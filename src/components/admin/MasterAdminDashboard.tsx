import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminSidebar, { AdminSection } from "./AdminSidebar";
import AdminOverview from "./sections/AdminOverview";
import CasasSection from "./sections/CasasSection";
import AgentesSection from "./sections/AgentesSection";
import CitasSection from "./sections/CitasSection";
import ConfigCitasSection from "./sections/ConfigCitasSection";
import AsignarSection from "./sections/AsignarSection";
import ClientesSection from "./sections/ClientesSection";
import KanbanSection from "./sections/KanbanSection";

interface MasterAdminDashboardProps {
  onLogout: () => void;
}

const MasterAdminDashboard = ({ onLogout }: MasterAdminDashboardProps) => {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminOverview />;
      case "casas":
        return <CasasSection />;
      case "agentes":
        return <AgentesSection />;
      case "citas":
        return <CitasSection />;
      case "config-citas":
        return <ConfigCitasSection />;
      case "asignar":
        return <AsignarSection />;
      case "clientes":
        return <ClientesSection />;
      case "kanban":
        return <KanbanSection />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={onLogout}
      />
      
      {/* Main Content */}
      <main className={`${isMobile ? "px-4 py-6" : "ml-64 p-8"}`}>
        {renderSection()}
      </main>
    </div>
  );
};

export default MasterAdminDashboard;
