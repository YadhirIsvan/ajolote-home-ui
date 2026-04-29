import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import type { PropertyStatus } from "@/shared/types/property-status.types";

export type { PropertyStatus };

interface PropertyCardProps {
  id: number;
  image: string;
  image_thumb?: string;
  price: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  status?: PropertyStatus;
}

const statusConfig: Record<PropertyStatus, { label: string; className: string }> = {
  disponible: {
    label: "Disponible",
    className: "bg-emerald-500/80",
  },
  preventa: {
    label: "Preventa",
    className: "bg-champagne/90",
  },
  oportunidad: {
    label: "Oportunidad",
    className: "bg-midnight/80",
  },
  vendida: {
    label: "Vendida",
    className: "bg-red-500/80",
  },
};

const PropertyCard = ({ id, image, image_thumb, price, title, location, beds, baths, area, status = "disponible" }: PropertyCardProps) => {
  const statusStyle = statusConfig[status];

  return (
    <Card className="group overflow-hidden bg-card border border-border/50 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 rounded-2xl">
      <Link to={`/propiedad/${id}`}>
        {/* Image with Status Tag */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={image_thumb ?? image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div
            className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-md shadow-lg ${statusStyle.className}`}
          >
            {statusStyle.label}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-champagne">{price}</span>
            <span className="text-xs text-muted-foreground">MXN</span>
          </div>

          <h3 className="text-base font-semibold text-primary line-clamp-1">{title}</h3>

          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>

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

          <Button variant="gold-outline" className="w-full mt-2">
            Ver Detalles
          </Button>
        </div>
      </Link>
    </Card>
  );
};

export default PropertyCard;
