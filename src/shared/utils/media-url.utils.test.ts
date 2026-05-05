import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const BASE_URL = "https://api.avakanta.com/api/v1";

beforeEach(() => {
  vi.stubEnv("VITE_API_BASE_URL", BASE_URL);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

// Importación dinámica para que la función lea el env ya mockeado
const { getMediaUrl, getApiOrigin } = await import("./media-url.utils");

// ─── getApiOrigin ─────────────────────────────────────────────────────────────

describe("getApiOrigin", () => {
  it("extrae solo el origen (scheme + host) de VITE_API_BASE_URL", () => {
    expect(getApiOrigin()).toBe("https://api.avakanta.com");
  });

  it("no incluye el path /api/v1", () => {
    expect(getApiOrigin()).not.toContain("/api/v1");
  });
});

// ─── getMediaUrl ──────────────────────────────────────────────────────────────

describe("getMediaUrl", () => {
  it("path /media/* → URL absoluta con el origen", () => {
    expect(getMediaUrl("/media/avatars/7/abc123.webp")).toBe(
      "https://api.avakanta.com/media/avatars/7/abc123.webp"
    );
  });

  it("URL absoluta ya con http → se devuelve sin modificar", () => {
    const url = "https://cdn.ejemplo.com/imagen.jpg";
    expect(getMediaUrl(url)).toBe(url);
  });

  it("path sin /media/ → se devuelve tal cual", () => {
    expect(getMediaUrl("/static/logo.png")).toBe("/static/logo.png");
  });
});
