import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSellPage } from "./use-sell-page.sell.hook";

vi.mock("@/shared/hooks/use-auth.hook");

import { useAuth } from "@/shared/hooks/use-auth.hook";

const mockedUseAuth = vi.mocked(useAuth);

function makeAuthMock(isAuthenticated: boolean) {
  const openAuthModal = vi.fn();
  mockedUseAuth.mockReturnValue({
    isAuthenticated,
    openAuthModal,
    user: null,
    isLoading: false,
    logout: vi.fn(),
    setUser: vi.fn(),
  } as never);
  return { openAuthModal };
}

beforeEach(() => vi.clearAllMocks());

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe("useSellPage — estado inicial", () => {
  it("isFormOpen: false, isVideoOpen: false, showAuthHint: false", () => {
    makeAuthMock(false);
    const { result } = renderHook(() => useSellPage());
    expect(result.current.isFormOpen).toBe(false);
    expect(result.current.isVideoOpen).toBe(false);
    expect(result.current.showAuthHint).toBe(false);
  });
});

// ─── openForm ─────────────────────────────────────────────────────────────────

describe("useSellPage — openForm", () => {
  it("no autenticado → showAuthHint: true, llama openAuthModal, isFormOpen permanece false", () => {
    const { openAuthModal } = makeAuthMock(false);
    const { result } = renderHook(() => useSellPage());

    act(() => result.current.openForm());

    expect(result.current.showAuthHint).toBe(true);
    expect(openAuthModal).toHaveBeenCalledTimes(1);
    expect(result.current.isFormOpen).toBe(false);
  });

  it("autenticado → isFormOpen: true, no llama openAuthModal", () => {
    const { openAuthModal } = makeAuthMock(true);
    const { result } = renderHook(() => useSellPage());

    act(() => result.current.openForm());

    expect(result.current.isFormOpen).toBe(true);
    expect(openAuthModal).not.toHaveBeenCalled();
  });
});

// ─── openVideo ────────────────────────────────────────────────────────────────

describe("useSellPage — openVideo", () => {
  it("openVideo() establece isVideoOpen: true", () => {
    makeAuthMock(true);
    const { result } = renderHook(() => useSellPage());

    act(() => result.current.openVideo());

    expect(result.current.isVideoOpen).toBe(true);
  });
});
