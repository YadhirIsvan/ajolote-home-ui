import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { getPropertiesAction } from "@/buy/actions/get-properties.actions";
import { getCitiesAction, type CityItem } from "@/shared/actions/get-cities.actions";
import { naturalSearchAction } from "@/buy/actions/natural-search.actions";
import { useAuth } from "@/shared/hooks/auth.context";
import {
  DEFAULT_BUY_FILTERS,
  PRICE_RANGE_LIMITS,
} from "@/buy/constants/buy.constants";
import type {
  BuyFilters,
  BuyPropertyListItem,
  PriceOrdering,
} from "@/buy/types/property.types";
import { mapStateToStatus } from "@/buy/utils/map-state-to-status.utils";
import { formatBuyPrice } from "@/buy/utils/format-price.utils";

export { formatBuyPrice as formatPrice };
export const BUY_PROPERTIES_QUERY_KEY = "buy-properties";
const PAGE_SIZE = 20;

export const useBuyProperties = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<BuyFilters>(DEFAULT_BUY_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [naturalSearchQuery, setNaturalSearchQuery] = useState<string>("");
  const [naturalSearchError, setNaturalSearchError] = useState<string | null>(null);

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
        ordering: filters.ordering,
        bedroomsMin: filters.bedroomsMin,
        bathroomsMin: filters.bathroomsMin,
        parkingMin: filters.parkingMin,
        sqmMin: filters.sqmMin,
        sqmMax: filters.sqmMax,
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      getPropertiesAction({
        zone: filters.zone === "Todas las zonas" ? undefined : filters.zone,
        type: filters.type === "all" ? undefined : filters.type,
        state: filters.state === "all" ? undefined : filters.state,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
        ordering: filters.ordering || undefined,
        bedrooms_min: filters.bedroomsMin ?? undefined,
        bathrooms_min: filters.bathroomsMin ?? undefined,
        parking_min: filters.parkingMin ?? undefined,
        sqm_min: filters.sqmMin ?? undefined,
        sqm_max: filters.sqmMax ?? undefined,
        limit: PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.reduce((total, page) => total + page.data.length, 0);
    },
    staleTime: 0,
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
    filters.ordering !== "",
    filters.bedroomsMin !== null,
    filters.bathroomsMin !== null,
    filters.parkingMin !== null,
    filters.sqmMin !== null || filters.sqmMax !== null,
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
  const setOrdering = useCallback(
    (ordering: PriceOrdering) => setFilters((prev) => ({ ...prev, ordering })),
    []
  );

  // ── Natural search via useMutation ────────────────────────────────────────────

  const naturalSearchMutation = useMutation({
    mutationFn: (query: string) => naturalSearchAction(query),
  });

  const handleNaturalSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setNaturalSearchError(null);
    try {
      const result = await naturalSearchMutation.mutateAsync(trimmed);
      setNaturalSearchQuery(trimmed);
      setFilters((prev) => ({
        ...prev,
        zone: result.zone ?? "Todas las zonas",
        type: result.type,
        state: result.state,
        priceRange: [
          result.price_min ?? PRICE_RANGE_LIMITS.min,
          result.price_max ?? PRICE_RANGE_LIMITS.max,
        ],
        amenities: result.amenities,
        bedroomsMin: result.bedrooms_min ?? null,
        bathroomsMin: result.bathrooms_min ?? null,
        parkingMin: result.parking_min ?? null,
        sqmMin: result.sqm_min ?? null,
        sqmMax: result.sqm_max ?? null,
      }));
    } catch {
      setNaturalSearchError("No se pudo procesar tu búsqueda. Intenta de nuevo.");
    }
  }, [naturalSearchMutation]);

  const clearNaturalSearch = useCallback(() => {
    setNaturalSearchQuery("");
    setNaturalSearchError(null);
    naturalSearchMutation.reset();
    setFilters(DEFAULT_BUY_FILTERS);
  }, [naturalSearchMutation]);

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
    setOrdering,
    mapStateToStatus,
    cities,
    sentinelRef,
    isFetchingNextPage,
    hasNextPage,
    handleNaturalSearch,
    clearNaturalSearch,
    isNaturalSearching: naturalSearchMutation.isPending,
    naturalSearchError,
    naturalSearchQuery,
    isAuthenticated,
  };
};
