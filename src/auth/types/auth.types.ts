// Re-exportados desde shared/ — UserRole, AuthMembership, AuthUser son globales
import type { AuthUser as _AuthUser } from "@/shared/types/user.types";
export type { UserRole, AuthMembership, AuthUser } from "@/shared/types/user.types";

// ── Google OAuth2 SDK — tipado mínimo para eliminar `any` ───────────────────

export interface GoogleTokenResponse {
  error?: string;
  access_token: string;
}

export interface GoogleTokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: GoogleTokenResponse) => void;
}

export interface GoogleTokenClient {
  requestAccessToken: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: GoogleTokenClientConfig) => GoogleTokenClient;
        };
      };
    };
  }
}

export type AuthStep = "options" | "email" | "verify" | "success";

// ── OTP ────────────────────────────────────────────────────────────────────────

export interface SendOtpRequest {
  email: string;
}

/** Respuesta de POST /auth/email/otp */
export interface SendOtpResponse {
  message: string;
  email: string;
  is_new_user: boolean;
}

/** Body de POST /auth/email/verify */
export interface VerifyOtpRequest {
  email: string;
  token: string;
  first_name?: string; // solo si is_new_user fue true
  last_name?: string;  // solo si is_new_user fue true
  phone?: string;      // solo si is_new_user fue true
}

// ── Register ───────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

// ── Auth User / Tokens ─────────────────────────────────────────────────────────

export interface AuthTokens {
  access: string;
  refresh: string;
  user: _AuthUser;
}
