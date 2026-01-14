import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import AuthGate from "@/components/AuthGate";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import {
  User,
  CreditCard,
  Home,
  ShoppingBag,
  Settings,
  LogOut,
  FileText,
  Loader2,
} from "lucide-react";

const MiCuenta = () => {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--champagne-gold))]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {!user ? (
            <AuthGate />
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Mi Cuenta
                </h1>
                <p className="text-lg text-muted-foreground">
                  Gestiona tu perfil, crédito y propiedades en un solo lugar
                </p>
              </div>

              {/* Grid de Secciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mi Perfil */}
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-[hsl(var(--champagne-gold))]/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">
                      Mi Perfil
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Actualiza tu información personal y preferencias
                  </p>
                  <Button variant="outline" className="w-full">
                    Ver Perfil
                  </Button>
                </Card>

                {/* Mi Score de Crédito */}
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-[hsl(var(--champagne-gold))]/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-[hsl(var(--champagne-gold))]/10 rounded-full">
                      <CreditCard className="w-6 h-6 text-[hsl(var(--champagne-gold))]" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">
                      Mi Score de Crédito
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Revisa tu score y monto pre-aprobado
                  </p>
                  <Button className="w-full bg-[hsl(var(--champagne-gold))] hover:bg-[hsl(var(--champagne-gold))]/90 text-white">
                    Ver Score
                  </Button>
                </Card>

                {/* Propiedades en Venta */}
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-[hsl(var(--champagne-gold))]/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">
                      Propiedades en Venta
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gestiona las propiedades que has publicado
                  </p>
                  <Button variant="outline" className="w-full">
                    Ver Mis Ventas
                  </Button>
                </Card>

                {/* Propiedades en Proceso de Compra */}
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-[hsl(var(--champagne-gold))]/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-[hsl(var(--champagne-gold))]/10 rounded-full">
                      <ShoppingBag className="w-6 h-6 text-[hsl(var(--champagne-gold))]" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">
                      Propiedades en Compra
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Seguimiento de tus compras activas
                  </p>
                  <Button variant="outline" className="w-full">
                    Ver Mis Compras
                  </Button>
                </Card>

                {/* Configuración */}
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-[hsl(var(--champagne-gold))]/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Settings className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">
                      Configuración
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ajusta la configuración de tu cuenta
                  </p>
                  <Button variant="outline" className="w-full">
                    Configurar
                  </Button>
                </Card>

                {/* Cerrar Sesión - Mobile at bottom, subtle styling */}
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border hover:border-muted-foreground/20 md:order-last">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-muted rounded-full">
                      <LogOut className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-muted-foreground">
                      Cerrar Sesión
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Salir de tu cuenta de forma segura
                  </p>
                  <Button
                    variant="outline"
                    className="w-full text-muted-foreground hover:text-primary"
                    onClick={handleSignOut}
                  >
                    Cerrar Sesión
                  </Button>
                </Card>
              </div>

              {/* Sección de Actividad Reciente */}
              <Card className="mt-12 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Actividad Reciente
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">
                          Score Legal Generado
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Casa en Querétaro - Score: 98/100
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground hidden sm:block">
                      Hace 2 días
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[hsl(var(--champagne-gold))]/10 rounded-full">
                        <CreditCard className="w-5 h-5 text-[hsl(var(--champagne-gold))]" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">
                          Crédito Pre-aprobado
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Monto: $8,500,000
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground hidden sm:block">
                      Hace 5 días
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Home className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">
                          Propiedad Agregada a Favoritos
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Departamento en CDMX
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground hidden sm:block">
                      Hace 1 semana
                    </span>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiCuenta;
