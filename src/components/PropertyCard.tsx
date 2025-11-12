import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";

interface PropertyCardProps {
  id: number;
  image: string;
  price: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  score?: number;
}

const PropertyCard = ({ id, image, price, title, location, beds, baths, area, score }: PropertyCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-glow-blue hover:-translate-y-1">
      <Link to={`/propiedad/${id}`}>
        {/* Imagen */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {score && (
            <div className="absolute top-3 right-3 bg-ribbon text-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Score: {score}
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-5">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-2xl font-bold text-flamingo">{price}</span>
            <span className="text-xs text-muted-foreground">MXN</span>
          </div>

          <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-1">{title}</h3>

          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{location}</span>
          </div>

          {/* Características */}
          <div className="flex items-center gap-4 mb-4 text-sm text-card-foreground">
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4 text-ribbon" />
              <span>{beds}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-ribbon" />
              <span>{baths}</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4 text-ribbon" />
              <span>{area}m²</span>
            </div>
          </div>

          <Button variant="hero" className="w-full">
            Ver Detalles
          </Button>
        </div>
      </Link>
    </Card>
  );
};

export default PropertyCard;
