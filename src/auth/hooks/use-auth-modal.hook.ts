import { useState } from "react";
import type { AuthStep } from "@/auth/types/auth.types";
import { sendEmailOtpAction } from "@/auth/actions/send-email-otp.actions";
import { verifyOtpAction } from "@/auth/actions/verify-otp.actions";
import { authApi } from "@/auth/api/auth.api";
import type { AuthTokens } from "@/auth/types/auth.types";

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

  // Estado del flujo is_new_user
  const [isNewUser, setIsNewUser] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const handleGoogleLogin = () => {
    setError("");
    setIsLoading(true);

    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      setError("Google Sign-In no se ha cargado. Recarga la página.");
      setIsLoading(false);
      return;
    }

    const client = google.accounts.oauth2.initTokenClient({
      client_id: "475959109147-3dmiaob3u2dsn11r0tqh914l1rfh52hd.apps.googleusercontent.com",
      scope: "email profile",
      callback: async (tokenResponse: any) => {
        if (tokenResponse.error) {
          setError("Error al autenticar con Google");
          setIsLoading(false);
          return;
        }

        try {
          const { data } = await authApi.loginWithGoogle(tokenResponse.access_token);
          const authData = data as AuthTokens;
          localStorage.setItem("access_token", authData.access);
          localStorage.setItem("refresh_token", authData.refresh);
          localStorage.setItem("user", JSON.stringify(authData.user));
          onLoginSuccess();
        } catch {
          setError("Error al iniciar sesión con Google");
        } finally {
          setIsLoading(false);
        }
      },
    });

    client.requestAccessToken();
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await authApi.loginWithApple("");
      const authData = data as AuthTokens;
      localStorage.setItem("access_token", authData.access);
      localStorage.setItem("refresh_token", authData.refresh);
      localStorage.setItem("user", JSON.stringify(authData.user));
      onLoginSuccess();
    } catch {
      setError("Apple Login no está disponible actualmente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un correo válido");
      return;
    }
    setIsLoading(true);
    setError("");
    const result = await sendEmailOtpAction(email);
    setIsLoading(false);
    if (result.success) {
      setIsNewUser(result.isNewUser);
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
    if (isNewUser && (!firstName.trim() || !lastName.trim())) {
      setError("Nombre y apellido son obligatorios");
      return;
    }
    setIsLoading(true);
    setError("");

    const extra = isNewUser
      ? {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          ...(phone.trim() ? { phone: phone.trim() } : {}),
        }
      : undefined;

    const result = await verifyOtpAction(email, token, extra);
    setIsLoading(false);
    if (result.success) {
      setStep("success");
      setTimeout(onLoginSuccess, 1500);
    } else {
      setError(result.message);
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "email") setStep("options");
    if (step === "verify") {
      setToken("");
      setIsNewUser(false);
      setFirstName("");
      setLastName("");
      setPhone("");
      setStep("email");
    }
  };

  const resetModal = () => {
    setStep("options");
    setEmail("");
    setToken("");
    setError("");
    setIsNewUser(false);
    setFirstName("");
    setLastName("");
    setPhone("");
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
    isNewUser,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    goToEmailStep,
    handleGoogleLogin,
    handleAppleLogin,
    handleEmailSubmit,
    handleTokenVerify,
    handleBack,
    handleOpenChange,
  };
};
