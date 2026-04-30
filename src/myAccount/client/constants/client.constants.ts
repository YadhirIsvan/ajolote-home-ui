import type { NotificationPreferences, AppointmentStatus } from "@/myAccount/client/types/client.types";

export const LOAN_TYPE_LABELS: Record<string, string> = {
  individual: "Individual (Banco, Infonavit o Fovissste)",
  conyugal: "Conyugal o Familiar (Unir créditos)",
  cofinavit: "Cofinavit (Banco + Ahorro Infonavit)",
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  new_properties: false,
  price_updates: false,
  appointment_reminders: false,
  offers: false,
};

export const EXCLUDED_BUY_STATUSES = ["cerrado", "cancelado"] as const;

export const SALE_PROGRESS_STEPS = [
  "Registrar propiedad",
  "Aprobar estado",
  "Marketing",
  "Vendida",
] as const;

export const CANCELLABLE_APPOINTMENT_STATUSES = new Set<AppointmentStatus>([
  "programada",
  "confirmada",
  "en_progreso",
]);
