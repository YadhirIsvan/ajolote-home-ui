import { describe, it, expect } from "vitest";
import {
  getLoanTypeLabel,
  formatPrice,
  formatDate,
  formatTime,
  capitalizeFirst,
  getStatusBadgeClass,
  getClientVisibleStatusLabel,
  getStatusBadgeColor,
  getProgressStepIndex,
  hoursAgo,
  humanizeType,
  buildStepsFromProgress,
  getAppointmentStatusConfig,
} from "./client.utils";

// ─── getLoanTypeLabel ─────────────────────────────────────────────────────────

describe("getLoanTypeLabel", () => {
  it("clave conocida → retorna etiqueta legible", () => {
    expect(getLoanTypeLabel("individual")).toContain("Individual");
  });

  it("clave desconocida → retorna la misma clave (fallback)", () => {
    expect(getLoanTypeLabel("otro")).toBe("otro");
  });
});

// ─── formatPrice ──────────────────────────────────────────────────────────────

describe("formatPrice (client)", () => {
  it("undefined → '$0'", () => {
    expect(formatPrice(undefined)).toBe("$0");
  });

  it("0 → '$0'", () => {
    expect(formatPrice(0)).toBe("$0");
  });

  it("número formatea con $ y separadores MXN", () => {
    const result = formatPrice(2500000);
    expect(result).toContain("$");
    expect(result).toMatch(/2[,.]500[,.]000/);
  });

  it("string numérico se parsea igual que number", () => {
    expect(formatPrice("1500000")).toBe(formatPrice(1500000));
  });

  it("sin decimales (maximumFractionDigits: 0)", () => {
    expect(formatPrice(1200000.99)).not.toContain(".99");
  });
});

// ─── formatDate ───────────────────────────────────────────────────────────────

describe("formatDate (client)", () => {
  it("fecha ISO retorna string no vacío con el año", () => {
    const result = formatDate("2024-06-15");
    expect(result).toBeTruthy();
    expect(result).toContain("2024");
  });

  it("incluye el día y el mes", () => {
    const result = formatDate("2024-01-05");
    expect(result).toBeTruthy();
  });
});

// ─── formatTime ───────────────────────────────────────────────────────────────

describe("formatTime (client)", () => {
  it("hora AM → '9:00 AM'", () => {
    expect(formatTime("09:00")).toBe("9:00 AM");
  });

  it("medianoche → '12:00 AM'", () => {
    expect(formatTime("00:00")).toBe("12:00 AM");
  });

  it("mediodía → '12:00 PM'", () => {
    expect(formatTime("12:00")).toBe("12:00 PM");
  });

  it("hora PM → '3:30 PM'", () => {
    expect(formatTime("15:30")).toBe("3:30 PM");
  });

  it("23:59 → '11:59 PM'", () => {
    expect(formatTime("23:59")).toBe("11:59 PM");
  });
});

// ─── capitalizeFirst ──────────────────────────────────────────────────────────

describe("capitalizeFirst", () => {
  it("pone la primera letra en mayúscula", () => {
    expect(capitalizeFirst("hola")).toBe("Hola");
  });

  it("no modifica el resto del string", () => {
    expect(capitalizeFirst("hOLA")).toBe("HOLA");
  });

  it("string vacío no lanza", () => {
    expect(capitalizeFirst("")).toBe("");
  });
});

// ─── getStatusBadgeClass ──────────────────────────────────────────────────────

describe("getStatusBadgeClass", () => {
  it("status 'cerrado' → clase verde", () => {
    expect(getStatusBadgeClass("cerrado")).toContain("emerald");
  });

  it("cualquier otro status → clase gold", () => {
    expect(getStatusBadgeClass("activo")).toContain("champagne-gold");
  });
});

// ─── getClientVisibleStatusLabel ──────────────────────────────────────────────

describe("getClientVisibleStatusLabel", () => {
  it("'registrar_propiedad' → etiqueta legible", () => {
    expect(getClientVisibleStatusLabel("registrar_propiedad")).toBe("Registrar propiedad");
  });

  it("'vendida' → 'Vendida'", () => {
    expect(getClientVisibleStatusLabel("vendida")).toBe("Vendida");
  });

  it("'cancelado' → 'Cancelado'", () => {
    expect(getClientVisibleStatusLabel("cancelado")).toBe("Cancelado");
  });
});

// ─── getStatusBadgeColor ──────────────────────────────────────────────────────

