import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "@/shared/components/custom/PropertyCard";
import type { SimilarProperty } from "@/buy/types/property.types";

interface SimilarPropertiesSectionProps {
  properties: SimilarProperty[];
}

const CARDS_PER_PAGE = 3;

const SimilarPropertiesSection = ({ properties }: SimilarPropertiesSectionProps) => {
  const [page, setPage] = useState(0);

  if (!properties.length) return null;

  const totalPages = Math.ceil(properties.length / CARDS_PER_PAGE);
  const currentCards = properties.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  return (
    <section className="border-t border-border mt-2">
      <div className="container mx-auto px-4 lg:px-6 pt-10 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary">
            Propiedades similares
          </h2>
          {totalPages > 1 && (
            <span className="text-sm text-muted-foreground">
              {page + 1} / {totalPages}
            </span>
          )}
        </div>

        {/* Carousel Row */}
        <div className="flex items-center gap-3 lg:gap-5">

          {/* Prev Button */}
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!canGoPrev}
            aria-label="Propiedades anteriores"
            className="shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-border bg-background
                       flex items-center justify-center text-primary shadow-soft
                       hover:bg-champagne hover:text-white hover:border-champagne
                       disabled:opacity-25 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cards Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {currentCards.map((prop) => (
              <PropertyCard
                key={prop.id}
                id={prop.id}
                image={prop.image}
                price={prop.price}
                title={prop.title}
                location={prop.address}
                beds={prop.beds}
                baths={prop.baths}
                area={prop.sqm}
                status="disponible"
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!canGoNext}
            aria-label="Siguientes propiedades"
            className="shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-border bg-background
                       flex items-center justify-center text-primary shadow-soft
                       hover:bg-champagne hover:text-white hover:border-champagne
                       disabled:opacity-25 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Dot Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Ir a página ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === page
                    ? "w-5 h-2 bg-champagne"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default SimilarPropertiesSection;
