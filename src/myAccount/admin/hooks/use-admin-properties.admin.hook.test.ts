import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useAdminProperties } from "./use-admin-properties.admin.hook";
import {
  getAdminPropertiesAction,
  deleteAdminPropertyAction,
  toggleAdminPropertyFeaturedAction,
  getAdminStatesAction,
  getAdminCitiesAction,
  getAdminAmenitiesAction,
} from "@/myAccount/admin/actions/get-admin-properties.actions";

vi.mock("@/myAccount/admin/actions/get-admin-properties.actions");
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockedGetProperties = vi.mocked(getAdminPropertiesAction);
const mockedDelete = vi.mocked(deleteAdminPropertyAction);
const mockedToggleFeatured = vi.mocked(toggleAdminPropertyFeaturedAction);
const mockedGetStates = vi.mocked(getAdminStatesAction);
const mockedGetCities = vi.mocked(getAdminCitiesAction);
const mockedGetAmenities = vi.mocked(getAdminAmenitiesAction);

const MOCK_PROPERTIES = [
  { id: 1, title: "Casa A", price: "2500000", status: "disponible" },
  { id: 2, title: "Depto B", price: "1800000", status: "disponible" },
];

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

function renderProperties(opts = { isFormOpen: false, selectedStateId: null as number | null }) {
  return renderHook(() => useAdminProperties(opts), { wrapper: makeWrapper() });
}

beforeEach(() => vi.clearAllMocks());

// ─── propertiesQuery siempre activa ──────────────────────────────────────────

describe("useAdminProperties — propertiesQuery", () => {
  it("llama a getAdminPropertiesAction con limit 200", async () => {
    mockedGetProperties.mockResolvedValueOnce(MOCK_PROPERTIES as never);

    renderProperties();

    await waitFor(() =>
      expect(mockedGetProperties).toHaveBeenCalledWith({ limit: 200 })
    );
  });

  it("propertiesQuery poblado tras resolver", async () => {
    mockedGetProperties.mockResolvedValueOnce(MOCK_PROPERTIES as never);

    const { result } = renderProperties();

    await waitFor(() => expect(result.current.propertiesQuery.isSuccess).toBe(true));

    expect(result.current.propertiesQuery.data).toHaveLength(2);
  });
});

// ─── queries condicionales (isFormOpen) ──────────────────────────────────────

describe("useAdminProperties — queries condicionales", () => {
  it("isFormOpen false → no llama a getAdminStatesAction", () => {
    mockedGetProperties.mockReturnValue(new Promise(() => {}));

    renderProperties({ isFormOpen: false, selectedStateId: null });

    expect(mockedGetStates).not.toHaveBeenCalled();
    expect(mockedGetAmenities).not.toHaveBeenCalled();
  });

  it("isFormOpen true → llama a states y amenities", async () => {
    mockedGetProperties.mockResolvedValue(MOCK_PROPERTIES as never);
    mockedGetStates.mockResolvedValueOnce([] as never);
    mockedGetAmenities.mockResolvedValueOnce([] as never);

    renderProperties({ isFormOpen: true, selectedStateId: null });

    await waitFor(() => {
      expect(mockedGetStates).toHaveBeenCalled();
      expect(mockedGetAmenities).toHaveBeenCalled();
    });
  });

  it("isFormOpen true + selectedStateId null → no llama a getAdminCitiesAction", () => {
    mockedGetProperties.mockReturnValue(new Promise(() => {}));
    mockedGetStates.mockReturnValue(new Promise(() => {}));
    mockedGetAmenities.mockReturnValue(new Promise(() => {}));

    renderProperties({ isFormOpen: true, selectedStateId: null });

    expect(mockedGetCities).not.toHaveBeenCalled();
  });

  it("isFormOpen true + selectedStateId → llama a getAdminCitiesAction", async () => {
    mockedGetProperties.mockResolvedValue(MOCK_PROPERTIES as never);
    mockedGetStates.mockResolvedValueOnce([] as never);
    mockedGetAmenities.mockResolvedValueOnce([] as never);
    mockedGetCities.mockResolvedValueOnce([] as never);

    renderHook(
      () => useAdminProperties({ isFormOpen: true, selectedStateId: 3 }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(mockedGetCities).toHaveBeenCalledWith(3));
  });
});

// ─── deleteMutation ───────────────────────────────────────────────────────────

describe("useAdminProperties — deleteMutation", () => {
  it("éxito → invalida la query 'admin-properties'", async () => {
    mockedGetProperties.mockResolvedValue(MOCK_PROPERTIES as never);
    mockedDelete.mockResolvedValueOnce(undefined as never);

    const { result } = renderProperties();
    await waitFor(() => expect(result.current.propertiesQuery.isSuccess).toBe(true));

    const callsBefore = mockedGetProperties.mock.calls.length;

    act(() => { result.current.deleteMutation.mutate(1); });

    await waitFor(() => expect(result.current.deleteMutation.isSuccess).toBe(true));
    expect(mockedGetProperties.mock.calls.length).toBeGreaterThan(callsBefore);
  });
});

// ─── toggleFeaturedMutation ───────────────────────────────────────────────────

describe("useAdminProperties — toggleFeaturedMutation", () => {
  it("llama a toggleAdminPropertyFeaturedAction con el id correcto", async () => {
    mockedGetProperties.mockResolvedValue(MOCK_PROPERTIES as never);
    mockedToggleFeatured.mockResolvedValueOnce(undefined as never);

    const { result } = renderProperties();

    act(() => { result.current.toggleFeaturedMutation.mutate(7); });

    await waitFor(() => expect(mockedToggleFeatured).toHaveBeenCalledWith(7));
  });
});
