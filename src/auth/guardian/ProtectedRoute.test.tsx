import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "@/shared/hooks/use-auth.hook";

vi.mock("@/shared/hooks/use-auth.hook", () => ({
  useAuth: vi.fn(),
}));
vi.mock("@/auth/pages/LoginPage", () => ({
  default: () => <div data-testid="login-page" />,
}));

const mockedUseAuth = vi.mocked(useAuth);

const BASE_AUTH = {
  isLoadingUser: false,
  isAuthenticated: false,
  isLoggingOut: false,
  showAuthModal: false,
  user: null,
  role: null,
  openAuthModal: vi.fn(),
  closeAuthModal: vi.fn(),
  syncAuthState: vi.fn(),
  handleLoginSuccess: vi.fn(),
  handleLogout: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe("ProtectedRoute", () => {
  it("isLoadingUser → muestra spinner, no children ni LoginPage", () => {
    mockedUseAuth.mockReturnValue({ ...BASE_AUTH, isLoadingUser: true } as never);

    render(
      <ProtectedRoute>
        <div data-testid="protected-content" />
      </ProtectedRoute>
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });

  it("no autenticado (carga completa) → muestra LoginPage, no children", () => {
    mockedUseAuth.mockReturnValue({
      ...BASE_AUTH,
      isLoadingUser: false,
      isAuthenticated: false,
    } as never);

    render(
      <ProtectedRoute>
        <div data-testid="protected-content" />
      </ProtectedRoute>
    );

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("autenticado → muestra children, no LoginPage ni spinner", () => {
    mockedUseAuth.mockReturnValue({
      ...BASE_AUTH,
      isLoadingUser: false,
      isAuthenticated: true,
    } as never);

    render(
      <ProtectedRoute>
        <div data-testid="protected-content" />
      </ProtectedRoute>
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });
});
