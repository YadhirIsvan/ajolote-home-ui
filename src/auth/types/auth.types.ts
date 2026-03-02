export type UserRole = "client" | "agent" | "admin";

export type AuthStep = "options" | "email" | "verify" | "success";

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
  phone?: string;
  memberships: AuthMembership[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: AuthUser;
}

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
