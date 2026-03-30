import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useRegister } from "./use-register.auth.hook";
import { registerAction } from "@/auth/actions/register.actions";

vi.mock("@/auth/actions/register.actions");

const mockedAction = vi.mocked(registerAction);

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

const VALID_REQUEST = {
  email: "test@example.com",
  first_name: "Juan",
  last_name: "Pérez",
};

beforeEach(() => vi.clearAllMocks());

describe("useRegister", () => {
  it("isLoading: false en estado inicial", () => {
    const { result } = renderHook(() => useRegister(), { wrapper: makeWrapper() });
    expect(result.current.isLoading).toBe(false);
  });

  it("isLoading: true mientras la mutación está en vuelo", async () => {
    mockedAction.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useRegister(), { wrapper: makeWrapper() });

    act(() => { result.current.register(VALID_REQUEST); });

    await waitFor(() => expect(result.current.isLoading).toBe(true));
  });

  it("register() llama a registerAction con los datos correctos y retorna su resultado", async () => {
    const expected = { success: true, message: "Cuenta creada.", email: "test@example.com" };
    mockedAction.mockResolvedValueOnce(expected);

    const { result } = renderHook(() => useRegister(), { wrapper: makeWrapper() });
    const response = await result.current.register(VALID_REQUEST);

    expect(mockedAction).toHaveBeenCalledWith(VALID_REQUEST);
    expect(response).toEqual(expected);
  });
});
