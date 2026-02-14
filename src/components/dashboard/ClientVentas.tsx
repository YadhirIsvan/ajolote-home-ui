import { ArrowLeft, Home, MapPin, Eye, Calendar, TrendingUp, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClientVentasProps {
  onBack: () => void;
}

const mockVentas = [
  {
    id: 1,
    title: "Casa en Querétaro",
    address: "Col. Juriquilla, Querétaro",
    price: "$4,200,000",
    status: "Publicada",
    views: 142,
    interested: 8,
    daysListed: 15,
    image: "/placeholder.svg",
    trend: "+12% visitas",
  },
  {
    id: 2,
    title: "Departamento en CDMX",
    address: "Col. Roma Norte, CDMX",
    price: "$2,800,000",
    status: "En revisión",
    views: 67,
    interested: 3,
    daysListed: 5,
    image: "/placeholder.svg",
    trend: "+24% visitas",
  },
];

const ClientVentas = ({ onBack }: ClientVentasProps) => {
  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-foreground/60 hover:text-champagne-gold transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al Dashboard
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-midnight">Mis Propiedades en Venta</h1>
          <p className="text-sm text-foreground/60 mt-1">{mockVentas.length} propiedades activas</p>
        </div>
        <Button variant="gold" size="sm">
          <Home className="w-4 h-4 mr-2" />
          Agregar Propiedad
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Propiedades", value: "2", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Visitas totales", value: "209", color: "text-champagne-gold", bg: "bg-champagne-gold/10" },
          { label: "Interesados", value: "11", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Valor total", value: "$7M", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => (
          <Card key={stat.label} className="border border-border/20 rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-foreground/50 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Cards */}
      <div className="space-y-4">
        {mockVentas.map((prop) => (
          <Card key={prop.id} className="border border-border/20 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="sm:w-48 h-40 sm:h-auto bg-muted/30 relative flex-shrink-0">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                  <Badge className={`absolute top-3 left-3 text-xs ${prop.status === "Publicada" ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700"}`}>
                    {prop.status}
                  </Badge>
                </div>

                {/* Details */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-midnight">{prop.title}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-foreground/50 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {prop.address}
                      </div>
                    </div>
                    <span className="text-xl font-bold text-champagne-gold">{prop.price}</span>
                  </div>

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/10">
                    <div className="flex items-center gap-1.5 text-sm text-foreground/60">
                      <Eye className="w-4 h-4" />
                      <span>{prop.views} visitas</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-foreground/60">
                      <Calendar className="w-4 h-4" />
                      <span>{prop.daysListed} días</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>{prop.trend}</span>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs border-champagne-gold/30 text-champagne-gold hover:bg-champagne-gold/5">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientVentas;
