import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAdminHistoryAction } from "./get-admin-history.actions";
import { adminApi } from "@/myAccount/admin/api/admin.api";

vi.mock("@/myAccount/admin/api/admin.api");

const mockedApi = vi.mocked(adminApi);

const BACKEND_ITEM = {
  id: 1,
  property: { title: "Casa Norte", property_type: "casa", zone: "Norte" },
  client: { id: 10, name: "Juan" },
  agent: { id: 5, name: "Pedro" },
  sale_price: "1500000.00",
  payment_method: "credito",
  closed_at: "2026-03-15T00:00:00Z",
};

beforeEach(() => vi.clearAllMocks());

describe("getAdminHistoryAction — mapeo", () => {
  it("mapea property.property_type a propertyType", async () => {
    mockedApi.getSalesHistory.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_ITEM] },
    } as never);

    const result = await getAdminHistoryAction();

    expect(result.count).toBe(1);
    const item = result.results[0];
    expect(item.property.propertyType).toBe("casa");
    expect(item.property.zone).toBe("Norte");
    expect(item.salePrice).toBe("1500000.00");
    expect(item.paymentMethod).toBe("credito");
    expect(item.closedAt).toBe("2026-03-15T00:00:00Z");
  });

  it("pasa los params a la API", async () => {
    mockedApi.getSalesHistory.mockResolvedValueOnce({
      data: { count: 0, results: [] },
    } as never);

    await getAdminHistoryAction({ zone: "Sur", limit: 10 });

    expect(mockedApi.getSalesHistory).toHaveBeenCalledWith({ zone: "Sur", limit: 10 });
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getSalesHistory.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminHistoryAction()).rejects.toThrow();
  });
});
