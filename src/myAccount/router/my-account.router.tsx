import ClientPage from "@/myAccount/client/pages/ClientPage";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import MasterAdminDashboard from "@/components/admin/MasterAdminDashboard";
import type { UserRole } from "@/myAccount/shared/components/RoleSelector";

interface MyAccountRouterProps {
  role: UserRole;
  onLogout: () => void;
  onNavigateConfig: () => void;
}

/**
 * Distributes rendering by authenticated role.
 * As agent/ and admin/ domains are migrated, their imports will be updated here.
 */
const MyAccountRouter = ({ role, onLogout, onNavigateConfig }: MyAccountRouterProps) => {
  switch (role) {
    case "cliente":
      return <ClientPage onLogout={onLogout} onNavigateConfig={onNavigateConfig} />;
    case "agente":
      return <AgentDashboard onLogout={onLogout} />;
    case "admin":
      return <MasterAdminDashboard onLogout={onLogout} />;
    default:
      return null;
  }
};

export default MyAccountRouter;
