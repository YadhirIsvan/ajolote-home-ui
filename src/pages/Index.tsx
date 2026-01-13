import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import PropertyCard from "@/components/PropertyCard";
import { Search, Shield, TrendingUp, Clock } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const zones = [
  "Orizaba",
  "Córdoba", 
  "Fortín",
  "Peñuela",
  "Amatlán",
  "Río Blanco",
  "Nogales",
];

const Index = () => {
  const [selectedZone, setSelectedZone] = useState<string>("");

  const featuredProperties = [
    {
      id: 1,
      image: property1,
      price: "$4,500,000",
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
      title: "Residencia con Alberca",
      location: "Río Blanco, Veracruz",
      beds: 5,
      baths: 4,
      area: 380,
      score: 99,
    },
  ];

  const filteredProperties = selectedZone
    ? featuredProperties.filter((p) => p.location.includes(selectedZone))
    : featuredProperties;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Clean & Minimal */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 leading-tight">
            Encuentra tu hogar ideal
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Propiedades verificadas con validación legal y crediticia en la región de Veracruz
          </p>

          {/* Zone Selector - Full width on mobile */}
          <div className="max-w-md mx-auto mb-8">
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-full h-14 text-base bg-card border-2 border-border hover:border-champagne transition-colors">
                <SelectValue placeholder="Selecciona tu Zona" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {zones.map((zone) => (
                  <SelectItem key={zone} value={zone} className="text-base py-3 cursor-pointer">
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="lg" asChild className="w-full sm:w-auto">
              <Link to="/comprar">
                <Search className="w-4 h-4" />
                Explorar Propiedades
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link to="/vender">
                Publicar Propiedad
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-grey-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-6 text-center shadow-soft">
              <Shield className="w-8 h-8 text-champagne mx-auto mb-3" />
              <div className="text-3xl font-bold text-primary mb-1">95+</div>
              <div className="text-sm text-muted-foreground">Score Legal Promedio</div>
            </div>
            <div className="bg-card rounded-xl p-6 text-center shadow-soft">
              <TrendingUp className="w-8 h-8 text-champagne mx-auto mb-3" />
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Propiedades Verificadas</div>
            </div>
            <div className="bg-card rounded-xl p-6 text-center shadow-soft">
              <Clock className="w-8 h-8 text-champagne mx-auto mb-3" />
              <div className="text-3xl font-bold text-primary mb-1">7 min</div>
              <div className="text-sm text-muted-foreground">Pre-aprobación de Crédito</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Propiedades Destacadas</h2>
            <p className="text-muted-foreground">
              Cada propiedad incluye su Score Legal y validación completa
            </p>
          </div>

          {/* Property Grid - 1 col mobile, 3 col desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center mt-10">
            <Button variant="midnight" size="lg" asChild>
              <Link to="/comprar">
                Ver Todas las Propiedades
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
