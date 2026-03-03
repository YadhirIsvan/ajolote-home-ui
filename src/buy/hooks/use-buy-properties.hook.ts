import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPropertiesAction } from "@/buy/actions/get-properties.actions";
import { getCitiesAction, type CityItem } from "@/buy/actions/get-cities.actions";
import {
  DEFAULT_BUY_FILTERS,
  PRICE_RANGE_LIMITS,
  type BuyFilters,
  type BuyPropertyListItem,
} from "@/buy/types/property.types";
import type { PropertyStatus } from "@/shared/components/custom/PropertyCard";

export const BUY_PROPERTIES_QUERY_KEY = "buy-properties";

const mapStateToStatus = (state: string): PropertyStatus => {
  if (state === "used") return "oportunidad";
  return "disponible";
};

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);

export const useBuyProperties = () => {
  const [filters, setFilters] = useState<BuyFilters>(DEFAULT_BUY_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch cities for zone filter
  const { data: citiesData } = useQuery({
    queryKey: ["buy-cities"],
    queryFn: getCitiesAction,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const cities: CityItem[] = citiesData ?? [];

  const { data, isLoading, isError } = useQuery({
    queryKey: [BUY_PROPERTIES_QUERY_KEY, {
      zone: filters.zone,
      type: filters.type,
      state: filters.state,
      amenities: filters.amenities,
    }],
    queryFn: () =>
      getPropertiesAction({
        zone: filters.zone === "Todas las zonas" ? undefined : filters.zone,
        type: filters.type === "all" ? undefined : filters.type,
        state: filters.state === "all" ? undefined : filters.state,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
        limit: 50,
        offset: 0,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const filteredProperties: BuyPropertyListItem[] = (data?.data ?? []).filter(
    (p) =>
      p.priceNum >= filters.priceRange[0] && p.priceNum <= filters.priceRange[1]
  );

  const activeFiltersCount = [
    filters.zone !== "Todas las zonas",
    filters.priceRange[0] !== PRICE_RANGE_LIMITS.min ||
      filters.priceRange[1] !== PRICE_RANGE_LIMITS.max,
    filters.type !== "all",
    filters.state !== "all",
    filters.amenities.length > 0,
  ].filter(Boolean).length;

  const toggleAmenity = (amenityId: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const clearFilters = () => setFilters(DEFAULT_BUY_FILTERS);

  const setZone = (zone: string) => setFilters((prev) => ({ ...prev, zone }));
  const setPriceRange = (priceRange: [number, number]) =>
    setFilters((prev) => ({ ...prev, priceRange }));
  const setType = (type: string) => setFilters((prev) => ({ ...prev, type }));
  const setState = (state: string) => setFilters((prev) => ({ ...prev, state }));

  return {
    filteredProperties,
    isLoading,
    isError,
    filters,
    isFilterOpen,
    setIsFilterOpen,
    activeFiltersCount,
    toggleAmenity,
    clearFilters,
    setZone,
    setPriceRange,
    setState,
    setType,
    mapStateToStatus,
    cities,
  };
};
