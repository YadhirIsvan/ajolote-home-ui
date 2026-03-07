import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/shared/components/custom/Navigation";
import PropertyCard from "@/shared/components/custom/PropertyCard";
import { Search, Shield, TrendingUp, Clock } from "lucide-react";
import { useFeaturedProperties } from "@/home/hooks/use-featured-properties.hook";
import { HOME_ZONES } from "@/home/types/property.types";
import videoBackground from "@/assets/videos/video-background.mp4";

const HomePage = () => {
  const [selectedZone, setSelectedZone] = useState<string>("");

  const { properties, isLoading } = useFeaturedProperties({
    zone: selectedZone || undefined,
    limit: 20,
    offset: 0,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoBackground} type="video/mp4" />
        </video>

        {/* Overlay elegante para legibilidad */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/50 to-midnight/80"
          aria-hidden
        />

        {/* Contenido */}
        <div className="relative z-10 container mx-auto text-center px-4 pt-24 pb-16 md:pt-32 md:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
            Encuentra tu hogar ideal
          </h1>
          <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Propiedades verificadas con validación legal y crediticia en la región de Veracruz
          </p>

          <div className="max-w-md mx-auto mb-8">
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-full h-14 text-base bg-white/95 backdrop-blur-sm border-2 border-white/30 hover:border-champagne transition-colors shadow-medium">
                <SelectValue placeholder="Selecciona tu Zona" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {HOME_ZONES.map((zone) => (
                  <SelectItem key={zone} value={zone} className="text-base py-3 cursor-pointer">
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="lg" asChild className="w-full sm:w-auto shadow-gold">
              <Link to="/comprar">
                <Search className="w-4 h-4" />
                Explorar Propiedades
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-sm"
            >
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
              <div className="text-3xl font-bold text-primary mb-1">100 %</div>
              <div className="text-sm text-muted-foreground">Verificadas</div>
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

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Cargando propiedades...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
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
                />
              ))}
            </div>
          )}

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

export default HomePage;
