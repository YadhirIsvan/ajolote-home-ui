import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AdminTabsNavigation, { AdminTab } from "./AdminTabsNavigation";
import PropiedadesSection from "./sections/PropiedadesSection";
import AgentesSection from "./sections/AgentesSection";
import CitasSection from "./sections/CitasSection";
import AsignarSection from "./sections/AsignarSection";
import ClientesSection from "./sections/ClientesSection";
import KanbanSection from "./sections/KanbanSection";
import ajoloteLogo from "@/assets/ajolote-logo.png";

interface MasterAdminDashboardProps {
  onLogout: () => void;
}

const MasterAdminDashboard = ({ onLogout }: MasterAdminDashboardProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<AdminTab>("propiedades");
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

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
      default:
        return <PropiedadesSection />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-midnight text-white">
        <div className={cn(
          "flex items-center justify-between px-4 py-3",
          !isMobile && "pr-60" // Make room for right sidebar on desktop
        )}>
          <div className="flex items-center gap-3">
            <img src={ajoloteLogo} alt="Ajolote" className="w-8 h-8 object-contain" />
            <div>
              <h1 className="font-bold text-lg">Panel Admin</h1>
              {!isMobile && <p className="text-xs text-white/60">Gestión integral</p>}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 gap-2"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            {!isMobile && "Salir"}
          </Button>
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

      {/* Desktop Tab Navigation (right side) */}
      {!isMobile && (
        <AdminTabsNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      )}
      
      {/* Main Content */}
      <main className={cn(
        "p-4 md:p-8",
        !isMobile && "mr-56" // Make room for right sidebar on desktop
      )}>
        {renderSection()}
      </main>
    </div>
  );
};

export default MasterAdminDashboard;
