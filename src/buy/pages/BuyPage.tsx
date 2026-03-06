import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import Navigation from "@/shared/components/custom/Navigation";
import PropertyCard from "@/shared/components/custom/PropertyCard";
import PropertyFilters from "@/buy/components/PropertyFilters";
import MortgageCallToAction from "@/buy/components/MortgageCallToAction";
import { useBuyProperties } from "@/buy/hooks/use-buy-properties.hook";
import { useFinancialModal } from "@/contexts/FinancialModalContext";

const BuyPage = () => {
  const { openFinancialModal } = useFinancialModal();
  const {
    filteredProperties,
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
  } = useBuyProperties();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-24 md:pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">Propiedades en Venta</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {filteredProperties.length} propiedades encontradas
              </p>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden md:block w-72 flex-shrink-0">
              <div className="bg-card rounded-2xl p-6 border border-border sticky top-24 shadow-soft space-y-6">
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
                    onClearFilters={clearFilters}
                  />
                </div>
                
                {/* Mortgage CTA Sidebar */}
                <div className="border-t border-border pt-6">
                  <MortgageCallToAction onCalculateCredit={() => openFinancialModal()} />
                </div>
              </div>
            </aside>

            {/* Property Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="text-center py-16 text-muted-foreground">Cargando propiedades...</div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No se encontraron propiedades con estos filtros</p>
                  <Button variant="gold-outline" onClick={clearFilters}>
                    Limpiar Filtros
                  </Button>
                </div>
              ) : (
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
                onZoneChange={setZone}
                onTypeChange={setType}
                onStateChange={setState}
                onPriceRangeChange={setPriceRange}
                onAmenityToggle={toggleAmenity}
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
