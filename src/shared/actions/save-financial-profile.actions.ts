import axios from "axios";
import { axiosInstance } from "@/shared/api/axios.instance";

export interface FinancialProfilePayload {
  loan_type: string;
  monthly_income: number;
  partner_monthly_income: number | null;
  savings_for_enganche: number;
  has_infonavit: boolean;
  infonavit_subcuenta_balance: number | null;
}

interface BackendFinancialProfile {
  calculated_budget?: number;
  loan_type?: string;
  monthly_income?: number;
  partner_monthly_income?: number;
  savings_for_enganche?: number;
  has_infonavit?: boolean;
  infonavit_subcuenta_balance?: number;
}

export interface FinancialProfileResult {
  calculatedBudget: number | null;
  loanType: string;
  monthlyIncome: string;
  partnerMonthlyIncome: string;
  savingsForEnganche: string;
  hasInfonavit: boolean;
  infonavitSubcuentaBalance: string;
}

const mapProfile = (data: BackendFinancialProfile): FinancialProfileResult => ({
  calculatedBudget: data.calculated_budget ?? null,
  loanType: data.loan_type ?? "",
  monthlyIncome: data.monthly_income?.toString() ?? "",
  partnerMonthlyIncome: data.partner_monthly_income?.toString() ?? "",
  savingsForEnganche: data.savings_for_enganche?.toString() ?? "",
  hasInfonavit: data.has_infonavit ?? false,
  infonavitSubcuentaBalance: data.infonavit_subcuenta_balance?.toString() ?? "",
});

export const getFinancialProfileAction = async (): Promise<FinancialProfileResult | null> => {
  try {
    const { data } = await axiosInstance.get<BackendFinancialProfile>(
      "/client/financial-profile"
    );
    return mapProfile(data);
  } catch {
    return null;
  }
};

export const saveFinancialProfileAction = async (
  payload: FinancialProfilePayload
): Promise<{ calculatedBudget: number }> => {
  try {
    const { data } = await axiosInstance.put<BackendFinancialProfile>(
      "/client/financial-profile",
      payload
    );
    return { calculatedBudget: data.calculated_budget ?? 0 };
  } catch (putError) {
    // 400 = datos inválidos → no intentar POST, el error viene del payload
    if (axios.isAxiosError(putError) && putError.response?.status === 400) {
      console.error("[saveFinancialProfileAction] Error al guardar perfil financiero:", putError);
      throw putError;
    }

    // Cualquier otro error (404, 405, red) → intentar crear con POST
    try {
      const { data } = await axiosInstance.post<BackendFinancialProfile>(
        "/client/financial-profile",
        payload
      );
      return { calculatedBudget: data.calculated_budget ?? 0 };
    } catch (postError) {
      console.error("[saveFinancialProfileAction] Error al guardar perfil financiero:", postError);
      throw postError;
    }
  }
};
