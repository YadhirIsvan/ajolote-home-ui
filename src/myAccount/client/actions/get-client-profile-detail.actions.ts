import { clientApi } from "@/myAccount/client/api/client.api";
import type { ClientProfileDetail } from "@/myAccount/client/types/client.types";

export const getClientProfileDetailAction = async (): Promise<ClientProfileDetail> => {
  const { data } = await clientApi.getClientProfile();
  return {
    occupation: data.occupation ?? "",
    residence_location: data.residence_location ?? "",
    desired_credit_type: data.desired_credit_type ?? "",
    desired_property_type: data.desired_property_type ?? "",
  };
};

export const updateClientProfileFieldAction = async (
  field: string,
  value: string
): Promise<ClientProfileDetail> => {
  const { data } = await clientApi.updateClientProfile({ [field]: value });
  return {
    occupation: data.occupation ?? "",
    residence_location: data.residence_location ?? "",
    desired_credit_type: data.desired_credit_type ?? "",
    desired_property_type: data.desired_property_type ?? "",
  };
};
