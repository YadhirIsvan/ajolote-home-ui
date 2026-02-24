import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientPropertiesSaleAction } from "@/myAccount/client/actions/get-client-properties-sale.actions";
import { getClientPropertySaleDetailAction } from "@/myAccount/client/actions/get-client-property-sale-detail.actions";
import type { PropertySaleItem } from "@/myAccount/client/types/client.types";

export const useClientVentas = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading: ventasLoading } = useQuery({
    queryKey: ["client-properties-sale"],
    queryFn: getClientPropertiesSaleAction,
  });

  const ventasList = (data?.list ?? []) as PropertySaleItem[];
  const fallback = ventasList.find((p) => p.id === selectedPropertyId);

  const { data: detailData } = useQuery({
    queryKey: ["client-property-sale-detail", selectedPropertyId],
    queryFn: () => getClientPropertySaleDetailAction(selectedPropertyId!, fallback),
    enabled: !!selectedPropertyId,
  });

  const selectedProperty = selectedPropertyId
    ? ((detailData ?? ventasList.find((p) => p.id === selectedPropertyId)) as PropertySaleItem | undefined)
    : null;

  return {
    ventasList,
    ventasLoading,
    selectedPropertyId,
    setSelectedPropertyId,
    selectedProperty,
    isFormOpen,
    setIsFormOpen,
  };
};