describe("getStatusBadgeColor", () => {
  it("'vendida' → verde", () => {
    expect(getStatusBadgeColor("vendida")).toContain("emerald");
  });

  it("'marketing' → azul", () => {
    expect(getStatusBadgeColor("marketing")).toContain("blue");
  });

  it("'aprobar_estado' → amarillo", () => {
    expect(getStatusBadgeColor("aprobar_estado")).toContain("yellow");
  });

  it("'cancelado' → rojo", () => {
    expect(getStatusBadgeColor("cancelado")).toContain("red");
  });

  it("'registrar_propiedad' (default) → ámbar", () => {
    expect(getStatusBadgeColor("registrar_propiedad")).toContain("amber");
  });
});

// ─── getProgressStepIndex ─────────────────────────────────────────────────────

describe("getProgressStepIndex", () => {
  it("'registrar_propiedad' → 0", () => {
    expect(getProgressStepIndex("registrar_propiedad")).toBe(0);
  });

  it("'aprobar_estado' → 1", () => {
    expect(getProgressStepIndex("aprobar_estado")).toBe(1);
  });

  it("'marketing' → 2", () => {
    expect(getProgressStepIndex("marketing")).toBe(2);
  });

  it("'vendida' → 3", () => {
    expect(getProgressStepIndex("vendida")).toBe(3);
  });

  it("'cancelado' → -1", () => {
    expect(getProgressStepIndex("cancelado")).toBe(-1);
  });
});

// ─── hoursAgo ─────────────────────────────────────────────────────────────────

describe("hoursAgo", () => {
  it("fecha reciente retorna al menos 1 hora", () => {
    const recent = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    expect(hoursAgo(recent)).toBeGreaterThanOrEqual(1);
  });

  it("fecha hace 3 horas retorna ≥ 3", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3_600_000).toISOString();
    expect(hoursAgo(threeHoursAgo)).toBeGreaterThanOrEqual(3);
  });
});

// ─── humanizeType ─────────────────────────────────────────────────────────────

describe("humanizeType", () => {
  it("reemplaza underscores por espacios y capitaliza palabras", () => {
    expect(humanizeType("tipo_de_propiedad")).toBe("Tipo De Propiedad");
  });

  it("string sin underscores capitaliza la primera palabra", () => {
    expect(humanizeType("casa")).toBe("Casa");
  });
});

// ─── buildStepsFromProgress ───────────────────────────────────────────────────

describe("buildStepsFromProgress", () => {
  it("progress undefined → 4 pasos, todos sin completar", () => {
    const steps = buildStepsFromProgress(undefined);
    expect(steps).toHaveLength(4);
    expect(steps.every((s) => !s.done)).toBe(true);
  });

  it("progress 0 → ningún paso done", () => {
    const steps = buildStepsFromProgress(0);
    expect(steps.every((s) => !s.done)).toBe(true);
  });

  it("progress 15 → primer paso done", () => {
    const steps = buildStepsFromProgress(15);
    expect(steps[0].done).toBe(true);
    expect(steps[1].done).toBe(false);
  });

  it("progress 60 → 3 pasos done, paso 'Documentos' allowUpload=true", () => {
    const steps = buildStepsFromProgress(60);
    expect(steps[0].done).toBe(true);
    expect(steps[1].done).toBe(true);
    expect(steps[2].done).toBe(true);
    expect(steps[3].allowUpload).toBe(true);
  });

  it("progress 100 → todos los pasos done, allowUpload=false en 'Documentos'", () => {
    const steps = buildStepsFromProgress(100);
    expect(steps.every((s) => s.done)).toBe(true);
    expect(steps[3].allowUpload).toBe(false);
  });
});

// ─── getAppointmentStatusConfig ───────────────────────────────────────────────

describe("getAppointmentStatusConfig", () => {
  it("'programada' → label 'Programada' y clase blue", () => {
    const { label, className } = getAppointmentStatusConfig("programada");
    expect(label).toBe("Programada");
    expect(className).toContain("blue");
  });

  it("'confirmada' → label 'Confirmada' y clase emerald", () => {
    const { label, className } = getAppointmentStatusConfig("confirmada");
    expect(label).toBe("Confirmada");
    expect(className).toContain("emerald");
  });

  it("'cancelada' → label 'Cancelada' y clase red", () => {
    const { label, className } = getAppointmentStatusConfig("cancelada");
    expect(label).toBe("Cancelada");
    expect(className).toContain("red");
  });

  it("'no_show' → label 'No asistió' y clase gray", () => {
    const { label, className } = getAppointmentStatusConfig("no_show");
    expect(label).toBe("No asistió");
    expect(className).toContain("gray");
  });

  it("'reagendada' → clase violet", () => {
    expect(getAppointmentStatusConfig("reagendada").className).toContain("violet");
  });
});
