import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAdminPurchaseProcessesAction,
  updatePurchaseProcessStatusAction,
  getAdminSaleProcessesAction,
  updateSaleProcessStatusAction,
} from "./get-admin-kanban.actions";
import { adminApi } from "@/myAccount/admin/api/admin.api";

vi.mock("@/myAccount/admin/api/admin.api");

const mockedApi = vi.mocked(adminApi);

const BACKEND_PURCHASE = {
  id: 1,
  status: "documentacion",
  overall_progress: 40,
  client: { id: 10, name: "Ana" },
  property: { id: 5, title: "Casa A" },
  agent: { id: 2, name: "Pedro" },
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-03-01T00:00:00Z",
};

const BACKEND_SALE = {
  id: 2,
  status: "captacion",
  property: { id: 6, title: "Casa B" },
  client: { id: 11, name: "Luis" },
  agent: { id: 3, name: "María" },
  created_at: "2026-02-01T00:00:00Z",
  updated_at: "2026-03-10T00:00:00Z",
};

beforeEach(() => vi.clearAllMocks());

// ─── getAdminPurchaseProcessesAction ─────────────────────────────────────────

describe("getAdminPurchaseProcessesAction — mapeo", () => {
  it("mapea overallProgress y updatedAt", async () => {
    mockedApi.getPurchaseProcesses.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_PURCHASE] },
    } as never);

    const result = await getAdminPurchaseProcessesAction();

    expect(result.results[0].overallProgress).toBe(40);
    expect(result.results[0].updatedAt).toBe("2026-03-01T00:00:00Z");
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getPurchaseProcesses.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminPurchaseProcessesAction()).rejects.toThrow();
  });
});

// ─── updatePurchaseProcessStatusAction ───────────────────────────────────────

describe("updatePurchaseProcessStatusAction", () => {
  it("llama a la API con id y payload correctos", async () => {
    mockedApi.updatePurchaseProcessStatus.mockResolvedValueOnce(undefined as never);

    await updatePurchaseProcessStatusAction(1, "cerrado", "ok");

    expect(mockedApi.updatePurchaseProcessStatus).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ status: "cerrado", notes: "ok" })
    );
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.updatePurchaseProcessStatus.mockRejectedValueOnce(new Error("err"));
    await expect(
      updatePurchaseProcessStatusAction(1, "cerrado")
    ).rejects.toThrow();
  });
});

// ─── getAdminSaleProcessesAction ─────────────────────────────────────────────

describe("getAdminSaleProcessesAction — mapeo", () => {
  it("mapea campos de venta correctamente", async () => {
    mockedApi.getSaleProcesses.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_SALE] },
    } as never);

    const result = await getAdminSaleProcessesAction();

    expect(result.results[0].status).toBe("captacion");
    expect(result.results[0].updatedAt).toBe("2026-03-10T00:00:00Z");
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getSaleProcesses.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminSaleProcessesAction()).rejects.toThrow();
  });
});

// ─── updateSaleProcessStatusAction ───────────────────────────────────────────

describe("updateSaleProcessStatusAction", () => {
  it("llama a la API con status y notes", async () => {
    mockedApi.updateSaleProcessStatus.mockResolvedValueOnce(undefined as never);

    await updateSaleProcessStatusAction(2, "firma_contrato", "Firmado");

    expect(mockedApi.updateSaleProcessStatus).toHaveBeenCalledWith(
      2,
      { status: "cerrado", notes: "Firmado" }
    );
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.updateSaleProcessStatus.mockRejectedValueOnce(new Error("err"));
    await expect(
      updateSaleProcessStatusAction(2, "firma_contrato")
    ).rejects.toThrow();
  });
});
