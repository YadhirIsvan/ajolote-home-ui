import { useState } from "react";
import type { AuthStep } from "@/auth/types/auth.types";
import { sendEmailOtpAction } from "@/auth/actions/send-email-otp.actions";
import { verifyOtpAction } from "@/auth/actions/verify-otp.actions";
import { loginWithGoogleAction } from "@/auth/actions/login-with-google.actions";
import { loginWithAppleAction } from "@/auth/actions/login-with-apple.actions";

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
