import { DollarSign, Users, Home, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

const AdminOverview = () => {
  const stats = [
    { label: "Ventas Totales", value: "$48.5M", icon: DollarSign, change: "+12%" },
    { label: "Agentes Activos", value: "12", icon: Users, change: "+2" },
    { label: "Propiedades", value: "47", icon: Home, change: "+8" },
    { label: "Citas Hoy", value: "15", icon: Clock, change: "+5" },
  ];

  const topAgents = [
    { name: "Carlos Mendoza", sales: 8, avatar: "CM" },
    { name: "Laura Sánchez", sales: 6, avatar: "LS" },
    { name: "Roberto Díaz", sales: 5, avatar: "RD" },
    { name: "Ana Martínez", sales: 4, avatar: "AM" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-midnight mb-2">Dashboard</h1>
        <p className="text-foreground/60">Vista general del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50 bg-white">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-champagne-gold/10">
                  <stat.icon className="w-5 h-5 text-champagne-gold" />
                </div>
                <Badge
                  className={
                    stat.change.startsWith("+")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }
                >
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xl md:text-2xl font-bold text-midnight">{stat.value}</p>
              <p className="text-sm text-foreground/60">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-xl text-midnight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-champagne-gold" />
              Ventas Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"].map(
                (month, index) => {
                  const heights = [40, 55, 70, 45, 80, 65, 90, 75, 85, 60, 95, 50];
                  return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-champagne-gold to-champagne-gold/60 transition-all hover:from-champagne-gold-dark hover:to-champagne-gold"
                        style={{ height: `${heights[index]}%` }}
                      />
                      <span className="text-xs text-foreground/60">{month}</span>
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Agents */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-xl text-midnight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-champagne-gold" />
              Top Agentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topAgents.map((agent, index) => (
              <div
                key={agent.name}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      index === 0
                        ? "bg-champagne-gold"
                        : index === 1
                        ? "bg-midnight"
                        : "bg-foreground/40"
                    }`}
                  >
                    {agent.avatar}
                  </div>
                  <span className="font-medium text-midnight">{agent.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-champagne-gold">{agent.sales}</p>
                  <p className="text-xs text-foreground/60">ventas</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
