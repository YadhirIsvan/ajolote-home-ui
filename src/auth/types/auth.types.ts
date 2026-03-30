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

// ── Auth Response (login / me) ─────────────────────────────────────────────────
// Tokens are no longer in the response body — they are set as httpOnly cookies
// by the backend. The body only carries user data and the refresh expiry timestamp.

export interface AuthResponse {
  refresh_expires_at: number; // millisecond epoch — used for auto-logout timer
  user: _AuthUser;
}

// AuthTokens kept as an alias for backward compatibility with existing callers.
export type AuthTokens = AuthResponse;
