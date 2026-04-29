import { describe, it, expect } from "vitest";
import { mapStateToStatus } from "./map-state-to-status.utils";

describe("mapStateToStatus", () => {
  it("'used' retorna 'oportunidad'", () => {
    expect(mapStateToStatus("used")).toBe("oportunidad");
  });

  it("'nueva' retorna 'disponible'", () => {
    expect(mapStateToStatus("nueva")).toBe("disponible");
  });

  it("'new' retorna 'disponible'", () => {
    expect(mapStateToStatus("new")).toBe("disponible");
  });

  it("string desconocido retorna 'disponible' por defecto", () => {
    expect(mapStateToStatus("cualquier-otro")).toBe("disponible");
  });
});
