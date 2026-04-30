import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClientPropertiesSaleAction } from "./get-client-properties-sale.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: { getPropertiesSale: vi.fn() },
}));

const mockedGetPropertiesSale = vi.mocked(clientApi.getPropertiesSale);

function makeBackendSaleItem(overrides = {}) {
  return {
    id: 20,
    status: "activo",
    client_visible_status: "marketing",
    progress_step: 2,
    views: 150,
    interested: 5,
    days_listed: 30,
    trend: "up",
    property: {
      id: 200,
      title: "Departamento Centro",
      address: "Calle 2 #45",
      price: "2,000,000",
      image: "https://example.com/dep.jpg",
    },
    agent: { name: "María Pérez" },
    ...overrides,
  };
}

function makeBackendStats(overrides = {}) {
  return {
    total_properties: 1,
    total_views: 150,
    total_interested: 5,
    total_value: "2000000.00",
    ...overrides,
  };
}

beforeEach(() => vi.clearAllMocks());

describe("getClientPropertiesSaleAction", () => {
  it("mapea results: daysListed ← days_listed, progressStep ← progress_step, client_visible_status", async () => {
    mockedGetPropertiesSale.mockResolvedValueOnce({
      data: { stats: makeBackendStats(), results: [makeBackendSaleItem()] },
    } as never);

    const { list } = await getClientPropertiesSaleAction();

    expect(list[0].daysListed).toBe(30);
    expect(list[0].progressStep).toBe(2);
    expect(list[0].client_visible_status).toBe("marketing");
    expect(list[0].trend).toBe("up");
  });

  it("mapea stats: totalValue como parseFloat, interestedAmount ← total_interested", async () => {
    mockedGetPropertiesSale.mockResolvedValueOnce({
      data: {
        stats: makeBackendStats({ total_value: "3500000.50", total_interested: 12 }),
        results: [],
      },
    } as never);

    const { summary } = await getClientPropertiesSaleAction();

    expect(summary?.totalValue).toBeCloseTo(3500000.5);
    expect(summary?.interestedAmount).toBe(12);
    expect(summary?.totalViews).toBe(150);
    expect(summary?.propertiesAmount).toBe(1);
  });

  it("property.image: null → image: ''", async () => {
    mockedGetPropertiesSale.mockResolvedValueOnce({
      data: {
        stats: makeBackendStats(),
        results: [
          makeBackendSaleItem({
            property: { id: 1, title: "T", address: "A", price: "0", image: null },
          }),
        ],
      },
    } as never);

    const { list } = await getClientPropertiesSaleAction();

    expect(list[0].image).toBe("");
  });

  it("múltiples resultados → list con la longitud correcta", async () => {
    mockedGetPropertiesSale.mockResolvedValueOnce({
      data: {
        stats: makeBackendStats({ total_properties: 2 }),
        results: [makeBackendSaleItem(), makeBackendSaleItem({ id: 21 })],
      },
    } as never);

    const { list } = await getClientPropertiesSaleAction();

    expect(list).toHaveLength(2);
  });

  it("error → lanza un Error", async () => {
    mockedGetPropertiesSale.mockRejectedValueOnce(new Error("Server error"));

    await expect(getClientPropertiesSaleAction()).rejects.toThrow("Server error");
  });
});
