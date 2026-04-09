import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthUser, UserRole } from "@/shared/types/user.types";
import { logoutAction } from "@/shared/actions/logout.actions";
import { meAction } from "@/shared/actions/me.actions";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Reads the non-httpOnly 'session_active' cookie that the backend sets
 * alongside the httpOnly tokens. Allows JS to know a session exists without
 * ever having access to the actual token values.
 */
function getSessionActiveCookie(): boolean {
  return document.cookie.split(";").some((c) => c.trim().startsWith("session_active="));
}

// ── Context shape ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  showAuthModal: boolean;
  user: AuthUser | null;
  role: UserRole | null;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  /** Calls /auth/me and syncs React state from the response. */
  syncAuthState: () => Promise<void>;
  /** Reloads the page after a successful login so /auth/me runs on mount. */
  handleLoginSuccess: () => void;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialise synchronously from the session_active cookie so there is no
  // flash of the login screen when the user is already authenticated.
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => getSessionActiveCookie()
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [refreshExpiresAt, setRefreshExpiresAt] = useState<number | null>(null);

  const role: UserRole | null = (user?.memberships?.[0]?.role as UserRole) ?? null;

  // ── Core state updater ─────────────────────────────────────────────────────

  const syncAuthState = async (): Promise<void> => {
    const result = await meAction();
    if (result) {
      setUser(result.user);
      setRefreshExpiresAt(result.refresh_expires_at);
      setIsAuthenticated(true);
      setShowAuthModal(false);
    } else {
      setUser(null);
      setRefreshExpiresAt(null);
      setIsAuthenticated(false);
    }
  };

  // ── Login ──────────────────────────────────────────────────────────────────

  const handleLoginSuccess = () => {
    // Reload so the app starts fresh: the session_active cookie is already set
    // by the backend, and the mount effect below will call /auth/me.
    window.location.reload();
  };

  // ── Logout ────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    await logoutAction(); // backend blacklists token + deletes cookies
    queryClient.clear();  // limpia el cache de queries del usuario anterior
    setIsAuthenticated(false);
    setUser(null);
    setRefreshExpiresAt(null);
    localStorage.removeItem("selected_tenant_id");
  };

  const handleAutoLogout = async () => {
    setIsLoggingOut(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    await logoutAction();
    queryClient.clear();  // limpia el cache de queries del usuario anterior
    localStorage.removeItem("selected_tenant_id");
    setIsLoggingOut(false);
    setIsAuthenticated(false);
    setUser(null);
    setRefreshExpiresAt(null);
  };

  // Stable refs so effects always call the latest version
  const autoLogoutRef = useRef(handleAutoLogout);
  autoLogoutRef.current = handleAutoLogout;
  const handleLogoutRef = useRef(handleLogout);
  handleLogoutRef.current = handleLogout;

  // ── Effects ───────────────────────────────────────────────────────────────

  // On mount: if a session cookie exists, fetch user data from the backend.
  useEffect(() => {
    if (getSessionActiveCookie()) {
      syncAuthState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-logout when the refresh token expires.
  useEffect(() => {
    if (!isAuthenticated || refreshExpiresAt === null) return;

    const msLeft = refreshExpiresAt - Date.now();
    if (msLeft <= 0) {
      autoLogoutRef.current();
      return;
    }

    const timer = setTimeout(
      () => autoLogoutRef.current(),
      Math.min(msLeft, 2_147_483_647) // clamp to max 32-bit int for setTimeout
    );
    return () => clearTimeout(timer);
  }, [isAuthenticated, refreshExpiresAt]);

  // Cross-tab logout: when another tab deletes the session_active cookie
  // (by logging out), this tab detects it on visibility change.
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSessionOnFocus = () => {
      if (!document.hidden && !getSessionActiveCookie()) {
        handleLogoutRef.current();
      }
    };

    document.addEventListener("visibilitychange", checkSessionOnFocus);
    return () =>
      document.removeEventListener("visibilitychange", checkSessionOnFocus);
  }, [isAuthenticated]);

  // ── Context value ─────────────────────────────────────────────────────────

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

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
