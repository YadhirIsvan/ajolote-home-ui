import { clientApi } from "@/myAccount/client/api/client.api";
import { hoursAgo, humanizeType } from "@/myAccount/client/utils/client.utils";
import type { RecentActivityItem } from "@/myAccount/client/types/client.types";

interface BackendActivityItem {
  type: string;
  description: string;
  created_at: string;
}

interface DashboardResponse {
  recent_activity: BackendActivityItem[];
}

export const getClientRecentActivityAction = async (): Promise<RecentActivityItem[]> => {
  try {
    const { data } = await clientApi.getDashboard();
    const dashboard = data as DashboardResponse;
    return (dashboard.recent_activity ?? []).map((item) => ({
      name: humanizeType(item.type),
      description: item.description,
      time: hoursAgo(item.created_at),
    }));
  } catch (error) {
    console.error("[getClientRecentActivityAction] Error al obtener actividad reciente:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener actividad reciente"
    );
  }
};
