import type { AppointmentStatus } from "@/myAccount/client/types/client.types";

export const formatPrice = (price: string | number | undefined): string => {
  if (!price) return "$0";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (timeStr: string): string => {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

export const capitalizeFirst = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

export const getStatusBadgeClass = (status: string): string =>
  status === "cerrado"
    ? "bg-emerald-600 text-white text-xs"
    : "bg-champagne-gold text-white text-xs";

export type ClientVisibleStatus =
  | "registrar_propiedad"
  | "aprobar_estado"
  | "marketing"
  | "vendida"
  | "cancelado";

const CLIENT_VISIBLE_STATUS_LABELS: Record<ClientVisibleStatus, string> = {
  registrar_propiedad: "Registrar propiedad",
  aprobar_estado: "Aprobar estado",
  marketing: "Marketing",
  vendida: "Vendida",
  cancelado: "Cancelado",
};

export const getClientVisibleStatusLabel = (status: ClientVisibleStatus): string =>
  CLIENT_VISIBLE_STATUS_LABELS[status];

export const getStatusBadgeColor = (status: ClientVisibleStatus): string => {
  switch (status) {
    case "vendida":
      return "bg-emerald-500 text-white";
    case "marketing":
      return "bg-blue-500 text-white";
    case "aprobar_estado":
      return "bg-yellow-500 text-white";
    case "cancelado":
      return "bg-red-500 text-white";
    case "registrar_propiedad":
    default:
      return "bg-amber-100 text-amber-700";
  }
};

const PROGRESS_STEP_INDEX: Record<ClientVisibleStatus, number> = {
  registrar_propiedad: 0,
  aprobar_estado: 1,
  marketing: 2,
  vendida: 3,
  cancelado: -1,
};

export const getProgressStepIndex = (status: ClientVisibleStatus): number =>
  PROGRESS_STEP_INDEX[status];

export const hoursAgo = (isoDate: string): number =>
  Math.max(1, Math.round((Date.now() - new Date(isoDate).getTime()) / 3_600_000));

export const humanizeType = (type: string): string =>
  type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

import type { Step } from "@/myAccount/client/types/client.types";

export const buildStepsFromProgress = (progress: number | undefined): Step[] => {
  const p = progress ?? 0;
  return [
    { label: "Oferta", done: p >= 15, current: p >= 15 && p < 30, allowUpload: false },
    { label: "Avalúo", done: p >= 30, current: p >= 30 && p < 45, allowUpload: false },
    { label: "Crédito", done: p >= 45, current: p >= 45 && p < 60, allowUpload: false },
    {
      label: "Documentos verificados",
      done: p >= 100,
      current: p >= 60 && p < 100,
      allowUpload: p >= 60 && p < 100,
    },
  ];
};

export const getAppointmentStatusConfig = (
  status: AppointmentStatus
): { label: string; className: string } => {
  const CONFIG: Record<AppointmentStatus, { label: string; className: string }> = {
    programada:  { label: "Programada",  className: "bg-blue-100 text-blue-700" },
    confirmada:  { label: "Confirmada",  className: "bg-emerald-100 text-emerald-700" },
    en_progreso: { label: "En progreso", className: "bg-amber-100 text-amber-700" },
    completada:  { label: "Completada",  className: "bg-emerald-100 text-emerald-700" },
    cancelada:   { label: "Cancelada",   className: "bg-red-100 text-red-600" },
    no_show:     { label: "No asistió",  className: "bg-gray-100 text-gray-600" },
    reagendada:  { label: "Reagendada",  className: "bg-violet-100 text-violet-700" },
  };
  return CONFIG[status] ?? CONFIG.programada;
};
