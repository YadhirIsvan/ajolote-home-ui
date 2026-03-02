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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await authApi.loginWithGoogle("");
      const authData = data as AuthTokens;
      localStorage.setItem("access_token", authData.access);
      localStorage.setItem("refresh_token", authData.refresh);
      localStorage.setItem("user", JSON.stringify(authData.user));
      onLoginSuccess();
    } catch (err: unknown) {
      const axiosError = err as { response?: { status?: number } };
      if (axiosError.response?.status === 501) {
        setError("Google Login no está disponible actualmente");
      } else {
        setError("Google Login no está disponible actualmente");
      }
    } finally {
      setIsLoading(false);
    }
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
    } catch (err: unknown) {
      const axiosError = err as { response?: { status?: number } };
      if (axiosError.response?.status === 501) {
        setError("Apple Login no está disponible actualmente");
      } else {
        setError("Apple Login no está disponible actualmente");
      }
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
      setStep("success");
      setTimeout(onLoginSuccess, 1000);
    } else {
      setError(result.message);
    }
  };

  const handleBack = () => {
    setError("");
    if (step === "email") setStep("options");
    if (step === "verify") setStep("email");
  };

  const resetModal = () => {
    setStep("options");
    setEmail("");
    setToken("");
    setError("");
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
    goToEmailStep,
    handleGoogleLogin,
    handleAppleLogin,
    handleEmailSubmit,
    handleTokenVerify,
    handleBack,
    handleOpenChange,
  };
};
