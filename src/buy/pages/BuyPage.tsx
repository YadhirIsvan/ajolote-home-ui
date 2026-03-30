import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import PropertyCard from "@/shared/components/custom/PropertyCard";
import PropertyFilters from "@/buy/components/PropertyFilters";
import MortgageCallToAction from "@/buy/components/MortgageCallToAction";
import NaturalSearchBar from "@/buy/components/NaturalSearchBar";
import { useBuyProperties } from "@/buy/hooks/use-buy-properties.buy.hook";
import { useFinancialModal } from "@/shared/hooks/financial-modal.context";
import { useAuth } from "@/shared/hooks/auth.context";

const BuyPage = () => {
  const { openFinancialModal } = useFinancialModal();
  const { isAuthenticated } = useAuth();
  const {
    filteredProperties,
    totalCount,
    isLoading,
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
    handleNaturalSearch,
    clearNaturalSearch,
    isNaturalSearching,
    naturalSearchError,
    naturalSearchQuery,
    setOrdering,
  } = useBuyProperties();

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 pb-24 md:pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">Propiedades en Venta</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {totalCount} propiedades encontradas
              </p>
            </div>
          </div>

          {/* Natural Language Search */}
          <NaturalSearchBar
            onSearch={handleNaturalSearch}
            onClear={clearNaturalSearch}
            isSearching={isNaturalSearching}
            error={naturalSearchError}
            appliedQuery={naturalSearchQuery}
          />

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar — sticky que scrollea con el contenido */}
            <aside className="hidden md:block w-72 flex-shrink-0">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-soft space-y-6">
                  <div>
                    <h3 className="font-semibold text-primary mb-4">Filtros</h3>
                    <PropertyFilters
                      filters={filters}
                      cities={cities}
                      onZoneChange={setZone}
                      onTypeChange={setType}
                      onStateChange={setState}
                      onPriceRangeChange={setPriceRange}
                      onAmenityToggle={toggleAmenity}
                      onOrderingChange={setOrdering}
                      onClearFilters={clearFilters}
                    />
                  </div>

                  {/* Mortgage CTA Sidebar — solo para usuarios autenticados */}
                  {isAuthenticated && (
                  <div className="border-t border-border pt-6">
                    <MortgageCallToAction onCalculateCredit={() => openFinancialModal()} />
                  </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Property Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] rounded-2xl bg-secondary/30 animate-pulse" />
                  ))}
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No se encontraron propiedades con estos filtros</p>
                  <Button variant="gold-outline" onClick={clearFilters}>
                    Limpiar Filtros
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        id={property.id}
                        image={property.image}
                        price={property.price}
                        title={property.title}
                        location={property.address}
                        beds={property.beds}
                        baths={property.baths}
                        area={property.sqm}
                        status={mapStateToStatus(property.state)}
                      />
                    ))}
                  </div>

                  {/* Sentinel para infinite scroll */}
                  <div ref={sentinelRef} className="h-1" />

                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Cargando más propiedades...</span>
                    </div>
                  )}

                  {!hasNextPage && filteredProperties.length > 0 && (
                    <p className="text-center text-muted-foreground text-sm py-8">
                      Has visto todas las propiedades
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Filter Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-40">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="gold" size="lg" className="rounded-full shadow-gold px-6 gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filtrar
              {activeFiltersCount > 0 && (
                <span className="ml-1 bg-white text-champagne text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-background">
            <SheetHeader className="text-left pb-4 border-b border-border">
              <SheetTitle className="text-primary text-xl">Filtrar Propiedades</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-[calc(100%-140px)] py-4">
              <PropertyFilters
                filters={filters}
                cities={cities}
                onZoneChange={setZone}
                onTypeChange={setType}
                onStateChange={setState}
                onPriceRangeChange={setPriceRange}
                onAmenityToggle={toggleAmenity}
                onOrderingChange={setOrdering}
                onClearFilters={clearFilters}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
              <Button variant="gold" className="w-full" onClick={() => setIsFilterOpen(false)}>
                Ver {filteredProperties.length} Propiedades
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default BuyPage;
