// Auth domain public API
export { useAuth } from "@/auth/hooks/use-auth.auth.hook";
export { useAuthModal } from "@/auth/hooks/use-auth-modal.auth.hook";
export { useRegister } from "@/auth/hooks/use-register.auth.hook";
export { useVerifyOtp } from "@/auth/hooks/use-verify-otp.auth.hook";
export type {
  AuthUser,
  AuthStep,
  UserRole,
  RegisterRequest,
  AuthTokens,
  GoogleTokenResponse,
  GoogleTokenClientConfig,
  GoogleTokenClient,
} from "@/auth/types/auth.types";
