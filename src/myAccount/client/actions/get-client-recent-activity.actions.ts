import { clientApi } from "@/myAccount/client/api/client.api";
import type { RecentActivityItem } from "@/myAccount/client/types/client.types";

interface BackendActivityItem {
  type: string;
  description: string;
  created_at: string;
}

interface DashboardResponse {
  recent_activity: BackendActivityItem[];
}

const hoursAgo = (isoDate: string): number =>
  Math.max(
    1,
    Math.round((Date.now() - new Date(isoDate).getTime()) / 3_600_000)
  );

const humanizeType = (type: string): string =>
  type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const getClientRecentActivityAction = async (): Promise<
  RecentActivityItem[]
> => {
  try {
    const { data } = await clientApi.getDashboard();
    const dashboard = data as DashboardResponse;
    return (dashboard.recent_activity ?? []).map((item) => ({
      name: humanizeType(item.type),
      description: item.description,
      time: hoursAgo(item.created_at),
    }));
  } catch {
    return [];
  }
};
