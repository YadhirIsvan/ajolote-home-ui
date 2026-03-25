import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Slider } from "@/shared/components/ui/slider";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { X, ArrowUpNarrowWide, ArrowDownNarrowWide, ArrowUpDown } from "lucide-react";
import {
  PROPERTY_TYPES,
  PROPERTY_STATES,
  AMENITY_OPTIONS,
  PRICE_RANGE_LIMITS,
  type BuyFilters,
  type PriceOrdering,
} from "@/buy/types/property.types";
import type { CityItem } from "@/shared/actions/get-cities.actions";
import { formatPrice } from "@/buy/hooks/use-buy-properties.buy.hook";

interface PropertyFiltersProps {
  filters: BuyFilters;
  cities: CityItem[];
  onZoneChange: (zone: string) => void;
  onTypeChange: (type: string) => void;
  onStateChange: (state: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onAmenityToggle: (id: string) => void;
  onOrderingChange: (ordering: PriceOrdering) => void;
  onClearFilters: () => void;
}

const PropertyFilters = ({
  filters,
  cities,
  onZoneChange,
  onTypeChange,
  onStateChange,
  onPriceRangeChange,
  onAmenityToggle,
  onOrderingChange,
  onClearFilters,
}: PropertyFiltersProps) => {
  const [orderingExpanded, setOrderingExpanded] = useState(filters.ordering !== "");

  const handleOrderingToggle = () => {
    if (orderingExpanded) {
      setOrderingExpanded(false);
      onOrderingChange("");
    } else {
      setOrderingExpanded(true);
    }
  };

  return (
  <div className="space-y-6">
    {/* Zone */}
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Zona</label>
      <Select value={filters.zone} onValueChange={onZoneChange}>
        <SelectTrigger className="w-full h-12 bg-card border-2 border-border rounded-xl">
          <SelectValue placeholder="Selecciona tu Zona" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50">
          <SelectItem value="Todas las zonas" className="py-3 cursor-pointer">
            Todas las zonas
          </SelectItem>
          {(cities ?? []).map((city) => (
            <SelectItem key={city.id} value={city.name} className="py-3 cursor-pointer">
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Property Type */}
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Tipo de Propiedad</label>
      <Select value={filters.type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full h-12 bg-card border-2 border-border rounded-xl">
          <SelectValue placeholder="Tipo de propiedad" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50">
          {PROPERTY_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value} className="py-3 cursor-pointer">
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Property State */}
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Estado de Propiedad</label>
      <Select value={filters.state} onValueChange={onStateChange}>
        <SelectTrigger className="w-full h-12 bg-card border-2 border-border rounded-xl">
          <SelectValue placeholder="Estado de propiedad" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50">
          {PROPERTY_STATES.map((state) => (
            <SelectItem key={state.value} value={state.value} className="py-3 cursor-pointer">
              {state.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Amenities */}
    <div>
      <label className="block text-sm font-medium text-foreground mb-3">Amenidades</label>
      <div className="space-y-3">
        {AMENITY_OPTIONS.map((amenity) => (
          <div key={amenity.id} className="flex items-center space-x-3">
            <Checkbox
              id={amenity.id}
              checked={filters.amenities.includes(amenity.id)}
              onCheckedChange={() => onAmenityToggle(amenity.id)}
              className="border-champagne data-[state=checked]:bg-champagne data-[state=checked]:border-champagne"
            />
            <label
              htmlFor={amenity.id}
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              {amenity.label}
            </label>
          </div>
        ))}
      </div>
    </div>

    {/* Ordering */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={handleOrderingToggle}
          className={`
            flex items-center justify-center w-7 h-7 rounded-lg border transition-all duration-200
            ${orderingExpanded
              ? "bg-champagne border-champagne text-white shadow-sm"
              : "border-border text-muted-foreground hover:border-champagne/50 hover:text-champagne"
            }
          `}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-medium text-foreground">Ordenar por Precio</span>
      </div>

      {orderingExpanded && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onOrderingChange("price")}
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium
              transition-all duration-200
              ${filters.ordering === "price"
                ? "bg-champagne border-champagne text-white shadow-sm"
                : "border-border text-muted-foreground hover:border-champagne/50 hover:text-foreground bg-card"
              }
            `}
          >
            <ArrowUpNarrowWide className="w-3.5 h-3.5" />
            Ascendente
          </button>
          <button
            type="button"
            onClick={() => onOrderingChange("-price")}
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium
              transition-all duration-200
              ${filters.ordering === "-price"
                ? "bg-champagne border-champagne text-white shadow-sm"
                : "border-border text-muted-foreground hover:border-champagne/50 hover:text-foreground bg-card"
              }
            `}
          >
            <ArrowDownNarrowWide className="w-3.5 h-3.5" />
            Descendente
          </button>
        </div>
      )}
    </div>

    {/* Price Range */}
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Rango de Precio</label>
      <div className="px-2 pt-4 pb-2">
        <Slider
          value={filters.priceRange}
          onValueChange={(v) => onPriceRangeChange(v as [number, number])}
          min={PRICE_RANGE_LIMITS.min}
          max={PRICE_RANGE_LIMITS.max}
          step={PRICE_RANGE_LIMITS.step}
          className="w-full touch-pan-y"
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        <span>{formatPrice(filters.priceRange[0])}</span>
        <span>{formatPrice(filters.priceRange[1])}</span>
      </div>
    </div>

    {/* Clear Filters */}
    <Button variant="ghost" className="w-full" onClick={onClearFilters}>
      <X className="w-4 h-4 mr-2" />
      Limpiar Filtros
    </Button>
  </div>
  );
};

export default PropertyFilters;
