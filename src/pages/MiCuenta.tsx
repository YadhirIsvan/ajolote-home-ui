import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { User, CreditCard, Home, FileText, Settings, LogOut } from "lucide-react";

const MiCuenta = () => {
  return (
    <div className="min-h-screen bg-dawn">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Mi Cuenta</h1>
            <p className="text-lg text-foreground/70">
              Gestiona tu perfil, crédito y propiedades en un solo lugar
            </p>
          </div>

          {/* Grid de Secciones */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Perfil */}
            <Card className="p-6 hover:shadow-glow-blue transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-ribbon/20 rounded-full">
                  <User className="w-6 h-6 text-ribbon" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Mi Perfil</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Actualiza tu información personal y preferencias
              </p>
              <Button variant="outline" className="w-full">
                Ver Perfil
              </Button>
            </Card>

            {/* Score de Crédito */}
            <Card className="p-6 hover:shadow-glow-orange transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-flamingo/20 rounded-full">
                  <CreditCard className="w-6 h-6 text-flamingo" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Mi Score de Crédito</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Revisa tu score y monto pre-aprobado
              </p>
              <Button variant="cta" className="w-full">
                Ver Score
              </Button>
            </Card>

            {/* Mis Propiedades */}
            <Card className="p-6 hover:shadow-glow-blue transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-carissma/20 rounded-full">
                  <Home className="w-6 h-6 text-carissma" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Mis Propiedades</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Gestiona tus publicaciones y favoritos
              </p>
              <Button variant="outline" className="w-full">
                Ver Propiedades
              </Button>
            </Card>

            {/* Documentos */}
            <Card className="p-6 hover:shadow-glow-blue transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-ribbon/20 rounded-full">
                  <FileText className="w-6 h-6 text-ribbon" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Mis Documentos</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Accede a tus documentos verificados
              </p>
              <Button variant="outline" className="w-full">
                Ver Documentos
              </Button>
            </Card>

            {/* Configuración */}
            <Card className="p-6 hover:shadow-glow-blue transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-ribbon/20 rounded-full">
                  <Settings className="w-6 h-6 text-ribbon" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Configuración</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Ajusta la configuración de tu cuenta
              </p>
              <Button variant="outline" className="w-full">
                Configurar
              </Button>
            </Card>

            {/* Cerrar Sesión */}
            <Card className="p-6 hover:shadow-glow-orange transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-flamingo/20 rounded-full">
                  <LogOut className="w-6 h-6 text-flamingo" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Cerrar Sesión</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Salir de tu cuenta de forma segura
              </p>
              <Button variant="outline" className="w-full">
                Cerrar Sesión
              </Button>
            </Card>
          </div>

          {/* Sección de Actividad Reciente */}
          <Card className="mt-12 p-8">
            <h2 className="text-2xl font-bold text-card-foreground mb-6">Actividad Reciente</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-ribbon/20 rounded-full">
                    <FileText className="w-5 h-5 text-ribbon" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">Score Legal Generado</p>
                    <p className="text-sm text-muted-foreground">Casa en Querétaro - Score: 98/100</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Hace 2 días</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-flamingo/20 rounded-full">
                    <CreditCard className="w-5 h-5 text-flamingo" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">Crédito Pre-aprobado</p>
                    <p className="text-sm text-muted-foreground">Monto: $8,500,000</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Hace 5 días</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-carissma/20 rounded-full">
                    <Home className="w-5 h-5 text-carissma" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">Propiedad Agregada a Favoritos</p>
                    <p className="text-sm text-muted-foreground">Departamento en CDMX</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Hace 1 semana</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MiCuenta;
