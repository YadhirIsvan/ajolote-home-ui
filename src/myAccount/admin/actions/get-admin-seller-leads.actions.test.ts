import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAdminSellerLeadsAction,
  updateAdminSellerLeadAction,
  convertAdminSellerLeadAction,
} from "./get-admin-seller-leads.actions";
import { adminApi } from "@/myAccount/admin/api/admin.api";

vi.mock("@/myAccount/admin/api/admin.api");

const mockedApi = vi.mocked(adminApi);

const BACKEND_LEAD = {
  id: 1,
  full_name: "María Vendedora",
  email: "maria@example.com",
  phone: "555-3333",
  property_type: "casa",
  location: "CDMX Norte",
  expected_price: "2500000.00",
  status: "nuevo",
  assigned_agent: null,
  created_at: "2026-03-01T00:00:00Z",
};

beforeEach(() => vi.clearAllMocks());

// ─── getAdminSellerLeadsAction ────────────────────────────────────────────────

describe("getAdminSellerLeadsAction — mapeo", () => {
  it("mapea snake_case a camelCase correctamente", async () => {
    mockedApi.getSellerLeads.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_LEAD] },
    } as never);

    const result = await getAdminSellerLeadsAction();

    const lead = result.results[0];
    expect(lead.fullName).toBe("María Vendedora");
    expect(lead.propertyType).toBe("casa");
    expect(lead.expectedPrice).toBe("2500000.00");
    expect(lead.assignedAgent).toBeNull();
    expect(lead.createdAt).toBe("2026-03-01T00:00:00Z");
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getSellerLeads.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminSellerLeadsAction()).rejects.toThrow();
  });
});

// ─── updateAdminSellerLeadAction ──────────────────────────────────────────────

describe("updateAdminSellerLeadAction", () => {
  it("llama a la API con id y payload correctos", async () => {
    mockedApi.updateSellerLead.mockResolvedValueOnce(undefined as never);

    const payload = { status: "en_proceso" as const, notes: "Contactado" };
    await updateAdminSellerLeadAction(1, payload);

    expect(mockedApi.updateSellerLead).toHaveBeenCalledWith(1, payload);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.updateSellerLead.mockRejectedValueOnce(new Error("err"));
    await expect(updateAdminSellerLeadAction(1, {})).rejects.toThrow();
  });
});

// ─── convertAdminSellerLeadAction ─────────────────────────────────────────────

describe("convertAdminSellerLeadAction", () => {
  it("retorna property_id, sale_process_id y message del backend", async () => {
    mockedApi.convertSellerLead.mockResolvedValueOnce({
      data: { property_id: 100, sale_process_id: 200, message: "Convertido" },
    } as never);

    const result = await convertAdminSellerLeadAction(1, 20, "Listo");

    expect(result.property_id).toBe(100);
    expect(result.sale_process_id).toBe(200);
    expect(result.message).toBe("Convertido");
  });

  it("llama a la API con agent_membership_id y notes", async () => {
    mockedApi.convertSellerLead.mockResolvedValueOnce({
      data: { property_id: 1, sale_process_id: 2, message: "ok" },
    } as never);

    await convertAdminSellerLeadAction(5, 99, "nota");

    expect(mockedApi.convertSellerLead).toHaveBeenCalledWith(
      5,
      { agent_membership_id: 99, notes: "nota" }
    );
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.convertSellerLead.mockRejectedValueOnce(new Error("err"));
    await expect(convertAdminSellerLeadAction(1, 1)).rejects.toThrow();
  });
});
