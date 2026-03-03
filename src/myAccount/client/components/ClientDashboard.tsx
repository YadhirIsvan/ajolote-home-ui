import { User, CreditCard, Home, ShoppingCart, ChevronRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useClientDashboard } from "@/myAccount/client/hooks/use-client-dashboard.hook";
import type { PropertySaleItem, PropertyBuySummary } from "@/myAccount/client/types/client.types";

interface ClientDashboardProps {
  onLogout: () => void;
  onNavigateVentas?: () => void;
  onNavigateCompras?: () => void;
}

const ClientDashboard = ({ onNavigateVentas, onNavigateCompras }: ClientDashboardProps) => {
  const navigate = useNavigate();
  const {
    ventasList,
    ventasLoading,
    comprasList,
    comprasLoading,
    activityData,
    activityLoading,
  } = useClientDashboard();

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
              <div
                className="h-full bg-gradient-to-r from-champagne-gold to-champagne-gold-dark rounded-full"
                style={{ width: "88%" }}
              />
            </div>
            <p className="text-sm text-foreground/60 mb-4">
              Monto pre-aprobado:{" "}
              <span className="font-semibold text-midnight">$8,500,000 MXN</span>
            </p>
            <Button
              variant="gold"
              className="w-full group-hover:shadow-md transition-shadow"
              onClick={() => navigate("/credito")}
            >
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
              ) : activityData.length ? (
                activityData.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      i === 0
                        ? "bg-gradient-to-r from-champagne-gold/5 to-transparent border-champagne-gold/10"
                        : "bg-muted/10 border-border/10"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${i === 0 ? "bg-champagne-gold/10" : "bg-muted/30"}`}
                    >
                      <CreditCard
                        className={`w-4 h-4 ${i === 0 ? "text-champagne-gold" : "text-foreground/60"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-midnight text-sm">{item.name}</p>
                      <p className="text-xs text-foreground/50 truncate">{item.description}</p>
                    </div>
                    <span className="text-xs text-foreground/40 whitespace-nowrap">
                      {item.time === 1
                        ? "1 día"
                        : item.time < 7
                        ? `${item.time} días`
                        : `${Math.floor(item.time / 7)} sem`}
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
              <p className="text-sm text-foreground/60 mb-4">
                Propiedades que estás vendiendo actualmente
              </p>
              <div className="space-y-2 mb-4">
                {ventasLoading ? (
                  <p className="text-sm text-foreground/50">Cargando...</p>
                ) : ventasList.length ? (
                  (ventasList as PropertySaleItem[]).slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 bg-muted/20 rounded-lg text-sm"
                    >
                      <span className="text-midnight truncate">{p.title}</span>
                      <span className="text-champagne-gold font-medium shrink-0 ml-2">
                        {p.price}
                      </span>
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
                  (comprasList as PropertyBuySummary[]).slice(0, 2).map((p) => {
                    const progressNum = Math.min(p.overallProgress || 0, 100);
                    return (
                      <div key={p.id} className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-midnight font-medium truncate">
                            {p.title}
                          </span>
                          <span className="text-champagne-gold font-medium text-sm shrink-0 ml-2">
                            {p.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${progressNum}%` }}
                            />
                          </div>
                          <span className="text-xs text-foreground/50">
                            {p.overallProgress}
                          </span>
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
