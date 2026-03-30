import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useClientCompras } from "./use-client-compras.client.hook";
import { getClientPropertiesBuyAction } from "@/myAccount/client/actions/get-client-properties-buy.actions";
import { getClientPropertyFilesAction } from "@/myAccount/client/actions/get-client-property-files.actions";
import { getClientPurchaseStepsAction } from "@/myAccount/client/actions/get-client-purchase-steps.actions";
import { uploadClientPropertyFilesAction } from "@/myAccount/client/actions/upload-client-property-files.actions";

vi.mock("@/myAccount/client/actions/get-client-properties-buy.actions");
vi.mock("@/myAccount/client/actions/get-client-property-files.actions");
vi.mock("@/myAccount/client/actions/get-client-purchase-steps.actions");
vi.mock("@/myAccount/client/actions/upload-client-property-files.actions");

const mockedGetBuy = vi.mocked(getClientPropertiesBuyAction);
const mockedGetFiles = vi.mocked(getClientPropertyFilesAction);
const mockedGetSteps = vi.mocked(getClientPurchaseStepsAction);
const mockedUpload = vi.mocked(uploadClientPropertyFilesAction);

const PROPERTY_A = { id: 1, title: "Casa A", overallProgress: 60 };
const PROPERTY_B = { id: 2, title: "Casa B", overallProgress: 30 };
const MOCK_FILES = [{ id: 10, name: "contrato.pdf" }];
const MOCK_STEPS = [{ label: "Oferta", done: true, current: false, allowUpload: false }];

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetFiles.mockResolvedValue(MOCK_FILES as never);
  mockedGetSteps.mockResolvedValue(MOCK_STEPS as never);
  mockedUpload.mockResolvedValue(undefined);
});

// ─── buildStepsFromProgress ───────────────────────────────────────────────────

describe("useClientCompras — buildStepsFromProgress", () => {
  it("progress 0 → todos done: false, current: false, allowUpload: false", () => {
    mockedGetBuy.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useClientCompras(), {
      wrapper: makeWrapper(),
    });
    const steps = result.current.buildStepsFromProgress(0);
    expect(steps.every((s) => !s.done && !s.current && !s.allowUpload)).toBe(true);
  });

  it("progress 15 → 'Oferta': done: true, current: true", () => {
    mockedGetBuy.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useClientCompras(), {
      wrapper: makeWrapper(),
    });
    const steps = result.current.buildStepsFromProgress(15);
    expect(steps[0].label).toBe("Oferta");
    expect(steps[0].done).toBe(true);
    expect(steps[0].current).toBe(true);
  });

  it("progress 60 → 'Documentos verificados': current: true, allowUpload: true", () => {
    mockedGetBuy.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useClientCompras(), {
      wrapper: makeWrapper(),
    });
    const steps = result.current.buildStepsFromProgress(60);
    const docs = steps.find((s) => s.label === "Documentos verificados")!;
    expect(docs.current).toBe(true);
    expect(docs.allowUpload).toBe(true);
  });

  it("progress 100 → todos done: true", () => {
    mockedGetBuy.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useClientCompras(), {
      wrapper: makeWrapper(),
    });
    const steps = result.current.buildStepsFromProgress(100);
    expect(steps.every((s) => s.done)).toBe(true);
  });
});

// ─── Listas y viewingDetailId ─────────────────────────────────────────────────

describe("useClientCompras — listas y selección", () => {
  it("lista vacía: singleProperty null, viewingDetailId null, displayList []", async () => {
    mockedGetBuy.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useClientCompras(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.comprasLoading).toBe(false));
    expect(result.current.singleProperty).toBeNull();
    expect(result.current.viewingDetailId).toBeNull();
    expect(result.current.displayList).toEqual([]);
  });

  it("una sola propiedad: singleProperty apunta a ella, viewingDetailId = su id", async () => {
    mockedGetBuy.mockResolvedValueOnce([PROPERTY_A] as never);
    const { result } = renderHook(() => useClientCompras(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.comprasLoading).toBe(false));
    expect(result.current.singleProperty?.id).toBe(1);
    expect(result.current.viewingDetailId).toBe(1);
    expect(result.current.displayList).toEqual([]);
  });

  it("múltiples propiedades: displayList tiene elementos, singleProperty null", async () => {
    mockedGetBuy.mockResolvedValueOnce([PROPERTY_A, PROPERTY_B] as never);
    const { result } = renderHook(() => useClientCompras(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.comprasLoading).toBe(false));
    expect(result.current.singleProperty).toBeNull();
    expect(result.current.displayList).toHaveLength(2);
  });

  it("setSelectedPropertyId sobrescribe viewingDetailId incluso con singleProperty", async () => {
    mockedGetBuy.mockResolvedValueOnce([PROPERTY_A] as never);
    const { result } = renderHook(() => useClientCompras(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.comprasLoading).toBe(false));
    expect(result.current.viewingDetailId).toBe(1);

    act(() => result.current.setSelectedPropertyId(99));

    expect(result.current.viewingDetailId).toBe(99);
  });
});

// ─── Queries dependientes de viewingDetailId ──────────────────────────────────

describe("useClientCompras — filesData y purchaseSteps", () => {
  it("filesData vacío cuando viewingDetailId es null (query disabled)", async () => {
    mockedGetBuy.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useClientCompras(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.comprasLoading).toBe(false));
    expect(result.current.filesData).toEqual([]);
    expect(mockedGetFiles).not.toHaveBeenCalled();
  });
});

// ─── triggerUpload ────────────────────────────────────────────────────────────

describe("useClientCompras — triggerUpload", () => {
  it("triggerUpload(id) actualiza activePropertyId", async () => {
    mockedGetBuy.mockResolvedValueOnce([PROPERTY_A] as never);
    const { result } = renderHook(() => useClientCompras(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.comprasLoading).toBe(false));

    act(() => result.current.triggerUpload(1));

    expect(result.current.activePropertyId).toBe(1);
  });
});
