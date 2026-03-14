import { User, Briefcase, Shield } from "lucide-react";
import AuthGuard from "@/auth/guardian/AuthGuard";
import { useAuth } from "@/auth/hooks/use-auth.hook";
import MyAccountRouter from "@/myAccount/router/my-account.router";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/myAccount/client/api/client.api";

type ClientSubView = "dashboard" | "config" | "ventas" | "compras";
import { useState, useMemo } from "react";

const roleIcons = { client: User, agent: Briefcase, admin: Shield };
const roleLabels = { client: "Cliente", agent: "Agente", admin: "Administrador" };

const MiCuenta = () => {
  const {
    isAuthenticated,
    role,
    user,
    showAuthModal,
    openAuthModal,
    closeAuthModal,
    handleLoginSuccess,
    handleLogout,
  } = useAuth();

  const [clientSubView, setClientSubView] = useState<ClientSubView>("dashboard");

  const isClientAuth = isAuthenticated && role === "client";
  const RoleIcon = role ? roleIcons[role] : User;

  const { data: userProfile } = useQuery({
    queryKey: ["client-user-profile"],
    queryFn: async () => {
      const { data } = await clientApi.getUserProfile();
      return data as { avatar: string | null };
    },
    enabled: isClientAuth,
  });

  const userWithAvatar = useMemo(() => {
    if (!user) return null;
    return { ...user, avatar_url: userProfile?.avatar ?? null };
  }, [user, userProfile]);

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

export default MiCuenta;
