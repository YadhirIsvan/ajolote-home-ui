import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminPropertiesAction,
  deleteAdminPropertyAction,
  toggleAdminPropertyFeaturedAction,
  getAdminStatesAction,
  getAdminCitiesAction,
  getAdminAmenitiesAction,
} from "@/myAccount/admin/actions/get-admin-properties.actions";

interface UseAdminPropertiesOptions {
  isFormOpen: boolean;
  selectedStateId: number | null;
}

export const useAdminProperties = ({ isFormOpen, selectedStateId }: UseAdminPropertiesOptions) => {
  const queryClient = useQueryClient();

  const propertiesQuery = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => getAdminPropertiesAction({ limit: 200 }),
  });

  const statesQuery = useQuery({
    queryKey: ["catalog-states"],
    queryFn: getAdminStatesAction,
    staleTime: 10 * 60 * 1000,
    enabled: isFormOpen,
  });

  const citiesQuery = useQuery({
    queryKey: ["catalog-cities", selectedStateId],
    queryFn: () => getAdminCitiesAction(selectedStateId!),
    enabled: isFormOpen && selectedStateId !== null,
    staleTime: 5 * 60 * 1000,
  });

  const amenitiesQuery = useQuery({
    queryKey: ["catalog-amenities"],
    queryFn: getAdminAmenitiesAction,
    staleTime: 10 * 60 * 1000,
    enabled: isFormOpen,
  });

  const deleteMutation = useMutation({
    mutationFn: (rawId: number) => deleteAdminPropertyAction(rawId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast.success("Propiedad eliminada");
    },
    onError: () => toast.error("Error al eliminar la propiedad"),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (rawId: number) => toggleAdminPropertyFeaturedAction(rawId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast.success("Propiedad destacada actualizada");
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const invalidateProperties = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-properties"] });

  return {
    propertiesQuery,
    statesQuery,
    citiesQuery,
    amenitiesQuery,
    deleteMutation,
    toggleFeaturedMutation,
    invalidateProperties,
  };
};
