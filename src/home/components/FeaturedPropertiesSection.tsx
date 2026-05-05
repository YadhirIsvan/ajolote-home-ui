import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import PropertyCard from "@/shared/components/custom/PropertyCard";
import type { PropertyListItem } from "@/home/types/property.types";

interface FeaturedPropertiesSectionProps {
  properties: PropertyListItem[];
  isLoading: boolean;
}

const FeaturedPropertiesSection = memo(({ properties, isLoading }: FeaturedPropertiesSectionProps) => (
  <section className="py-24 md:py-32 px-6 bg-gradient-to-b from-secondary/15 via-secondary/5 to-background">
    <div className="container mx-auto max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 md:mb-16">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--champagne-gold))] mb-2 block">
            Catálogo
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-midnight">
            Propiedades Destacadas
          </h2>
        </div>
        <Button
          variant="ghost"
          asChild
          className="group text-foreground/50 hover:text-midnight self-start sm:self-auto"
        >
          <Link to="/comprar" className="flex items-center gap-2 text-sm font-medium">
            Ver todas
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-2xl bg-secondary/30 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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

      <div className="text-center mt-14">
        <Button
          variant="gold"
          size="lg"
          asChild
          className="rounded-full px-10 py-6 text-base font-semibold shadow-[0_8px_30px_rgba(184,155,110,0.3)] hover:shadow-[0_12px_40px_rgba(184,155,110,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
        >
          <Link to="/comprar" className="flex items-center gap-2">
            Explorar Propiedades
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

));

FeaturedPropertiesSection.displayName = "FeaturedPropertiesSection";

export default FeaturedPropertiesSection;
