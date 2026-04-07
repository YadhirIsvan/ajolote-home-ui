import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminAssignmentsAction,
  createAdminAssignmentAction,
  deleteAdminAssignmentAction,
} from "@/myAccount/admin/actions/get-admin-assignments.actions";
import { getAdminAgentsAction } from "@/myAccount/admin/actions/get-admin-agents.actions";
import { getAdminPropertiesAction } from "@/myAccount/admin/actions/get-admin-properties.actions";
import {
  Home,
  User,
  ArrowRight,
  X,
  Check,
  Search,
  ArrowLeftRight,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { useIsMobile } from "@/shared/hooks/use-mobile.hook";
import { toast } from "sonner";
import { getApiOrigin } from "@/shared/utils/media-url.utils";

// ─── Media URL helper ─────────────────────────────────────────────────────────
const getMediaUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${getApiOrigin()}${url}`;
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface PropertyRow {
  rawId: number;
  title: string;
  image: string;
  price: string;
  address: string;
  // null = unassigned
  agentName: string | null;
  agentAvatar: string | null;
  agentMembershipId: number | null;
  // ALL assignment IDs for this property (to delete all at once)
  allAssignmentIds: number[];
}

interface AgentRow {
  membershipId: number;
  name: string;
  avatar: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AsignarSection = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<PropertyRow | null>(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // ─── Queries ──────────────────────────────────────────────────────────────────

  const assignmentsQuery = useQuery({
    queryKey: ["admin-assignments"],
    queryFn: getAdminAssignmentsAction,
  });

  const agentsQuery = useQuery({
    queryKey: ["admin-agents"],
    queryFn: getAdminAgentsAction,
  });

  const propertiesQuery = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => getAdminPropertiesAction({ limit: 200 }),
  });

  // ─── Mutations ────────────────────────────────────────────────────────────────

  // Assign to an unassigned property (no existing assignments to remove)
  const assignMutation = useMutation({
    mutationFn: ({ propertyId, membershipId }: { propertyId: number; membershipId: number }) =>
      createAdminAssignmentAction(propertyId, membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast.success("Propiedad asignada");
    },
    onError: () => toast.error("Error al asignar la propiedad"),
  });

  // Transfer: delete ALL existing assignments, then create new one
  const transferMutation = useMutation({
    mutationFn: async ({
      propertyId,
      allAssignmentIds,
      newMembershipId,
    }: {
      propertyId: number;
      allAssignmentIds: number[];
      newMembershipId: number;
    }) => {
      if (allAssignmentIds.length > 0) {
        await Promise.all(allAssignmentIds.map((id) => deleteAdminAssignmentAction(id)));
      }
      await createAdminAssignmentAction(propertyId, newMembershipId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast.success("Agente actualizado");
      setIsTransferOpen(false);
    },
    onError: () => toast.error("Error al cambiar el agente"),
  });

  // Remove: delete ALL assignments → property moves to "Sin Asignar"
  const removeMutation = useMutation({
    mutationFn: (allAssignmentIds: number[]) =>
      Promise.all(allAssignmentIds.map((id) => deleteAdminAssignmentAction(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast.success("Agente removido");
    },
    onError: () => toast.error("Error al remover el agente"),
  });

  // ─── Derived data ─────────────────────────────────────────────────────────────

  const propertyDetailsMap = new Map(
    (propertiesQuery.data?.results ?? []).map((p) => [p.id, p])
  );

  const agents: AgentRow[] = (agentsQuery.data?.results ?? []).map((a) => ({
    membershipId: a.membershipId,
    name: a.name,
    avatar: a.avatar ?? a.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
  }));

  const rows: PropertyRow[] = (() => {
    if (!assignmentsQuery.data) return [];

    const unassigned: PropertyRow[] = (assignmentsQuery.data.unassignedProperties ?? []).map((p) => {
      const detail = propertyDetailsMap.get(p.id);
      return {
        rawId: p.id,
        title: p.title,
        image: getMediaUrl(detail?.image),
        price: detail?.price ?? "",
        address: detail?.address ?? "",
        agentName: null,
        agentAvatar: null,
        agentMembershipId: null,
        allAssignmentIds: [],
      };
    });

    const assigned: PropertyRow[] = (assignmentsQuery.data.assignments ?? []).map((a) => {
      const detail = propertyDetailsMap.get(a.property.id);
      // Pick the most recently assigned agent (last in array since backend orders by assigned_at asc internally,
      // or just use index 0 — we fix duplicates by always deleting-all on transfer/remove)
      const primaryAgent = a.agents[0] ?? null;
      const agentRow = agents.find((ag) => ag.membershipId === primaryAgent?.membershipId);
      return {
        rawId: a.property.id,
        title: a.property.title,
        image: getMediaUrl(detail?.image),
        price: detail?.price ?? "",
        address: detail?.address ?? "",
        agentName: primaryAgent?.name ?? null,
        agentAvatar: agentRow?.avatar ?? null,
        agentMembershipId: primaryAgent?.membershipId ?? null,
        // Store ALL assignment IDs so we can delete all at once
        allAssignmentIds: (a.agents ?? []).map((ag) => ag.id),
      };
    });

    return [...unassigned, ...assigned];
  })();

  const unassignedRows = rows.filter((p) => !p.agentName);
  const assignedRows = rows.filter((p) => !!p.agentName);

  const filterRow = (p: PropertyRow) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.agentName ?? "").toLowerCase().includes(searchTerm.toLowerCase());

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const handleAssign = (propertyRawId: number, membershipId: number) => {
    assignMutation.mutate({ propertyId: propertyRawId, membershipId });
  };

  const handleRemoveAgent = (property: PropertyRow) => {
    if (!property.allAssignmentIds.length) return;
    removeMutation.mutate(property.allAssignmentIds);
  };

  const handleOpenTransfer = (property: PropertyRow) => {
    setSelectedProperty(property);
    setIsTransferOpen(true);
  };

  const handleTransfer = (newMembershipId: number) => {
    if (!selectedProperty) return;
    transferMutation.mutate({
      propertyId: selectedProperty.rawId,
      allAssignmentIds: selectedProperty.allAssignmentIds,
      newMembershipId,
    });
  };

  // ─── Sub-renders ──────────────────────────────────────────────────────────────

  const PropertyCard = ({ property, showAssignSelect }: { property: PropertyRow; showAssignSelect: boolean }) => (
    <Card className="border-border/50 hover:border-champagne-gold/50 transition-all overflow-hidden">
      <div className="flex">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="w-24 h-24 md:w-28 md:h-28 object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-24 h-24 md:w-28 md:h-28 bg-muted/30 flex items-center justify-center flex-shrink-0">
            <Home className="w-8 h-8 text-foreground/20" />
          </div>
        )}
        <CardContent className="p-3 md:p-4 flex-1 min-w-0">
          <h3 className="font-semibold text-midnight truncate text-sm md:text-base">{property.title}</h3>
          {property.address && (
            <div className="flex items-center gap-1 text-xs text-foreground/60 mb-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{property.address}</span>
            </div>
          )}
          {property.price && (
            <p className="text-sm font-bold text-champagne-gold mb-2">{property.price}</p>
          )}

          {showAssignSelect ? (
            <Select
              onValueChange={(value) => handleAssign(property.rawId, Number(value))}
              disabled={assignMutation.isPending}
            >
              <SelectTrigger className="h-9 text-xs border-champagne-gold/50">
                <SelectValue placeholder="Asignar a..." />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.membershipId} value={String(agent.membershipId)}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-champagne-gold text-white flex items-center justify-center text-xs">
                        {agent.avatar}
                      </div>
                      <span>{agent.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-champagne-gold text-white flex items-center justify-center text-xs flex-shrink-0">
                  {property.agentAvatar ?? "?"}
                </div>
                <span className="text-xs text-midnight truncate">{property.agentName}</span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-champagne-gold hover:bg-champagne-gold/10"
                  onClick={() => handleOpenTransfer(property)}
                  title="Cambiar agente"
                  disabled={transferMutation.isPending}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => handleRemoveAgent(property)}
                  disabled={removeMutation.isPending}
                  title="Quitar agente"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );

  const TransferContent = () => {
    if (!selectedProperty) return null;
    const otherAgents = agents.filter((a) => a.membershipId !== selectedProperty.agentMembershipId);
    return (
      <div className="space-y-5 p-4">
        <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl">
          {selectedProperty.image ? (
            <img src={selectedProperty.image} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-muted/30 flex items-center justify-center flex-shrink-0">
              <Home className="w-6 h-6 text-foreground/30" />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-semibold text-midnight truncate text-sm">{selectedProperty.title}</h4>
            {selectedProperty.address && (
              <p className="text-xs text-foreground/60 truncate">{selectedProperty.address}</p>
            )}
          </div>
        </div>

        {selectedProperty.agentName && (
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
            <User className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-orange-600">Agente actual</p>
              <p className="font-medium text-orange-700 text-sm">{selectedProperty.agentName}</p>
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-midnight mb-2">Transferir a:</p>
          <div className="space-y-2">
            {otherAgents.map((agent) => (
              <button
                key={agent.membershipId}
                onClick={() => handleTransfer(agent.membershipId)}
                disabled={transferMutation.isPending}
                className="w-full flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-champagne-gold/10 border border-transparent hover:border-champagne-gold/50 transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-champagne-gold text-white flex items-center justify-center font-semibold text-sm">
                    {agent.avatar}
                  </div>
                  <p className="font-medium text-midnight text-sm">{agent.name}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-champagne-gold" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const isLoading = assignmentsQuery.isLoading || agentsQuery.isLoading;

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-midnight">Asignar Propiedades</h1>
        <p className="text-foreground/60">Asigna y transfiere propiedades entre agentes</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
        <Input
          placeholder="Buscar propiedades o agentes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 border-border/50"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-foreground/50">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader className="bg-red-50 border-b border-red-100 py-3 px-4">
              <CardTitle className="text-base text-red-700 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Sin Asignar
                <Badge className="bg-red-100 text-red-700 ml-auto">
                  {unassignedRows.filter(filterRow).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {unassignedRows.filter(filterRow).length === 0 ? (
                <div className="text-center py-8 text-foreground/50">
                  <Check className="w-10 h-10 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">Todas las propiedades están asignadas</p>
                </div>
              ) : (
                unassignedRows.filter(filterRow).map((p) => (
                  <PropertyCard key={p.rawId} property={p} showAssignSelect />
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="bg-green-50 border-b border-green-100 py-3 px-4">
              <CardTitle className="text-base text-green-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Asignadas
                <Badge className="bg-green-100 text-green-700 ml-auto">
                  {assignedRows.filter(filterRow).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {assignedRows.filter(filterRow).length === 0 ? (
                <div className="text-center py-8 text-foreground/50">
                  <Home className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">No hay propiedades asignadas</p>
                </div>
              ) : (
                assignedRows.filter(filterRow).map((p) => (
                  <PropertyCard key={p.rawId} property={p} showAssignSelect={false} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resumen por agente — conteo real de propiedades asignadas */}
      <Card className="border-border/50">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-base text-midnight">Resumen por Agente</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {agents.map((agent) => {
              // Count only rows where this agent is the primary (and only) assigned agent
              const count = assignedRows.filter(
                (p) => p.agentMembershipId === agent.membershipId
              ).length;
              return (
                <div
                  key={agent.membershipId}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-muted/20 hover:border-champagne-gold/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-champagne-gold text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {agent.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-midnight text-sm truncate">{agent.name}</p>
                    <p className="text-xs text-foreground/60">{count} propiedad{count !== 1 ? "es" : ""}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Transfer Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isTransferOpen} onOpenChange={setIsTransferOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>Cambiar Agente</DrawerTitle>
            </DrawerHeader>
            {TransferContent()}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cambiar Agente</DialogTitle>
            </DialogHeader>
            {TransferContent()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AsignarSection;
