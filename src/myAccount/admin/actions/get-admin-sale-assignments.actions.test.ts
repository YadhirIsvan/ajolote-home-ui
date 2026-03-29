import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSaleProcessAssignmentsAction,
  assignSaleProcessAgentAction,
  unassignSaleProcessAgentAction,
} from "./get-admin-sale-assignments.actions";
import { adminApi } from "@/myAccount/admin/api/admin.api";

vi.mock("@/myAccount/admin/api/admin.api");

const mockedApi = vi.mocked(adminApi);

const BACKEND_ENTRY = {
  sale_process_id: 10,
  property: {
    id: 5,
    title: "Casa Sur",
    property_type: "casa",
    image: "https://cdn.example.com/img.jpg",
    price: "2000000.00",
    address: "Av. Sur 50",
  },
  status: "captacion",
  agent: { membership_id: "MEM-002", name: "Pedro" },
};

const BACKEND_RESPONSE = {
  unassigned: [BACKEND_ENTRY],
  assigned: [{ ...BACKEND_ENTRY, sale_process_id: 11, agent: null }],
};

beforeEach(() => vi.clearAllMocks());

// ─── getSaleProcessAssignmentsAction ─────────────────────────────────────────

describe("getSaleProcessAssignmentsAction — mapeo", () => {
  it("mapea unassigned y assigned correctamente", async () => {
    mockedApi.getSaleProcessAssignments.mockResolvedValueOnce({
      data: BACKEND_RESPONSE,
    } as never);

    const result = await getSaleProcessAssignmentsAction();

    expect(result.unassigned).toHaveLength(1);
    expect(result.unassigned[0].saleProcessId).toBe(10);
    expect(result.unassigned[0].property.propertyType).toBe("casa");
    expect(result.unassigned[0].agent?.membershipId).toBe("MEM-002");

    expect(result.assigned[0].agent).toBeNull();
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getSaleProcessAssignments.mockRejectedValueOnce(new Error("err"));
    await expect(getSaleProcessAssignmentsAction()).rejects.toThrow();
  });
});

// ─── assignSaleProcessAgentAction ─────────────────────────────────────────────

describe("assignSaleProcessAgentAction", () => {
  it("llama a la API con saleProcessId y agentMembershipId", async () => {
    mockedApi.assignSaleProcessAgent.mockResolvedValueOnce(undefined as never);

    await assignSaleProcessAgentAction(10, 20);

    expect(mockedApi.assignSaleProcessAgent).toHaveBeenCalledWith(10, 20);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.assignSaleProcessAgent.mockRejectedValueOnce(new Error("err"));
    await expect(assignSaleProcessAgentAction(1, 1)).rejects.toThrow();
  });
});

// ─── unassignSaleProcessAgentAction ──────────────────────────────────────────

describe("unassignSaleProcessAgentAction", () => {
  it("llama a la API con el saleProcessId correcto", async () => {
    mockedApi.unassignSaleProcessAgent.mockResolvedValueOnce(undefined as never);

    await unassignSaleProcessAgentAction(10);

    expect(mockedApi.unassignSaleProcessAgent).toHaveBeenCalledWith(10);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.unassignSaleProcessAgent.mockRejectedValueOnce(new Error("err"));
    await expect(unassignSaleProcessAgentAction(1)).rejects.toThrow();
  });
});
