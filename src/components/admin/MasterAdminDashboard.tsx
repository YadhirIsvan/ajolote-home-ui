import { useState } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut, User, Settings, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import AdminTabsNavigation, { AdminTab } from "./AdminTabsNavigation";
import PropiedadesSection from "./sections/PropiedadesSection";
import AgentesSection from "./sections/AgentesSection";
import CitasSection from "./sections/CitasSection";
import AsignarSection from "./sections/AsignarSection";
import ClientesSection from "./sections/ClientesSection";
import KanbanSection from "./sections/KanbanSection";
import HistorialSection from "./sections/HistorialSection";
import InsightsSection from "./sections/InsightsSection";
import vakantaLogo from "@/assets/vakanta-logo.png";

interface MasterAdminDashboardProps {
  onLogout: () => void;
}

const MasterAdminDashboard = ({ onLogout }: MasterAdminDashboardProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<AdminTab>("propiedades");

  const renderSection = () => {
    switch (activeTab) {
      case "propiedades":
        return <PropiedadesSection />;
      case "agentes":
        return <AgentesSection />;
      case "citas":
        return <CitasSection />;
      case "asignar":
        return <AsignarSection />;
      case "clientes":
        return <ClientesSection />;
      case "kanban":
        return <KanbanSection />;
      case "historial":
        return <HistorialSection />;
      case "insights":
        return <InsightsSection />;
      default:
        return <PropiedadesSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header - Same style as normal Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
             <Link to="/" className="flex items-center gap-2 group">
               <img src={vakantaLogo} alt="Vakanta" className="h-10 transition-transform group-hover:scale-105" />
             </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ver sitio público
              </Link>
            </div>

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted">
                  <div className="w-8 h-8 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-champagne-gold" />
                  </div>
                  {!isMobile && (
                    <>
                      <span className="text-sm font-medium text-foreground">Administrador</span>
                      <ChevronDown className="w-4 h-4 text-foreground/60" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración del sistema
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Mobile Tab Navigation (below header) */}
      {isMobile && (
        <AdminTabsNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      )}

      {/* Desktop Tab Navigation (left side) */}
      {!isMobile && (
        <AdminTabsNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      )}
      
      {/* Main Content */}
      <main className={cn(
        "p-4 md:p-8",
        !isMobile && "ml-56" // Make room for left sidebar on desktop
      )}>
        {renderSection()}
      </main>
    </div>
  );
};

export default MasterAdminDashboard;
