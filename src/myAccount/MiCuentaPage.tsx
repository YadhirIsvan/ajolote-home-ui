import { User, Briefcase, Shield } from "lucide-react";
import { useAuth } from "@/shared/hooks/use-auth.hook";
import MyAccountRouter from "@/myAccount/router/my-account.router";

const roleIcons  = { client: User, agent: Briefcase, admin: Shield };
const roleLabels = { client: "Cliente", agent: "Agente", admin: "Administrador" };

const MiCuentaPage = () => {
  const { role, handleLogout } = useAuth();

  const RoleIcon = role ? roleIcons[role] : User;

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className={`text-center mb-8 md:mb-12 ${role !== "client" ? "hidden md:block" : "hidden"}`}>
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

          {role && (
            <MyAccountRouter role={role} onLogout={handleLogout} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MiCuentaPage;
