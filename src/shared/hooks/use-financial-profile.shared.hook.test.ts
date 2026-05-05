import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useFinancialProfile } from "./use-financial-profile.shared.hook";
import {
  getFinancialProfileAction,
  saveFinancialProfileAction,
  type FinancialProfilePayload,
} from "@/shared/actions/save-financial-profile.actions";

vi.mock("@/shared/actions/save-financial-profile.actions");
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

const mockedGet = vi.mocked(getFinancialProfileAction);
const mockedSave = vi.mocked(saveFinancialProfileAction);

const MOCK_PROFILE = {
  calculatedBudget: 1_500_000,
  loanType: "individual",
  monthlyIncome: "30000",
  partnerMonthlyIncome: "",
  savingsForEnganche: "200000",
  hasInfonavit: false,
  infonavitSubcuentaBalance: "",
};

const MOCK_PAYLOAD: FinancialProfilePayload = {
  loan_type: "individual",
  monthly_income: 30_000,
  partner_monthly_income: null,
  savings_for_enganche: 200_000,
  has_infonavit: false,
  infonavit_subcuenta_balance: null,
};

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

// ─── Query deshabilitada ──────────────────────────────────────────────────────

describe("useFinancialProfile — query deshabilitada", () => {
  it("enabled false → no llama a getFinancialProfileAction", () => {
    mockedGet.mockReturnValue(new Promise(() => {}));

    renderHook(() => useFinancialProfile(false), { wrapper: makeWrapper() });

    expect(mockedGet).not.toHaveBeenCalled();
  });

  it("enabled false → existingProfile null y fetchingProfile false", () => {
    const { result } = renderHook(() => useFinancialProfile(false), {
      wrapper: makeWrapper(),
    });

    expect(result.current.existingProfile).toBeNull();
    expect(result.current.fetchingProfile).toBe(false);
  });
});

// ─── Query habilitada ─────────────────────────────────────────────────────────

describe("useFinancialProfile — query habilitada", () => {
  it("enabled true → llama a getFinancialProfileAction", async () => {
    mockedGet.mockResolvedValueOnce(MOCK_PROFILE);

    renderHook(() => useFinancialProfile(true), { wrapper: makeWrapper() });

    await waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(1));
  });

  it("datos del backend → existingProfile poblado", async () => {
    mockedGet.mockResolvedValueOnce(MOCK_PROFILE);

    const { result } = renderHook(() => useFinancialProfile(true), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.fetchingProfile).toBe(false));

    expect(result.current.existingProfile?.calculatedBudget).toBe(1_500_000);
    expect(result.current.existingProfile?.loanType).toBe("individual");
  });

  it("backend retorna null → existingProfile null", async () => {
    mockedGet.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useFinancialProfile(true), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.fetchingProfile).toBe(false));

    expect(result.current.existingProfile).toBeNull();
  });
});

// ─── saveMutation ─────────────────────────────────────────────────────────────

describe("useFinancialProfile — saveMutation", () => {
  it("éxito → saveMutation.isSuccess y invalida la query", async () => {
    mockedGet.mockResolvedValue(MOCK_PROFILE);
    mockedSave.mockResolvedValueOnce({ calculatedBudget: 1_500_000 });

    const { result } = renderHook(() => useFinancialProfile(true), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.fetchingProfile).toBe(false));

    act(() => { result.current.saveMutation.mutate(MOCK_PAYLOAD); });

    await waitFor(() => expect(result.current.saveMutation.isSuccess).toBe(true));
    // Invalidar la query dispara un refetch → mockedGet se llama al menos 2 veces
    expect(mockedGet.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("mutationFn llama a saveFinancialProfileAction con el payload correcto", async () => {
    mockedGet.mockResolvedValue(null);
    mockedSave.mockResolvedValueOnce({ calculatedBudget: 0 });

    const { result } = renderHook(() => useFinancialProfile(true), {
      wrapper: makeWrapper(),
    });

    act(() => { result.current.saveMutation.mutate(MOCK_PAYLOAD); });

    await waitFor(() => expect(mockedSave).toHaveBeenCalled());
    // TanStack v5 pasa (variables, context) al mutationFn
    expect(mockedSave).toHaveBeenCalledWith(MOCK_PAYLOAD, expect.anything());
  });
});
