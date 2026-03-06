import { User, Bookmark, Home, ShoppingCart, ChevronRight, Calculator, TrendingUp, BedDouble, Bath, Maximize, Phone, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useClientDashboard } from "@/myAccount/client/hooks/use-client-dashboard.hook";
import { useFinancialModal } from "@/contexts/FinancialModalContext";
import { getLoanTypeLabel } from "@/myAccount/client/actions/get-client-financial-profile.actions";
import type { PropertySaleItem, PropertyBuySummary } from "@/myAccount/client/types/client.types";

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

interface ClientDashboardProps {
  onLogout: () => void;
  onNavigateVentas?: () => void;
  onNavigateCompras?: () => void;
}

const ClientDashboard = ({ onNavigateVentas, onNavigateCompras }: ClientDashboardProps) => {
  const navigate = useNavigate();
  const { openFinancialModal } = useFinancialModal();
  const {
    ventasList,
    ventasLoading,
    comprasList,
    comprasLoading,
    savedProperties,
    savedLoading,
    financialProfile,
    financialLoading,
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
        {/* Mi Presupuesto de Crédito */}
        <Card className="border-champagne-gold/20 bg-gradient-to-br from-champagne-gold/5 via-white to-champagne-gold/10 shadow-sm hover:shadow-lg transition-all rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            {financialLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-foreground/50">Cargando...</p>
              </div>
            ) : financialProfile ? (
              /* --- TIENE PERFIL FINANCIERO --- */
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-champagne-gold/20">
                    <TrendingUp className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Pre-aprobado</span>
                </div>

                <h3 className="text-lg font-semibold text-midnight mb-1">Mi Presupuesto Estimado</h3>

                <p className="text-3xl font-bold text-champagne-gold mb-1">
                  {formatPrice(financialProfile.calculatedBudget)}
                </p>
                <p className="text-xs text-foreground/40 mb-4">MXN</p>

                <Separator className="mb-4" />

                {/* Detalle del tipo de crédito */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">Tipo de crédito</span>
                    <span className="font-medium text-midnight text-right text-xs max-w-[60%] truncate">
                      {getLoanTypeLabel(financialProfile.loanType)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">Ingreso mensual</span>
                    <span className="font-medium text-midnight">{formatPrice(financialProfile.monthlyIncome)}</span>
                  </div>
                  {financialProfile.partnerMonthlyIncome && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/60">Ingreso pareja</span>
                      <span className="font-medium text-midnight">{formatPrice(financialProfile.partnerMonthlyIncome)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">Ahorro disponible</span>
                    <span className="font-medium text-midnight">{formatPrice(financialProfile.savingsForEnganche)}</span>
                  </div>
                </div>

                {/* CTA contacto */}
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 mb-4">
                  <p className="text-xs text-blue-800">
                    ¿Quieres asesoría personalizada? Un agente puede ayudarte a encontrar la propiedad ideal dentro de tu presupuesto.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full border-blue-300 text-blue-700 hover:bg-blue-100 text-xs"
                    onClick={() => navigate("/comprar")}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Explorar Propiedades
                  </Button>
                </div>

                {/* Recalcular */}
                <button
                  onClick={openFinancialModal}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-champagne-gold hover:text-champagne-gold-dark hover:bg-champagne-gold/5 rounded-lg transition-colors py-2 px-4"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Recalcular con otros datos
                </button>
              </>
            ) : (
              /* --- NO TIENE PERFIL FINANCIERO --- */
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-champagne-gold/20">
                    <Calculator className="w-5 h-5 text-champagne-gold" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-midnight mb-2">Mi Presupuesto de Crédito</h3>

                <p className="text-sm text-foreground/60 mb-4">
                  Descubre cuánto puedes comprar. Calcula tu presupuesto estimado en menos de 2 minutos y encuentra la propiedad perfecta para ti.
                </p>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-4">
                  <p className="text-xs text-amber-800 font-medium mb-1">¿Por qué calcular tu presupuesto?</p>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>- Sabrás exactamente cuánto puedes financiar</li>
                    <li>- Podrás filtrar propiedades dentro de tu rango</li>
                    <li>- Un agente podrá asesorarte mejor</li>
                  </ul>
                </div>

                <Button
                  variant="gold"
                  className="w-full"
                  onClick={openFinancialModal}
                >
                  Calcular mi Presupuesto
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Propiedades Guardadas */}
        <Card className="border border-border/30 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-champagne-gold" />
                <h3 className="text-lg font-semibold text-midnight">Propiedades Guardadas</h3>
              </div>
              {!savedLoading && savedProperties.length > 0 && (
                <span className="text-xs text-foreground/40">{savedProperties.length} guardadas</span>
              )}
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {savedLoading ? (
                <p className="text-sm text-foreground/50">Cargando...</p>
              ) : savedProperties.length ? (
                savedProperties.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl border bg-muted/10 border-border/10 cursor-pointer hover:bg-champagne-gold/5 hover:border-champagne-gold/20 transition-colors"
                    onClick={() => navigate(`/propiedad/${item.propertyId}`)}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted/30">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-5 h-5 text-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-midnight text-sm truncate">{item.title}</p>
                      <p className="text-xs text-foreground/50 truncate">{item.address}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-foreground/40 flex items-center gap-0.5">
                          <BedDouble className="w-3 h-3" /> {item.bedrooms}
                        </span>
                        <span className="text-xs text-foreground/40 flex items-center gap-0.5">
                          <Bath className="w-3 h-3" /> {item.bathrooms}
                        </span>
                        {item.constructionSqm && (
                          <span className="text-xs text-foreground/40 flex items-center gap-0.5">
                            <Maximize className="w-3 h-3" /> {item.constructionSqm}m²
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-champagne-gold whitespace-nowrap">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-foreground/50">No tienes propiedades guardadas</p>
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
                        {formatPrice(p.price)}
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
                            {formatPrice(p.price)}
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
