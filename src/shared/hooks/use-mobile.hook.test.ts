import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile.hook";

type MqlListener = () => void;

function mockMatchMedia(initialWidth: number) {
  const listeners: MqlListener[] = [];

  Object.defineProperty(window, "innerWidth", {
    value: initialWidth,
    writable: true,
    configurable: true,
  });

  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: initialWidth < 768,
      addEventListener: vi.fn((_: string, listener: MqlListener) =>
        listeners.push(listener)
      ),
      removeEventListener: vi.fn(),
    }))
  );

  return {
    triggerChange: (newWidth: number) => {
      Object.defineProperty(window, "innerWidth", {
        value: newWidth,
        writable: true,
        configurable: true,
      });
      listeners.forEach((fn) => fn());
    },
  };
}

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.unstubAllGlobals());

describe("useIsMobile", () => {
  it("innerWidth < 768 → retorna true", () => {
    mockMatchMedia(375);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("innerWidth >= 768 → retorna false", () => {
    mockMatchMedia(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("evento change actualiza el valor", () => {
    const { triggerChange } = mockMatchMedia(1024);
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    act(() => triggerChange(375));

    expect(result.current).toBe(true);
  });
});
