import type { ReactNode } from "react";
import type { UserRole } from "@/auth/types/auth.types";
import LoginPage from "@/auth/pages/LoginPage";

interface AuthGuardProps {
  isAuthenticated: boolean;
  role: UserRole | null;
  showAuthModal: boolean;
  onOpenAuthModal: () => void;
  onCloseAuthModal: () => void;
  onLoginSuccess: () => void;
  children: ReactNode;
}

const AuthGuard = ({
  isAuthenticated,
  role,
  showAuthModal,
  onOpenAuthModal,
  onCloseAuthModal,
  onLoginSuccess,
  children,
}: AuthGuardProps) => {
  if (!isAuthenticated || !role) {
    return (
      <LoginPage
        showAuthModal={showAuthModal}
        onOpenAuthModal={onOpenAuthModal}
        onCloseAuthModal={onCloseAuthModal}
        onLoginSuccess={onLoginSuccess}
      />
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
