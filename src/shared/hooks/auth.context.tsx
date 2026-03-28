import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { AuthUser, UserRole } from "@/shared/types/user.types";
import { logoutAction } from "@/shared/actions/logout.actions";

/**
 * Lee el claim `exp` de un JWT sin verificar firma. Retorna null si falla.
 * USO ACEPTABLE: únicamente para el timer de auto-logout en el cliente (UX).
 * PROHIBIDO: usar el payload decodificado aquí para decisiones de autorización
 * o verificación de roles — eso siempre debe hacerlo el servidor.
 */
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

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  showAuthModal: boolean;
  user: AuthUser | null;
  role: UserRole | null;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  /** Actualiza el estado de auth desde localStorage sin recargar la página.
   *  Usar cuando el login ocurre fuera de MiCuentaPage (ej: FinancialModal). */
  syncAuthState: () => void;
  /** Actualiza el estado de auth y recarga la página (comportamiento de MiCuentaPage). */
  handleLoginSuccess: () => void;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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

  const syncAuthState = () => {
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

  const handleLoginSuccess = () => {
    syncAuthState();
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

  const handleLogoutRef = useRef(handleLogout);
  handleLogoutRef.current = handleLogout;

  // Timer de expiración del refresh token
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

  // Seguridad: si el usuario regresa al tab y los tokens ya no existen
  // (borrados por otra pestaña, expiración externa, etc.), cierra sesión inmediatamente.
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokensOnFocus = () => {
      if (!document.hidden && !localStorage.getItem("access_token")) {
        handleLogoutRef.current();
      }
    };

    document.addEventListener("visibilitychange", checkTokensOnFocus);
    return () => document.removeEventListener("visibilitychange", checkTokensOnFocus);
  }, [isAuthenticated]);

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoggingOut,
        showAuthModal,
        user,
        role,
        openAuthModal,
        closeAuthModal,
        syncAuthState,
        handleLoginSuccess,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
