import { useState } from "react";
import ClientDashboard from "@/myAccount/client/components/ClientDashboard";
import ClientConfigScreen from "@/myAccount/client/components/ClientConfigScreen";
import ClientVentas from "@/myAccount/client/components/ClientVentas";
import ClientCompras from "@/myAccount/client/components/ClientCompras";
import ClientCitas from "@/myAccount/client/components/ClientCitas";
import type { ClientSubView } from "@/myAccount/client/types/client.types";

interface ClientPageProps {
  onLogout: () => void;
  onNavigateConfig: () => void;
}

const ClientPage = ({ onLogout }: ClientPageProps) => {
  const [subView, setSubView] = useState<ClientSubView>("dashboard");

  const renderView = () => {
    switch (subView) {
      case "config":
        return <ClientConfigScreen onBack={() => setSubView("dashboard")} />;
      case "ventas":
        return <ClientVentas onBack={() => setSubView("dashboard")} />;
      case "compras":
        return <ClientCompras onBack={() => setSubView("dashboard")} />;
      case "citas":
        return <ClientCitas onBack={() => setSubView("dashboard")} />;
      default:
        return (
          <ClientDashboard
            onLogout={onLogout}
            onNavigateVentas={() => setSubView("ventas")}
            onNavigateCompras={() => setSubView("compras")}
            onNavigateCitas={() => setSubView("citas")}
            onNavigateConfig={() => setSubView("config")}
          />
        );
    }
  };

  return <>{renderView()}</>;
};

export { ClientPage };
export type { ClientSubView };
export default ClientPage;
