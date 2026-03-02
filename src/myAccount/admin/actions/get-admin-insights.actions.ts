import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { AdminInsights } from "@/myAccount/admin/types/admin.types";

export type InsightsPeriod = "month" | "quarter" | "year" | "all";

export const getAdminInsightsAction = async (
  period: InsightsPeriod = "month"
): Promise<AdminInsights> => {
  const { data } = await adminApi.getInsights(period);
  return data as AdminInsights;
};
