import { clientApi } from "@/myAccount/client/api/client.api";
import type { RecentActivityItem } from "@/myAccount/client/types/client.types";

const DEFAULT_ACTIVITY: RecentActivityItem[] = [
  { name: "Score Legal Generado", descripction: "Casa en Querétaro - Score: 98/100", time: 2 },
  { name: "Crédito Pre-aprobado", descripction: "Monto: $8,500,000 MXN", time: 5 },
  { name: "Propiedad Agregada", descripction: "Departamento en CDMX", time: 7 },
];

export const getClientRecentActivityAction =
  async (): Promise<RecentActivityItem[]> => {
    try {
      const { data } = await clientApi.getRecentActivity();
      return Array.isArray(data) ? (data as RecentActivityItem[]) : DEFAULT_ACTIVITY;
    } catch {
      return DEFAULT_ACTIVITY;
    }
  };
