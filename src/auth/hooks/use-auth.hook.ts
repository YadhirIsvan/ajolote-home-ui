import { useState, useEffect, useRef } from "react";
import type { AuthUser, UserRole } from "@/auth/types/auth.types";
import { authApi } from "@/auth/api/auth.api";

/** Lee el claim `exp` de un JWT sin verificar firma. Retorna null si falla. */
function getRefreshTokenExpiresInMs(token: string): number | null {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (!payload?.exp) return null;
    return payload.exp * 1000 - Date.now();
  } catch {
    return null;
  }
}

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

  // Ref para acceder a handleLogout dentro del timer sin re-crearlo como dep
  const handleLogoutRef = useRef(handleLogout);
  handleLogoutRef.current = handleLogout;

  // Auto-logout cuando expira el refresh token
  useEffect(() => {
    if (!isAuthenticated) return;

    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return;

    const msLeft = getRefreshTokenExpiresInMs(refresh);
    if (msLeft === null) return;

    // Ya expiró: cerrar sesión inmediatamente
    if (msLeft <= 0) {
      handleLogoutRef.current();
      return;
    }

    // Programar cierre exactamente cuando expire (máx ~24 días por límite de setTimeout)
    const timer = setTimeout(
      () => handleLogoutRef.current(),
      Math.min(msLeft, 2_147_483_647)
    );
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

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
