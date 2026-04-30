import type { AppointmentStatus } from "@/myAccount/agent/types/agent.types";

export const PIPELINE_STAGE_LABELS: Record<number, string> = {
  1: "Lead",
  2: "Visita",
  3: "Interés",
  4: "Pre-Aprob",
  5: "Avalúo",
  6: "Crédito",
  7: "Docs Finales",
  8: "Escrituras",
  9: "Cerrado",
};

export const APPOINTMENT_STATUS_ORDER: AppointmentStatus[] = [
  "programada",
  "confirmada",
  "en_progreso",
  "completada",
  "cancelada",
  "reagendada",
];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  programada:  "Programada",
  confirmada:  "Confirmada",
  en_progreso: "En Progreso",
  completada:  "Completada",
  cancelada:   "Cancelada",
  reagendada:  "Reagendada",
  no_show:     "No Show",
};
