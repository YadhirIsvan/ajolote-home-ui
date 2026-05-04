import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getFinancialProfileAction,
  saveFinancialProfileAction,
  FINANCIAL_PROFILE_QUERY_KEY,
  type FinancialProfilePayload,
  type FinancialProfileResult,
} from "@/shared/actions/save-financial-profile.actions";

interface UseFinancialProfileReturn {
  existingProfile: FinancialProfileResult | null;
  fetchingProfile: boolean;
  saveMutation: ReturnType<typeof useMutation<{ calculatedBudget: number }, Error, FinancialProfilePayload>>;
}

export const useFinancialProfile = (enabled: boolean): UseFinancialProfileReturn => {
  const queryClient = useQueryClient();

  const { data: existingProfile = null, isLoading: fetchingProfile } = useQuery({
    queryKey: [FINANCIAL_PROFILE_QUERY_KEY],
    queryFn: getFinancialProfileAction,
    enabled,
    staleTime: 0,
    retry: false,
  });

  const saveMutation = useMutation<{ calculatedBudget: number }, Error, FinancialProfilePayload>({
    mutationFn: saveFinancialProfileAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FINANCIAL_PROFILE_QUERY_KEY] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const detail: string =
          error.response?.data?.detail ??
          error.response?.data?.message ??
          "Verifica los datos e intenta de nuevo.";
        toast.error("Error al guardar tu perfil", { description: detail });
      } else {
        toast.error("Error inesperado", {
          description: "No se pudo guardar tu perfil. Intenta de nuevo.",
        });
      }
    },
  });

  return { existingProfile, fetchingProfile, saveMutation };
};
