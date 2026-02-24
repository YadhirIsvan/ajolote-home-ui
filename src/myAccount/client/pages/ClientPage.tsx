import { useState } from "react";
import ClientDashboard from "@/myAccount/client/components/ClientDashboard";
import ClientConfigScreen from "@/myAccount/client/components/ClientConfigScreen";
import ClientVentas from "@/myAccount/client/components/ClientVentas";
import ClientCompras from "@/myAccount/client/components/ClientCompras";
import type { ClientSubView } from "@/myAccount/client/types/client.types";

interface ClientPageProps {
  onLogout: () => void;
  onNavigateConfig: () => void;
}

const ClientPage = ({ onLogout, onNavigateConfig: _ }: ClientPageProps) => {
  const [subView, setSubView] = useState<ClientSubView>("dashboard");

  const renderView = () => {
    switch (subView) {
      case "config":
        return <ClientConfigScreen onBack={() => setSubView("dashboard")} />;
      case "ventas":
        return <ClientVentas onBack={() => setSubView("dashboard")} />;
      case "compras":
        return <ClientCompras onBack={() => setSubView("dashboard")} />;
      default:
        return (
          <ClientDashboard
            onLogout={onLogout}
            onNavigateVentas={() => setSubView("ventas")}
            onNavigateCompras={() => setSubView("compras")}
          />
        );
    }
  };

  return <>{renderView()}</>;
};

export { ClientPage };
export type { ClientSubView };
export default ClientPage;
