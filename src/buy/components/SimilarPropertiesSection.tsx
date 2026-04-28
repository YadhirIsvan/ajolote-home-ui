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
  const firstVisible = page * CARDS_PER_PAGE + 1;
  const lastVisible = Math.min((page + 1) * CARDS_PER_PAGE, properties.length);

  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  return (
    <section className="border-t border-border mt-2">
      <div className="container mx-auto px-4 lg:px-6 pt-10 pb-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary">
            Propiedades similares
          </h2>
          {totalPages > 1 && (
            <span className="text-sm text-muted-foreground">
              Mostrando {firstVisible}–{lastVisible} de {properties.length} propiedades
            </span>
          )}
        </div>

        {/* Cards Grid — full width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 gap-4">

            {/* Prev */}
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!canGoPrev}
              aria-label="Ver propiedades anteriores"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border
                         bg-background text-sm font-medium text-primary shadow-sm
                         hover:bg-champagne hover:text-white hover:border-champagne hover:shadow-md
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anteriores</span>
            </button>

            {/* Numbered page buttons */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Ir a página ${i + 1}`}
                  aria-current={i === page ? "page" : undefined}
                  className={`min-w-[2rem] h-8 rounded-lg text-sm font-semibold px-2.5
                              transition-all duration-200 ${
                    i === page
                      ? "bg-champagne text-white shadow-md scale-105"
                      : "bg-muted text-muted-foreground hover:bg-muted-foreground/20 hover:text-primary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!canGoNext}
              aria-label="Ver siguientes propiedades"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border
                         bg-background text-sm font-medium text-primary shadow-sm
                         hover:bg-champagne hover:text-white hover:border-champagne hover:shadow-md
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              <span className="hidden sm:inline">Siguientes</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </section>
  );
};

export default SimilarPropertiesSection;
