import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFinancialProfileAction } from "./get-financial-profile.actions";
import { buyApi } from "@/buy/api/buy.api";

vi.mock("@/buy/api/buy.api", () => ({
  buyApi: { get: vi.fn() },
  ENDPOINTS: {},
}));

const mockedGet = vi.mocked(buyApi.get);

const RAW_FULL = {
  loan_type: "hipoteca",
  monthly_income: 25000,
  partner_monthly_income: 10000,
  savings_for_enganche: 300000,
  has_infonavit: true,
  infonavit_subcuenta_balance: 50000,
  calculated_budget: 1500000,
};

beforeEach(() => vi.clearAllMocks());

describe("getFinancialProfileAction", () => {
  it("perfil completo mapea snake_case → camelCase con valores string", async () => {
    mockedGet.mockResolvedValueOnce({ data: RAW_FULL } as never);

    const { profile } = await getFinancialProfileAction();

    expect(profile).not.toBeNull();
    expect(profile!.loanType).toBe("hipoteca");
    expect(profile!.monthlyIncome).toBe("25000");
    expect(profile!.partnerMonthlyIncome).toBe("10000");
    expect(profile!.savingsForEnganche).toBe("300000");
    expect(profile!.hasInfonavit).toBe(true);
    expect(profile!.infonautSubcuentaBalance).toBe("50000");
    expect(profile!.calculatedBudget).toBe(1500000);
  });

  it("partner_monthly_income undefined → partnerMonthlyIncome: ''", async () => {
    mockedGet.mockResolvedValueOnce({
      data: { ...RAW_FULL, partner_monthly_income: undefined },
    } as never);

    const { profile } = await getFinancialProfileAction();

    expect(profile!.partnerMonthlyIncome).toBe("");
  });

  it("infonavit_subcuenta_balance undefined → infonautSubcuentaBalance: ''", async () => {
    mockedGet.mockResolvedValueOnce({
      data: { ...RAW_FULL, infonavit_subcuenta_balance: undefined },
    } as never);

    const { profile } = await getFinancialProfileAction();

    expect(profile!.infonautSubcuentaBalance).toBe("");
  });

  it("calculated_budget: 0 (falsy) retorna { profile: null }", async () => {
    mockedGet.mockResolvedValueOnce({
      data: { ...RAW_FULL, calculated_budget: 0 },
    } as never);

    const { profile } = await getFinancialProfileAction();

    expect(profile).toBeNull();
  });

  it("error de API lanza Error con mensaje descriptivo", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Unauthorized"));

    await expect(getFinancialProfileAction()).rejects.toThrow("Unauthorized");
  });
});
