import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClientPurchaseStepsAction } from "./get-client-purchase-steps.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: { getPropertyDetail: vi.fn() },
}));

const mockedGetPropertyDetail = vi.mocked(clientApi.getPropertyDetail);

function makeStep(overrides = {}) {
  return {
    key: "docs",
    label: "Documentos",
    progress: 60,
    status: "current",
    allow_upload: true,
    ...overrides,
  };
}

beforeEach(() => vi.clearAllMocks());

describe("getClientPurchaseStepsAction", () => {
  it("status 'completed' → done: true, current: false", async () => {
    mockedGetPropertyDetail.mockResolvedValueOnce({
      data: { steps: [makeStep({ status: "completed", allow_upload: false })] },
    } as never);

    const [step] = await getClientPurchaseStepsAction(5);

    expect(step.done).toBe(true);
    expect(step.current).toBe(false);
    expect(step.allowUpload).toBe(false);
  });

  it("status 'current' → done: false, current: true", async () => {
    mockedGetPropertyDetail.mockResolvedValueOnce({
      data: { steps: [makeStep({ status: "current" })] },
    } as never);

    const [step] = await getClientPurchaseStepsAction(5);

    expect(step.done).toBe(false);
    expect(step.current).toBe(true);
  });

  it("status 'pending' → done: false, current: false, allow_upload mapeado a allowUpload", async () => {
    mockedGetPropertyDetail.mockResolvedValueOnce({
      data: {
        steps: [
          makeStep({ status: "pending", allow_upload: false }),
          makeStep({ key: "credit", label: "Crédito", status: "pending", allow_upload: true }),
        ],
      },
    } as never);

    const steps = await getClientPurchaseStepsAction(5);

    expect(steps[0].done).toBe(false);
    expect(steps[0].current).toBe(false);
    expect(steps[1].allowUpload).toBe(true);
  });

  it("detail.steps ausente → retorna []", async () => {
    mockedGetPropertyDetail.mockResolvedValueOnce({ data: {} } as never);

    const result = await getClientPurchaseStepsAction(5);

    expect(result).toEqual([]);
  });

  it("error → lanza un Error", async () => {
    mockedGetPropertyDetail.mockRejectedValueOnce(new Error("Server error"));

    await expect(getClientPurchaseStepsAction(5)).rejects.toThrow("Server error");
  });
});
