import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { isValidPhoneNumber } from "react-phone-number-input";
import type {
  AuthStep,
  AuthMethod,
  ProfileVariant,
} from "@/auth/types/auth.types";
import type { AuthMembership } from "@/auth/types/auth.types";
import { sendEmailOtpAction } from "@/auth/actions/send-email-otp.actions";
import { verifyOtpAction } from "@/auth/actions/verify-otp.actions";
import { loginWithGoogleAction } from "@/auth/actions/login-with-google.actions";
import { loginWithAppleAction } from "@/auth/actions/login-with-apple.actions";
import {
  updateAuthProfileAction,
  type UpdateAuthProfileData,
} from "@/auth/actions/update-auth-phone.actions";

interface UseAuthModalOptions {
  onLoginSuccess: () => void;
  onClose: () => void;
}

export const useAuthModal = ({ onLoginSuccess, onClose }: UseAuthModalOptions) => {
  const [step, setStep] = useState<AuthStep>("options");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [authMethod, setAuthMethod] = useState<AuthMethod>("otp");
  const [profileVariant, setProfileVariant] = useState<ProfileVariant>("full");
  // Tracks the "popup is open" phase of Google OAuth before mutateAsync fires
  const [isGooglePending, setIsGooglePending] = useState(false);

  const isPhoneValid = Boolean(phone) && isValidPhoneNumber(phone);

  // ── Mutations ──────────────────────────────────────────────────────────────────

  const sendOtpMutation = useMutation({
    mutationFn: (email: string) => sendEmailOtpAction(email),
  });
  const verifyOtpMutation = useMutation({
    mutationFn: (params: { email: string; token: string }) =>
      verifyOtpAction(params.email, params.token),
  });
  const googleLoginMutation = useMutation({
    mutationFn: (accessToken: string) => loginWithGoogleAction(accessToken),
  });
  const appleLoginMutation = useMutation({
    mutationFn: (identityToken: string) => loginWithAppleAction(identityToken),
  });
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateAuthProfileData) => updateAuthProfileAction(data),
  });

  const isLoading =
    sendOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    isGooglePending ||
    googleLoginMutation.isPending ||
    appleLoginMutation.isPending ||
    updateProfileMutation.isPending;

  // ── Helpers ────────────────────────────────────────────────────────────────────

  const saveTenantPreference = (memberships?: AuthMembership[]) => {
    if (memberships?.length) {
      localStorage.setItem("selected_tenant_id", String(memberships[0].tenant_id));
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleGoogleLogin = () => {
    setError("");

    const google = window.google;
    if (!google?.accounts?.oauth2) {
      setError("Google Sign-In no se ha cargado. Recarga la página.");
      return;
    }

    // Cuando el usuario cierra el popup de Google sin completar el flujo,
    // el callback de initTokenClient nunca se invoca. Detectamos el cierre del
    // popup escuchando cuando la ventana principal recupera el foco.
    setIsGooglePending(true);
    let callbackInvoked = false;

    const onWindowFocus = () => {
      setTimeout(() => {
        if (!callbackInvoked) setIsGooglePending(false);
      }, 500);
      window.removeEventListener("focus", onWindowFocus);
    };
    window.addEventListener("focus", onWindowFocus);

    const client = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
      scope: "email profile",
      callback: async (tokenResponse) => {
        callbackInvoked = true;
        window.removeEventListener("focus", onWindowFocus);
        setIsGooglePending(false);

        if (tokenResponse.error) {
          setError("Error al autenticar con Google");
          return;
        }

        try {
          const result = await googleLoginMutation.mutateAsync(tokenResponse.access_token);
          if (result.success) {
            saveTenantPreference(result.user?.memberships);
            const needsPhone = !result.user?.phone?.trim();
            if (needsPhone) {
              setAuthMethod("google");
              setProfileVariant("phone-only");
              setStep("profile");
            } else {
              onLoginSuccess();
            }
          } else {
            setError(result.message ?? "Error al iniciar sesión con Google");
          }
        } catch {
          setError("Error al iniciar sesión con Google");
        }
      },
    });

    client.requestAccessToken();
  };

  const handleAppleLogin = async () => {
    setError("");
    try {
      const result = await appleLoginMutation.mutateAsync("");
      if (result.success) {
        saveTenantPreference(result.user?.memberships);
        onLoginSuccess();
      } else {
        setError(result.message ?? "Apple Login no está disponible actualmente");
      }
    } catch {
      setError("Apple Login no está disponible actualmente");
    }
  };

  const handleEmailSubmit = async () => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !EMAIL_REGEX.test(email)) {
      setError("Por favor ingresa un correo válido");
      return;
    }
    setError("");
    try {
      const result = await sendOtpMutation.mutateAsync(email);
      if (result.success) {
        setStep("verify");
      } else {
        setError(result.message);
      }
    } catch {
      setError("Error al enviar el código. Intenta de nuevo.");
    }
  };

  const handleTokenVerify = async () => {
    if (token.length < 4) {
      setError("El código debe tener al menos 4 dígitos");
      return;
    }
    setError("");

    try {
      const result = await verifyOtpMutation.mutateAsync({ email, token });

      if (result.success) {
        saveTenantPreference(result.data?.user?.memberships);
        const hasPhone = !!result.data?.user?.phone?.trim();
        if (hasPhone) {
          setStep("success");
          setTimeout(onLoginSuccess, 1500);
        } else {
          setAuthMethod("otp");
          setProfileVariant("full");
          setStep("profile");
        }
      } else {
        setError(result.message);
      }
    } catch {
      setError("Código inválido o expirado. Intenta de nuevo.");
    }
  };

  const handleProfileSubmit = async () => {
    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Ingresa un teléfono válido para continuar.");
      return;
    }

    setError("");

    try {
      const result = await updateProfileMutation.mutateAsync({
        phone,
        ...(firstName.trim() ? { first_name: firstName.trim() } : {}),
        ...(lastName.trim() ? { last_name: lastName.trim() } : {}),
      });

      if (!result.success) {
        setError(result.message ?? "No se pudo guardar el perfil.");
        return;
      }

      setStep("success");
      setTimeout(onLoginSuccess, 1500);
    } catch {
      setError("No se pudo guardar el perfil.");
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "email") setStep("options");
    if (step === "verify") {
      setToken("");
      setStep("email");
    }
    if (step === "profile") {
      setFirstName("");
      setLastName("");
      setPhone("");
      setStep("verify");
    }
  };

  const resetModal = () => {
    setStep("options");
    setEmail("");
    setToken("");
    setError("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setAuthMethod("otp");
    setProfileVariant("full");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetModal();
      onClose();
    }
  };

  const goToEmailStep = () => setStep("email");

  return {
    step,
    email,
    setEmail,
    token,
    setToken,
    error,
    isLoading,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    authMethod,
    profileVariant,
    isPhoneValid,
    goToEmailStep,
    handleGoogleLogin,
    handleAppleLogin,
    handleEmailSubmit,
    handleTokenVerify,
    handleProfileSubmit,
    handleBack,
    handleOpenChange,
  };
};
