import { User, CreditCard, Home, ShoppingCart, Bell, ChevronRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

interface PropertySaleSummary {
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
}

interface PropertiesSaleResponse {
  propertiesAmount?: number;
  totalViews?: number;
  interestedAmount?: number;
  totalValue?: number;
  properties?: PropertySaleSummary[];
}

interface PropertyBuySummary {
  id: number;
  title: string;
  address: string;
  price: string;
  image: string;
  status: string;
  agent_name: string;
  overallProgress: string;
  processStage: string;
  fileNames: string[];
}

interface RecentActivityItem {
  name: string;
  descripction: string;
  time: number;
}

const DEFAULT_VENTAS_RESPONSE: PropertiesSaleResponse = {
  propertiesAmount: 2,
  totalViews: 209,
  interestedAmount: 11,
  totalValue: 7000000,
  properties: [
    { id: 1, title: "Casa en Querétaro", address: "Col. Juriquilla, Querétaro", price: "$4,200,000", status: "Publicada", views: 142, interested: 8, daysListed: 15, image: "/placeholder.svg", trend: 12, progressStep: 3 },
    { id: 2, title: "Departamento en CDMX", address: "Col. Roma Norte, CDMX", price: "$2,800,000", status: "En revisión", views: 0, interested: 0, daysListed: 5, image: "/placeholder.svg", trend: 0, progressStep: 1 },
  ],
};

const DEFAULT_COMPRAS: PropertyBuySummary[] = [
  { id: 1, title: "Casa en Polanco", address: "Col. Polanco, CDMX", price: "$12,500,000", image: "/placeholder.svg", status: "En proceso", agent_name: "María López", overallProgress: "50%", processStage: "Documentos verificados", fileNames: [] },
];

const DEFAULT_ACTIVITY: RecentActivityItem[] = [
  { name: "Score Legal Generado", descripction: "Casa en Querétaro - Score: 98/100", time: 2 },
  { name: "Crédito Pre-aprobado", descripction: "Monto: $8,500,000 MXN", time: 5 },
  { name: "Propiedad Agregada", descripction: "Departamento en CDMX", time: 7 },
];

const fetchPropertiesSale = async (): Promise<PropertiesSaleResponse> => {
  const res = await fetch(`${API_BASE}/api/user/properties-sale/`);
  if (!res.ok) throw new Error("Error al cargar propiedades en venta");
  return res.json();
};

const fetchPropertiesBuys = async (): Promise<PropertyBuySummary[]> => {
  const res = await fetch(`${API_BASE}/api/user/properties-buys/`);
  if (!res.ok) throw new Error("Error al cargar compras en proceso");
  return res.json();
};

const fetchRecentActivity = async (): Promise<RecentActivityItem[]> => {
  const res = await fetch(`${API_BASE}/api/user/recent-activity`);
  if (!res.ok) throw new Error("Error al cargar actividad reciente");
  return res.json();
};

interface ClientDashboardProps {
  onLogout: () => void;
  onNavigateVentas?: () => void;
  onNavigateCompras?: () => void;
}

const ClientDashboard = ({ onLogout, onNavigateVentas, onNavigateCompras }: ClientDashboardProps) => {
  const navigate = useNavigate();

  const { data: ventasData, isLoading: ventasLoading } = useQuery({
    queryKey: ["properties-sale"],
    queryFn: () => fetchPropertiesSale().catch(() => DEFAULT_VENTAS_RESPONSE),
  });

  const { data: comprasData, isLoading: comprasLoading } = useQuery({
    queryKey: ["properties-buys"],
    queryFn: () => fetchPropertiesBuys().catch(() => DEFAULT_COMPRAS),
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => fetchRecentActivity().catch(() => DEFAULT_ACTIVITY),
  });

  const ventasList = Array.isArray(ventasData) ? ventasData : ventasData?.properties ?? [];
  const ventasSummary = !Array.isArray(ventasData) ? ventasData : null;
  const comprasList = Array.isArray(comprasData) ? comprasData : [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-champagne-gold/5 to-transparent rounded-2xl border border-champagne-gold/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-champagne-gold/20 flex items-center justify-center">
            <User className="w-6 h-6 text-champagne-gold" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-midnight">¡Bienvenido de nuevo!</h2>
            <p className="text-sm text-foreground/60">Gestiona tu cuenta y propiedades</p>
          </div>
        </div>
      </div>

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score de Crédito */}
        <Card className="border-champagne-gold/20 bg-gradient-to-br from-champagne-gold/5 via-white to-champagne-gold/10 shadow-sm hover:shadow-lg transition-all rounded-2xl overflow-hidden group cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-champagne-gold/20">
                <TrendingUp className="w-5 h-5 text-champagne-gold" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Pre-aprobado</span>
            </div>
            <h3 className="text-lg font-semibold text-midnight mb-1">Mi Score de Crédito</h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-champagne-gold">750</span>
              <span className="text-sm text-foreground/60">/ 850</span>
            </div>
            <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-champagne-gold to-champagne-gold-dark rounded-full" style={{ width: "88%" }}></div>
            </div>
            <p className="text-sm text-foreground/60 mb-4">
              Monto pre-aprobado: <span className="font-semibold text-midnight">$8,500,000 MXN</span>
            </p>
            <Button variant="gold" className="w-full group-hover:shadow-md transition-shadow" onClick={() => navigate("/credito")}>
              Ver Detalles
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card className="border border-border/30 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-midnight mb-4">Actividad Reciente</h3>
            <div className="space-y-3">
              {activityLoading ? (
                <p className="text-sm text-foreground/50">Cargando...</p>
              ) : activityData?.length ? (
                activityData.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      i === 0 ? "bg-gradient-to-r from-champagne-gold/5 to-transparent border-champagne-gold/10" : "bg-muted/10 border-border/10"
                    }`}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${i === 0 ? "bg-champagne-gold/10" : "bg-muted/30"}`}>
                      <CreditCard className={`w-4 h-4 ${i === 0 ? "text-champagne-gold" : "text-foreground/60"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-midnight text-sm">{item.name}</p>
                      <p className="text-xs text-foreground/50 truncate">{item.descripction}</p>
                    </div>
                    <span className="text-xs text-foreground/40 whitespace-nowrap">
                      {item.time === 1 ? "1 día" : item.time < 7 ? `${item.time} días` : `${Math.floor(item.time / 7)} sem`}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-foreground/50">No hay actividad reciente</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Propiedades Section */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* En Venta */}
          <Card className="border border-border/30 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-blue-50">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                  {ventasLoading ? "..." : ventasList.length} activas
                </span>
              </div>
              <h3 className="text-lg font-semibold text-midnight mb-2">En Venta</h3>
              <p className="text-sm text-foreground/60 mb-4">Propiedades que estás vendiendo actualmente</p>
              <div className="space-y-2 mb-4">
                {ventasLoading ? (
                  <p className="text-sm text-foreground/50">Cargando...</p>
                ) : ventasList.length ? (
                  (ventasList as PropertySaleSummary[]).slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2.5 bg-muted/20 rounded-lg text-sm">
                      <span className="text-midnight truncate">{p.title}</span>
                      <span className="text-champagne-gold font-medium shrink-0 ml-2">{p.price}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground/50">No tienes propiedades en venta</p>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={onNavigateVentas}
              >
                Gestionar Propiedades
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Proceso de Compra */}
          <Card className="border border-border/30 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-50">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  {comprasLoading ? "..." : comprasList.length} en proceso
                </span>
              </div>
              <h3 className="text-lg font-semibold text-midnight mb-2">Proceso de Compra</h3>
              <p className="text-sm text-foreground/60 mb-4">Propiedades que estás adquiriendo</p>
              <div className="space-y-2 mb-4">
                {comprasLoading ? (
                  <p className="text-sm text-foreground/50">Cargando...</p>
                ) : comprasList.length ? (
                  comprasList.slice(0, 2).map((p) => {
                    const progressNum = parseInt(p.overallProgress?.replace(/%/g, "") || "0", 10);
                    return (
                      <div key={p.id} className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-midnight font-medium truncate">{p.title}</span>
                          <span className="text-champagne-gold font-medium text-sm shrink-0 ml-2">{p.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressNum}%` }}></div>
                          </div>
                          <span className="text-xs text-foreground/50">{p.overallProgress}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-foreground/50">No tienes compras en proceso</p>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                onClick={onNavigateCompras}
              >
                Ver Estado
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
