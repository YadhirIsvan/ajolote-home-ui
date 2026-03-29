import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useClientConfig } from "./use-client-config.client.hook";
import { getClientProfileAction } from "@/myAccount/client/actions/get-client-profile.actions";

vi.mock("@/myAccount/client/actions/get-client-profile.actions");

const mockedGetProfile = vi.mocked(getClientProfileAction);

const MOCK_PROFILE = {
  id: 1,
  email: "ana@example.com",
  first_name: "Ana",
  last_name: "García",
  phone: "272 123 4567",
  avatar: "https://example.com/avatar.jpg",
};

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useClientConfig", () => {
  it("profileLoading: true mientras la query está en vuelo", () => {
    mockedGetProfile.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useClientConfig(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.profileLoading).toBe(true);
  });

  it("profile poblado y phone extraído de profile.phone", async () => {
    mockedGetProfile.mockResolvedValueOnce(MOCK_PROFILE as never);
    const { result } = renderHook(() => useClientConfig(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.profileLoading).toBe(false));
    expect(result.current.profile).toEqual(MOCK_PROFILE);
    expect(result.current.phone).toBe("272 123 4567");
  });

  it("profile: null → phone: ''", async () => {
    mockedGetProfile.mockResolvedValueOnce(null as never);
    const { result } = renderHook(() => useClientConfig(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.profileLoading).toBe(false));
    expect(result.current.phone).toBe("");
  });
});
