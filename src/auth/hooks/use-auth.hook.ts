import { useState } from "react";
import type { AuthUser, UserRole } from "@/auth/types/auth.types";
import { authApi } from "@/auth/api/auth.api";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("access_token")
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("user") ?? "null");
    } catch {
      return null;
    }
  });

  const role: UserRole | null = user?.memberships?.[0]?.role ?? null;

  const handleLoginSuccess = () => {
    try {
      const stored = localStorage.getItem("user");
      const parsedUser: AuthUser | null = stored ? JSON.parse(stored) : null;
      setUser(parsedUser);
    } catch {
      setUser(null);
    }
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout errors
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return {
    isAuthenticated,
    showAuthModal,
    role,
    user,
    openAuthModal,
    closeAuthModal,
    handleLoginSuccess,
    handleLogout,
  };
};
