import { useState } from "react";
import { ArrowLeft, Home, MapPin, Eye, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SellerLeadForm from "@/components/SellerLeadForm";
import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

interface PropertySaleItem {
  id: number;
  title: string;
  address: string;
  price: string;
  status: string;
  views: number;
  interested: number;
  daysListed: number;
  image: string;
  trend: number;
  progressStep: number;
  type?: string;
  sqm?: number;
  bedrooms?: number;
  bathrooms?: number;
}

interface PropertiesSaleResponse {
  propertiesAmount?: number;
  totalViews?: number;
  interestedAmount?: number;
  totalValue?: number;
  properties?: PropertySaleItem[];
}

const DEFAULT_VENTAS_RESPONSE: PropertiesSaleResponse = {
  propertiesAmount: 2,
  totalViews: 209,
  interestedAmount: 11,
  totalValue: 7000000,
  properties: [
    { id: 1, title: "Casa en Querétaro", address: "Col. Juriquilla, Querétaro", price: "$4,200,000", status: "Publicada", views: 142, interested: 8, daysListed: 15, image: "/placeholder.svg", trend: 12, progressStep: 3, type: "Casa", sqm: 180, bedrooms: 3, bathrooms: 2 },
    { id: 2, title: "Departamento en CDMX", address: "Col. Roma Norte, CDMX", price: "$2,800,000", status: "En revisión", views: 0, interested: 0, daysListed: 5, image: "/placeholder.svg", trend: 0, progressStep: 1, type: "Departamento", sqm: 95, bedrooms: 2, bathrooms: 1 },
  ],
};

const fetchPropertiesSale = async (): Promise<PropertiesSaleResponse> => {
  const res = await fetch(`${API_BASE}/api/user/properties-sale/`);
  if (!res.ok) throw new Error("Error al cargar propiedades en venta");
  return res.json();
};

const fetchPropertySaleDetail = async (id: number): Promise<PropertySaleItem> => {
  const res = await fetch(`${API_BASE}/api/user/property-sale/${id}`);
  if (!res.ok) throw new Error("Error al cargar detalle de propiedad");
  return res.json();
};

interface ClientVentasProps {
  onBack: () => void;
}

const progressSteps = ["Registrar propiedad", "Aprobar estado", "Marketing", "Vendida"];

const MiniProgressBar = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center gap-1 mt-3">
    {progressSteps.map((_, i) => (
      <div
        key={i}
        className={`h-1.5 flex-1 rounded-full transition-colors ${
          i < currentStep ? "bg-emerald-500" : "bg-muted"
        }`}
      />
    ))}
  </div>
);

