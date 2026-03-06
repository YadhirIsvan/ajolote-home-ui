import { ArrowLeft, Home, MapPin, Eye, Calendar, TrendingUp, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SellerLeadForm from "@/sell/components/SellerLeadForm";
import { useClientVentas } from "@/myAccount/client/hooks/use-client-ventas.hook";
import type { PropertySaleItem } from "@/myAccount/client/types/client.types";

interface ClientVentasProps {
  onBack: () => void;
}

const progressSteps = ["Registrar propiedad", "Aprobar estado", "Marketing", "Vendida"];

const formatPrice = (price: string | number | undefined): string => {
  if (!price) return "$0";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const getClientVisibleStatusLabel = (status: 'registrar_propiedad' | 'aprobar_estado' | 'marketing' | 'vendida'): string => {
  const labels: Record<'registrar_propiedad' | 'aprobar_estado' | 'marketing' | 'vendida', string> = {
    'registrar_propiedad': 'Registrar propiedad',
    'aprobar_estado': 'Aprobar estado',
    'marketing': 'Marketing',
    'vendida': 'Vendida',
  };
  return labels[status];
};

const getStatusBadgeColor = (status: 'registrar_propiedad' | 'aprobar_estado' | 'marketing' | 'vendida') => {
  switch (status) {
    case 'vendida':
      return 'bg-emerald-500 text-white';
    case 'marketing':
      return 'bg-blue-500 text-white';
    case 'aprobar_estado':
      return 'bg-yellow-500 text-white';
    case 'registrar_propiedad':
    default:
      return 'bg-amber-100 text-amber-700';
  }
};

const getProgressStepIndex = (status: 'registrar_propiedad' | 'aprobar_estado' | 'marketing' | 'vendida'): number => {
  const map: Record<'registrar_propiedad' | 'aprobar_estado' | 'marketing' | 'vendida', number> = {
    'registrar_propiedad': 0,
    'aprobar_estado': 1,
    'marketing': 2,
    'vendida': 3,
  };
  return map[status];
};

const MiniProgressBar = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center gap-1 mt-3">
    {progressSteps.map((_, i) => (
      <div
        key={i}
        className={`h-1.5 flex-1 rounded-full transition-colors ${
          i <= currentStep ? "bg-emerald-500" : "bg-muted"
        }`}
      />
    ))}
  </div>
);

const FullProgressStepper = ({ currentStep }: { currentStep: number }) => (
  <div className="relative mb-8">
    <div className="absolute top-5 left-0 right-0 h-1 bg-muted/40 rounded-full mx-[12%]" />
    <div
      className="absolute top-5 left-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full mx-[12%] transition-all duration-500"
      style={{
        width: `${Math.max(0, (currentStep / (progressSteps.length - 1)) * 76)}%`,
      }}
    />
    <div className="flex items-start justify-between relative">
      {progressSteps.map((label, i) => {
        const done = i <= currentStep;
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-[10px] sm:text-xs mt-2 text-center leading-tight max-w-[80px] ${
                done || active ? "text-emerald-600 font-semibold" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const ClientVentas = ({ onBack }: ClientVentasProps) => {
  const {
    ventasList,
    ventasLoading,
    selectedPropertyId,
    setSelectedPropertyId,
    selectedProperty,
    isFormOpen,
    setIsFormOpen,
    refetchAll,
  } = useClientVentas();

  if (selectedPropertyId && selectedProperty) {
    const prop = selectedProperty as PropertySaleItem;
    const isPublished = prop.status === "Publicada";
    const trendStr =
      prop.trend != null
        ? prop.trend >= 0
          ? `+${prop.trend}% visitas`
          : `${prop.trend}% visitas`
        : "";
    const progressIndex = getProgressStepIndex(prop.client_visible_status);

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

        <Card className="border border-border/20 rounded-2xl">
          <CardContent className="p-6">
            <FullProgressStepper currentStep={progressIndex} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-border/20 rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-midnight mb-4">
                Información de la Propiedad
              </h2>
              <div className="space-y-4">
                {[
                  { 
                    label: "Ubicación", 
                    value: [
                      prop.address_street && prop.address_number && `${prop.address_street} ${prop.address_number}`,
                      prop.address_neighborhood && `Col. ${prop.address_neighborhood}`,
                      prop.city?.name,
                    ].filter(Boolean).join(', ') || prop.address || 'N/A'
                  },
                  { 
                    label: "Metros cuadrados", 
                    value: prop.construction_sqm ? `${prop.construction_sqm} m²` : (prop.land_sqm ? `${prop.land_sqm} m²` : 'N/A')
                  },
                  { label: "Recámaras", value: String(prop.bedrooms ?? 'N/A') },
                  { label: "Baños", value: String(prop.bathrooms ?? 'N/A') },
                  { label: "Precio", value: formatPrice(prop.price) },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-2 border-b border-border/10 last:border-0"
                  >
                    <span className="text-sm text-foreground/60">{item.label}</span>
                    <span className="text-sm font-medium text-midnight">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {isPublished && (
            <Card className="border border-border/20 rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-midnight mb-4">Datos de Venta</h2>
                <div className="space-y-4">
                  {[
                    { label: "Nombre", value: prop.title },
                    { label: "Ubicación", value: prop.address ?? 'N/A' },
                    { label: "Precio", value: formatPrice(prop.price) },
                    { label: "Visitas", value: String(prop.views ?? 0) },
                    { label: "Días publicada", value: `${prop.daysListed ?? 0} días` },
                    { label: "Tendencia", value: trendStr },
                    { label: "Interesados", value: String(prop.interested ?? 0) },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-2 border-b border-border/10 last:border-0"
                    >
                      <span className="text-sm text-foreground/60">{item.label}</span>
                      <span
                        className={`text-sm font-medium ${
                          item.label === "Tendencia" ? "text-emerald-600" : "text-midnight"
                        }`}
                      >
                        {item.value}
                      </span>
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

      {/* Summary Stats - COMENTADO POR AHORA */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
      </div> */}

      {/* Property Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-midnight">Mis Propiedades</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchAll()}
            className="gap-2 border-champagne-gold/30 hover:border-champagne-gold hover:bg-champagne-gold/5"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
        </div>
        <div>
        {ventasLoading ? (
          <p className="text-sm text-foreground/50">Cargando propiedades...</p>
        ) : (
          ventasList.map((prop) => {
            const clientVisibleStatus = prop.client_visible_status;
            const isVendida = clientVisibleStatus === 'vendida';
            const progressIndex = getProgressStepIndex(clientVisibleStatus);
            return (
              <Card
                key={prop.id}
                className="border border-border/20 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPropertyId(prop.id)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-40 sm:h-auto bg-muted/30 relative flex-shrink-0">
                      <img
                        src={prop.image || "https://via.placeholder.com/400x300?text=Propiedad"}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Sin+Imagen";
                        }}
                      />
                      <Badge
                        className={`absolute top-3 left-3 text-xs ${getStatusBadgeColor(clientVisibleStatus)}`}
                      >
                        {getClientVisibleStatusLabel(clientVisibleStatus)}
                      </Badge>
                    </div>

                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-midnight">{prop.title}</h3>
                          <div className="flex items-center gap-1.5 text-sm text-foreground/50 mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {prop.address}
                          </div>
                        </div>
                        <span className="text-xl font-bold text-champagne-gold">{formatPrice(prop.price)}</span>
                      </div>

                      {isVendida ? (
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs border-champagne-gold/30 text-champagne-gold hover:bg-champagne-gold/5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Editar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 pt-4 border-t border-border/10">
                          <p className="text-xs text-foreground/50 mb-1">Progreso de revisión</p>
                          <MiniProgressBar currentStep={progressIndex} />
                          <div className="flex justify-between mt-2">
                            {progressSteps.map((s, i) => (
                              <span
                                key={i}
                                className={`text-[9px] ${
                                  i < progressIndex
                                    ? "text-emerald-600"
                                    : "text-muted-foreground"
                                }`}
                              >
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
      </div>

      <SellerLeadForm open={isFormOpen} onOpenChange={setIsFormOpen} mode="add" />
    </div>
  );
};

export default ClientVentas;
