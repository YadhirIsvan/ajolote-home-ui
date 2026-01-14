import { User, CreditCard, Home, ShoppingCart, Settings, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ClientDashboardProps {
  onLogout: () => void;
}

const ClientDashboard = ({ onLogout }: ClientDashboardProps) => {
  const dashboardCards = [
    {
      icon: User,
      title: "Mi Perfil",
      description: "Actualiza tu información personal",
      action: "Editar Perfil",
    },
    {
      icon: CreditCard,
      title: "Mi Score de Crédito",
      description: "Score: 750 | Pre-aprobado: $8.5M",
      action: "Ver Detalles",
      highlight: true,
    },
    {
      icon: Home,
      title: "En Venta",
      description: "2 propiedades activas",
      action: "Gestionar",
    },
    {
      icon: ShoppingCart,
      title: "Proceso de Compra",
      description: "1 propiedad en proceso",
      action: "Ver Estado",
    },
    {
      icon: Settings,
      title: "Configuración",
      description: "Notificaciones y seguridad",
      action: "Configurar",
    },
    {
      icon: LogOut,
      title: "Cerrar Sesión",
      description: "Salir de tu cuenta",
      action: "Salir",
      isLogout: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <Card
            key={index}
            className={`group cursor-pointer border transition-all duration-300 hover:shadow-lg ${
              card.highlight
                ? "border-champagne-gold/30 bg-gradient-to-br from-champagne-gold/5 to-transparent"
                : "border-border/50 bg-white hover:border-champagne-gold/50"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    card.highlight
                      ? "bg-champagne-gold/20"
                      : "bg-champagne-gold/10 group-hover:bg-champagne-gold/20"
                  } transition-colors`}
                >
                  <card.icon
                    className={`w-6 h-6 ${
                      card.isLogout ? "text-red-500" : "text-champagne-gold"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-midnight mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-foreground/60 mb-4">
                    {card.description}
                  </p>
                  <Button
                    variant={card.isLogout ? "outline" : card.highlight ? "gold" : "outline"}
                    size="sm"
                    onClick={card.isLogout ? onLogout : undefined}
                    className={
                      card.isLogout
                        ? "border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                        : ""
                    }
                  >
                    {card.action}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-8 bg-white border border-border/50">
        <h2 className="text-2xl font-bold text-midnight mb-6">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/30">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-champagne-gold/10 rounded-full">
                <CreditCard className="w-5 h-5 text-champagne-gold" />
              </div>
              <div>
                <p className="font-semibold text-midnight">Score Legal Generado</p>
                <p className="text-sm text-foreground/60">Casa en Querétaro - Score: 98/100</p>
              </div>
            </div>
            <span className="text-sm text-foreground/50">Hace 2 días</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/30">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-champagne-gold/10 rounded-full">
                <CreditCard className="w-5 h-5 text-champagne-gold" />
              </div>
              <div>
                <p className="font-semibold text-midnight">Crédito Pre-aprobado</p>
                <p className="text-sm text-foreground/60">Monto: $8,500,000</p>
              </div>
            </div>
            <span className="text-sm text-foreground/50">Hace 5 días</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/30">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-champagne-gold/10 rounded-full">
                <Home className="w-5 h-5 text-champagne-gold" />
              </div>
              <div>
                <p className="font-semibold text-midnight">Propiedad Agregada</p>
                <p className="text-sm text-foreground/60">Departamento en CDMX</p>
              </div>
            </div>
            <span className="text-sm text-foreground/50">Hace 1 semana</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClientDashboard;
