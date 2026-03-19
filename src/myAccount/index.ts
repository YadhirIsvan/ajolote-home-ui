// myAccount Bounded Context — public API
// Cada sub-dominio expone su propia API; este barrel agrega las entradas principales.

export { default as MiCuentaPage } from "@/myAccount/MiCuentaPage";

// ── Client ─────────────────────────────────────────────────────────────────────
export {
  useClientDashboard,
  useClientVentas,
  useClientCompras,
  useClientAppointments,
  useClientConfig,
} from "@/myAccount/client/index";
export type {
  ClientSubView,
  UserProfile,
  PropertySaleSummary,
  PropertySaleItem,
  PropertyBuySummary,
  ClientAppointment,
  ClientProfileDetail,
  NotificationPreferences,
} from "@/myAccount/client/index";

// ── Agent ──────────────────────────────────────────────────────────────────────
export { useAgentDashboard } from "@/myAccount/agent/index";
export type {
  AgentProperty,
  AgentDashboard,
  AgentDashboardStats,
  AgentAppointment,
  AgentLead,
  AppointmentStatus,
} from "@/myAccount/agent/index";

// ── Admin ──────────────────────────────────────────────────────────────────────
export { useAdminDashboard } from "@/myAccount/admin/index";
export type {
  AdminTab,
  AdminSection,
  Paginated,
  AdminProperty,
  AdminAgent,
  AdminClient,
  AdminInsights,
} from "@/myAccount/admin/index";
