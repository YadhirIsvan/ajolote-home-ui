import type { UserRole } from "@/auth/types/auth.types";
import LoginPage from "@/auth/pages/LoginPage";

interface AuthGuardProps {
  isAuthenticated: boolean;
  selectedRole: UserRole | null;
  showAuthModal: boolean;
  showRoleSelector: boolean;
  onOpenAuthModal: () => void;
  onCloseAuthModal: () => void;
  onCloseRoleSelector: () => void;
  onLoginSuccess: () => void;
  onRoleSelect: (role: UserRole) => void;
  children: React.ReactNode;
}

const AuthGuard = ({
  isAuthenticated,
  selectedRole,
  showAuthModal,
  showRoleSelector,
  onOpenAuthModal,
  onCloseAuthModal,
  onCloseRoleSelector,
  onLoginSuccess,
  onRoleSelect,
  children,
}: AuthGuardProps) => {
  if (!isAuthenticated || !selectedRole) {
    return (
      <LoginPage
        showAuthModal={showAuthModal}
        showRoleSelector={showRoleSelector}
        onOpenAuthModal={onOpenAuthModal}
        onCloseAuthModal={onCloseAuthModal}
        onCloseRoleSelector={onCloseRoleSelector}
        onLoginSuccess={onLoginSuccess}
        onRoleSelect={onRoleSelect}
      />
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
