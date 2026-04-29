import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useSellerLeadForm } from "./use-seller-lead-form.sell.hook";
import { submitSellerLeadAction } from "@/sell/actions/submit-seller-lead.actions";
import type { SellerLeadData } from "@/sell/actions/submit-seller-lead.actions";

vi.mock("@/sell/actions/submit-seller-lead.actions");
vi.mock("@/shared/actions/get-cities.actions", () => ({
  getCitiesAction: vi.fn().mockResolvedValue([]),
}));

const mockedAction = vi.mocked(submitSellerLeadAction);

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

function renderForm(opts: {
  mode?: "default" | "add";
  onPropertyAdded?: (data: SellerLeadData) => void;
  membershipId?: number;
} = {}) {
  const onOpenChange = vi.fn();
  const { result } = renderHook(
    () => useSellerLeadForm({ onOpenChange, ...opts }),
    { wrapper: makeWrapper() },
  );
  return { result, onOpenChange };
}

// Helpers para rellenar formulario hasta un step dado
function fillStep1(result: ReturnType<typeof renderHook>["result"]) {
  act(() => result.current.updateFormData("propertyType", "casa"));
  act(() => result.current.updateFormData("location", "Orizaba"));
  act(() => result.current.updateFormData("squareMeters", "120"));
}

function fillStep2(result: ReturnType<typeof renderHook>["result"]) {
  act(() => result.current.updateFormData("bedrooms", "3"));
  act(() => result.current.updateFormData("bathrooms", "2"));
}

function fillStep3(result: ReturnType<typeof renderHook>["result"]) {
  act(() => result.current.updateFormData("fullName", "Ana García"));
  act(() => result.current.updateFormData("phone", "555-1234"));
}

beforeEach(() => vi.clearAllMocks());

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe("useSellerLeadForm — estado inicial", () => {
  it("currentStep: 1, isSubmitted: false, isSubmitting: false, errors: {}", () => {
    const { result } = renderForm();
    expect(result.current.currentStep).toBe(1);
    expect(result.current.isSubmitted).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors).toEqual({});
  });

  it("progressPercentage es ~33 en el step 1 de 3", () => {
    const { result } = renderForm();
    expect(result.current.progressPercentage).toBeCloseTo(33.33, 1);
  });
});

// ─── updateFormData ───────────────────────────────────────────────────────────

describe("useSellerLeadForm — updateFormData", () => {
  it("actualiza el campo correcto en formData", () => {
    const { result } = renderForm();
    act(() => result.current.updateFormData("location", "Córdoba"));
    expect(result.current.formData.location).toBe("Córdoba");
  });

  it("limpia el error del campo al actualizarlo", () => {
    const { result } = renderForm();
    // Forzar un error en step 1
    act(() => result.current.handleNext());
    expect(result.current.errors.propertyType).toBeTruthy();

    // Al actualizar el campo, el error se limpia
    act(() => result.current.updateFormData("propertyType", "casa"));
    expect(result.current.errors.propertyType).toBeFalsy();
  });
});

// ─── handleNext — validaciones ────────────────────────────────────────────────

