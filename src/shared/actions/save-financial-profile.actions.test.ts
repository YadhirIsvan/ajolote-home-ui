import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getFinancialProfileAction,
  saveFinancialProfileAction,
  type FinancialProfilePayload,
} from "./save-financial-profile.actions";
import { axiosInstance } from "@/shared/api/axios.instance";

vi.mock("@/shared/api/axios.instance", () => ({
  axiosInstance: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(axiosInstance.get);
const mockedPut = vi.mocked(axiosInstance.put);
const mockedPost = vi.mocked(axiosInstance.post);

const PAYLOAD: FinancialProfilePayload = {
  loan_type: "credito_hipotecario",
  monthly_income: 20000,
  partner_monthly_income: null,
  savings_for_enganche: 100000,
  has_infonavit: false,
  infonavit_subcuenta_balance: null,
};

/** Crea un error con isAxiosError: true y el status indicado */
function makeAxiosError(status: number) {
  return Object.assign(new Error(`HTTP ${status}`), {
    isAxiosError: true,
    response: { status },
  });
}

beforeEach(() => vi.clearAllMocks());

// ─── getFinancialProfileAction ────────────────────────────────────────────────

describe("getFinancialProfileAction", () => {
  it("éxito → mapea snake_case a camelCase correctamente", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        calculated_budget: 500000,
        loan_type: "credito_hipotecario",
        monthly_income: 20000,
        partner_monthly_income: 10000,
        savings_for_enganche: 100000,
        has_infonavit: true,
        infonavit_subcuenta_balance: 50000,
      },
    } as never);

    const result = await getFinancialProfileAction();

    expect(result?.calculatedBudget).toBe(500000);
    expect(result?.loanType).toBe("credito_hipotecario");
    expect(result?.monthlyIncome).toBe("20000");
    expect(result?.hasInfonavit).toBe(true);
  });

  it("error → retorna null", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Not found"));

    const result = await getFinancialProfileAction();

    expect(result).toBeNull();
  });
});

// ─── saveFinancialProfileAction ───────────────────────────────────────────────

describe("saveFinancialProfileAction", () => {
  it("PUT éxito → retorna { calculatedBudget }", async () => {
    mockedPut.mockResolvedValueOnce({
      data: { calculated_budget: 750000 },
    } as never);

    const result = await saveFinancialProfileAction(PAYLOAD);

    expect(result).toEqual({ calculatedBudget: 750000 });
    expect(mockedPost).not.toHaveBeenCalled();
  });

  it("PUT éxito con calculated_budget undefined → { calculatedBudget: 0 }", async () => {
    mockedPut.mockResolvedValueOnce({ data: {} } as never);

    const result = await saveFinancialProfileAction(PAYLOAD);

    expect(result).toEqual({ calculatedBudget: 0 });
  });

  it("PUT falla con 400 → lanza inmediatamente sin llamar POST", async () => {
    mockedPut.mockRejectedValueOnce(makeAxiosError(400));

    await expect(saveFinancialProfileAction(PAYLOAD)).rejects.toThrow("HTTP 400");
    expect(mockedPost).not.toHaveBeenCalled();
  });

  it("PUT falla con no-400 → fallback POST éxito → retorna resultado del POST", async () => {
    mockedPut.mockRejectedValueOnce(makeAxiosError(404));
    mockedPost.mockResolvedValueOnce({
      data: { calculated_budget: 600000 },
    } as never);

    const result = await saveFinancialProfileAction(PAYLOAD);

    expect(mockedPost).toHaveBeenCalledWith("/client/financial-profile", PAYLOAD);
    expect(result).toEqual({ calculatedBudget: 600000 });
  });

  it("PUT falla con no-400 → POST también falla → lanza el error del POST", async () => {
    mockedPut.mockRejectedValueOnce(makeAxiosError(500));
    mockedPost.mockRejectedValueOnce(new Error("POST failed"));

    await expect(saveFinancialProfileAction(PAYLOAD)).rejects.toThrow("POST failed");
  });
});
