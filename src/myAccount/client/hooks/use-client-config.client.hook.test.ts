import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useClientConfig } from "./use-client-config.client.hook";
import { getClientProfileAction } from "@/myAccount/client/actions/get-client-profile.actions";
import { updateClientProfileAction } from "@/myAccount/client/actions/update-client-profile.actions";

vi.mock("@/myAccount/client/actions/get-client-profile.actions");
vi.mock("@/myAccount/client/actions/update-client-profile.actions");

const mockedGetProfile = vi.mocked(getClientProfileAction);
const mockedUpdate = vi.mocked(updateClientProfileAction);

const MOCK_PROFILE = {
  id: 1,
  email: "ana@example.com",
  first_name: "Ana",
  last_name: "García",
  phone: "+525512345678",
  avatar: null,
  city: "CDMX",
};

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useClientConfig — query", () => {
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
    expect(result.current.phone).toBe("+525512345678");
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

describe("useClientConfig — updateProfile mutation", () => {
  it("updateProfile llama a updateClientProfileAction con los datos", async () => {
    mockedGetProfile.mockResolvedValueOnce(MOCK_PROFILE as never);
    mockedUpdate.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useClientConfig(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.profileLoading).toBe(false));

    await act(async () => {
      await result.current.updateProfile({
        phone: "+525599999999",
        first_name: "Beatriz",
      });
    });

    expect(mockedUpdate.mock.calls[0][0]).toEqual({
      phone: "+525599999999",
      first_name: "Beatriz",
    });
  });

  it("isSaving: true durante la mutación", async () => {
    mockedGetProfile.mockResolvedValueOnce(MOCK_PROFILE as never);
    let resolve!: (v: { success: boolean }) => void;
    mockedUpdate.mockReturnValueOnce(
      new Promise((r) => {
        resolve = r;
      })
    );

    const { result } = renderHook(() => useClientConfig(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.profileLoading).toBe(false));

    act(() => {
      void result.current.updateProfile({ phone: "+525512345678" });
    });

    await waitFor(() => expect(result.current.isSaving).toBe(true));

    await act(async () => {
      resolve({ success: true });
    });

    await waitFor(() => expect(result.current.isSaving).toBe(false));
  });

  it("mutación exitosa invalida la query client-user-profile", async () => {
    mockedGetProfile.mockResolvedValue(MOCK_PROFILE as never);
    mockedUpdate.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useClientConfig(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.profileLoading).toBe(false));

    await act(async () => {
      await result.current.updateProfile({ phone: "+525512345678" });
    });

    // invalidateQueries → refetch → getClientProfileAction llamado 2 veces (inicial + post-update)
    await waitFor(() => expect(mockedGetProfile).toHaveBeenCalledTimes(2));
  });

  it("mutación fallida NO invalida la query", async () => {
    mockedGetProfile.mockResolvedValueOnce(MOCK_PROFILE as never);
    mockedUpdate.mockResolvedValueOnce({
      success: false,
      message: "error",
    });

    const { result } = renderHook(() => useClientConfig(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.profileLoading).toBe(false));

    await act(async () => {
      await result.current.updateProfile({ phone: "+525512345678" });
    });

    expect(mockedGetProfile).toHaveBeenCalledTimes(1);
  });
});
