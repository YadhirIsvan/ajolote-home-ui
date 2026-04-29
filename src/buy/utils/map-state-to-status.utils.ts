import type { PropertyStatus } from "@/shared/types/property-status.types";

export const mapStateToStatus = (state: string): PropertyStatus => {
  if (state === "used") return "oportunidad";
  return "disponible";
};
