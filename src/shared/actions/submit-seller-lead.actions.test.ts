import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitSellerLeadAction, type SellerLeadData } from "./submit-seller-lead.actions";
import { axiosInstance } from "@/shared/api/axios.instance";

vi.mock("@/shared/api/axios.instance", () => ({
  axiosInstance: { post: vi.fn() },
}));

const mockedPost = vi.mocked(axiosInstance.post);

beforeEach(() => vi.clearAllMocks());

const BASE_LEAD: SellerLeadData = {
  fullName: "Juan García",
  phone: "+525512345678",
  propertyType: "casa",
  location: "Guadalajara",
  squareMeters: "120",
  bedrooms: "3",
  bathrooms: "2",
  expectedPrice: "2500000",
};

const BACKEND_RESPONSE = {
  id: 7,
  full_name: "Juan García",
  status: "new",
  message: "Solicitud recibida",
};

describe("submitSellerLeadAction", () => {
  it("éxito → { success: true, leadId, message }", async () => {
    mockedPost.mockResolvedValueOnce({ data: BACKEND_RESPONSE } as never);

    const result = await submitSellerLeadAction(BASE_LEAD);

    expect(result.success).toBe(true);
    expect(result.leadId).toBe("7");
    expect(result.message).toBe("Solicitud recibida");
  });

  it("mapea 'casa' → 'house' en el payload", async () => {
    mockedPost.mockResolvedValueOnce({ data: BACKEND_RESPONSE } as never);

    await submitSellerLeadAction(BASE_LEAD);

    expect(mockedPost).toHaveBeenCalledWith(
      "/public/sale-processes",
      expect.objectContaining({ property_type: "house" })
    );
  });

  it("mapea 'departamento' → 'apartment'", async () => {
    mockedPost.mockResolvedValueOnce({ data: BACKEND_RESPONSE } as never);

    await submitSellerLeadAction({ ...BASE_LEAD, propertyType: "departamento" });

    expect(mockedPost).toHaveBeenCalledWith(
      "/public/sale-processes",
      expect.objectContaining({ property_type: "apartment" })
    );
  });

  it("mapea 'terreno' → 'land'", async () => {
    mockedPost.mockResolvedValueOnce({ data: BACKEND_RESPONSE } as never);

    await submitSellerLeadAction({ ...BASE_LEAD, propertyType: "terreno" });

    expect(mockedPost).toHaveBeenCalledWith(
      "/public/sale-processes",
      expect.objectContaining({ property_type: "land" })
    );
  });

  it("propertyType desconocido → se pasa sin transformar", async () => {
    mockedPost.mockResolvedValueOnce({ data: BACKEND_RESPONSE } as never);

    await submitSellerLeadAction({ ...BASE_LEAD, propertyType: "otro" });

    expect(mockedPost).toHaveBeenCalledWith(
      "/public/sale-processes",
      expect.objectContaining({ property_type: "otro" })
    );
  });

  it("con membershipId → incluye membership_id en el payload", async () => {
    mockedPost.mockResolvedValueOnce({ data: BACKEND_RESPONSE } as never);

    await submitSellerLeadAction(BASE_LEAD, 42);

    expect(mockedPost).toHaveBeenCalledWith(
      "/public/sale-processes",
      expect.objectContaining({ membership_id: 42 })
    );
  });

  it("sin membershipId → no incluye membership_id", async () => {
    mockedPost.mockResolvedValueOnce({ data: BACKEND_RESPONSE } as never);

    await submitSellerLeadAction(BASE_LEAD);

    const payload = (mockedPost.mock.calls[0] as unknown[])[1] as Record<string, unknown>;
    expect(payload).not.toHaveProperty("membership_id");
  });

  it("squareMeters vacío → no incluye square_meters en el payload", async () => {
    mockedPost.mockResolvedValueOnce({ data: BACKEND_RESPONSE } as never);

    await submitSellerLeadAction({ ...BASE_LEAD, squareMeters: "" });

    const payload = (mockedPost.mock.calls[0] as unknown[])[1] as Record<string, unknown>;
    expect(payload.square_meters).toBeUndefined();
  });

  it("error de red → { success: false, mensaje genérico }", async () => {
    mockedPost.mockRejectedValueOnce(new Error("Network error"));

    const result = await submitSellerLeadAction(BASE_LEAD);

    expect(result.success).toBe(false);
    expect(result.message).toContain("No se pudo enviar");
  });
});
