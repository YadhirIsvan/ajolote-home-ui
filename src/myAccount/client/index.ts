// myAccount/client domain public API
export { useClientDashboard } from "@/myAccount/client/hooks/use-client-dashboard.client.hook";
export { useClientVentas } from "@/myAccount/client/hooks/use-client-ventas.client.hook";
export { useClientCompras } from "@/myAccount/client/hooks/use-client-compras.client.hook";
export { useClientAppointments } from "@/myAccount/client/hooks/use-client-appointments.client.hook";
export { useClientConfig } from "@/myAccount/client/hooks/use-client-config.client.hook";
export type {
  ClientSubView,
  UserProfile,
  PropertySaleSummary,
  PropertySaleItem,
  PropertyBuySummary,
  ClientAppointment,
  ClientProfileDetail,
  NotificationPreferences,
} from "@/myAccount/client/types/client.types";
