import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getLoanTypeLabel,
  getClientFinancialProfileAction,
} from "./get-client-financial-profile.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: { getFinancialProfile: vi.fn() },
}));

const mockedGetFinancialProfile = vi.mocked(clientApi.getFinancialProfile);

function makeBackendProfile(overrides = {}) {
  return {
    loan_type: "individual",
    monthly_income: 20000,
    partner_monthly_income: 10000,
    savings_for_enganche: 100000,
    has_infonavit: true,
    infonavit_subcuenta_balance: 50000,
    calculated_budget: 750000,
    ...overrides,
  };
}

beforeEach(() => vi.clearAllMocks());

// ─── getLoanTypeLabel ─────────────────────────────────────────────────────────

describe("getLoanTypeLabel", () => {
  it("key conocido → retorna la etiqueta completa", () => {
    expect(getLoanTypeLabel("individual")).toBe(
      "Individual (Banco, Infonavit o Fovissste)"
    );
  });

  it("key desconocido → retorna el key tal cual (fallback)", () => {
    expect(getLoanTypeLabel("hipoteca_especial")).toBe("hipoteca_especial");
  });
});

// ─── getClientFinancialProfileAction ─────────────────────────────────────────

describe("getClientFinancialProfileAction", () => {
  it("éxito → mapea snake_case a camelCase correctamente", async () => {
    mockedGetFinancialProfile.mockResolvedValueOnce({
      data: makeBackendProfile(),
    } as never);

    const result = await getClientFinancialProfileAction();

    expect(result).toEqual({
      loanType: "individual",
      monthlyIncome: 20000,
      partnerMonthlyIncome: 10000,
      savingsForEnganche: 100000,
      hasInfonavit: true,
      infonavitSubcuentaBalance: 50000,
      calculatedBudget: 750000,
    });
  });

  it("calculated_budget: 0 (falsy) → retorna null", async () => {
    mockedGetFinancialProfile.mockResolvedValueOnce({
      data: makeBackendProfile({ calculated_budget: 0 }),
    } as never);

    const result = await getClientFinancialProfileAction();

    expect(result).toBeNull();
  });

  it("error → silencia y retorna null", async () => {
    mockedGetFinancialProfile.mockRejectedValueOnce(new Error("Unauthorized"));

    const result = await getClientFinancialProfileAction();

    expect(result).toBeNull();
  });
});
