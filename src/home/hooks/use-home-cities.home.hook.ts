import { useQuery } from "@tanstack/react-query";
import { getCitiesAction, type CityItem } from "@/shared/actions/get-cities.actions";

interface UseHomeCitiesReturn {
  cities: CityItem[];
  isLoading: boolean;
}

export const useHomeCities = (): UseHomeCitiesReturn => {
  const { data, isLoading } = useQuery({
    queryKey: ["home-cities"],
    queryFn: getCitiesAction,
    staleTime: 1000 * 60 * 60, // 1 hora — catálogo prácticamente estático
  });

  return {
    cities: data ?? [],
    isLoading,
  };
};
