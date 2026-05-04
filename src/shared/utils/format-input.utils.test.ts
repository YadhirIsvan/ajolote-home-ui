import { describe, it, expect } from "vitest";
import {
  parseRawNumber,
  parseRawDecimal,
  formatMoney,
  formatSqm,
  formatPhone,
} from "./format-input.utils";

// ─── parseRawNumber ───────────────────────────────────────────────────────────

describe("parseRawNumber", () => {
  it("elimina letras y símbolos, conserva dígitos", () => {
    expect(parseRawNumber("abc123def")).toBe("123");
  });

  it("elimina comas y puntos (separadores de formato)", () => {
    expect(parseRawNumber("1,234,567")).toBe("1234567");
  });

  it("string vacío → string vacío", () => {
    expect(parseRawNumber("")).toBe("");
  });

  it("conserva ceros al inicio", () => {
    expect(parseRawNumber("007")).toBe("007");
  });
});

// ─── parseRawDecimal ──────────────────────────────────────────────────────────

describe("parseRawDecimal", () => {
  it("conserva dígitos y un punto decimal", () => {
    expect(parseRawDecimal("12.34")).toBe("12.34");
  });

  it("previene doble punto: '12..34' → '12.34'", () => {
    expect(parseRawDecimal("12..34")).toBe("12.34");
  });

  it("elimina letras manteniendo el punto", () => {
    expect(parseRawDecimal("abc12.3def")).toBe("12.3");
  });

  it("string vacío → string vacío", () => {
    expect(parseRawDecimal("")).toBe("");
  });
});

// ─── formatMoney ─────────────────────────────────────────────────────────────

describe("formatMoney", () => {
  it("'1234567' → '1,234,567'", () => {
    expect(formatMoney("1234567")).toBe("1,234,567");
  });

  it("'1000000' → '1,000,000'", () => {
    expect(formatMoney("1000000")).toBe("1,000,000");
  });

  it("'0' → '0'", () => {
    expect(formatMoney("0")).toBe("0");
  });

  it("string vacío → string vacío", () => {
    expect(formatMoney("")).toBe("");
  });

  it("solo letras (sin dígitos) → string vacío", () => {
    expect(formatMoney("abc")).toBe("");
  });
});

// ─── formatSqm ───────────────────────────────────────────────────────────────

describe("formatSqm", () => {
  it("'1234.5' → '1,234.5'", () => {
    expect(formatSqm("1234.5")).toBe("1,234.5");
  });

  it("'1234' (sin decimales) → '1,234'", () => {
    expect(formatSqm("1234")).toBe("1,234");
  });

  it("preserva decimales trailing: '1234.50' → '1,234.50'", () => {
    expect(formatSqm("1234.50")).toBe("1,234.50");
  });

  it("string vacío → string vacío", () => {
    expect(formatSqm("")).toBe("");
  });
});

// ─── formatPhone ─────────────────────────────────────────────────────────────

describe("formatPhone", () => {
  it("10 dígitos mexicanos → 'NNN NNN NNNN'", () => {
    expect(formatPhone("2721234567")).toBe("272 123 4567");
  });

  it("6 dígitos → 'NNN NNN'", () => {
    expect(formatPhone("272123")).toBe("272 123");
  });

  it("3 o menos dígitos → sin separadores", () => {
    expect(formatPhone("272")).toBe("272");
  });

  it("prefijo +52 → '+52 NNN NNN NNNN'", () => {
    expect(formatPhone("+522721234567")).toBe("+52 272 123 4567");
  });

  it("otro país (+44...) → pass-through sin formatear", () => {
    expect(formatPhone("+441234567890")).toBe("+441234567890");
  });

  it("string vacío → string vacío", () => {
    expect(formatPhone("")).toBe("");
  });
});
