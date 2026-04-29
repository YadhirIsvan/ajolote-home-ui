import { describe, it, expect } from "vitest";
import { extractYouTubeId } from "./extract-youtube-id.utils";

describe("extractYouTubeId", () => {
  it("undefined retorna null", () => {
    expect(extractYouTubeId(undefined)).toBeNull();
  });

  it("string vacío retorna null", () => {
    expect(extractYouTubeId("")).toBeNull();
  });

  it("ID corto de 11 chars se retorna tal cual", () => {
    expect(extractYouTubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("URL youtube.com/watch?v= extrae el ID", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("URL youtu.be/ extrae el ID", () => {
    expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("URL de embed extrae el ID", () => {
    expect(extractYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("URL con parámetro ?v= extra extrae correctamente via URL API", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s")).toBe("dQw4w9WgXcQ");
  });
});
