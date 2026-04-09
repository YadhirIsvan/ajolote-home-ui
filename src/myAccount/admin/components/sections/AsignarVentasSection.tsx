import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSaleProcessAssignmentsAction,
  assignSaleProcessAgentAction,
  unassignSaleProcessAgentAction,
} from "@/myAccount/admin/actions/get-admin-sale-assignments.actions";
import { getAdminAgentsAction } from "@/myAccount/admin/actions/get-admin-agents.actions";
import type { SaleProcessAssignmentEntry } from "@/myAccount/admin/types/admin.types";
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

interface AgentRow {
  membershipId: number;
  name: string;
  avatarUrl: string | null;
  initials: string;
}

// ─── Avatar helper ────────────────────────────────────────────────────────────

const AgentAvatarEl = ({
  url,
  initials,
  cls,
}: {
  url: string | null;
  initials: string;
  cls: string;
}) =>
  url ? (
    <img
      src={url}
      alt={initials}
      className={`${cls} rounded-full object-cover flex-shrink-0`}
    />
  ) : (
    <div
      className={`${cls} rounded-full bg-champagne-gold text-white flex items-center justify-center font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  );

// ─── Component ────────────────────────────────────────────────────────────────

const AsignarVentasSection = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<SaleProcessAssignmentEntry | null>(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // ─── Queries ──────────────────────────────────────────────────────────────────

  const assignmentsQuery = useQuery({
    queryKey: ["admin-sale-process-assignments"],
    queryFn: getSaleProcessAssignmentsAction,
  });

  const agentsQuery = useQuery({
    queryKey: ["admin-agents"],
    queryFn: getAdminAgentsAction,
  });

  // ─── Mutations ────────────────────────────────────────────────────────────────

  const assignMutation = useMutation({
    mutationFn: ({ saleProcessId, membershipId }: { saleProcessId: number; membershipId: number }) =>
      assignSaleProcessAgentAction(saleProcessId, membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sale-process-assignments"] });
      toast.success("Agente asignado al proceso de venta");
    },
    onError: () => toast.error("Error al asignar el agente"),
  });

  const unassignMutation = useMutation({
    mutationFn: (saleProcessId: number) => unassignSaleProcessAgentAction(saleProcessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sale-process-assignments"] });
      toast.success("Agente removido del proceso de venta");
    },
    onError: () => toast.error("Error al remover el agente"),
  });

  // Transfer = unassign old + assign new
  const transferMutation = useMutation({
    mutationFn: async ({ saleProcessId, newMembershipId }: { saleProcessId: number; newMembershipId: number }) => {
      await unassignSaleProcessAgentAction(saleProcessId);
      await assignSaleProcessAgentAction(saleProcessId, newMembershipId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sale-process-assignments"] });
      toast.success("Agente actualizado");
      setIsTransferOpen(false);
    },
    onError: () => toast.error("Error al cambiar el agente"),
  });

  // ─── Derived data ─────────────────────────────────────────────────────────────

  const agents: AgentRow[] = (agentsQuery.data?.results ?? []).map((a) => ({
    membershipId: a.membershipId,
    name: a.name,
    avatarUrl: a.avatar ? getMediaUrl(a.avatar) : null,
    initials: a.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
  }));

  const unassigned = assignmentsQuery.data?.unassigned ?? [];
  const assigned = assignmentsQuery.data?.assigned ?? [];

  const filterEntry = (e: SaleProcessAssignmentEntry) =>
    e.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.agent?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase());

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const handleAssign = (saleProcessId: number, membershipId: number) => {
    assignMutation.mutate({ saleProcessId, membershipId });
  };

  const handleRemoveAgent = (entry: SaleProcessAssignmentEntry) => {
    unassignMutation.mutate(entry.saleProcessId);
  };

  const handleOpenTransfer = (entry: SaleProcessAssignmentEntry) => {
    setSelectedEntry(entry);
    setIsTransferOpen(true);
  };

  const handleTransfer = (newMembershipId: number) => {
    if (!selectedEntry) return;
    transferMutation.mutate({
      saleProcessId: selectedEntry.saleProcessId,
      newMembershipId,
    });
  };

  // ─── Sub-renders ──────────────────────────────────────────────────────────────

  const EntryCard = ({ entry, showAssignSelect }: { entry: SaleProcessAssignmentEntry; showAssignSelect: boolean }) => {
    const image = getMediaUrl(entry.property.image);
    const agentRow = agents.find((a) => a.membershipId === entry.agent?.membershipId);

    return (
      <Card className="border-border/50 hover:border-champagne-gold/50 transition-all overflow-hidden">
        <div className="flex">
          {image ? (
            <img
              src={image}
              alt={entry.property.title}
              className="w-24 h-24 md:w-28 md:h-28 object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-24 h-24 md:w-28 md:h-28 bg-muted/30 flex items-center justify-center flex-shrink-0">
              <Home className="w-8 h-8 text-foreground/20" />
            </div>
          )}
          <CardContent className="p-3 md:p-4 flex-1 min-w-0">
            <h3 className="font-semibold text-midnight truncate text-sm md:text-base">{entry.property.title}</h3>
            {entry.property.address && (
              <div className="flex items-center gap-1 text-xs text-foreground/60 mb-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{entry.property.address}</span>
              </div>
            )}
            {entry.property.price && (
              <p className="text-sm font-bold text-champagne-gold mb-1">{entry.property.price}</p>
            )}
            <Badge variant="outline" className="text-xs mb-2">{entry.status}</Badge>

            {showAssignSelect ? (
              <Select
                onValueChange={(value) => handleAssign(entry.saleProcessId, Number(value))}
                disabled={assignMutation.isPending}
              >
                <SelectTrigger className="h-9 text-xs border-champagne-gold/50">
                  <SelectValue placeholder="Asignar a..." />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.membershipId} value={String(agent.membershipId)}>
                      <div className="flex items-center gap-2">
                        <AgentAvatarEl url={agent.avatarUrl} initials={agent.initials} cls="w-6 h-6 text-xs" />
                        <span>{agent.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <AgentAvatarEl
                    url={agentRow?.avatarUrl ?? null}
                    initials={agentRow?.initials ?? "?"}
                    cls="w-6 h-6 text-xs"
                  />
                  <span className="text-xs text-midnight truncate">{entry.agent?.name}</span>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-champagne-gold hover:bg-champagne-gold/10"
                    onClick={() => handleOpenTransfer(entry)}
                    title="Cambiar agente"
                    disabled={transferMutation.isPending}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => handleRemoveAgent(entry)}
                    disabled={unassignMutation.isPending}
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
  };

  const TransferContent = () => {
    if (!selectedEntry) return null;
    const otherAgents = agents.filter((a) => a.membershipId !== selectedEntry.agent?.membershipId);
    const image = getMediaUrl(selectedEntry.property.image);

    return (
      <div className="space-y-5 p-4">
        <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl">
          {image ? (
            <img src={image} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-muted/30 flex items-center justify-center flex-shrink-0">
              <Home className="w-6 h-6 text-foreground/30" />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-semibold text-midnight truncate text-sm">{selectedEntry.property.title}</h4>
            {selectedEntry.property.address && (
              <p className="text-xs text-foreground/60 truncate">{selectedEntry.property.address}</p>
            )}
          </div>
        </div>

        {selectedEntry.agent && (
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
            <User className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-orange-600">Agente actual</p>
              <p className="font-medium text-orange-700 text-sm">{selectedEntry.agent.name}</p>
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
                  <AgentAvatarEl url={agent.avatarUrl} initials={agent.initials} cls="w-9 h-9 text-sm" />
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

  const filteredUnassigned = unassigned.filter(filterEntry);
  const filteredAssigned = assigned.filter(filterEntry);

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-midnight">Asignar Propiedades en Proceso de Venta</h1>
        <p className="text-foreground/60">Asigna agentes a procesos de venta (propiedades pendientes de publicar)</p>
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
                  {filteredUnassigned.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {filteredUnassigned.length === 0 ? (
                <div className="text-center py-8 text-foreground/50">
                  <Check className="w-10 h-10 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">Todos los procesos tienen agente asignado</p>
                </div>
              ) : (
                filteredUnassigned.map((e) => (
                  <EntryCard key={e.saleProcessId} entry={e} showAssignSelect />
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
                  {filteredAssigned.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {filteredAssigned.length === 0 ? (
                <div className="text-center py-8 text-foreground/50">
                  <Home className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">No hay procesos asignados</p>
                </div>
              ) : (
                filteredAssigned.map((e) => (
                  <EntryCard key={e.saleProcessId} entry={e} showAssignSelect={false} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resumen por agente */}
      <Card className="border-border/50">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-base text-midnight">Resumen por Agente</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {agents.map((agent) => {
              const count = assigned.filter(
                (e) => e.agent?.membershipId === agent.membershipId
              ).length;
              return (
                <div
                  key={agent.membershipId}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-muted/20 hover:border-champagne-gold/50 transition-all"
                >
                  <AgentAvatarEl url={agent.avatarUrl} initials={agent.initials} cls="w-10 h-10 text-sm" />
                  <div className="min-w-0">
                    <p className="font-medium text-midnight text-sm truncate">{agent.name}</p>
                    <p className="text-xs text-foreground/60">{count} proceso{count !== 1 ? "s" : ""}</p>
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

export default AsignarVentasSection;
