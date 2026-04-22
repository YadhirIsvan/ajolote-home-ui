import { useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import type {
  AuthStep,
  AuthMethod,
  ProfileVariant,
} from "@/auth/types/auth.types";
import { sendEmailOtpAction } from "@/auth/actions/send-email-otp.actions";
import {
  verifyOtpAction,
  type VerifyOtpExtra,
} from "@/auth/actions/verify-otp.actions";
import { loginWithGoogleAction } from "@/auth/actions/login-with-google.actions";
import { loginWithAppleAction } from "@/auth/actions/login-with-apple.actions";
import { updateAuthPhoneAction } from "@/auth/actions/update-auth-phone.actions";

interface UseAuthModalOptions {
  onLoginSuccess: () => void;
  onClose: () => void;
}

export const useAuthModal = ({ onLoginSuccess, onClose }: UseAuthModalOptions) => {
  const [step, setStep] = useState<AuthStep>("options");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Campos del perfil. phone almacena un valor E.164 producido por PhoneInputField.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Ramifica el flujo de "completar perfil" según el provider de auth.
  const [authMethod, setAuthMethod] = useState<AuthMethod>("otp");
  const [profileVariant, setProfileVariant] =
    useState<ProfileVariant>("full");

  const isPhoneValid = Boolean(phone) && isValidPhoneNumber(phone);

  const handleGoogleLogin = () => {
    setError("");
    setIsLoading(true);

    const google = window.google;
    if (!google?.accounts?.oauth2) {
      setError("Google Sign-In no se ha cargado. Recarga la página.");
      setIsLoading(false);
      return;
    }

    // Cuando el usuario cierra el popup de Google sin completar el flujo,
    // el callback de initTokenClient nunca se invoca. Detectamos el cierre del
    // popup escuchando cuando la ventana principal recupera el foco.
    let callbackInvoked = false;

    const onWindowFocus = () => {
      // Damos 500 ms para que el callback pueda dispararse primero si el flujo
      // completó justo al cerrarse el popup (ej. redirección automática).
      setTimeout(() => {
        if (!callbackInvoked) setIsLoading(false);
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

        if (tokenResponse.error) {
          setError("Error al autenticar con Google");
          setIsLoading(false);
          return;
        }

        const result = await loginWithGoogleAction(tokenResponse.access_token);
        if (result.success) {
          const needsPhone = !result.user?.phone?.trim();
          if (needsPhone) {
            setAuthMethod("google");
            setProfileVariant("phone-only");
            setStep("profile");
            setIsLoading(false);
            return;
          }
          onLoginSuccess();
        } else {
          setError(result.message ?? "Error al iniciar sesión con Google");
        }
        setIsLoading(false);
      },
    });

    client.requestAccessToken();
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    setError("");
    const result = await loginWithAppleAction("");
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.message ?? "Apple Login no está disponible actualmente");
    }
    setIsLoading(false);
  };

  const handleEmailSubmit = async () => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !EMAIL_REGEX.test(email)) {
      setError("Por favor ingresa un correo válido");
      return;
    }
    setIsLoading(true);
    setError("");
    const result = await sendEmailOtpAction(email);
    setIsLoading(false);
    if (result.success) {
      setStep("verify");
    } else {
      setError(result.message);
    }
  };

  const handleTokenVerify = async () => {
    if (token.length < 4) {
      setError("El código debe tener al menos 4 dígitos");
      return;
    }
    setIsLoading(true);
    setError("");

    const result = await verifyOtpAction(email, token);
    setIsLoading(false);

    if (result.success) {
      // Si el usuario ya tiene teléfono, ya no necesita completar nada → success.
      // Si no, mostrar paso profile con teléfono obligatorio.
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
  };

  const handleProfileSubmit = async () => {
    // Validación obligatoria: teléfono requerido en ambos flujos (OTP y Google).
    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Ingresa un teléfono válido para continuar.");
      return;
    }

    setIsLoading(true);
    setError("");

    if (authMethod === "google") {
      const result = await updateAuthPhoneAction(phone);
      if (!result.success) {
        setError(result.message ?? "No se pudo guardar el teléfono.");
        setIsLoading(false);
        return;
      }
    } else {
      // OTP: re-verify incluye phone obligatorio; nombre/apellido opcionales.
      const extra: VerifyOtpExtra = { phone };
      if (firstName.trim()) extra.first_name = firstName.trim();
      if (lastName.trim()) extra.last_name = lastName.trim();

      const result = await verifyOtpAction(email, token, extra);
      if (!result.success) {
        setError(result.message ?? "No se pudo guardar el teléfono.");
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);
    setStep("success");
    setTimeout(onLoginSuccess, 1500);
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
