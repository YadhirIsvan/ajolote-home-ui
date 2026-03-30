import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AuthGuard from "./AuthGuard";

// LoginPage tiene muchas dependencias internas — la mockeamos con un marcador
// simple para que los tests se centren en la lógica de guardia, no en el render.
vi.mock("@/auth/pages/LoginPage", () => ({
  default: () => <div data-testid="login-page" />,
}));

const NO_OP = vi.fn();

const DEFAULT_PROPS = {
  showAuthModal: false,
  onOpenAuthModal: NO_OP,
  onCloseAuthModal: NO_OP,
  onLoginSuccess: NO_OP,
};

describe("AuthGuard", () => {
  it("no autenticado → renderiza LoginPage, no renderiza children", () => {
    render(
      <AuthGuard {...DEFAULT_PROPS} isAuthenticated={false} role={null}>
        <div data-testid="protected-content" />
      </AuthGuard>
    );

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("autenticado pero role: null → renderiza LoginPage, no renderiza children", () => {
    render(
      <AuthGuard {...DEFAULT_PROPS} isAuthenticated={true} role={null}>
        <div data-testid="protected-content" />
      </AuthGuard>
    );

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("autenticado con role → renderiza children, no renderiza LoginPage", () => {
    render(
      <AuthGuard {...DEFAULT_PROPS} isAuthenticated={true} role="client">
        <div data-testid="protected-content" />
      </AuthGuard>
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });
});
