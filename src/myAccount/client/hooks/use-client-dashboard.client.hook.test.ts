import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useClientDashboard } from "./use-client-dashboard.client.hook";
import { useAuth } from "@/shared/hooks/use-auth.hook";
import { getClientPropertiesSaleAction } from "@/myAccount/client/actions/get-client-properties-sale.actions";
import { getClientPropertiesBuyAction } from "@/myAccount/client/actions/get-client-properties-buy.actions";
import { getClientSavedPropertiesAction } from "@/myAccount/client/actions/get-client-saved-properties.actions";
import { getClientFinancialProfileAction } from "@/myAccount/client/actions/get-client-financial-profile.actions";
import { getClientProfileDetailAction } from "@/myAccount/client/actions/get-client-profile-detail.actions";
import { getClientAppointmentsAction } from "@/myAccount/client/actions/get-client-appointments.actions";
import { getClientProfileAction } from "@/myAccount/client/actions/get-client-profile.actions";

vi.mock("@/shared/hooks/use-auth.hook");
vi.mock("@/myAccount/client/actions/get-client-properties-sale.actions");
vi.mock("@/myAccount/client/actions/get-client-properties-buy.actions");
vi.mock("@/myAccount/client/actions/get-client-saved-properties.actions");
vi.mock("@/myAccount/client/actions/get-client-financial-profile.actions");
vi.mock("@/myAccount/client/actions/get-client-profile-detail.actions");
vi.mock("@/myAccount/client/actions/get-client-appointments.actions");
vi.mock("@/myAccount/client/actions/get-client-profile.actions");

const mockedUseAuth = vi.mocked(useAuth);
const mockedGetSale = vi.mocked(getClientPropertiesSaleAction);
const mockedGetBuy = vi.mocked(getClientPropertiesBuyAction);
const mockedGetSaved = vi.mocked(getClientSavedPropertiesAction);
const mockedGetFinancial = vi.mocked(getClientFinancialProfileAction);
const mockedGetProfileDetail = vi.mocked(getClientProfileDetailAction);
const mockedGetAppointments = vi.mocked(getClientAppointmentsAction);
const mockedGetProfile = vi.mocked(getClientProfileAction);

function setAuth(isAuthenticated: boolean, role: string | null = null) {
  mockedUseAuth.mockReturnValue({
    isAuthenticated,
    role,
    user: null,
    isLoggingOut: false,
    showAuthModal: false,
    openAuthModal: vi.fn(),
    closeAuthModal: vi.fn(),
    syncAuthState: vi.fn(),
    handleLoginSuccess: vi.fn(),
    handleLogout: vi.fn(),
  } as never);
}

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

const SALE_RESULT = {
  list: [{ id: 1, title: "Casa A" }],
  summary: { propertiesAmount: 1, totalViews: 50, interestedAmount: 3, totalValue: 1000000 },
};
const BUY_LIST = [{ id: 10, title: "Depto B" }];
const SAVED_LIST = [{ id: 50, propertyId: 500 }];
const FINANCIAL = { calculatedBudget: 800000, loanType: "individual" };
const PROFILE_DETAIL = { occupation: "Dev", residence_location: "", desired_credit_type: "", desired_property_type: "" };
const APPOINTMENTS = [{ id: 3, status: "confirmed" }];
const USER_PROFILE = { id: 1, avatar: "https://example.com/avatar.jpg" };

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetSale.mockResolvedValue(SALE_RESULT as never);
  mockedGetBuy.mockResolvedValue(BUY_LIST as never);
  mockedGetSaved.mockResolvedValue(SAVED_LIST as never);
  mockedGetFinancial.mockResolvedValue(FINANCIAL as never);
  mockedGetProfileDetail.mockResolvedValue(PROFILE_DETAIL as never);
  mockedGetAppointments.mockResolvedValue(APPOINTMENTS as never);
  mockedGetProfile.mockResolvedValue(USER_PROFILE as never);
});

// ─── Queries deshabilitadas ───────────────────────────────────────────────────

describe("useClientDashboard — queries deshabilitadas", () => {
  it("isAuthenticated: false → ninguna query se dispara", async () => {
    setAuth(false);
    renderHook(() => useClientDashboard(), { wrapper: makeWrapper() });
    await new Promise((r) => setTimeout(r, 50));
    expect(mockedGetSale).not.toHaveBeenCalled();
    expect(mockedGetBuy).not.toHaveBeenCalled();
  });

  it("role: 'agent' (no client) → queries no se disparan", async () => {
    setAuth(true, "agent");
    renderHook(() => useClientDashboard(), { wrapper: makeWrapper() });
    await new Promise((r) => setTimeout(r, 50));
    expect(mockedGetSale).not.toHaveBeenCalled();
  });
});

// ─── Defaults antes de resolver ───────────────────────────────────────────────

describe("useClientDashboard — defaults", () => {
  it("defaults antes de resolver: arrays vacíos y nulls", () => {
    setAuth(false);
    const { result } = renderHook(() => useClientDashboard(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.ventasList).toEqual([]);
    expect(result.current.comprasList).toEqual([]);
    expect(result.current.savedProperties).toEqual([]);
    expect(result.current.financialProfile).toBeNull();
    expect(result.current.ventasSummary).toBeNull();
    expect(result.current.appointmentsList).toEqual([]);
  });
});

// ─── Queries habilitadas ──────────────────────────────────────────────────────

describe("useClientDashboard — authenticated + role client", () => {
  it("role: 'client' → todas las queries se disparan y datos poblados", async () => {
    setAuth(true, "client");
    const { result } = renderHook(() => useClientDashboard(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.ventasLoading).toBe(false));

    expect(result.current.ventasList).toHaveLength(1);
    expect(result.current.ventasSummary?.propertiesAmount).toBe(1);
    expect(result.current.comprasList).toHaveLength(1);
    expect(result.current.savedProperties).toHaveLength(1);
    expect(result.current.financialProfile?.calculatedBudget).toBe(800000);
    expect(result.current.appointmentsList).toHaveLength(1);
  });

  it("userAvatar extraído de userProfileQuery.data?.avatar", async () => {
    setAuth(true, "client");
    const { result } = renderHook(() => useClientDashboard(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.ventasLoading).toBe(false));

    expect(result.current.userAvatar).toBe("https://example.com/avatar.jpg");
  });
});
