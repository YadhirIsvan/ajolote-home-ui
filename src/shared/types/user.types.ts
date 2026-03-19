export type UserRole = "client" | "agent" | "admin";

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
