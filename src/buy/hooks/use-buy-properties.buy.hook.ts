import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPropertiesAction } from "@/buy/actions/get-properties.actions";
import { getCitiesAction, type CityItem } from "@/shared/actions/get-cities.actions";
import {
  DEFAULT_BUY_FILTERS,
  PRICE_RANGE_LIMITS,
  type BuyFilters,
  type BuyPropertyListItem,
} from "@/buy/types/property.types";
import type { PropertyStatus } from "@/shared/components/custom/PropertyCard";

export const BUY_PROPERTIES_QUERY_KEY = "buy-properties";
const PAGE_SIZE = 20;

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
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<BuyFilters>(DEFAULT_BUY_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Leer parámetro zone de la URL al cargar el componente
  useEffect(() => {
    const zoneFromUrl = searchParams.get("zone");
    if (zoneFromUrl) {
      setFilters((prev) => ({ ...prev, zone: zoneFromUrl }));
    }
  }, [searchParams]);

  const { data: citiesData } = useQuery({
    queryKey: ["buy-cities"],
    queryFn: getCitiesAction,
    staleTime: 1000 * 60 * 60,
  });

  const cities: CityItem[] = citiesData ?? [];

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      BUY_PROPERTIES_QUERY_KEY,
      {
        zone: filters.zone,
        type: filters.type,
        state: filters.state,
        amenities: filters.amenities,
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      getPropertiesAction({
        zone: filters.zone === "Todas las zonas" ? undefined : filters.zone,
        type: filters.type === "all" ? undefined : filters.type,
        state: filters.state === "all" ? undefined : filters.state,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
        limit: PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.reduce((total, page) => total + page.data.length, 0);
    },
    staleTime: 1000 * 60 * 5,
  });

  const allProperties = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const filteredProperties: BuyPropertyListItem[] = useMemo(
    () =>
      allProperties.filter(
        (p) =>
          p.priceNum >= filters.priceRange[0] &&
          p.priceNum <= filters.priceRange[1]
      ),
    [allProperties, filters.priceRange]
  );

  // Infinite scroll — observe a sentinel element
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const activeFiltersCount = [
    filters.zone !== "Todas las zonas",
    filters.priceRange[0] !== PRICE_RANGE_LIMITS.min ||
      filters.priceRange[1] !== PRICE_RANGE_LIMITS.max,
    filters.type !== "all",
    filters.state !== "all",
    filters.amenities.length > 0,
  ].filter(Boolean).length;

  const toggleAmenity = useCallback((amenityId: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  }, []);

  const clearFilters = useCallback(() => setFilters(DEFAULT_BUY_FILTERS), []);

  const setZone = useCallback(
    (zone: string) => setFilters((prev) => ({ ...prev, zone })),
    []
  );
  const setPriceRange = useCallback(
    (priceRange: [number, number]) => setFilters((prev) => ({ ...prev, priceRange })),
    []
  );
  const setType = useCallback(
    (type: string) => setFilters((prev) => ({ ...prev, type })),
    []
  );
  const setState = useCallback(
    (state: string) => setFilters((prev) => ({ ...prev, state })),
    []
  );

  return {
    filteredProperties,
    totalCount,
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
    sentinelRef,
    isFetchingNextPage,
    hasNextPage,
  };
};
