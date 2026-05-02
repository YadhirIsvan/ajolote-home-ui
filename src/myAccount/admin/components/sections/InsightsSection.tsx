import {
  DollarSign,
  TrendingUp,
  Clock,
  Home,
  BarChart3,
  PieChart,
  MapPin,
  Trophy,
  Download,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useIsMobile } from "@/shared/hooks/use-mobile.hook";
import { cn } from "@/lib/utils";
import { useAdminInsights } from "@/myAccount/admin/hooks/use-admin-insights.admin.hook";

const PIE_COLORS = ["#C5A059", "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

const InsightsSection = () => {
  const isMobile = useIsMobile();
  const { period, setPeriod, insightsQuery, insights } = useAdminInsights();

  const monthlySalesData = (insights?.salesByMonth ?? []).map((m) => ({
    month: m.month,
    ventas: m.count,
    valor: Number(m.totalAmount) / 1_000_000,
  }));

  const propertyTypeData = (insights?.distributionByType ?? []).map((t, i) => ({
    name: t.propertyType,
    value: t.count,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const maxZoneSales = Math.max(1, ...(insights?.activityByZone ?? []).map((z) => z.sales));
  const zoneHeatMapData = (insights?.activityByZone ?? []).map((z) => ({
    zone: z.zone,
    sales: z.sales,
    value: z.leads,
    intensity: Math.round((z.sales / maxZoneSales) * 100),
  }));

  const topAgents = (insights?.topAgents ?? []).map((a) => ({
    name: a.name,
    sales: a.salesCount,
    volume: a.score,
    commission: "",
    avatar: a.name.charAt(0).toUpperCase(),
  }));

  const summary = insights?.summary;
  const stats = {
    totalVolume: summary?.totalRevenue
      ? `$${Number(summary.totalRevenue).toLocaleString("es-MX")}`
      : "$0",
    avgTicket: summary?.totalSales && summary.totalSales > 0 && summary.totalRevenue
      ? `$${Math.round(Number(summary.totalRevenue) / summary.totalSales).toLocaleString("es-MX")}`
      : "$0",
    avgDaysToSell: 0,
    totalCommissions: "$0",
    totalProperties: summary?.totalProperties ?? 0,
    activeLeads: summary?.activeLeads ?? 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Ventas e Insights</h1>
          <p className="text-foreground/60">Análisis completo del rendimiento de ventas</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as InsightsPeriod)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
              <SelectItem value="all">Todo el Tiempo</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {isMobile ? "" : "Exportar Reporte"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-border/30 bg-gradient-to-br from-champagne-gold/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-champagne-gold/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-champagne-gold" />
              </div>
              <div>
                <p className="text-xs text-foreground/60">Volumen Total</p>
                <p className="text-lg md:text-xl font-bold text-midnight">{stats.totalVolume}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30 bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-foreground/60">Ticket Promedio</p>
                <p className="text-lg md:text-xl font-bold text-midnight">{stats.avgTicket}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-foreground/60">Leads Activos</p>
                <p className="text-lg md:text-xl font-bold text-midnight">{stats.activeLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-foreground/60">Ventas Totales</p>
                <p className="text-lg md:text-xl font-bold text-midnight">{summary?.totalSales ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30 bg-gradient-to-br from-orange-500/10 to-transparent col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Home className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-foreground/60">Total Propiedades</p>
                <p className="text-lg md:text-xl font-bold text-midnight">{stats.totalProperties}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {!isMobile && "Ventas Mensuales"}
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            {!isMobile && "Tipos de Inmueble"}
          </TabsTrigger>
          <TabsTrigger value="zones" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {!isMobile && "Mapa de Zonas"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card className="border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-midnight">
                <BarChart3 className="w-5 h-5 text-champagne-gold" />
                Ventas Mensuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {monthlySalesData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-foreground/40">
                    {insightsQuery.isLoading ? "Cargando..." : "Sin datos para este período"}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px"
                        }}
                        formatter={(value: number, name: string) => [
                          name === "ventas" ? `${value} propiedades` : `$${value.toFixed(1)}M`,
                          name === "ventas" ? "Ventas" : "Valor"
                        ]}
                      />
                      <Bar dataKey="ventas" fill="#C5A059" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types">
          <Card className="border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-midnight">
                <PieChart className="w-5 h-5 text-champagne-gold" />
                Tipos de Inmuebles Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {propertyTypeData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-foreground/40">
                    {insightsQuery.isLoading ? "Cargando..." : "Sin datos para este período"}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {propertyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones">
          <Card className="border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-midnight">
                <MapPin className="w-5 h-5 text-champagne-gold" />
                Mapa de Calor por Zona
              </CardTitle>
            </CardHeader>
            <CardContent>
              {zoneHeatMapData.length === 0 ? (
                <p className="text-center text-foreground/40 py-8">
                  {insightsQuery.isLoading ? "Cargando..." : "Sin datos para este período"}
                </p>
              ) : (
                <div className="space-y-3">
                  {zoneHeatMapData.map((zone, idx) => (
                    <div key={zone.zone} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-midnight">{zone.zone}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-foreground/60">{zone.sales} ventas</span>
                          <span className="font-semibold text-champagne-gold">{zone.value} leads</span>
                        </div>
                      </div>
                      <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            idx === 0 ? "bg-champagne-gold" :
                            idx === 1 ? "bg-champagne-gold/80" :
                            idx === 2 ? "bg-champagne-gold/60" :
                            "bg-champagne-gold/40"
                          )}
                          style={{ width: `${zone.intensity}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-midnight">
              <Trophy className="w-5 h-5 text-champagne-gold" />
              Top Vendedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topAgents.length === 0 ? (
              <p className="text-center text-foreground/40 py-4">
                {insightsQuery.isLoading ? "Cargando..." : "Sin datos"}
              </p>
            ) : (
              <div className="space-y-4">
                {topAgents.map((agent, idx) => (
                  <div
                    key={agent.name}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-xl transition-colors",
                      idx === 0 ? "bg-champagne-gold/10" : "bg-muted/20"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      idx === 0 ? "bg-champagne-gold text-white" :
                      idx === 1 ? "bg-gray-400 text-white" :
                      idx === 2 ? "bg-amber-600 text-white" :
                      "bg-muted text-foreground/60"
                    )}>
                      {idx + 1}
                    </div>

                    <div className="w-10 h-10 rounded-full bg-midnight/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-midnight">{agent.avatar}</span>
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-midnight">{agent.name}</p>
                      <p className="text-xs text-foreground/60">{agent.sales} ventas • score: {agent.volume}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-midnight">
              <FileText className="w-5 h-5 text-champagne-gold" />
              Resumen del Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Total Propiedades", value: String(summary?.totalProperties ?? 0) },
                { label: "Total Ventas", value: String(summary?.totalSales ?? 0) },
                { label: "Leads Activos", value: String(summary?.activeLeads ?? 0) },
                { label: "Ingresos Totales", value: summary?.totalRevenue ? `$${Number(summary.totalRevenue).toLocaleString("es-MX")}` : "$0" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                  <span className="text-sm text-foreground/60">{item.label}</span>
                  <span className="font-semibold text-midnight">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/30 bg-gradient-to-r from-midnight/5 to-champagne-gold/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-midnight">Exportar Reportes</h3>
              <p className="text-sm text-foreground/60">Descarga el historial completo en PDF o Excel</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Exportar PDF
              </Button>
              <Button variant="gold" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsSection;
