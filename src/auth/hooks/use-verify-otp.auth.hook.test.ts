import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useVerifyOtp } from "./use-verify-otp.auth.hook";
import { verifyOtpAction } from "@/auth/actions/verify-otp.actions";

vi.mock("@/auth/actions/verify-otp.actions");

const mockedAction = vi.mocked(verifyOtpAction);

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useVerifyOtp", () => {
  it("isLoading: false en estado inicial", () => {
    const { result } = renderHook(() => useVerifyOtp(), { wrapper: makeWrapper() });
    expect(result.current.isLoading).toBe(false);
  });

  it("isLoading: true mientras la mutación está en vuelo", async () => {
    mockedAction.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useVerifyOtp(), { wrapper: makeWrapper() });

    act(() => { result.current.verify({ email: "u@x.com", token: "1234" }); });

    await waitFor(() => expect(result.current.isLoading).toBe(true));
  });

  it("verify() llama a verifyOtpAction con email, token y extra desestructurados", async () => {
    const expected = { success: true, message: "Autenticación exitosa." };
    mockedAction.mockResolvedValueOnce(expected);

    const { result } = renderHook(() => useVerifyOtp(), { wrapper: makeWrapper() });
    const extra = { first_name: "Ana", last_name: "López" };
    const response = await result.current.verify({ email: "u@x.com", token: "9876", extra });

    expect(mockedAction).toHaveBeenCalledWith("u@x.com", "9876", extra);
    expect(response).toEqual(expected);
  });
});
