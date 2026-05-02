import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminInsightsAction,
  type InsightsPeriod,
} from "@/myAccount/admin/actions/get-admin-insights.actions";

export const useAdminInsights = () => {
  const [period, setPeriod] = useState<InsightsPeriod>("year");

  const insightsQuery = useQuery({
    queryKey: ["admin-insights", period],
    queryFn: () => getAdminInsightsAction(period),
  });

  return {
    period,
    setPeriod,
    insightsQuery,
    insights: insightsQuery.data,
  };
};
