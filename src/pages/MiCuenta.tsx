import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import RoleSelector, { UserRole } from "@/components/RoleSelector";
import { User, CreditCard, Home, Settings, LogOut, TrendingUp, ShoppingCart } from "lucide-react";

const MiCuenta = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleLoginSuccess = () => {
    setShowAuthModal(false);
    setShowRoleSelector(true);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIsAuthenticated(true);
    setShowRoleSelector(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedRole(null);
  };

  // Show login gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />

        <div className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-lg">
            {/* Login Gate */}
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-champagne-gold/10 flex items-center justify-center">
                <User className="w-10 h-10 text-champagne-gold" />
              </div>
              <h1 className="text-3xl font-bold text-midnight mb-4">Mi Cuenta</h1>
              <p className="text-foreground/60 mb-8 max-w-md mx-auto">
                Inicia sesión para gestionar tu perfil, propiedades y más
              </p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="h-14 px-10 bg-champagne-gold hover:bg-champagne-gold-dark text-white font-semibold text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        <RoleSelector
          isOpen={showRoleSelector}
          onClose={() => setShowRoleSelector(false)}
          onRoleSelect={handleRoleSelect}
        />
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-champagne-gold/10 text-champagne-gold text-sm font-medium mb-4">
              {selectedRole === "cliente" && <User className="w-4 h-4" />}
              {selectedRole === "agente" && <CreditCard className="w-4 h-4" />}
              {selectedRole === "admin" && <Settings className="w-4 h-4" />}
              <span className="capitalize">{selectedRole}</span>
            </div>
            <h1 className="text-4xl font-bold text-midnight mb-4">Mi Cuenta</h1>
            <p className="text-lg text-foreground/60">
              Gestiona tu perfil, crédito y propiedades en un solo lugar
            </p>
          </div>

          {/* Grid de Secciones */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Perfil */}
            <Card className="p-6 bg-white border border-border/50 hover:border-champagne-gold hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-champagne-gold/10 rounded-full">
                  <User className="w-6 h-6 text-champagne-gold" />
                </div>
                <h3 className="text-xl font-semibold text-midnight">Mi Perfil</h3>
              </div>
              <p className="text-sm text-foreground/60 mb-4">
                Actualiza tu información personal y preferencias
              </p>
              <Button variant="outline" className="w-full border-border/50 hover:border-champagne-gold hover:text-champagne-gold">
                Ver Perfil
              </Button>
            </Card>

            {/* Score de Crédito */}
            <Card className="p-6 bg-white border border-border/50 hover:border-champagne-gold hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-champagne-gold/10 rounded-full">
                  <CreditCard className="w-6 h-6 text-champagne-gold" />
                </div>
                <h3 className="text-xl font-semibold text-midnight">Mi Score de Crédito</h3>
              </div>
              <p className="text-sm text-foreground/60 mb-4">
                Revisa tu score y monto pre-aprobado
              </p>
              <Button className="w-full bg-champagne-gold hover:bg-champagne-gold-dark text-white">
                Ver Score
              </Button>
            </Card>

            {/* Propiedades en Venta */}
            <Card className="p-6 bg-white border border-border/50 hover:border-champagne-gold hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-champagne-gold/10 rounded-full">
                  <TrendingUp className="w-6 h-6 text-champagne-gold" />
                </div>
                <h3 className="text-xl font-semibold text-midnight">En Venta</h3>
              </div>
              <p className="text-sm text-foreground/60 mb-4">
                Gestiona tus propiedades publicadas para venta
              </p>
              <Button variant="outline" className="w-full border-border/50 hover:border-champagne-gold hover:text-champagne-gold">
                Ver Publicaciones
              </Button>
            </Card>

            {/* Proceso de Compra */}
            <Card className="p-6 bg-white border border-border/50 hover:border-champagne-gold hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-champagne-gold/10 rounded-full">
                  <ShoppingCart className="w-6 h-6 text-champagne-gold" />
                </div>
                <h3 className="text-xl font-semibold text-midnight">Proceso de Compra</h3>
              </div>
              <p className="text-sm text-foreground/60 mb-4">
                Seguimiento de propiedades que estás comprando
              </p>
              <Button variant="outline" className="w-full border-border/50 hover:border-champagne-gold hover:text-champagne-gold">
                Ver Proceso
              </Button>
            </Card>

            {/* Configuración */}
            <Card className="p-6 bg-white border border-border/50 hover:border-champagne-gold hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-champagne-gold/10 rounded-full">
                  <Settings className="w-6 h-6 text-champagne-gold" />
                </div>
                <h3 className="text-xl font-semibold text-midnight">Configuración</h3>
              </div>
              <p className="text-sm text-foreground/60 mb-4">
                Ajusta la configuración de tu cuenta
              </p>
              <Button variant="outline" className="w-full border-border/50 hover:border-champagne-gold hover:text-champagne-gold">
                Configurar
              </Button>
            </Card>

            {/* Cerrar Sesión */}
            <Card 
              className="p-6 bg-white border border-border/50 hover:border-destructive/50 hover:shadow-lg transition-all cursor-pointer"
              onClick={handleLogout}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-destructive/10 rounded-full">
                  <LogOut className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-midnight">Cerrar Sesión</h3>
              </div>
              <p className="text-sm text-foreground/60 mb-4">
                Salir de tu cuenta de forma segura
              </p>
              <Button variant="outline" className="w-full border-border/50 hover:border-destructive hover:text-destructive">
                Cerrar Sesión
              </Button>
            </Card>
          </div>

          {/* Sección de Actividad Reciente */}
          <Card className="mt-12 p-8 bg-white border border-border/50">
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
                    <p className="font-semibold text-midnight">Propiedad Agregada a Favoritos</p>
                    <p className="text-sm text-foreground/60">Departamento en CDMX</p>
                  </div>
                </div>
                <span className="text-sm text-foreground/50">Hace 1 semana</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MiCuenta;
