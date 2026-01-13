import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import PropertyCard from "@/components/PropertyCard";
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

const allProperties = [
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
    score: 98,
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
    score: 95,
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
    score: 97,
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
    score: 96,
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
    score: 94,
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
    score: 99,
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
    score: 93,
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
    score: 97,
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
    score: 98,
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
    score: 92,
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
    score: 96,
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
    score: 95,
  },
];

const Comprar = () => {
  const [selectedZone, setSelectedZone] = useState<string>("Todas las zonas");
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredProperties = allProperties.filter((property) => {
    const matchesZone = selectedZone === "Todas las zonas" || property.location.includes(selectedZone);
    const matchesPrice = property.priceNum >= priceRange[0] && property.priceNum <= priceRange[1];
    return matchesZone && matchesPrice;
  });

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Zone Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Zona</label>
        <Select value={selectedZone} onValueChange={setSelectedZone}>
          <SelectTrigger className="w-full h-12 bg-card border-2 border-border">
            <SelectValue placeholder="Selecciona tu Zona" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {zones.map((zone) => (
              <SelectItem key={zone} value={zone} className="py-3 cursor-pointer">
                {zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            step={500000}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="ghost"
        className="w-full"
        onClick={() => {
          setSelectedZone("Todas las zonas");
          setPriceRange([0, 20000000]);
        }}
      >
        Limpiar Filtros
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">Propiedades en Venta</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {filteredProperties.length} propiedades encontradas
              </p>
            </div>

            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="default">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl bg-background">
                <SheetHeader className="text-left pb-4">
                  <SheetTitle className="text-primary">Filtrar Propiedades</SheetTitle>
                </SheetHeader>
                <FilterContent />
                <div className="mt-6">
                  <Button variant="gold" className="w-full" onClick={() => setIsFilterOpen(false)}>
                    Ver {filteredProperties.length} Propiedades
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden md:block w-72 flex-shrink-0">
              <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                <h3 className="font-semibold text-primary mb-4">Filtros</h3>
                <FilterContent />
              </div>
            </aside>

            {/* Property Grid */}
            <div className="flex-1">
              {filteredProperties.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No se encontraron propiedades con estos filtros</p>
                  <Button
                    variant="gold-outline"
                    onClick={() => {
                      setSelectedZone("Todas las zonas");
                      setPriceRange([0, 20000000]);
                    }}
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comprar;
