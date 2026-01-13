import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from "@/components/Navigation";
import PropertyCard, { PropertyStatus } from "@/components/PropertyCard";
import { SlidersHorizontal, X } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const zones = [
  "Todas las zonas",
  "Orizaba",
  "Córdoba",
  "Fortín",
  "Peñuela",
  "Amatlán",
  "Río Blanco",
  "Nogales",
];

const propertyTypes = [
  { value: "all", label: "Todos" },
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "terreno", label: "Terreno" },
  { value: "local", label: "Local Comercial" },
];

const amenities = [
  { id: "pool", label: "Alberca" },
  { id: "security", label: "Seguridad 24/7" },
  { id: "garden", label: "Jardín" },
  { id: "parking", label: "Estacionamiento" },
  { id: "gym", label: "Gimnasio" },
];

const propertyStates = [
  { value: "all", label: "Todos" },
  { value: "nueva", label: "Nueva" },
  { value: "preventa", label: "Preventa" },
  { value: "usada", label: "Usada" },
];

interface Property {
  id: number;
  image: string;
  price: string;
  priceNum: number;
  title: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  status: PropertyStatus;
  type: string;
  amenities: string[];
  state: string;
}

const allProperties: Property[] = [
  {
    id: 1,
    image: property1,
    price: "$4,500,000",
    priceNum: 4500000,
    title: "Casa Moderna en Zona Residencial",
    location: "Orizaba, Veracruz",
    beds: 3,
    baths: 2,
    area: 180,
    status: "disponible",
    type: "casa",
    amenities: ["pool", "security", "garden"],
    state: "nueva",
  },
  {
    id: 2,
    image: property2,
    price: "$6,800,000",
    priceNum: 6800000,
    title: "Departamento de Lujo con Vista Panorámica",
    location: "Córdoba, Veracruz",
    beds: 2,
    baths: 2,
    area: 145,
    status: "preventa",
    type: "departamento",
    amenities: ["security", "gym", "parking"],
    state: "preventa",
  },
  {
    id: 3,
    image: property3,
    price: "$12,500,000",
    priceNum: 12500000,
    title: "Villa con Jardín Amplio",
    location: "Fortín, Veracruz",
    beds: 4,
    baths: 3,
    area: 320,
    status: "oportunidad",
    type: "casa",
    amenities: ["pool", "security", "garden", "parking"],
    state: "usada",
  },
  {
    id: 4,
    image: property1,
    price: "$3,200,000",
    priceNum: 3200000,
    title: "Casa Colonial Restaurada",
    location: "Peñuela, Veracruz",
    beds: 4,
    baths: 3,
    area: 220,
    status: "disponible",
    type: "casa",
    amenities: ["garden", "parking"],
    state: "usada",
  },
  {
    id: 5,
    image: property2,
    price: "$5,900,000",
    priceNum: 5900000,
    title: "Penthouse Contemporáneo",
    location: "Amatlán, Veracruz",
    beds: 3,
    baths: 3,
    area: 200,
    status: "disponible",
    type: "departamento",
    amenities: ["security", "gym", "parking"],
    state: "nueva",
  },
  {
    id: 6,
    image: property3,
    price: "$8,500,000",
    priceNum: 8500000,
    title: "Residencia con Alberca",
    location: "Río Blanco, Veracruz",
    beds: 5,
    baths: 4,
    area: 380,
    status: "preventa",
    type: "casa",
    amenities: ["pool", "security", "garden", "parking", "gym"],
    state: "preventa",
  },
  {
    id: 7,
    image: property1,
    price: "$2,800,000",
    priceNum: 2800000,
    title: "Departamento en Torre Premium",
    location: "Nogales, Veracruz",
    beds: 2,
    baths: 2,
    area: 120,
    status: "oportunidad",
    type: "departamento",
    amenities: ["security", "gym"],
    state: "usada",
  },
  {
    id: 8,
    image: property2,
    price: "$7,200,000",
    priceNum: 7200000,
    title: "Casa Minimalista con Jardín",
    location: "Orizaba, Veracruz",
    beds: 3,
    baths: 2,
    area: 250,
    status: "disponible",
    type: "casa",
    amenities: ["garden", "security", "parking"],
    state: "nueva",
  },
  {
    id: 9,
    image: property3,
    price: "$15,000,000",
    priceNum: 15000000,
    title: "Mansion con Vista Panorámica",
    location: "Córdoba, Veracruz",
    beds: 6,
    baths: 5,
    area: 500,
    status: "disponible",
    type: "casa",
    amenities: ["pool", "security", "garden", "parking", "gym"],
    state: "nueva",
  },
  {
    id: 10,
    image: property1,
    price: "$4,100,000",
    priceNum: 4100000,
    title: "Loft Industrial Remodelado",
    location: "Fortín, Veracruz",
    beds: 2,
    baths: 1,
    area: 140,
    status: "oportunidad",
    type: "departamento",
    amenities: ["parking"],
    state: "usada",
  },
  {
    id: 11,
    image: property2,
    price: "$9,500,000",
    priceNum: 9500000,
    title: "Casa en Condominio Exclusivo",
    location: "Orizaba, Veracruz",
    beds: 4,
    baths: 3,
    area: 300,
    status: "preventa",
    type: "casa",
    amenities: ["pool", "security", "garden", "parking"],
    state: "preventa",
  },
  {
    id: 12,
    image: property3,
    price: "$5,600,000",
    priceNum: 5600000,
    title: "Residencia Ecológica",
    location: "Amatlán, Veracruz",
    beds: 3,
    baths: 2,
    area: 190,
    status: "disponible",
    type: "casa",
    amenities: ["garden", "security"],
    state: "nueva",
  },
];

