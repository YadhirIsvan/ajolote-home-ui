import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { FormEvent } from "react";
import { useVerifyOtp } from "@/auth/hooks/use-verify-otp.auth.hook";

export interface UseVerifyOtpPageReturn {
  email: string;
  token: string;
  error: string;
  success: boolean;
  isLoading: boolean;
  setToken: (token: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleBack: () => void;
}

export const useVerifyOtpPage = (): UseVerifyOtpPageReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? "";

  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { verify, isLoading } = useVerifyOtp();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (token.length < 4) {
      setError("El código debe tener al menos 4 dígitos.");
      return;
    }
    setError("");
    const result = await verify({ email, token });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/mi-cuenta"), 1000);
    } else {
      setError(result.message);
    }
  };

  const handleBack = () => navigate(-1);

  return { email, token, error, success, isLoading, setToken, handleSubmit, handleBack };
};
