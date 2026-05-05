import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useAdminClientes } from "./use-admin-clientes.admin.hook";
import {
  getAdminClientsAction,
  getAdminClientDetailAction,
} from "@/myAccount/admin/actions/get-admin-clients.actions";

vi.mock("@/myAccount/admin/actions/get-admin-clients.actions");

const mockedGetClients = vi.mocked(getAdminClientsAction);
const mockedGetDetail = vi.mocked(getAdminClientDetailAction);

const MOCK_CLIENTS = {
  results: [
    { id: 1, name: "Juan García", email: "juan@x.com", phone: "+525512345678" },
    { id: 2, name: "Ana López",   email: "ana@x.com",  phone: "+525598765432" },
  ],
  count: 2,
};

const MOCK_DETAIL = { id: 1, name: "Juan García", email: "juan@x.com", appointments: [] };

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

function renderClientes(opts = { searchTerm: "", selectedClientId: null as number | null, isDetailOpen: false }) {
  return renderHook(() => useAdminClientes(opts), { wrapper: makeWrapper() });
}

beforeEach(() => vi.clearAllMocks());

// ─── clients query ────────────────────────────────────────────────────────────

describe("useAdminClientes — clients query", () => {
  it("clients vacío mientras carga", () => {
    mockedGetClients.mockReturnValue(new Promise(() => {}));
    mockedGetDetail.mockReturnValue(new Promise(() => {}));

    const { result } = renderClientes();

    expect(result.current.clients).toEqual([]);
  });

  it("clients se popula tras resolver", async () => {
    mockedGetClients.mockResolvedValueOnce(MOCK_CLIENTS as never);
    mockedGetDetail.mockReturnValue(new Promise(() => {}));

    const { result } = renderClientes();

    await waitFor(() => expect(result.current.clientsQuery.isSuccess).toBe(true));

    expect(result.current.clients).toHaveLength(2);
    expect(result.current.clients[0].name).toBe("Juan García");
  });

  it("pasa searchTerm a la action", async () => {
    mockedGetClients.mockResolvedValueOnce(MOCK_CLIENTS as never);
    mockedGetDetail.mockReturnValue(new Promise(() => {}));

    renderHook(
      () => useAdminClientes({ searchTerm: "juan", selectedClientId: null, isDetailOpen: false }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() =>
      expect(mockedGetClients).toHaveBeenCalledWith(
        expect.objectContaining({ search: "juan" })
      )
    );
  });
});

// ─── detailQuery (habilitada condicionalmente) ─────────────────────────────────

describe("useAdminClientes — detailQuery condicional", () => {
  it("selectedClientId null → no llama a getAdminClientDetailAction", () => {
    mockedGetClients.mockReturnValue(new Promise(() => {}));
    mockedGetDetail.mockReturnValue(new Promise(() => {}));

    renderClientes({ searchTerm: "", selectedClientId: null, isDetailOpen: true });

    expect(mockedGetDetail).not.toHaveBeenCalled();
  });

  it("isDetailOpen false → no llama a getAdminClientDetailAction", () => {
    mockedGetClients.mockReturnValue(new Promise(() => {}));
    mockedGetDetail.mockReturnValue(new Promise(() => {}));

    renderClientes({ searchTerm: "", selectedClientId: 1, isDetailOpen: false });

    expect(mockedGetDetail).not.toHaveBeenCalled();
  });

  it("selectedClientId + isDetailOpen → llama a getAdminClientDetailAction con el id correcto", async () => {
    mockedGetClients.mockResolvedValueOnce(MOCK_CLIENTS as never);
    mockedGetDetail.mockResolvedValueOnce(MOCK_DETAIL as never);

    renderHook(
      () => useAdminClientes({ searchTerm: "", selectedClientId: 1, isDetailOpen: true }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(mockedGetDetail).toHaveBeenCalledWith(1));
  });

  it("clientDetail null cuando la query está deshabilitada", () => {
    mockedGetClients.mockReturnValue(new Promise(() => {}));
    mockedGetDetail.mockReturnValue(new Promise(() => {}));

    const { result } = renderClientes();

    expect(result.current.clientDetail).toBeNull();
  });
});
