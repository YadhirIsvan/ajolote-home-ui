import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAdminInsightsAction } from "./get-admin-insights.actions";
import { adminApi } from "@/myAccount/admin/api/admin.api";

vi.mock("@/myAccount/admin/api/admin.api");

const mockedApi = vi.mocked(adminApi);

const BACKEND_INSIGHTS = {
  period: "month",
  sales_by_month: [{ month: "2026-03", count: 5, total_amount: 7500000 }],
  distribution_by_type: [{ property_type: "casa", count: 3, percentage: 60 }],
  activity_by_zone: { Norte: 10, Sur: 5 },
  top_agents: [{ id: 1, name: "Pedro", sales_count: 3, leads_count: 10, score: "4.9" }],
  summary: {
    total_properties: 50,
    total_sales: 12,
    total_revenue: 18000000,
    active_leads: 30,
  },
};

beforeEach(() => vi.clearAllMocks());

describe("getAdminInsightsAction — mapeo", () => {
  it("mapea summary de snake_case a camelCase", async () => {
    mockedApi.getInsights.mockResolvedValueOnce({
      data: BACKEND_INSIGHTS,
    } as never);

    const result = await getAdminInsightsAction("month");

    expect(result.summary.totalProperties).toBe(50);
    expect(result.summary.totalSales).toBe(12);
    expect(result.summary.totalRevenue).toBe(18000000);
    expect(result.summary.activeLeads).toBe(30);
  });

  it("mapea topAgents con salesCount y leadsCount", async () => {
    mockedApi.getInsights.mockResolvedValueOnce({
      data: BACKEND_INSIGHTS,
    } as never);

    const result = await getAdminInsightsAction();

    expect(result.topAgents).toHaveLength(1);
    expect(result.topAgents[0].salesCount).toBe(3);
    expect(result.topAgents[0].leadsCount).toBe(10);
  });

  it("mapea distributionByType con propertyType", async () => {
    mockedApi.getInsights.mockResolvedValueOnce({
      data: BACKEND_INSIGHTS,
    } as never);

    const result = await getAdminInsightsAction();

    expect(result.distributionByType[0].propertyType).toBe("casa");
  });

  it("llama a la API con el período correcto", async () => {
    mockedApi.getInsights.mockResolvedValueOnce({
      data: BACKEND_INSIGHTS,
    } as never);

    await getAdminInsightsAction("year");

    expect(mockedApi.getInsights).toHaveBeenCalledWith("year");
  });

  it("usa 'month' como período por defecto", async () => {
    mockedApi.getInsights.mockResolvedValueOnce({
      data: BACKEND_INSIGHTS,
    } as never);

    await getAdminInsightsAction();

    expect(mockedApi.getInsights).toHaveBeenCalledWith("month");
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getInsights.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminInsightsAction()).rejects.toThrow();
  });
});
