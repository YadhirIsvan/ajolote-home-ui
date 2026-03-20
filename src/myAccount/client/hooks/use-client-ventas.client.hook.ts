import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientPropertiesSaleAction } from "@/myAccount/client/actions/get-client-properties-sale.actions";
import { getClientPropertySaleDetailAction } from "@/myAccount/client/actions/get-client-property-sale-detail.actions";
import type { PropertySaleItem } from "@/myAccount/client/types/client.types";

export const useClientVentas = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const ventasQuery = useQuery({
    queryKey: ["client-properties-sale"],
    queryFn: getClientPropertiesSaleAction,
    staleTime: 0, // Datos considerados stale inmediatamente
    refetchInterval: 5000, // Refetch automático cada 5 segundos
  });

  const ventasList = (ventasQuery.data?.list ?? []) as PropertySaleItem[];
  const fallback = ventasList.find((p) => p.id === selectedPropertyId);

  const detailQuery = useQuery({
    queryKey: ["client-property-sale-detail", selectedPropertyId],
    queryFn: () => getClientPropertySaleDetailAction(selectedPropertyId!, fallback),
    enabled: !!selectedPropertyId,
    staleTime: 0,
    refetchInterval: 5000,
  });

  const selectedProperty = selectedPropertyId
    ? ((detailQuery.data ?? ventasList.find((p) => p.id === selectedPropertyId)) as PropertySaleItem | undefined)
    : null;

  const refetchAll = () => {
    ventasQuery.refetch();
    if (selectedPropertyId !== null) detailQuery.refetch();
  };

  return {
    ventasList,
    ventasLoading: ventasQuery.isLoading,
    selectedPropertyId,
    setSelectedPropertyId,
    selectedProperty,
    isFormOpen,
    setIsFormOpen,
    refetchAll, // Función para refrescar manualmente
  };
};
