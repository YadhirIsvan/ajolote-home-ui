import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClientPropertySaleDetailAction } from "./get-client-property-sale-detail.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: { getPropertySaleDetail: vi.fn() },
}));

const mockedGetPropertySaleDetail = vi.mocked(clientApi.getPropertySaleDetail);

function makeBackendDetail(overrides: Record<string, unknown> = {}) {
  return {
    id: 30,
    status: "activo",
    property: {
      id: 300,
      title: "Casa Colonia Centro",
      address: "Av. 5 de Mayo 10",
      price: "1,800,000",
      image: "https://example.com/casa.jpg",
      bedrooms: 3,
      bathrooms: 2,
      views: 80,
    },
    agent: { name: "Luis Ramírez", phone: "272-000-0000", email: "luis@example.com" },
    stages: [{ name: "Valuación", status: "completed", completed_at: "2026-03-01" }],
    history: [{ previous_status: "pendiente", new_status: "activo", changed_at: "2026-03-01", notes: "" }],
    ...overrides,
  };
}

beforeEach(() => vi.clearAllMocks());

describe("getClientPropertySaleDetailAction", () => {
  it("mapea BackendSaleDetail → PropertySaleItem correctamente", async () => {
    mockedGetPropertySaleDetail.mockResolvedValueOnce({
      data: makeBackendDetail(),
    } as never);

    const result = await getClientPropertySaleDetailAction(30);

    expect(result.id).toBe(30);
    expect(result.title).toBe("Casa Colonia Centro");
    expect(result.agent?.name).toBe("Luis Ramírez");
    expect(result.stages).toHaveLength(1);
    expect(result.history).toHaveLength(1);
  });

  it("property.address/price/image ausentes → cadenas vacías", async () => {
    mockedGetPropertySaleDetail.mockResolvedValueOnce({
      data: makeBackendDetail({
        property: { id: 1, title: "Sin datos", image: "" },
      }),
    } as never);

    const result = await getClientPropertySaleDetailAction(30);

    expect(result.address).toBe("");
    expect(result.price).toBe("");
  });

  it("con fallback: views/interested/daysListed/trend/progressStep tomados del fallback", async () => {
    mockedGetPropertySaleDetail.mockResolvedValueOnce({
      data: makeBackendDetail(),
    } as never);

    const fallback = {
      id: 30,
      views: 999,
      interested: 42,
      daysListed: 15,
      trend: "down",
      progressStep: 3,
      client_visible_status: "marketing" as const,
    } as never;

    const result = await getClientPropertySaleDetailAction(30, fallback);

    expect(result.views).toBe(999);
    expect(result.interested).toBe(42);
    expect(result.daysListed).toBe(15);
    expect(result.trend).toBe("down");
    expect(result.progressStep).toBe(3);
    expect(result.client_visible_status).toBe("marketing");
  });

  it("error CON fallback → retorna el fallback", async () => {
    mockedGetPropertySaleDetail.mockRejectedValueOnce(new Error("Network error"));
    const fallback = { id: 30, title: "Fallback Casa" } as never;

    const result = await getClientPropertySaleDetailAction(30, fallback);

    expect(result).toBe(fallback);
  });

  it("error SIN fallback → lanza con id en el mensaje", async () => {
    mockedGetPropertySaleDetail.mockRejectedValueOnce(new Error("Network error"));

    await expect(getClientPropertySaleDetailAction(99)).rejects.toThrow(
      "No se pudo cargar el detalle del proceso de venta 99"
    );
  });

  it("stages e history mapeados como SaleProcessStage[] y SaleProcessHistoryEntry[]", async () => {
    const detail = makeBackendDetail();
    mockedGetPropertySaleDetail.mockResolvedValueOnce({
      data: detail,
    } as never);

    const result = await getClientPropertySaleDetailAction(30);

    expect(result.stages?.[0]).toMatchObject({ name: "Valuación", status: "completed" });
    expect(result.history?.[0]).toMatchObject({ new_status: "activo" });
  });
});
