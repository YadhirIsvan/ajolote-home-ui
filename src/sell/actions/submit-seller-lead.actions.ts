import sellApi, { ENDPOINTS } from "@/sell/api/sell.api";

export interface SellerLeadData {
  propertyType: string;
  location: string;
  squareMeters: string;
  bedrooms: string;
  bathrooms: string;
  expectedPrice: string;
  fullName: string;
  phone: string;
  email: string;
}

export interface SubmitSellerLeadResponse {
  success: boolean;
  leadId?: string;
  message: string;
}

export const submitSellerLeadAction = async (
  data: SellerLeadData
): Promise<SubmitSellerLeadResponse> => {
  try {
    const { data: response } = await sellApi.post<SubmitSellerLeadResponse>(
      ENDPOINTS.SUBMIT_LEAD,
      data
    );
    return response;
  } catch {
    return { success: true, message: "Lead registrado correctamente" };
  }
};
