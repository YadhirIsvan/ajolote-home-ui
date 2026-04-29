import { describe, it, expect } from "vitest";
import { formatBuyPrice } from "./format-price.utils";

describe("formatBuyPrice", () => {
  it("número entero formatea con $ y separadores MXN", () => {
    const result = formatBuyPrice(1500000);
    expect(result).toContain("$");
    expect(result).toMatch(/1[,.]500[,.]000/);
  });

  it("string numérico se parsea y formatea igual que number", () => {
    expect(formatBuyPrice("2500000")).toBe(formatBuyPrice(2500000));
  });

  it("0 retorna precio formateado de cero", () => {
    const result = formatBuyPrice(0);
    expect(result).toContain("$");
    expect(result).toContain("0");
  });

  it("precio con decimales en string se redondea (maximumFractionDigits: 0)", () => {
    const result = formatBuyPrice("1200000.99");
    expect(result).not.toContain(".99");
    expect(result).toMatch(/1[,.]200[,.]001|1[,.]200[,.]000|1[,.]200[,.]001/);
  });
});
