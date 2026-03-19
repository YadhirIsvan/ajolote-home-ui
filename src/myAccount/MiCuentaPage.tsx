import { useState } from "react";
import { User, Briefcase, Shield } from "lucide-react";
import AuthGuard from "@/auth/guardian/AuthGuard";
import { useAuth } from "@/shared/hooks/use-auth.hook";
import MyAccountRouter from "@/myAccount/router/my-account.router";

type ClientSubView = "dashboard" | "config" | "ventas" | "compras";

const roleIcons = { client: User, agent: Briefcase, admin: Shield };
const roleLabels = { client: "Cliente", agent: "Agente", admin: "Administrador" };

const MiCuentaPage = () => {
  const {
    isAuthenticated,
    role,
    showAuthModal,
    openAuthModal,
    closeAuthModal,
    handleLoginSuccess,
    handleLogout,
  } = useAuth();

  const [clientSubView, setClientSubView] = useState<ClientSubView>("dashboard");

  const RoleIcon = role ? roleIcons[role] : User;

  return (
    <AuthGuard
      isAuthenticated={isAuthenticated}
      role={role}
      showAuthModal={showAuthModal}
      onOpenAuthModal={openAuthModal}
      onCloseAuthModal={closeAuthModal}
      onLoginSuccess={handleLoginSuccess}
    >
      <div className="min-h-screen bg-white">
        <div className="pt-20 md:pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            {clientSubView === "dashboard" && (
              <div
                className={`text-center mb-8 md:mb-12 ${
                  role !== "client" ? "hidden md:block" : ""
                }`}
              >
                {role !== "client" && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-champagne-gold/10 text-champagne-gold text-sm font-medium mb-4">
                    <RoleIcon className="w-4 h-4" />
                    <span>{role ? roleLabels[role] : ""}</span>
                  </div>
                )}
                <h1 className="text-2xl md:text-4xl font-bold text-midnight mb-2 md:mb-4">
                  {role === "admin"
                    ? "Panel de Administración"
                    : role === "agent"
                    ? "Panel del Agente"
                    : "Perfil"}
                </h1>
                {role !== "client" && (
                  <p className="text-sm md:text-lg text-foreground/60 max-w-xl mx-auto">
                    {role === "admin"
                      ? "Control total de la plataforma"
                      : "Gestiona tus propiedades y prospectos"}
                  </p>
                )}
              </div>
            )}

            {role && (
              <MyAccountRouter
                role={role}
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

export default MiCuentaPage;
