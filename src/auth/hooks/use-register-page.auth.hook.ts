import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent, FormEvent } from "react";
import { useRegister } from "@/auth/hooks/use-register.auth.hook";
import type { RegisterRequest } from "@/auth/types/auth.types";

interface RegisterForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface UseRegisterPageReturn {
  form: RegisterForm;
  error: string;
  userExists: boolean;
  isLoading: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  navigateToLogin: () => void;
}

export const useRegisterPage = (): UseRegisterPageReturn => {
  const navigate = useNavigate();
  const { register, isLoading } = useRegister();

  const [form, setForm] = useState<RegisterForm>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [userExists, setUserExists] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setUserExists(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.firstName || !form.lastName) {
      setError("Nombre, apellido y correo son obligatorios.");
      return;
    }
    setError("");
    setUserExists(false);

    const payload: RegisterRequest = {
      email: form.email,
      first_name: form.firstName,
      last_name: form.lastName,
      ...(form.phone ? { phone: form.phone } : {}),
    };

    const result = await register(payload);
    if (result.success) {
      navigate("/auth/verify", { state: { email: form.email } });
    } else if (result.userExists) {
      setUserExists(true);
      setError(result.message);
    } else {
      setError(result.message);
    }
  };

  const navigateToLogin = () => navigate("/mi-cuenta");

  return { form, error, userExists, isLoading, handleChange, handleSubmit, navigateToLogin };
};
