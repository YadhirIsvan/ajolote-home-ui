import { useState } from "react";
import { User, Briefcase, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import RoleSelector, { UserRole } from "@/components/RoleSelector";
import { Button } from "@/components/ui/button";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import MasterAdminDashboard from "@/components/admin/MasterAdminDashboard";

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
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedRole(null);
  };

  // Login Gate
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

  // Role Icons
  const roleIcons = {
    cliente: User,
    agente: Briefcase,
    admin: Shield,
  };

  const roleLabels = {
    cliente: "Cliente",
    agente: "Agente",
    admin: "Administrador",
  };

  const RoleIcon = selectedRole ? roleIcons[selectedRole] : User;

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Header - Hidden on mobile for agent/admin (they have sticky headers) */}
          <div className={`text-center mb-8 md:mb-12 ${selectedRole !== "cliente" ? "hidden md:block" : ""}`}>
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

          {/* Role-Specific Dashboard */}
          {selectedRole === "cliente" && <ClientDashboard onLogout={handleLogout} />}
          {selectedRole === "agente" && <AgentDashboard onLogout={handleLogout} />}
          {selectedRole === "admin" && <MasterAdminDashboard onLogout={handleLogout} />}
        </div>
      </div>
    </div>
  );
};

export default MiCuenta;
