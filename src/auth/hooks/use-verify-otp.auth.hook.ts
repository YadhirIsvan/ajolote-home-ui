import { useMutation } from "@tanstack/react-query";
import {
  verifyOtpAction,
  type VerifyOtpExtra,
  type VerifyOtpResponse,
} from "@/auth/actions/verify-otp.actions";

interface VerifyOtpParams {
  email: string;
  token: string;
  extra?: VerifyOtpExtra;
}

interface UseVerifyOtpReturn {
  verify: (params: VerifyOtpParams) => Promise<VerifyOtpResponse>;
  isLoading: boolean;
}

export const useVerifyOtp = (): UseVerifyOtpReturn => {
  const mutation = useMutation({
    mutationFn: ({ email, token, extra }: VerifyOtpParams) =>
      verifyOtpAction(email, token, extra),
  });

  return {
    verify: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
