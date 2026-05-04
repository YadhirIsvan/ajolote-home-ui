import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { UserRole } from "@/shared/types/user.types";

const ClientPage = lazy(() => import("@/myAccount/client/pages/ClientPage"));
const AgentPage  = lazy(() => import("@/myAccount/agent/pages/AgentPage"));
const AdminPage  = lazy(() => import("@/myAccount/admin/pages/AdminPage"));

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--champagne-gold))]" />
  </div>
);

interface MyAccountRouterProps {
  role: UserRole;
  onLogout: () => void;
}

const MyAccountRouter = ({ role, onLogout }: MyAccountRouterProps) => {
  const renderPage = () => {
    switch (role) {
      case "client":
        return <ClientPage onLogout={onLogout} />;
      case "agent":
        return <AgentPage onLogout={onLogout} />;
      case "admin":
        return <AdminPage onLogout={onLogout} />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return <Suspense fallback={<PageLoader />}>{renderPage()}</Suspense>;
};

export default MyAccountRouter;
