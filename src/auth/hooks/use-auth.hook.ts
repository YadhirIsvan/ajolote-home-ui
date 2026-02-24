import { useState } from "react";
import type { UserRole } from "@/auth/types/auth.types";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleLoginSuccess = () => {
    setShowAuthModal(false);
    setShowRoleSelector(true);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIsAuthenticated(true);
    setShowRoleSelector(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedRole(null);
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);
  const closeRoleSelector = () => setShowRoleSelector(false);

  return {
    isAuthenticated,
    showAuthModal,
    showRoleSelector,
    selectedRole,
    openAuthModal,
    closeAuthModal,
    closeRoleSelector,
    handleLoginSuccess,
    handleRoleSelect,
    handleLogout,
  };
};
