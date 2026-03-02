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
  memberships: AuthMembership[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: AuthUser;
}
