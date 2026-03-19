import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { BackendAdminInsights } from "@/myAccount/admin/api/admin.api";
import type { AdminInsights } from "@/myAccount/admin/types/admin.types";

export type InsightsPeriod = "month" | "quarter" | "year" | "all";

// ─── Mapper ───────────────────────────────────────────────────────────────────

const mapAdminInsights = (b: BackendAdminInsights): AdminInsights => ({
  period: b.period,
  salesByMonth: b.sales_by_month.map((m) => ({
    month: m.month,
    count: m.count,
    totalAmount: m.total_amount,
  })),
  distributionByType: b.distribution_by_type.map((t) => ({
    propertyType: t.property_type,
    count: t.count,
    percentage: t.percentage,
  })),
  activityByZone: b.activity_by_zone,
  topAgents: b.top_agents.map((a) => ({
    id: a.id,
    name: a.name,
    salesCount: a.sales_count,
    leadsCount: a.leads_count,
    score: a.score,
  })),
  summary: {
    totalProperties: b.summary.total_properties,
    totalSales: b.summary.total_sales,
    totalRevenue: b.summary.total_revenue,
    activeLeads: b.summary.active_leads,
  },
});

// ─── Action ───────────────────────────────────────────────────────────────────

export const getAdminInsightsAction = async (
  period: InsightsPeriod = "month"
): Promise<AdminInsights> => {
  try {
    const { data } = await adminApi.getInsights(period);
    return mapAdminInsights(data);
  } catch (error) {
    console.error("[getAdminInsightsAction] Error al obtener insights:", error);
    throw error;
  }
};
