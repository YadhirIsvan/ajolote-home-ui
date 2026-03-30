import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitSellerLeadAction } from "./submit-seller-lead.actions";
import { sellApi } from "@/sell/api/sell.api";
import type { SellerLeadData } from "./submit-seller-lead.actions";

vi.mock("@/sell/api/sell.api", () => ({
  sellApi: { post: vi.fn() },
  ENDPOINTS: { SUBMIT_LEAD: "/public/sale-processes" },
}));

const mockedPost = vi.mocked(sellApi.post);

const BASE_DATA: SellerLeadData = {
  propertyType: "casa",
  location: "Orizaba",
  squareMeters: "120",
  bedrooms: "3",
  bathrooms: "2",
  expectedPrice: "2500000",
  fullName: "Ana García",
  phone: "555-1234",
};

const BACKEND_RESPONSE = {
  id: 7,
  full_name: "Ana García",
  status: "pending",
  message: "Solicitud recibida correctamente.",
};

beforeEach(() => vi.clearAllMocks());

// ─── Transformación del payload ───────────────────────────────────────────────

describe("submitSellerLeadAction — payload", () => {
  beforeEach(() => {
    mockedPost.mockResolvedValue({ data: BACKEND_RESPONSE } as never);
  });

  it("propertyType 'casa' → property_type: 'house'", async () => {
    await submitSellerLeadAction({ ...BASE_DATA, propertyType: "casa" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.property_type).toBe("house");
  });

  it("propertyType 'departamento' → property_type: 'apartment'", async () => {
    await submitSellerLeadAction({ ...BASE_DATA, propertyType: "departamento" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.property_type).toBe("apartment");
  });

  it("squareMeters '120' → square_meters: 120 (parseFloat)", async () => {
    await submitSellerLeadAction({ ...BASE_DATA, squareMeters: "120" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.square_meters).toBe(120);
  });

  it("squareMeters '' → square_meters: undefined", async () => {
    await submitSellerLeadAction({ ...BASE_DATA, squareMeters: "" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.square_meters).toBeUndefined();
  });

  it("bedrooms '3' → bedrooms: 3 (parseInt)", async () => {
    await submitSellerLeadAction({ ...BASE_DATA, bedrooms: "3" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.bedrooms).toBe(3);
  });

  it("bedrooms '' → bedrooms: undefined", async () => {
    await submitSellerLeadAction({ ...BASE_DATA, bedrooms: "" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.bedrooms).toBeUndefined();
  });

  it("expectedPrice '2500000' → expected_price: 2500000 (parseFloat)", async () => {
    await submitSellerLeadAction({ ...BASE_DATA, expectedPrice: "2500000" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.expected_price).toBe(2500000);
  });

  it("expectedPrice '' → expected_price: undefined", async () => {
    await submitSellerLeadAction({ ...BASE_DATA, expectedPrice: "" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.expected_price).toBeUndefined();
  });
});

// ─── Respuestas ───────────────────────────────────────────────────────────────

describe("submitSellerLeadAction — respuestas", () => {
  it("éxito retorna { success: true, leadId: String(id), message }", async () => {
    mockedPost.mockResolvedValueOnce({ data: BACKEND_RESPONSE } as never);

    const result = await submitSellerLeadAction(BASE_DATA);

    expect(result.success).toBe(true);
    expect(result.leadId).toBe("7");
    expect(result.message).toBe("Solicitud recibida correctamente.");
  });

  it("error retorna { success: false, message: 'No se pudo enviar...' }", async () => {
    mockedPost.mockRejectedValueOnce(new Error("Server Error"));

    const result = await submitSellerLeadAction(BASE_DATA);

    expect(result.success).toBe(false);
    expect(result.message).toBe("No se pudo enviar tu solicitud. Intenta de nuevo.");
  });
});
