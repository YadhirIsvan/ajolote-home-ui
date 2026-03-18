import { useQuery } from "@tanstack/react-query";
import { getFeaturedPropertiesAction } from "@/home/actions/get-featured-properties.actions";
import type { GetFeaturedPropertiesParams } from "@/home/types/property.types";

export const HOME_PROPERTIES_QUERY_KEY = "home-featured-properties";

export const useFeaturedProperties = (params: GetFeaturedPropertiesParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [HOME_PROPERTIES_QUERY_KEY, params],
    queryFn: () => getFeaturedPropertiesAction(params),
    staleTime: 1000 * 60 * 5,
  });

  return {
    properties: data?.data ?? [],
    isLoading,
    isError,
    isFromFallback: data?.fromFallback ?? false,
  };
};
