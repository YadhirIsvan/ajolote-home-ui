import { useRef, useState } from "react";
import { Camera, Bookmark, Home, ShoppingCart, ChevronRight, Calculator, TrendingUp, BedDouble, Bath, Maximize, Phone, RefreshCw, Briefcase, MapPin, CreditCard, CalendarCheck, Calendar, Clock, Settings } from "lucide-react";
import { getMediaUrl } from "@/shared/utils/media-url.utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useClientDashboard } from "@/myAccount/client/hooks/use-client-dashboard.client.hook";
import { useFinancialModal } from "@/shared/hooks/financial-modal.context";
import { useAuth } from "@/shared/hooks/use-auth.hook";
import { getLoanTypeLabel } from "@/myAccount/client/actions/get-client-financial-profile.actions";
import { updateClientProfileFieldAction } from "@/myAccount/client/actions/get-client-profile-detail.actions";
import { clientApi } from "@/myAccount/client/api/client.api";
import ProfileFieldModal from "./ProfileFieldModal";
import type { PropertySaleItem, PropertyBuySummary, ClientProfileDetail, ClientAppointment } from "@/myAccount/client/types/client.types";

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
  onNavigateCitas?: () => void;
  onNavigateConfig?: () => void;
}

const ClientDashboard = ({ onNavigateVentas, onNavigateCompras, onNavigateCitas, onNavigateConfig }: ClientDashboardProps) => {
  const navigate = useNavigate();
  const { openFinancialModal } = useFinancialModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const userName = user ? `${user.first_name} ${user.last_name}`.trim() || user.email : "";
  const userInitial = (user?.first_name?.[0] || user?.email?.[0] || "?").toUpperCase();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) return;
    // Preview inmediato con blob local
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
    try {
      const { data } = await clientApi.uploadAvatar(file);
      URL.revokeObjectURL(previewUrl);
      setAvatarUrl(getMediaUrl(data.avatar_medium ?? data.avatar));
      queryClient.invalidateQueries({ queryKey: ["client-user-profile"] });
    } catch {
      URL.revokeObjectURL(previewUrl);
      setAvatarUrl(null);
    }
  };

  const {
    ventasList,
    ventasLoading,
    comprasList,
    comprasLoading,
    savedProperties,
    savedLoading,
    financialProfile,
    financialLoading,
    clientProfile,
    clientProfileLoading,
    userAvatar,
    appointmentsList,
    appointmentsLoading,
  } = useClientDashboard();

  const displayAvatar = avatarUrl || userAvatar;

  const [modalField, setModalField] = useState<{
    key: keyof ClientProfileDetail;
    title: string;
    description: string;
    icon: React.ReactNode;
  } | null>(null);
  const [modalValue, setModalValue] = useState("");

  const profileFields: {
    key: keyof ClientProfileDetail;
    label: string;
    icon: React.ReactNode;
    title: string;
    description: string;
  }[] = [
    { key: "occupation", label: "Ocupación", icon: <Briefcase className="w-5 h-5 text-[hsl(var(--champagne-gold))]" />, title: "¿A qué te dedicas?", description: "Esto nos ayuda a conectarte con las mejores opciones de crédito para tu perfil." },
    { key: "residence_location", label: "Ubicación", icon: <MapPin className="w-5 h-5 text-[hsl(var(--champagne-gold))]" />, title: "¿En qué zona buscas propiedad?", description: "Cuéntanos tu ciudad o zona preferida para encontrar opciones cerca de ti." },
    { key: "desired_credit_type", label: "Tipo de crédito", icon: <CreditCard className="w-5 h-5 text-[hsl(var(--champagne-gold))]" />, title: "¿Qué tipo de crédito te interesa?", description: "Infonavit, bancario, cofinanciamiento, conyugal... elige el que mejor se adapte." },
    { key: "desired_property_type", label: "Tipo de propiedad", icon: <Home className="w-5 h-5 text-[hsl(var(--champagne-gold))]" />, title: "¿Qué tipo de propiedad buscas?", description: "Casa, departamento, terreno, local comercial... dinos qué tienes en mente." },
  ];

  const completedCount = clientProfile
    ? profileFields.filter((f) => clientProfile[f.key]?.trim()).length
    : 0;

  const updateFieldMutation = useMutation({
    mutationFn: ({ field, value }: { field: string; value: string }) =>
      updateClientProfileFieldAction(field, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-profile-detail"] });
      setModalField(null);
    },
  });

  const openFieldModal = (field: typeof profileFields[number]) => {
    setModalField({ key: field.key, title: field.title, description: field.description, icon: field.icon });
    setModalValue(clientProfile?.[field.key] ?? "");
  };

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const handleAvatarClick = () => {
    if (displayAvatar) {
      setShowAvatarMenu((prev) => !prev);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleDeleteAvatar = async () => {
    setShowAvatarMenu(false);
    setAvatarUrl(null);
    try {
      await clientApi.updateProfile({ avatar: "" });
      queryClient.invalidateQueries({ queryKey: ["client-user-profile"] });
    } catch { /* silent */ }
  };

  const progressPercent = (completedCount / profileFields.length) * 100;
  const ringRadius = 62;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (progressPercent / 100) * ringCircumference;

  return (
    <div className="space-y-6">
      {/* Profile Avatar Header with Progress Ring */}
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="relative">
          {/* SVG progress ring around avatar */}
          <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]" viewBox="0 0 136 136">
            {/* Track */}
            <circle cx="68" cy="68" r={ringRadius} fill="none" stroke="hsl(var(--border))" strokeWidth="3" opacity="0.3" />
            {/* Progress */}
            <circle
              cx="68" cy="68" r={ringRadius} fill="none"
              stroke="hsl(var(--champagne-gold))"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
              className="transition-all duration-700 ease-out"
              transform="rotate(-90 68 68)"
            />
          </svg>

          <div
            className="relative w-32 h-32 rounded-full cursor-pointer group"
            onClick={handleAvatarClick}
          >
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[hsl(var(--champagne-gold))]/20 to-[hsl(var(--champagne-gold))]/10 flex items-center justify-center">
                <span className="text-4xl font-bold text-[hsl(var(--champagne-gold))]">{userInitial}</span>
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { handleAvatarChange(e); setShowAvatarMenu(false); }}
          />
          {showAvatarMenu && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-lg border border-border/30 py-1 z-50 min-w-[160px]">
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-midnight hover:bg-muted/20 transition-colors"
                onClick={() => { setShowAvatarMenu(false); fileInputRef.current?.click(); }}
              >
                Cambiar foto
              </button>
              <button
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                onClick={handleDeleteAvatar}
              >
                Eliminar foto
              </button>
            </div>
          )}
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-midnight">{userName}</h2>
          {!clientProfileLoading && completedCount < profileFields.length && (
            <p className="text-xs text-[hsl(var(--champagne-gold))] font-medium mt-0.5">
              Completa tu perfil {completedCount}/{profileFields.length}
            </p>
          )}
          {(clientProfileLoading || completedCount >= profileFields.length) && (
            <p className="text-sm text-foreground/50">Cliente</p>
          )}
          {onNavigateConfig && (
            <button
              onClick={onNavigateConfig}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-foreground/60 hover:text-champagne-gold transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Configuración
            </button>
          )}
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
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 text-xs"
                    onClick={() => navigate("/comprar")}
                  >
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

        {/* Propiedades & Citas Section */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {comprasLoading ? "..." : comprasList.filter((p) => !["cerrado", "cancelado"].includes(p.status)).length} en proceso
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

          {/* Mis Citas */}
          <Card className="border border-border/30 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-violet-50">
                  <CalendarCheck className="w-5 h-5 text-violet-600" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet-50 text-violet-600">
                  {appointmentsLoading ? "..." : appointmentsList.length} citas
                </span>
              </div>
              <h3 className="text-lg font-semibold text-midnight mb-2">Mis Citas</h3>
              <p className="text-sm text-foreground/60 mb-4">
                Visitas agendadas a propiedades
              </p>
              <div className="space-y-2 mb-4">
                {appointmentsLoading ? (
                  <p className="text-sm text-foreground/50">Cargando...</p>
                ) : appointmentsList.length ? (
                  (appointmentsList as ClientAppointment[]).slice(0, 3).map((apt) => {
                    const d = new Date(apt.scheduled_date + "T00:00:00");
                    const dateStr = d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
                    const [h, m] = apt.scheduled_time.split(":");
                    const hour = parseInt(h, 10);
                    const timeStr = `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
                    return (
                      <div
                        key={apt.id}
                        className="flex items-center gap-3 p-2.5 bg-muted/20 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted/30">
                          {apt.property_image ? (
                            <img src={apt.property_image} alt={apt.property_title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-4 h-4 text-foreground/20" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-midnight font-medium truncate">{apt.property_title}</p>
                          <div className="flex items-center gap-2 text-xs text-foreground/45">
                            <span className="flex items-center gap-0.5">
                              <Calendar className="w-3 h-3" /> {dateStr}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3" /> {timeStr}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-foreground/50">No tienes citas agendadas</p>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full border-violet-200 text-violet-600 hover:bg-violet-50"
                onClick={onNavigateCitas}
              >
                Ver Citas
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Completa tu Perfil */}
      {!clientProfileLoading && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-midnight">Completa tu Perfil</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profileFields.map((field) => {
              const val = clientProfile?.[field.key]?.trim();
              const isCompleted = !!val;
              return (
                <button
                  key={field.key}
                  className={`group relative text-left w-full p-5 rounded-2xl border transition-all duration-300 cursor-pointer
                    ${isCompleted
                      ? "bg-white border-border/20 hover:border-[hsl(var(--champagne-gold))]/30 hover:shadow-md"
                      : "bg-[hsl(var(--champagne-gold))]/[0.03] border-dashed border-[hsl(var(--champagne-gold))]/25 hover:border-[hsl(var(--champagne-gold))]/50 hover:bg-[hsl(var(--champagne-gold))]/[0.06]"
                    }
                    hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]`}
                  onClick={() => openFieldModal(field)}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl shrink-0 transition-colors duration-300
                      ${isCompleted
                        ? "bg-[hsl(var(--champagne-gold))]/10 group-hover:bg-[hsl(var(--champagne-gold))]/20"
                        : "bg-[hsl(var(--champagne-gold))]/10 group-hover:bg-[hsl(var(--champagne-gold))]/15"
                      }`}
                    >
                      {field.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-midnight mb-0.5">{field.label}</p>
                      <p className={`text-sm truncate ${isCompleted ? "text-foreground/60" : "text-[hsl(var(--champagne-gold))]/70 font-medium"}`}>
                        {val || "Toca para completar"}
                      </p>
                    </div>
                    {isCompleted && (
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <ProfileFieldModal
        isOpen={!!modalField}
        onClose={() => setModalField(null)}
        title={modalField?.title ?? ""}
        description={modalField?.description ?? ""}
        value={modalValue}
        onChange={setModalValue}
        maxLength={200}
        onSave={() => {
          if (modalField) {
            updateFieldMutation.mutate({ field: modalField.key, value: modalValue });
          }
        }}
        isLoading={updateFieldMutation.isPending}
        icon={modalField?.icon}
      />
    </div>
  );
};

export default ClientDashboard;