const Comprar = () => {
  const [selectedZone, setSelectedZone] = useState<string>("Todas las zonas");
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000000]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId) ? prev.filter((a) => a !== amenityId) : [...prev, amenityId]
    );
  };

  const clearFilters = () => {
    setSelectedZone("Todas las zonas");
    setPriceRange([0, 20000000]);
    setSelectedType("all");
    setSelectedAmenities([]);
    setSelectedState("all");
  };

  const filteredProperties = allProperties.filter((property) => {
    const matchesZone = selectedZone === "Todas las zonas" || property.location.includes(selectedZone);
    const matchesPrice = property.priceNum >= priceRange[0] && property.priceNum <= priceRange[1];
    const matchesType = selectedType === "all" || property.type === selectedType;
    const matchesState = selectedState === "all" || property.state === selectedState;
    const matchesAmenities =
      selectedAmenities.length === 0 || selectedAmenities.every((a) => property.amenities.includes(a));
    return matchesZone && matchesPrice && matchesType && matchesState && matchesAmenities;
  });

  const activeFiltersCount = [
    selectedZone !== "Todas las zonas",
    priceRange[0] !== 0 || priceRange[1] !== 20000000,
    selectedType !== "all",
    selectedState !== "all",
    selectedAmenities.length > 0,
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Zone Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Zona</label>
        <Select value={selectedZone} onValueChange={setSelectedZone}>
          <SelectTrigger className="w-full h-12 bg-card border-2 border-border rounded-xl">
            <SelectValue placeholder="Selecciona tu Zona" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {zones.map((zone) => (
              <SelectItem key={zone} value={zone} className="py-3 cursor-pointer">
                {zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Tipo de Propiedad</label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full h-12 bg-card border-2 border-border rounded-xl">
            <SelectValue placeholder="Tipo de propiedad" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {propertyTypes.map((type) => (
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
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-full h-12 bg-card border-2 border-border rounded-xl">
            <SelectValue placeholder="Estado de propiedad" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {propertyStates.map((state) => (
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
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-3">
              <Checkbox
                id={amenity.id}
                checked={selectedAmenities.includes(amenity.id)}
                onCheckedChange={() => toggleAmenity(amenity.id)}
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

      {/* Price Range Slider */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Rango de Precio</label>
        <div className="px-2 pt-4 pb-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={20000000}
            step={100000}
            className="w-full touch-pan-y"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="ghost" className="w-full" onClick={clearFilters}>
        <X className="w-4 h-4 mr-2" />
        Limpiar Filtros
      </Button>
    </div>
  );

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
              <div className="bg-card rounded-2xl p-6 border border-border sticky top-24 shadow-soft">
                <h3 className="font-semibold text-primary mb-4">Filtros</h3>
                <FilterContent />
              </div>
            </aside>

            {/* Property Grid */}
            <div className="flex-1">
              {filteredProperties.length === 0 ? (
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
                      location={property.location}
                      beds={property.beds}
                      baths={property.baths}
                      area={property.area}
                      status={property.status}
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
            <Button
              variant="gold"
              size="lg"
              className="rounded-full shadow-gold px-6 gap-2"
            >
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
              <FilterContent />
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

export default Comprar;
