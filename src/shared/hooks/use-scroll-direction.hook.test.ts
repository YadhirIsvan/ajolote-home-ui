import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { createElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { useScrollDirection } from "./use-scroll-direction.hook";

function makeWrapper(initialPath = "/") {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(MemoryRouter, { initialEntries: [initialPath] }, children);
}

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    value,
    writable: true,
    configurable: true,
  });
}

describe("useScrollDirection", () => {
  it("estado inicial: visible = true", () => {
    setScrollY(0);
    const { result } = renderHook(() => useScrollDirection(), {
      wrapper: makeWrapper(),
    });
    expect(result.current).toBe(true);
  });

  it("scroll hacia abajo → visible: false", () => {
    setScrollY(0);
    const { result } = renderHook(() => useScrollDirection(), {
      wrapper: makeWrapper(),
    });

    act(() => {
      setScrollY(200);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  it("scroll hacia arriba desde posición baja → visible: true", () => {
    setScrollY(0);
    const { result } = renderHook(() => useScrollDirection(), {
      wrapper: makeWrapper(),
    });

    // Primero bajar
    act(() => {
      setScrollY(200);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);

    // Luego subir
    act(() => {
      setScrollY(100);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("scroll a 0 → visible: true siempre (tope superior)", () => {
    setScrollY(0);
    const { result } = renderHook(() => useScrollDirection(), {
      wrapper: makeWrapper(),
    });

    // Bajar primero
    act(() => {
      setScrollY(300);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);

    // Volver al tope
    act(() => {
      setScrollY(0);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });
});
