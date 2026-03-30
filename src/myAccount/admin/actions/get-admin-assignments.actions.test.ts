import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAdminAssignmentsAction,
  createAdminAssignmentAction,
  deleteAdminAssignmentAction,
} from "./get-admin-assignments.actions";
import { adminApi } from "@/myAccount/admin/api/admin.api";

vi.mock("@/myAccount/admin/api/admin.api");

const mockedApi = vi.mocked(adminApi);

const BACKEND_RESPONSE = {
  unassigned_properties: [
    { id: 1, title: "Casa sin agente", property_type: "casa" },
  ],
  assignments: [
    {
      property: { id: 2, title: "Casa asignada", property_type: "departamento" },
      agents: [
        { id: 10, membership_id: "MEM-010", name: "Agente Uno", is_visible: true },
      ],
    },
  ],
};

beforeEach(() => vi.clearAllMocks());

// ─── getAdminAssignmentsAction ────────────────────────────────────────────────

describe("getAdminAssignmentsAction — mapeo", () => {
  it("mapea unassigned_properties y assignments correctamente", async () => {
    mockedApi.getAssignments.mockResolvedValueOnce({
      data: BACKEND_RESPONSE,
    } as never);

    const result = await getAdminAssignmentsAction();

    expect(result.unassignedProperties).toHaveLength(1);
    expect(result.unassignedProperties[0].propertyType).toBe("casa");

    expect(result.assignments).toHaveLength(1);
    const assignment = result.assignments[0];
    expect(assignment.property.title).toBe("Casa asignada");
    expect(assignment.agents[0].membershipId).toBe("MEM-010");
    expect(assignment.agents[0].isVisible).toBe(true);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getAssignments.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminAssignmentsAction()).rejects.toThrow();
  });
});

// ─── createAdminAssignmentAction ──────────────────────────────────────────────

describe("createAdminAssignmentAction", () => {
  it("llama a la API con los parámetros correctos", async () => {
    mockedApi.createAssignment.mockResolvedValueOnce(undefined as never);

    await createAdminAssignmentAction(10, 20, false);

    expect(mockedApi.createAssignment).toHaveBeenCalledWith(10, 20, false);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.createAssignment.mockRejectedValueOnce(new Error("err"));
    await expect(createAdminAssignmentAction(1, 1)).rejects.toThrow();
  });
});

// ─── deleteAdminAssignmentAction ──────────────────────────────────────────────

describe("deleteAdminAssignmentAction", () => {
  it("llama a la API con el id correcto", async () => {
    mockedApi.deleteAssignment.mockResolvedValueOnce(undefined as never);

    await deleteAdminAssignmentAction(99);

    expect(mockedApi.deleteAssignment).toHaveBeenCalledWith(99);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.deleteAssignment.mockRejectedValueOnce(new Error("err"));
    await expect(deleteAdminAssignmentAction(1)).rejects.toThrow();
  });
});
