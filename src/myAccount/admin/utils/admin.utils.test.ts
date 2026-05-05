import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fmtPrice,
  calcDays,
  localDateStr,
  getInitials,
  formatDate,
  extractYouTubeId,
} from "./admin.utils";

// ─── getMediaUrl ──────────────────────────────────────────────────────────────
// getMediaUrl depends on getApiOrigin from shared/utils/media-url.utils, which reads
// import.meta.env.VITE_API_BASE_URL. It is tested as an integration of admin.utils.

// ─── fmtPrice ─────────────────────────────────────────────────────────────────

describe("fmtPrice", () => {
  it("precio válido → string con $ y separadores MXN", () => {
    const result = fmtPrice("1500000");
    expect(result).toContain("$");
    expect(result).toMatch(/1[,.]500[,.]000/);
  });

  it("string vacío → '—'", () => {
    expect(fmtPrice("")).toBe("—");
  });

  it("string no numérico → '—'", () => {
    expect(fmtPrice("abc")).toBe("—");
  });

  it("sin decimales (maximumFractionDigits: 0)", () => {
    expect(fmtPrice("1200000.99")).not.toContain(".99");
  });
});

// ─── calcDays ─────────────────────────────────────────────────────────────────

describe("calcDays", () => {
  it("null → 0", () => {
    expect(calcDays(null)).toBe(0);
  });

  it("fecha de hoy → 0 días", () => {
    expect(calcDays(new Date().toISOString())).toBe(0);
  });

  it("fecha hace 5 días → 5", () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 86_400_000).toISOString();
    expect(calcDays(fiveDaysAgo)).toBe(5);
  });
});

// ─── localDateStr ─────────────────────────────────────────────────────────────

describe("localDateStr", () => {
  it("retorna formato YYYY-MM-DD", () => {
    const d = new Date(2024, 0, 5); // 5 Jan 2024
    expect(localDateStr(d)).toBe("2024-01-05");
  });

  it("rellena mes y día con cero si son de un dígito", () => {
    const d = new Date(2024, 2, 3); // 3 Mar 2024
    expect(localDateStr(d)).toBe("2024-03-03");
  });
});

// ─── getInitials ──────────────────────────────────────────────────────────────

describe("getInitials", () => {
  it("nombre completo → primeras 2 iniciales en mayúscula", () => {
    expect(getInitials("Juan García")).toBe("JG");
  });

  it("nombre de una sola palabra → 1 inicial (solo hay una primera letra)", () => {
    expect(getInitials("Ana")).toBe("A");
  });

  it("tres palabras → solo 2 iniciales", () => {
    expect(getInitials("María José Pérez")).toBe("MJ");
  });
});

// ─── formatDate (admin) ───────────────────────────────────────────────────────

describe("formatDate (admin)", () => {
  it("ISO string retorna string legible con año", () => {
    const result = formatDate("2024-03-15T10:00:00Z");
    expect(result).toContain("2024");
  });

  it("retorna string no vacío", () => {
    expect(formatDate("2024-06-01")).toBeTruthy();
  });
});

// ─── extractYouTubeId (admin) ─────────────────────────────────────────────────

describe("extractYouTubeId (admin)", () => {
  it("URL youtube.com/watch?v= extrae el ID", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("URL youtu.be/ extrae el ID", () => {
    expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("URL embed extrae el ID", () => {
    expect(extractYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("URL shorts extrae el ID", () => {
    expect(extractYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("string de 11 chars que no es URL → se devuelve tal cual (trim)", () => {
    expect(extractYouTubeId("  dQw4w9WgXcQ  ")).toBe("dQw4w9WgXcQ");
  });
});
