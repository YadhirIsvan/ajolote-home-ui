import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAdminDashboard } from "./use-admin-dashboard.admin.hook";

describe("useAdminDashboard", () => {
  it("activeTab es 'propiedades' por defecto", () => {
    const { result } = renderHook(() => useAdminDashboard());
    expect(result.current.activeTab).toBe("propiedades");
  });

  it("setActiveTab actualiza activeTab", () => {
    const { result } = renderHook(() => useAdminDashboard());
    act(() => result.current.setActiveTab("agentes"));
    expect(result.current.activeTab).toBe("agentes");
  });

  it("setActiveTab acepta cualquier AdminTab válida", () => {
    const { result } = renderHook(() => useAdminDashboard());
    act(() => result.current.setActiveTab("clientes"));
    expect(result.current.activeTab).toBe("clientes");
  });
});
