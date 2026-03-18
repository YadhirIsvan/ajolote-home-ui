import { clientApi } from "@/myAccount/client/api/client.api";
import type { ClientProfileDetail } from "@/myAccount/client/types/client.types";

const mapProfileDetail = (data: Record<string, string>): ClientProfileDetail => ({
  occupation: data.occupation ?? "",
  residence_location: data.residence_location ?? "",
  desired_credit_type: data.desired_credit_type ?? "",
  desired_property_type: data.desired_property_type ?? "",
});

export const getClientProfileDetailAction = async (): Promise<ClientProfileDetail> => {
  try {
    const { data } = await clientApi.getClientProfile();
    return mapProfileDetail(data);
  } catch (error) {
    console.error("[getClientProfileDetailAction] Error al obtener detalle de perfil:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener el perfil del cliente"
    );
  }
};

export const updateClientProfileFieldAction = async (
  field: string,
  value: string
): Promise<ClientProfileDetail> => {
  try {
    const { data } = await clientApi.updateClientProfile({ [field]: value });
    return mapProfileDetail(data);
  } catch (error) {
    console.error("[updateClientProfileFieldAction] Error al actualizar campo de perfil:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al actualizar el perfil"
    );
  }
};
