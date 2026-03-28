import { describe, it, expect, vi, beforeEach, createContext, useContext } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode, createContext as reactCreateContext, useContext as reactUseContext } from "react";
import { usePropertyDetail } from "./use-property-detail.buy.hook";
import { getPropertyDetailAction } from "@/buy/actions/get-property-detail.actions";
import { getFinancialProfileAction } from "@/buy/actions/get-financial-profile.actions";
import { getAppointmentSlotsAction } from "@/buy/actions/get-appointment-slots.actions";
import { scheduleAppointmentAction } from "@/buy/actions/schedule-appointment.actions";
import { checkSavedPropertyAction } from "@/shared/actions/check-saved-property.actions";
import { toggleSavedPropertyAction } from "@/shared/actions/toggle-saved-property.actions";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("@/buy/actions/get-property-detail.actions");
vi.mock("@/buy/actions/get-financial-profile.actions");
vi.mock("@/buy/actions/get-appointment-slots.actions");
vi.mock("@/buy/actions/schedule-appointment.actions");
vi.mock("@/shared/actions/check-saved-property.actions");
vi.mock("@/shared/actions/toggle-saved-property.actions");

// Mockeamos useParams para controlar el id sin necesitar un router completo
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useParams: vi.fn(() => ({ id: "42" })) };
});

import { useParams } from "react-router-dom";

const mockedUseParams = vi.mocked(useParams);
const mockedGetDetail = vi.mocked(getPropertyDetailAction);
const mockedGetFinancial = vi.mocked(getFinancialProfileAction);
const mockedGetSlots = vi.mocked(getAppointmentSlotsAction);
const mockedSchedule = vi.mocked(scheduleAppointmentAction);
const mockedCheckSaved = vi.mocked(checkSavedPropertyAction);
const mockedToggleSaved = vi.mocked(toggleSavedPropertyAction);

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MOCK_PROPERTY = {
  id: 42,
  title: "Casa Test",
  description: "Descripción larga de la propiedad para pruebas unitarias en Orizaba.",
  address: "Av. Principal 100",
  price: "$2,500,000",
  beds: 4, baths: 3, sqm: 180, landSqm: 250,
  verified: true, status: "available",
  images: ["img1.jpg", "img2.jpg"],
  videoId: undefined, videoImg: undefined,
  coordinates: { lat: 18.85, lng: -97.09 },
  nearbyPlaces: [],
  amenities: [],
  agent: { name: "Agente X", photo: "/a.jpg", phone: "555-0001", email: "ax@test.com" },
  similarProperties: [],
};

// ─── Wrapper ─────────────────────────────────────────────────────────────────

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

function setupDefaultMocks() {
  mockedGetDetail.mockResolvedValue({ data: MOCK_PROPERTY, fromFallback: false });
  mockedGetFinancial.mockResolvedValue({ profile: null });
  mockedCheckSaved.mockResolvedValue({ isSaved: false });
  mockedGetSlots.mockResolvedValue({ success: true, data: { date: "", agent: { name: "" }, available_slots: [], slot_duration_minutes: 30 } });
  mockedSchedule.mockResolvedValue({ success: true, message: "ok" });
  mockedToggleSaved.mockResolvedValue({ isSaved: true });
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  mockedUseParams.mockReturnValue({ id: "42" });
  setupDefaultMocks();
});

// ─── isError con id inválido ──────────────────────────────────────────────────

describe("usePropertyDetail — id inválido", () => {
  it("id no numérico en la URL produce isError: true", () => {
    mockedUseParams.mockReturnValue({ id: "no-es-numero" });

    const { result } = renderHook(() => usePropertyDetail(), { wrapper: makeWrapper() });

    expect(result.current.isError).toBe(true);
  });
});

// ─── isLoading y datos ────────────────────────────────────────────────────────

describe("usePropertyDetail — carga de datos", () => {
  it("isLoading: true mientras la query está en vuelo", () => {
    mockedGetDetail.mockReturnValue(new Promise(() => {}));
    mockedGetFinancial.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePropertyDetail(), { wrapper: makeWrapper() });

    expect(result.current.isLoading).toBe(true);
  });

  it("property recibe los datos mapeados de getPropertyDetailAction", async () => {
    const { result } = renderHook(() => usePropertyDetail(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.property).not.toBeNull();
    expect(result.current.property!.id).toBe(42);
    expect(result.current.property!.title).toBe("Casa Test");
  });
});

// ─── handleScheduleClick ─────────────────────────────────────────────────────

describe("usePropertyDetail — handleScheduleClick", () => {
  it("sin access_token abre showAuthModal, no showScheduleModal", async () => {
    // localStorage.clear() ya fue llamado en beforeEach — no hay access_token
    const { result } = renderHook(() => usePropertyDetail(), { wrapper: makeWrapper() });

    act(() => result.current.handleScheduleClick());

    expect(result.current.showAuthModal).toBe(true);
    expect(result.current.showScheduleModal).toBe(false);
  });

  it("con access_token abre showScheduleModal, no showAuthModal", async () => {
    localStorage.setItem("access_token", "valid-token");

    const { result } = renderHook(() => usePropertyDetail(), { wrapper: makeWrapper() });

    act(() => result.current.handleScheduleClick());

    expect(result.current.showScheduleModal).toBe(true);
    expect(result.current.showAuthModal).toBe(false);
  });
});

// ─── handleAuthSuccess ────────────────────────────────────────────────────────

describe("usePropertyDetail — handleAuthSuccess", () => {
  it("cierra showAuthModal y abre showScheduleModal", () => {
    const { result } = renderHook(() => usePropertyDetail(), { wrapper: makeWrapper() });

    // Abrir authModal primero (sin token)
    act(() => result.current.handleScheduleClick());
    expect(result.current.showAuthModal).toBe(true);

    act(() => result.current.handleAuthSuccess());

    expect(result.current.showAuthModal).toBe(false);
    expect(result.current.showScheduleModal).toBe(true);
  });
});

// ─── handleCallClick ──────────────────────────────────────────────────────────

describe("usePropertyDetail — handleCallClick", () => {
  it("setea agentPhoneToCall y abre showCallConfirmModal", () => {
    const { result } = renderHook(() => usePropertyDetail(), { wrapper: makeWrapper() });

    act(() => result.current.handleCallClick("555-9876"));

    expect(result.current.showCallConfirmModal).toBe(true);
  });
});

// ─── showMortgageCalculator ───────────────────────────────────────────────────

describe("usePropertyDetail — showMortgageCalculator", () => {
  it("true cuando autenticado, perfil no null y ya no está cargando", async () => {
    localStorage.setItem("access_token", "valid-token");
    mockedGetFinancial.mockResolvedValueOnce({
      profile: {
        loanType: "hipoteca",
        monthlyIncome: "25000",
        partnerMonthlyIncome: "",
        savingsForEnganche: "300000",
        hasInfonavit: false,
        infonautSubcuentaBalance: "",
        calculatedBudget: 1500000,
      },
    });

    const { result } = renderHook(() => usePropertyDetail(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.loadingProfile).toBe(false));

    expect(result.current.showMortgageCalculator).toBe(true);
  });

  it("false cuando no está autenticado aunque el perfil exista", async () => {
    // Sin access_token
    mockedGetFinancial.mockResolvedValueOnce({ profile: null });

    const { result } = renderHook(() => usePropertyDetail(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.loadingProfile).toBe(false));

    expect(result.current.showMortgageCalculator).toBe(false);
  });
});
