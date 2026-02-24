import { useState } from "react";
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
  Filter,
  Calendar,
  FileText,
  User,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Mock data for charts
const monthlySalesData = [
  { month: "Ene", ventas: 4, valor: 45.2 },
  { month: "Feb", ventas: 3, valor: 32.1 },
  { month: "Mar", ventas: 5, valor: 58.4 },
  { month: "Abr", ventas: 6, valor: 72.3 },
  { month: "May", ventas: 4, valor: 48.9 },
  { month: "Jun", ventas: 7, valor: 89.2 },
  { month: "Jul", ventas: 5, valor: 61.5 },
  { month: "Ago", ventas: 8, valor: 98.7 },
  { month: "Sep", ventas: 6, valor: 75.4 },
  { month: "Oct", ventas: 7, valor: 82.1 },
  { month: "Nov", ventas: 9, valor: 112.3 },
  { month: "Dic", ventas: 5, valor: 63.8 },
];

const propertyTypeData = [
  { name: "Casa", value: 35, color: "#C5A059" },
  { name: "Departamento", value: 40, color: "#0F172A" },
  { name: "Loft", value: 15, color: "#6366F1" },
  { name: "Penthouse", value: 10, color: "#10B981" },
];

const zoneHeatMapData = [
  { zone: "Polanco", sales: 15, value: 187.5, intensity: 100 },
  { zone: "Santa Fe", sales: 12, value: 226.8, intensity: 80 },
  { zone: "Condesa", sales: 10, value: 65.0, intensity: 67 },
  { zone: "Roma", sales: 8, value: 38.4, intensity: 53 },
  { zone: "Coyoacán", sales: 6, value: 49.2, intensity: 40 },
  { zone: "Del Valle", sales: 5, value: 35.0, intensity: 33 },
  { zone: "Nápoles", sales: 4, value: 28.8, intensity: 27 },
];

const topAgents = [
  { name: "Carlos Mendoza", sales: 18, volume: "$142.5M", commission: "$1.425M", avatar: "CM" },
  { name: "Laura Sánchez", sales: 15, volume: "$118.2M", commission: "$1.182M", avatar: "LS" },
  { name: "Roberto Díaz", sales: 12, volume: "$95.8M", commission: "$958K", avatar: "RD" },
  { name: "Ana Martínez", sales: 10, volume: "$78.4M", commission: "$784K", avatar: "AM" },
  { name: "Miguel Torres", sales: 8, volume: "$62.1M", commission: "$621K", avatar: "MT" },
];

const auditLogs = [
  { admin: "Admin Principal", action: "Cerró venta", property: "Casa Polanco", date: "2024-01-15 14:30", client: "Miguel Torres" },
  { admin: "Admin Principal", action: "Aprobó documentos", property: "Penthouse SF", date: "2024-01-14 11:20", client: "Ana Ruiz" },
  { admin: "Admin Secundario", action: "Cerró venta", property: "Depto Roma", date: "2024-01-12 16:45", client: "Roberto Silva" },
  { admin: "Admin Principal", action: "Validó avalúo", property: "Loft Condesa", date: "2024-01-10 09:15", client: "Fernando López" },
  { admin: "Admin Principal", action: "Cerró venta", property: "Casa Coyoacán", date: "2024-01-08 13:00", client: "Patricia Gómez" },
];

const InsightsSection = () => {
  const isMobile = useIsMobile();
  const [period, setPeriod] = useState("year");

  // Stats calculations (mock)
  const stats = {
    totalVolume: "$839.9M",
    avgTicket: "$8.2M",
    avgDaysToSell: 52,
    totalCommissions: "$8.4M",
    totalProperties: 69,
    yearlyCommissions: "$8.4M"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Ventas e Insights</h1>
          <p className="text-foreground/60">Análisis completo del rendimiento de ventas</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
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
                <p className="text-xs text-foreground/60">Tiempo Medio</p>
                <p className="text-lg md:text-xl font-bold text-midnight">{stats.avgDaysToSell} días</p>
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
                <p className="text-xs text-foreground/60">Comisiones</p>
                <p className="text-lg md:text-xl font-bold text-midnight">{stats.totalCommissions}</p>
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
                <p className="text-xs text-foreground/60">Total Vendidas</p>
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
                        name === "ventas" ? `${value} propiedades` : `$${value}M`,
                        name === "ventas" ? "Ventas" : "Valor"
                      ]}
                    />
                    <Bar dataKey="ventas" fill="#C5A059" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
              <div className="space-y-3">
                {zoneHeatMapData.map((zone, idx) => (
                  <div key={zone.zone} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-midnight">{zone.zone}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-foreground/60">{zone.sales} ventas</span>
                        <span className="font-semibold text-champagne-gold">${zone.value}M</span>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Agents Ranking */}
        <Card className="border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-midnight">
              <Trophy className="w-5 h-5 text-champagne-gold" />
              Top Vendedores
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                    <p className="text-xs text-foreground/60">{agent.sales} ventas • {agent.volume}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-bold text-champagne-gold">{agent.commission}</p>
                    <p className="text-xs text-foreground/60">comisión</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card className="border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-midnight">
              <FileText className="w-5 h-5 text-champagne-gold" />
              Log de Auditoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-3 p-3 bg-muted/20 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-midnight text-sm">{log.admin}</span>
                      <span className="text-foreground/60 text-sm">{log.action}</span>
                    </div>
                    <p className="text-sm text-champagne-gold font-medium truncate">{log.property}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-foreground/50">
                      <User className="w-3 h-3" />
                      <span>{log.client}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      <span>{log.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Ver historial completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
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
