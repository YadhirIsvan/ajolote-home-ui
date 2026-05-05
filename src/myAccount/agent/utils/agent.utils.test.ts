import { describe, it, expect } from "vitest";
import { formatPrice, formatTime, formatDate } from "./agent.utils";

// ─── formatPrice ──────────────────────────────────────────────────────────────

describe("formatPrice (agent)", () => {
  it("precio válido → string con $ y separadores MXN", () => {
    const result = formatPrice("3000000");
    expect(result).toContain("$");
    expect(result).toMatch(/3[,.]000[,.]000/);
  });

  it("string no numérico → NaN formateado (no lanza)", () => {
    expect(() => formatPrice("abc")).not.toThrow();
  });

  it("sin decimales (maximumFractionDigits: 0)", () => {
    expect(formatPrice("1500000.75")).not.toContain(".75");
  });
});

// ─── formatTime ───────────────────────────────────────────────────────────────

describe("formatTime (agent)", () => {
  it("hora AM → '9:00 AM'", () => {
    expect(formatTime("09:00")).toBe("9:00 AM");
  });

  it("mediodía → '12:00 PM'", () => {
    expect(formatTime("12:00")).toBe("12:00 PM");
  });

  it("hora PM → '3:30 PM'", () => {
    expect(formatTime("15:30")).toBe("3:30 PM");
  });

  it("medianoche → '12:00 AM'", () => {
    expect(formatTime("00:00")).toBe("12:00 AM");
  });
});

// ─── formatDate ───────────────────────────────────────────────────────────────

describe("formatDate (agent)", () => {
  it("fecha ISO retorna string no vacío con el mes", () => {
    const result = formatDate("2024-06-15");
    expect(result).toBeTruthy();
  });

  it("formato es corto: día y mes sin año", () => {
    const result = formatDate("2024-01-05");
    expect(result).not.toContain("2024");
  });
});
