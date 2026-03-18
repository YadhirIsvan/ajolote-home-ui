import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClientPropertiesBuyAction } from "@/myAccount/client/actions/get-client-properties-buy.actions";
import { getClientPropertyFilesAction } from "@/myAccount/client/actions/get-client-property-files.actions";
import { uploadClientPropertyFilesAction } from "@/myAccount/client/actions/upload-client-property-files.actions";
import { getClientPurchaseStepsAction } from "@/myAccount/client/actions/get-client-purchase-steps.actions";
import type { Step } from "@/myAccount/client/types/client.types";

const buildStepsFromProgress = (progress: number | undefined): Step[] => {
  const p = progress ?? 0;
  return [
    { label: "Oferta", done: p >= 15, current: p >= 15 && p < 30, allowUpload: false },
    { label: "Avalúo", done: p >= 30, current: p >= 30 && p < 45, allowUpload: false },
    { label: "Crédito", done: p >= 45, current: p >= 45 && p < 60, allowUpload: false },
    {
      label: "Documentos verificados",
      done: p >= 100,
      current: p >= 60 && p < 100,
      allowUpload: p >= 60 && p < 100,
    },
  ];
};

export const useClientCompras = () => {
  const queryClient = useQueryClient();
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [activePropertyId, setActivePropertyId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: comprasList = [], isLoading: comprasLoading } = useQuery({
    queryKey: ["client-properties-buy"],
    queryFn: getClientPropertiesBuyAction,
  });

  const singleProperty = comprasList.length === 1 ? comprasList[0] : null;
  const viewingDetailId = selectedPropertyId ?? singleProperty?.id ?? null;

  const { data: filesData = [], isLoading: filesLoading } = useQuery({
    queryKey: ["client-property-files", viewingDetailId],
    queryFn: () => getClientPropertyFilesAction(viewingDetailId!),
    enabled: !!viewingDetailId,
  });

  const { data: purchaseSteps = [] } = useQuery({
    queryKey: ["client-purchase-steps", viewingDetailId],
    queryFn: () => getClientPurchaseStepsAction(viewingDetailId!),
    enabled: !!viewingDetailId,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ propertyId, files }: { propertyId: number; files: File[] }) =>
      uploadClientPropertyFilesAction(propertyId, files),
    onSuccess: (_, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: ["client-property-files", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["client-properties-buy"] });
    },
  });

  const handleFileSelect = (propertyId: number, files: FileList | null) => {
    if (!files?.length) return;
    uploadMutation.mutate({ propertyId, files: Array.from(files) });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerUpload = (propertyId: number) => {
    setActivePropertyId(propertyId);
    fileInputRef.current?.click();
  };

  const displayList = comprasList.length > 1 ? comprasList : [];
  const viewingProperty = viewingDetailId
    ? comprasList.find((p) => p.id === viewingDetailId)
    : null;

  return {
    comprasList,
    comprasLoading,
    selectedPropertyId,
    setSelectedPropertyId,
    singleProperty,
    viewingDetailId,
    viewingProperty,
    displayList,
    filesData,
    filesLoading,
    purchaseSteps,
    uploadMutation,
    fileInputRef,
    activePropertyId,
    setActivePropertyId,
    handleFileSelect,
    triggerUpload,
    buildStepsFromProgress,
  };
};
