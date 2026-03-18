import { buyApi } from "@/buy/api/buy.api";
import type { FinancialProfile } from "@/buy/types/property.types";

interface RawFinancialProfile {
  loan_type: string;
  monthly_income: number;
  partner_monthly_income?: number;
  savings_for_enganche: number;
  has_infonavit: boolean;
  infonavit_subcuenta_balance?: number;
  calculated_budget: number;
}

export interface GetFinancialProfileResult {
  profile: FinancialProfile | null;
}

export const getFinancialProfileAction = async (): Promise<GetFinancialProfileResult> => {
  try {
    const { data } = await buyApi.get<RawFinancialProfile>("/client/financial-profile");
    if (!data.calculated_budget) return { profile: null };
    return {
      profile: {
        loanType: data.loan_type,
        monthlyIncome: data.monthly_income.toString(),
        partnerMonthlyIncome: data.partner_monthly_income?.toString() ?? "",
        savingsForEnganche: data.savings_for_enganche.toString(),
        hasInfonavit: data.has_infonavit,
        infonautSubcuentaBalance: data.infonavit_subcuenta_balance?.toString() ?? "",
        calculatedBudget: data.calculated_budget,
      },
    };
  } catch (error) {
    console.error("[getFinancialProfileAction] Error al obtener perfil financiero:", error);
    return { profile: null };
  }
};
