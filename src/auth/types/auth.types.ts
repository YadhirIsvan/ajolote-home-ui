export type UserRole = "client" | "agent" | "admin";

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

export interface AuthMembership {
  id: number;
  tenant_id: number;
  tenant_name: string;
  tenant_slug: string;
  role: UserRole;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  memberships: AuthMembership[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: AuthUser;
}
