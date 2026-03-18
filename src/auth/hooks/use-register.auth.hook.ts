import { useMutation } from "@tanstack/react-query";
import { registerAction, type RegisterActionResponse } from "@/auth/actions/register.actions";
import type { RegisterRequest } from "@/auth/types/auth.types";

interface UseRegisterReturn {
  register: (data: RegisterRequest) => Promise<RegisterActionResponse>;
  isLoading: boolean;
}

export const useRegister = (): UseRegisterReturn => {
  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => registerAction(data),
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
