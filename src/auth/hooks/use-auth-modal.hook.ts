import { useState } from "react";
import type { AuthStep } from "@/auth/types/auth.types";

interface UseAuthModalOptions {
  onLoginSuccess: () => void;
  onClose: () => void;
}

export const useAuthModal = ({ onLoginSuccess, onClose }: UseAuthModalOptions) => {
  const [step, setStep] = useState<AuthStep>("options");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = () => {
    setStep("success");
    setTimeout(() => {
      onLoginSuccess();
    }, 1500);
  };

  const handleAppleLogin = () => {
    setStep("success");
    setTimeout(() => {
      onLoginSuccess();
    }, 1500);
  };

  const handleEmailSubmit = () => {
    if (!email || !email.includes("@")) {
      setError("Por favor ingresa un correo válido");
      return;
    }
    setError("");
    setStep("verify");
  };

  const handleTokenVerify = () => {
    if (token.length < 4) {
      setError("El código debe tener al menos 4 dígitos");
      return;
    }
    setError("");
    setStep("success");
    setTimeout(() => {
      onLoginSuccess();
    }, 1500);
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
    goToEmailStep,
    handleGoogleLogin,
    handleAppleLogin,
    handleEmailSubmit,
    handleTokenVerify,
    handleBack,
    handleOpenChange,
  };
};
