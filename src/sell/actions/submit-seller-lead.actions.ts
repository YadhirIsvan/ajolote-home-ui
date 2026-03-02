import { sellApi, ENDPOINTS } from "@/sell/api/sell.api";

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

interface BackendSellerLeadResponse {
  id: number;
  full_name: string;
  status: string;
  message: string;
}

const PROPERTY_TYPE_MAP: Record<string, string> = {
  casa: "house",
  departamento: "apartment",
  terreno: "land",
  local: "commercial",
};

export const submitSellerLeadAction = async (
  data: SellerLeadData
): Promise<SubmitSellerLeadResponse> => {
  const payload = {
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    property_type: PROPERTY_TYPE_MAP[data.propertyType] ?? data.propertyType,
    location: data.location,
    square_meters: data.squareMeters ? parseFloat(data.squareMeters) : undefined,
    bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : undefined,
    bathrooms: data.bathrooms ? parseInt(data.bathrooms, 10) : undefined,
    expected_price: data.expectedPrice ? parseFloat(data.expectedPrice) : undefined,
  };

  try {
    const { data: response } = await sellApi.post<BackendSellerLeadResponse>(
      ENDPOINTS.SUBMIT_LEAD,
      payload
    );
    return {
      success: true,
      leadId: String(response.id),
      message: response.message,
    };
  } catch {
    return {
      success: false,
      message: "No se pudo enviar tu solicitud. Intenta de nuevo.",
    };
  }
};
