import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/shared/hooks/use-auth.hook";
import LoginPage from "@/auth/pages/LoginPage";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const {
    isLoadingUser,
    isAuthenticated,
    showAuthModal,
    openAuthModal,
    closeAuthModal,
    handleLoginSuccess,
  } = useAuth();

  if (isLoadingUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--champagne-gold))]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        showAuthModal={showAuthModal}
        onOpenAuthModal={openAuthModal}
        onCloseAuthModal={closeAuthModal}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
