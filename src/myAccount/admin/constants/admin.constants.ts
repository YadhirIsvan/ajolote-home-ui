import type { PurchaseProcessStatus, SaleProcessStatus, AppointmentType } from "@/myAccount/admin/types/admin.types";

// ─── Appointment statuses ─────────────────────────────────────────────────────

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  programada: "Programada",
  confirmada: "Confirmada",
  en_progreso: "En progreso",
  completada: "Completada",
  cancelada: "Cancelada",
  no_show: "No show",
  reagendada: "Reagendada",
};

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  programada:  "bg-blue-100 text-blue-700 border-blue-200",
  confirmada:  "bg-green-100 text-green-700 border-green-200",
  en_progreso: "bg-amber-100 text-amber-800 border-amber-200",
  completada:  "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelada:   "bg-red-100 text-red-600 border-red-200",
  no_show:     "bg-gray-100 text-gray-600 border-gray-200",
  reagendada:  "bg-purple-100 text-purple-700 border-purple-200",
};

export const APPOINTMENT_STATUS_PILL: Record<string, string> = {
  programada:  "bg-blue-100 text-blue-700",
  confirmada:  "bg-green-100 text-green-700",
  en_progreso: "bg-amber-200 text-amber-800",
  completada:  "bg-emerald-100 text-emerald-700",
  cancelada:   "bg-red-100 text-red-500 line-through",
  no_show:     "bg-gray-100 text-gray-400",
  reagendada:  "bg-purple-100 text-purple-600",
};

export const APPOINTMENT_EDITABLE_STATUSES = [
  "programada", "confirmada", "en_progreso", "completada", "cancelada", "no_show",
] as const;

export const APPOINTMENT_STATUS_ORDER = [
  "programada", "confirmada", "en_progreso", "completada", "cancelada", "no_show",
] as const;

// ─── Appointment types ────────────────────────────────────────────────────────

export interface AppointmentTypeOption {
  id: AppointmentType;
  name: string;
  color: string;
  defaultDuration: number;
}

export const APPOINTMENT_TYPE_OPTIONS: AppointmentTypeOption[] = [
  { id: "primera_visita",  name: "Primera Visita",     color: "bg-blue-100 text-blue-700",                       defaultDuration: 60  },
  { id: "seguimiento",     name: "Seguimiento",        color: "bg-green-100 text-green-700",                     defaultDuration: 45  },
  { id: "cierre_contrato", name: "Cierre de Contrato", color: "bg-champagne-gold/20 text-champagne-gold-dark",   defaultDuration: 90  },
  { id: "entrega_llaves",  name: "Entrega de Llaves",  color: "bg-purple-100 text-purple-700",                   defaultDuration: 30  },
  { id: "avaluo",          name: "Avalúo",             color: "bg-orange-100 text-orange-700",                   defaultDuration: 120 },
];

// ─── Calendar helpers ─────────────────────────────────────────────────────────

export const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const DURATION_OPTIONS = [
  { value: 30,  label: "30 minutos"    },
  { value: 45,  label: "45 minutos"    },
  { value: 60,  label: "1 hora"        },
  { value: 90,  label: "1 hora 30 min" },
  { value: 120, label: "2 horas"       },
];

// ─── Purchase process statuses ────────────────────────────────────────────────

export const PURCHASE_PROCESS_STATUS_LABELS: Record<PurchaseProcessStatus, string> = {
  lead:            "Lead",
  visita:          "Visita",
  interes:         "Interés",
  pre_aprobacion:  "Pre-aprobación",
  avaluo:          "Avalúo",
  credito:         "Crédito",
  docs_finales:    "Docs finales",
  escrituras:      "Escrituras",
  cerrado:         "Cerrado",
  cancelado:       "Cancelado",
};

export const PURCHASE_PIPELINE_STAGES: PurchaseProcessStatus[] = [
  "lead", "visita", "interes", "pre_aprobacion",
  "avaluo", "credito", "docs_finales", "escrituras", "cerrado",
];

// ─── Sale process statuses ────────────────────────────────────────────────────

export const SALE_PROCESS_STATUS_LABELS: Record<SaleProcessStatus, string> = {
  nuevo:                "Nuevo",
  contactado:           "Contactado",
  en_revision:          "En Revisión",
  vendedor_completado:  "Vendedor Completado",
  contacto_inicial:     "Contacto Inicial",
  evaluacion:           "Evaluación",
  valuacion:            "Valuación",
  firma_contrato:       "Firma Contrato",
  marketing:            "Marketing",
  publicar:             "Publicar",
  cancelado:            "Cancelado",
};

export const SALE_PIPELINE_STAGES: SaleProcessStatus[] = [
  "nuevo", "contactado", "en_revision", "vendedor_completado",
  "contacto_inicial", "evaluacion", "valuacion",
  "firma_contrato", "marketing", "publicar",
];

// ─── Agent schedule config ────────────────────────────────────────────────────

export type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export const DAY_KEYS: DayKey[] = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

export const DAY_ABBR: Record<DayKey, string> = {
  monday: "Lu", tuesday: "Ma", wednesday: "Mi", thursday: "Ju",
  friday: "Vi", saturday: "Sa", sunday: "Do",
};

export const BREAK_TYPE_LABELS: Record<string, string> = {
  lunch: "Almuerzo", coffee: "Café", rest: "Descanso", other: "Otro",
};

export const BREAK_TYPE_COLORS: Record<string, string> = {
  lunch:  "bg-orange-100 text-orange-700 border-orange-200",
  coffee: "bg-amber-100 text-amber-700 border-amber-200",
  rest:   "bg-blue-100 text-blue-700 border-blue-200",
  other:  "bg-gray-100 text-gray-700 border-gray-200",
};
