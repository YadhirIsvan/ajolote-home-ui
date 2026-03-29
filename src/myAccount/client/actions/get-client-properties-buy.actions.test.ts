import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClientPropertiesBuyAction } from "./get-client-properties-buy.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: { getPropertiesBuys: vi.fn() },
}));

const mockedGetPropertiesBuys = vi.mocked(clientApi.getPropertiesBuys);

function makeBackendPurchase(overrides = {}) {
  return {
    id: 10,
    status: "en_proceso",
    overall_progress: 45,
    process_stage: "Crédito",
    documents_count: 3,
    property: {
      id: 100,
      title: "Casa en Orizaba",
      address: "Av. Principal 123",
      price: "1,500,000",
      image: "https://example.com/photo.jpg",
    },
    agent: { name: "Carlos López" },
    ...overrides,
  };
}

beforeEach(() => vi.clearAllMocks());

describe("getClientPropertiesBuyAction", () => {
  it("mapea los campos de backend → PropertyBuySummary correctamente", async () => {
    mockedGetPropertiesBuys.mockResolvedValueOnce({
      data: { count: 1, results: [makeBackendPurchase()] },
    } as never);

    const [item] = await getClientPropertiesBuyAction();

    expect(item.id).toBe(10);
    expect(item.title).toBe("Casa en Orizaba");
    expect(item.overallProgress).toBe(45);
    expect(item.processStage).toBe("Crédito");
    expect(item.agent_name).toBe("Carlos López");
    expect(item.documents_count).toBe(3);
  });

  it("property.image: null → image: ''", async () => {
    mockedGetPropertiesBuys.mockResolvedValueOnce({
      data: {
        count: 1,
        results: [makeBackendPurchase({ property: { id: 1, title: "T", address: "A", price: "0", image: null } })],
      },
    } as never);

    const [item] = await getClientPropertiesBuyAction();

    expect(item.image).toBe("");
  });

  it("múltiples resultados → retorna array con la longitud correcta", async () => {
    mockedGetPropertiesBuys.mockResolvedValueOnce({
      data: {
        count: 2,
        results: [makeBackendPurchase(), makeBackendPurchase({ id: 11 })],
      },
    } as never);

    const result = await getClientPropertiesBuyAction();

    expect(result).toHaveLength(2);
  });

  it("error → silencia y retorna []", async () => {
    mockedGetPropertiesBuys.mockRejectedValueOnce(new Error("Server error"));

    const result = await getClientPropertiesBuyAction();

    expect(result).toEqual([]);
  });
});
