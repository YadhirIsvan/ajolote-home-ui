import { useState, useEffect, useRef } from "react";
import type { AuthUser, UserRole } from "@/shared/types/user.types";
import { logoutAction } from "@/shared/actions/logout.actions";

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    window.location.reload();
  };

  const handleLogout = async () => {
    await logoutAction();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleAutoLogout = async () => {
    setIsLoggingOut(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    await logoutAction();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setIsLoggingOut(false);
    setIsAuthenticated(false);
    setUser(null);
  };

  const autoLogoutRef = useRef(handleAutoLogout);
  autoLogoutRef.current = handleAutoLogout;

  useEffect(() => {
    if (!isAuthenticated) return;

    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return;

    const msLeft = getRefreshTokenExpiresInMs(refresh);
    if (msLeft === null) return;

    if (msLeft <= 0) {
      autoLogoutRef.current();
      return;
    }

    const timer = setTimeout(
      () => autoLogoutRef.current(),
      Math.min(msLeft, 2_147_483_647)
    );
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return {
    isAuthenticated,
    isLoggingOut,
    showAuthModal,
    role,
    user,
    openAuthModal,
    closeAuthModal,
    handleLoginSuccess,
    handleLogout,
  };
};