describe("useSellerLeadForm — handleNext validaciones", () => {
  it("step 1 con campos vacíos popula errors y no avanza", () => {
    const { result } = renderForm();
    act(() => result.current.handleNext());
    expect(result.current.errors.propertyType).toBeTruthy();
    expect(result.current.currentStep).toBe(1);
  });

  it("step 1 con squareMeters no numérico produce error en ese campo", () => {
    const { result } = renderForm();
    act(() => result.current.updateFormData("propertyType", "casa"));
    act(() => result.current.updateFormData("location", "Orizaba"));
    act(() => result.current.updateFormData("squareMeters", "no-es-numero"));
    act(() => result.current.handleNext());
    expect(result.current.errors.squareMeters).toBeTruthy();
    expect(result.current.currentStep).toBe(1);
  });

  it("step 1 válido avanza a currentStep: 2", () => {
    const { result } = renderForm();
    fillStep1(result);
    act(() => result.current.handleNext());
    expect(result.current.currentStep).toBe(2);
    expect(result.current.errors).toEqual({});
  });

  it("step 2 válido avanza a currentStep: 3", () => {
    const { result } = renderForm();
    fillStep1(result);
    act(() => result.current.handleNext());
    fillStep2(result);
    act(() => result.current.handleNext());
    expect(result.current.currentStep).toBe(3);
  });

  it("step 3 con fullName vacío popula errors y no hace submit", () => {
    const { result } = renderForm();
    fillStep1(result);
    act(() => result.current.handleNext());
    fillStep2(result);
    act(() => result.current.handleNext());

    // Step 3 sin fullName
    act(() => result.current.updateFormData("phone", "555-0000"));
    act(() => result.current.handleNext());

    expect(result.current.errors.fullName).toBeTruthy();
    expect(mockedAction).not.toHaveBeenCalled();
  });

  it("step 3 válido llama submitSellerLeadAction con los datos del formulario", async () => {
    mockedAction.mockResolvedValueOnce({ success: true, message: "ok", leadId: "1" });
    const { result } = renderForm();
    fillStep1(result);
    act(() => result.current.handleNext());
    fillStep2(result);
    act(() => result.current.handleNext());
    fillStep3(result);
    await act(() => result.current.handleNext());

    expect(mockedAction).toHaveBeenCalledWith(
      expect.objectContaining({
        propertyType: "casa",
        location: "Orizaba",
        fullName: "Ana García",
        phone: "555-1234",
      }),
      undefined
    );
  });
});

// ─── handleSubmit ─────────────────────────────────────────────────────────────

describe("useSellerLeadForm — handleSubmit", () => {
  async function submitFromStep3(result: ReturnType<typeof renderHook>["result"]) {
    fillStep1(result);
    act(() => result.current.handleNext());
    fillStep2(result);
    act(() => result.current.handleNext());
    fillStep3(result);
    await act(() => result.current.handleNext());
  }

  it("action exitosa → isSubmitted: true, isSubmitting: false", async () => {
    mockedAction.mockResolvedValueOnce({ success: true, message: "ok", leadId: "2" });
    const { result } = renderForm();
    await submitFromStep3(result);
    expect(result.current.isSubmitted).toBe(true);
    expect(result.current.isSubmitting).toBe(false);
  });

  it("action fallida → errors.submit poblado, isSubmitting: false, isSubmitted: false", async () => {
    mockedAction.mockResolvedValueOnce({ success: false, message: "Error del servidor" });
    const { result } = renderForm();
    await submitFromStep3(result);
    expect(result.current.isSubmitted).toBe(false);
    expect(result.current.errors.submit).toBe("Error del servidor");
    expect(result.current.isSubmitting).toBe(false);
  });

  it("modo 'add' llama onPropertyAdded, isSubmitted: true, sin llamar a la action", async () => {
    const onPropertyAdded = vi.fn();
    const { result } = renderForm({ mode: "add", onPropertyAdded });
    fillStep1(result);
    act(() => result.current.handleNext());
    fillStep2(result);
    act(() => result.current.handleNext());
    fillStep3(result);
    await act(() => result.current.handleNext());

    expect(onPropertyAdded).toHaveBeenCalledTimes(1);
    expect(result.current.isSubmitted).toBe(true);
    expect(mockedAction).not.toHaveBeenCalled();
  });
});

// ─── handleBack ───────────────────────────────────────────────────────────────

describe("useSellerLeadForm — handleBack", () => {
  it("desde step 2 vuelve a step 1", () => {
    const { result } = renderForm();
    fillStep1(result);
    act(() => result.current.handleNext());
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.handleBack());
    expect(result.current.currentStep).toBe(1);
  });

  it("desde step 1 currentStep no baja de 1", () => {
    const { result } = renderForm();
    act(() => result.current.handleBack());
    expect(result.current.currentStep).toBe(1);
  });
});

// ─── handleClose ──────────────────────────────────────────────────────────────

describe("useSellerLeadForm — handleClose", () => {
  it("llama onOpenChange(false) inmediatamente", () => {
    const { result, onOpenChange } = renderForm();
    act(() => result.current.handleClose());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
