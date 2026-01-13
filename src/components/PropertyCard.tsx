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
    <Card className="group overflow-hidden bg-card border border-border/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <Link to={`/propiedad/${id}`}>
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {score && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Score: {score}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-champagne">{price}</span>
            <span className="text-xs text-muted-foreground">MXN</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-primary line-clamp-1">{title}</h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-foreground/70 pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4 text-champagne" />
              <span>{beds}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-champagne" />
              <span>{baths}</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4 text-champagne" />
              <span>{area}m²</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button variant="gold-outline" className="w-full mt-2">
            Ver Detalles
          </Button>
        </div>
      </Link>
    </Card>
  );
};

export default PropertyCard;
