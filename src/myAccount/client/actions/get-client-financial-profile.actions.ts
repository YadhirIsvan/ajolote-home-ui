import { clientApi } from "@/myAccount/client/api/client.api";

export interface FinancialProfile {
  loanType: string;
  monthlyIncome: number;
  partnerMonthlyIncome: number | null;
  savingsForEnganche: number;
  hasInfonavit: boolean;
  infonavitSubcuentaBalance: number | null;
  calculatedBudget: number;
}

const LOAN_TYPE_LABELS: Record<string, string> = {
  individual: "Individual (Banco, Infonavit o Fovissste)",
  conyugal: "Conyugal o Familiar (Unir créditos)",
  cofinavit: "Cofinavit (Banco + Ahorro Infonavit)",
};

export function getLoanTypeLabel(loanType: string): string {
  return LOAN_TYPE_LABELS[loanType] ?? loanType;
}

export async function getClientFinancialProfileAction(): Promise<FinancialProfile | null> {
  try {
    const { data } = await clientApi.getFinancialProfile();
    if (!data?.calculated_budget) return null;
    return {
      loanType: data.loan_type ?? "",
      monthlyIncome: data.monthly_income ?? 0,
      partnerMonthlyIncome: data.partner_monthly_income ?? null,
      savingsForEnganche: data.savings_for_enganche ?? 0,
      hasInfonavit: data.has_infonavit ?? false,
      infonavitSubcuentaBalance: data.infonavit_subcuenta_balance ?? null,
      calculatedBudget: data.calculated_budget,
    };
  } catch (error) {
    console.error("[getClientFinancialProfileAction] Error al obtener perfil financiero:", error);
    return null;
  }
}
