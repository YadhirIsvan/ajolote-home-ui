import ClientPage from "@/myAccount/client/pages/ClientPage";
import AgentPage from "@/myAccount/agent/pages/AgentPage";
import AdminPage from "@/myAccount/admin/pages/AdminPage";
import type { UserRole } from "@/shared/types/user.types";

interface MyAccountRouterProps {
  role: UserRole;
  onLogout: () => void;
  onNavigateConfig: () => void;
}

const MyAccountRouter = ({ role, onLogout, onNavigateConfig }: MyAccountRouterProps) => {
  switch (role) {
    case "client":
      return <ClientPage onLogout={onLogout} onNavigateConfig={onNavigateConfig} />;
    case "agent":
      return <AgentPage onLogout={onLogout} />;
    case "admin":
      return <AdminPage onLogout={onLogout} />;
    default:
      return null;
  }
};

export default MyAccountRouter;
