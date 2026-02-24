import { User, Briefcase, Shield } from "lucide-react";
import Navigation from "@/shared/components/custom/Navigation";
import AuthGuard from "@/auth/guardian/AuthGuard";
import { useAuth } from "@/auth/hooks/use-auth.hook";
import MyAccountRouter from "@/myAccount/router/my-account.router";

type ClientSubView = "dashboard" | "config" | "ventas" | "compras";
import { useState } from "react";

const roleIcons = { cliente: User, agente: Briefcase, admin: Shield };
const roleLabels = { cliente: "Cliente", agente: "Agente", admin: "Administrador" };

const MiCuenta = () => {
  const {
    isAuthenticated,
    selectedRole,
    showAuthModal,
    showRoleSelector,
    openAuthModal,
    closeAuthModal,
    closeRoleSelector,
    handleLoginSuccess,
    handleRoleSelect,
    handleLogout,
  } = useAuth();

  const [clientSubView, setClientSubView] = useState<ClientSubView>("dashboard");

  const isClientAuth = isAuthenticated && selectedRole === "cliente";
  const RoleIcon = selectedRole ? roleIcons[selectedRole] : User;

  return (
    <AuthGuard
      isAuthenticated={isAuthenticated}
      selectedRole={selectedRole}
      showAuthModal={showAuthModal}
      showRoleSelector={showRoleSelector}
      onOpenAuthModal={openAuthModal}
      onCloseAuthModal={closeAuthModal}
      onCloseRoleSelector={closeRoleSelector}
      onLoginSuccess={handleLoginSuccess}
      onRoleSelect={handleRoleSelect}
    >
      <div className="min-h-screen bg-white">
        <Navigation
          isClientAuthenticated={isClientAuth}
          onLogout={handleLogout}
          onNavigateConfig={() => setClientSubView("config")}
        />

        <div className="pt-20 md:pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            {clientSubView === "dashboard" && (
              <div
                className={`text-center mb-8 md:mb-12 ${
                  selectedRole !== "cliente" ? "hidden md:block" : ""
                }`}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-champagne-gold/10 text-champagne-gold text-sm font-medium mb-4">
                  <RoleIcon className="w-4 h-4" />
                  <span>{selectedRole ? roleLabels[selectedRole] : ""}</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-midnight mb-2 md:mb-4">
                  {selectedRole === "admin"
                    ? "Panel de Administración"
                    : selectedRole === "agente"
                    ? "Panel del Agente"
                    : "Mi Cuenta"}
                </h1>
                <p className="text-sm md:text-lg text-foreground/60 max-w-xl mx-auto">
                  {selectedRole === "admin"
                    ? "Control total de la plataforma"
                    : selectedRole === "agente"
                    ? "Gestiona tus propiedades y prospectos"
                    : "Gestiona tu perfil, crédito y propiedades en un solo lugar"}
                </p>
              </div>
            )}

            {selectedRole && (
              <MyAccountRouter
                role={selectedRole}
                onLogout={handleLogout}
                onNavigateConfig={() => setClientSubView("config")}
              />
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default MiCuenta;