const FullProgressStepper = ({ currentStep }: { currentStep: number }) => (
  <div className="relative mb-8">
    {/* Background connector line */}
    <div className="absolute top-5 left-0 right-0 h-1 bg-muted/40 rounded-full mx-[12%]" />
    {/* Filled connector line */}
    <div
      className="absolute top-5 left-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full mx-[12%] transition-all duration-500"
      style={{ width: `${Math.max(0, ((currentStep) / (progressSteps.length - 1)) * 76)}%` }}
    />

    <div className="flex items-start justify-between relative">
      {progressSteps.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm ${
                done
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-200 shadow-md"
                  : active
                  ? "border-[3px] border-emerald-500 bg-background text-emerald-600 shadow-emerald-100 shadow-md animate-pulse"
                  : "border-2 border-muted bg-background text-muted-foreground"
              }`}
            >
              {done ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`text-[10px] sm:text-xs mt-2 text-center leading-tight max-w-[80px] ${
              done ? "text-emerald-600 font-semibold" : active ? "text-emerald-600 font-semibold" : "text-muted-foreground"
            }`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const ClientVentas = ({ onBack }: ClientVentasProps) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: ventasData, isLoading: ventasLoading } = useQuery({
    queryKey: ["properties-sale"],
    queryFn: () => fetchPropertiesSale().catch(() => DEFAULT_VENTAS_RESPONSE),
  });

  const defaultDetail = DEFAULT_VENTAS_RESPONSE.properties?.find((p) => p.id === selectedPropertyId);
  const { data: detailData, isLoading: detailLoading } = useQuery({
    queryKey: ["property-sale", selectedPropertyId],
    queryFn: () => fetchPropertySaleDetail(selectedPropertyId!).catch(() => defaultDetail!),
    enabled: !!selectedPropertyId,
  });

  const ventasList = Array.isArray(ventasData) ? ventasData : (ventasData?.properties ?? []) as PropertySaleItem[];
  const ventasSummary = !Array.isArray(ventasData) && ventasData ? ventasData : null;
  const selectedProperty = selectedPropertyId
    ? (detailData ?? ventasList.find((p) => p.id === selectedPropertyId))
    : null;

  // Detail View
  if (selectedPropertyId && selectedProperty) {
    const prop = selectedProperty as PropertySaleItem;
    const isPublished = prop.status === "Publicada";
    const trendStr = prop.trend != null ? (prop.trend >= 0 ? `+${prop.trend}% visitas` : `${prop.trend}% visitas`) : "";

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedPropertyId(null)}
          className="flex items-center gap-2 text-sm text-foreground/60 hover:text-champagne-gold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver a Mis Propiedades
        </button>

        <h1 className="text-2xl font-bold text-midnight">{prop.title}</h1>

        {/* Progress Stepper */}
        <Card className="border border-border/20 rounded-2xl">
          <CardContent className="p-6">
            <FullProgressStepper currentStep={prop.progressStep} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Info */}
          <Card className="border border-border/20 rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-midnight mb-4">Información de la Propiedad</h2>
              <div className="space-y-4">
                {[
                  { label: "Tipo", value: prop.type },
                  { label: "Ubicación", value: prop.address },
                  { label: "Metros cuadrados", value: `${prop.sqm} m²` },
                  { label: "Recámaras", value: String(prop.bedrooms) },
                  { label: "Baños", value: String(prop.bathrooms) },
                  { label: "Precio", value: prop.price },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/10 last:border-0">
                    <span className="text-sm text-foreground/60">{item.label}</span>
                    <span className="text-sm font-medium text-midnight">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Data - only if published */}
          {isPublished && (
            <Card className="border border-border/20 rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-midnight mb-4">Datos de Venta</h2>
                <div className="space-y-4">
                  {[
                    { label: "Nombre", value: prop.title },
                    { label: "Ubicación", value: prop.address },
                    { label: "Precio", value: prop.price },
                    { label: "Visitas", value: String(prop.views) },
                    { label: "Días publicada", value: `${prop.daysListed} días` },
                    { label: "Tendencia", value: trendStr },
                    { label: "Interesados", value: String(prop.interested) },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/10 last:border-0">
                      <span className="text-sm text-foreground/60">{item.label}</span>
                      <span className={`text-sm font-medium ${item.label === "Tendencia" ? "text-emerald-600" : "text-midnight"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-foreground/60 hover:text-champagne-gold transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al Dashboard
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-midnight">Mis Propiedades en Venta</h1>
          <p className="text-sm text-foreground/60 mt-1">
            {ventasLoading ? "Cargando..." : `${ventasList.length} propiedades activas`}
          </p>
        </div>
        <Button variant="gold" size="sm" onClick={() => setIsFormOpen(true)}>
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
        {ventasLoading ? (
          <p className="text-sm text-foreground/50">Cargando propiedades...</p>
        ) : (
          ventasList.map((prop) => {
          const isPublished = prop.status === "Publicada";
          return (
            <Card
              key={prop.id}
              className="border border-border/20 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPropertyId(prop.id)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 h-40 sm:h-auto bg-muted/30 relative flex-shrink-0">
                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                    <Badge className={`absolute top-3 left-3 text-xs ${isPublished ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700"}`}>
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

                    {isPublished ? (
                      /* Published stats */
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
                        <div className="ml-auto">
                          <Button variant="outline" size="sm" className="text-xs border-champagne-gold/30 text-champagne-gold hover:bg-champagne-gold/5" onClick={(e) => e.stopPropagation()}>
                            Editar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* En revisión – mini progress bar */
                      <div className="mt-4 pt-4 border-t border-border/10">
                        <p className="text-xs text-foreground/50 mb-1">Progreso de revisión</p>
                        <MiniProgressBar currentStep={prop.progressStep} />
                        <div className="flex justify-between mt-2">
                          {progressSteps.map((s, i) => (
                            <span key={i} className={`text-[9px] ${i < prop.progressStep ? "text-emerald-600" : "text-muted-foreground"}`}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
        )}
      </div>

      {/* Add Property Form */}
      <SellerLeadForm open={isFormOpen} onOpenChange={setIsFormOpen} mode="add" />
    </div>
  );
};

export default ClientVentas;
