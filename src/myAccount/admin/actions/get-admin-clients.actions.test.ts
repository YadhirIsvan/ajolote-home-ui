import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAdminClientsAction, getAdminClientDetailAction } from "./get-admin-clients.actions";
import { adminApi } from "@/myAccount/admin/api/admin.api";

vi.mock("@/myAccount/admin/api/admin.api");

const mockedApi = vi.mocked(adminApi);

const BACKEND_CLIENT = {
  id: 1,
  membership_id: "CLI-001",
  name: "Ana López",
  email: "ana@example.com",
  phone: "555-2222",
  avatar: null,
  city: "CDMX",
  purchase_processes_count: 2,
  sale_processes_count: 1,
  date_joined: "2025-01-01T00:00:00Z",
};

const BACKEND_CLIENT_DETAIL = {
  ...BACKEND_CLIENT,
  purchase_processes: [
    {
      id: 10,
      status: "en_proceso",
      overall_progress: 50,
      property: { id: 5, title: "Casa A" },
      agent: { id: 2, name: "Pedro" },
      documents: [],
      created_at: "2025-06-01T00:00:00Z",
    },
  ],
  sale_processes: [],
};

beforeEach(() => vi.clearAllMocks());

// ─── getAdminClientsAction ────────────────────────────────────────────────────

describe("getAdminClientsAction — mapeo", () => {
  it("mapea snake_case a camelCase correctamente", async () => {
    mockedApi.getClients.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_CLIENT] },
    } as never);

    const result = await getAdminClientsAction();

    expect(result.count).toBe(1);
    const client = result.results[0];
    expect(client.membershipId).toBe("CLI-001");
    expect(client.purchaseProcessesCount).toBe(2);
    expect(client.saleProcessesCount).toBe(1);
    expect(client.dateJoined).toBe("2025-01-01T00:00:00Z");
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getClients.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminClientsAction()).rejects.toThrow();
  });
});

// ─── getAdminClientDetailAction ───────────────────────────────────────────────

describe("getAdminClientDetailAction — mapeo", () => {
  it("mapea purchaseProcesses con overallProgress", async () => {
    mockedApi.getClientDetail.mockResolvedValueOnce({
      data: BACKEND_CLIENT_DETAIL,
    } as never);

    const result = await getAdminClientDetailAction(1);

    expect(result.purchaseProcesses).toHaveLength(1);
    expect(result.purchaseProcesses[0].overallProgress).toBe(50);
    expect(result.saleProcesses).toHaveLength(0);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getClientDetail.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminClientDetailAction(1)).rejects.toThrow();
  });
});
