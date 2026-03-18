import { useState, useEffect, DragEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminPurchaseProcessesAction,
  updatePurchaseProcessStatusAction,
} from "@/myAccount/admin/actions/get-admin-kanban.actions";
import type { AdminPurchaseProcess, PurchaseProcessStatus } from "@/myAccount/admin/types/admin.types";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Home,
  Clock,
  ArrowRight,
  ArrowLeft,
  GripVertical,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useIsMobile } from "@/shared/hooks/use-mobile.hook";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── helpers ────────────────────────────────────────────────────────────────

const getMediaUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/media/")) return `http://localhost:8000${url}`;
  return null;
};

const fmtPrice = (price: string): string => {
  const n = parseFloat(price);
  if (!price || isNaN(n)) return "—";
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
};

const calcDays = (updatedAt: string): number =>
  Math.floor((Date.now() - new Date(updatedAt).getTime()) / 86_400_000);

// ─── types ───────────────────────────────────────────────────────────────────

interface KanbanItem {
  id: string;
  rawId: number;
  client: string;
  clientAvatar: string | null;
  property: string;
  propertyImage: string | null;
  agent: string;
  lastActivity: string;
  price: string;
  daysInStage: number;
  progress: number;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  items: KanbanItem[];
}

// ─── constants ───────────────────────────────────────────────────────────────

const PIPELINE_IDS = [
  "lead", "visita", "interes", "pre-aprob",
  "avaluo", "credito", "docs", "escrituras", "cerrado",
];

const STATUS_LABELS: Record<PurchaseProcessStatus, string> = {
  lead: "Lead",
  visita: "Visita",
  interes: "Interés",
  pre_aprobacion: "Pre-aprobación",
  avaluo: "Avalúo",
  credito: "Crédito",
  docs_finales: "Docs finales",
  escrituras: "Escrituras",
  cerrado: "Cerrado",
  cancelado: "Cancelado",
};

const STATUS_TO_COLUMN: Record<PurchaseProcessStatus, string> = {
  lead: "lead",
  visita: "visita",
  interes: "interes",
  pre_aprobacion: "pre-aprob",
  avaluo: "avaluo",
  credito: "credito",
  docs_finales: "docs",
  escrituras: "escrituras",
  cerrado: "cerrado",
  cancelado: "cancelado",
};

const COLUMN_TO_STATUS: Record<string, PurchaseProcessStatus> = {
  lead: "lead",
  visita: "visita",
  interes: "interes",
  "pre-aprob": "pre_aprobacion",
  avaluo: "avaluo",
  credito: "credito",
  docs: "docs_finales",
  escrituras: "escrituras",
  cerrado: "cerrado",
  cancelado: "cancelado",
};

const PIPELINE_STATUSES: PurchaseProcessStatus[] = [
  "lead", "visita", "interes", "pre_aprobacion",
  "avaluo", "credito", "docs_finales", "escrituras", "cerrado",
];

const initialColumns: KanbanColumn[] = [
  { id: "lead",       title: "Lead",         color: "bg-blue-500",        items: [] },
  { id: "visita",     title: "Visita",        color: "bg-indigo-500",      items: [] },
  { id: "interes",    title: "Interés",       color: "bg-purple-500",      items: [] },
  { id: "pre-aprob",  title: "Pre-Aprob",     color: "bg-champagne-gold",  items: [] },
  { id: "avaluo",     title: "Avalúo",        color: "bg-orange-500",      items: [] },
  { id: "credito",    title: "Crédito",       color: "bg-amber-500",       items: [] },
  { id: "docs",       title: "Docs Finales",  color: "bg-teal-500",        items: [] },
  { id: "escrituras", title: "Escrituras",    color: "bg-emerald-500",     items: [] },
  { id: "cerrado",    title: "Cerrado",       color: "bg-green-600",       items: [] },
  { id: "cancelado",  title: "Cancelado",     color: "bg-slate-500",       items: [] },
];

const mapProcess = (p: AdminPurchaseProcess): KanbanItem => ({
  id: String(p.id),
  rawId: p.id,
  client: p.client.name,
  clientAvatar: p.client.avatar,
  property: p.property.title,
  propertyImage: p.property.image,
  agent: p.agent.name,
  lastActivity: p.updated_at.split("T")[0],
  price: p.property.price || "",
  daysInStage: calcDays(p.updated_at),
  progress: p.overall_progress,
});

// ─── component ───────────────────────────────────────────────────────────────

const KanbanSection = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<{ item: KanbanItem; columnId: string } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ item: KanbanItem; sourceColumnId: string } | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  // Status select in detail view
  const [pendingStatus, setPendingStatus] = useState<PurchaseProcessStatus | "">("");
  const [cerradoForm, setCerradoForm] = useState({ sale_price: "", payment_method: "" });

  // Drag to cerrado dialog
  const [pendingDragToCerrado, setPendingDragToCerrado] = useState<{ item: KanbanItem } | null>(null);
  const [dragCerradoForm, setDragCerradoForm] = useState({ sale_price: "", payment_method: "" });

  // ─── query ────────────────────────────────────────────────────────────────

  const processesQuery = useQuery({
    queryKey: ["admin-kanban"],
    queryFn: () => getAdminPurchaseProcessesAction({ limit: 200 }),
  });

  useEffect(() => {
    if (!processesQuery.data) return;
    const processes = processesQuery.data.results;
    setColumns(initialColumns.map(col => ({
      ...col,
      items: processes
        .filter(p => STATUS_TO_COLUMN[p.status] === col.id)
        .map(mapProcess),
    })));
  }, [processesQuery.data]);

  // Reset pending status when selection changes
  useEffect(() => {
    setPendingStatus("");
    setCerradoForm({ sale_price: "", payment_method: "" });
  }, [selectedItem?.item.id]);

  // ─── mutation ─────────────────────────────────────────────────────────────

  const moveMutation = useMutation({
    mutationFn: ({
      rawId, status, extra,
    }: { rawId: number; status: PurchaseProcessStatus; extra?: Record<string, unknown> }) =>
      updatePurchaseProcessStatusAction(rawId, status, undefined, extra),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kanban"] });
    },
    onError: () => toast.error("Error al cambiar la etapa"),
  });

  // ─── navigation ──────────────────────────────────────────────────────────

  const isCancelado = (columnId: string) => columnId === "cancelado";

  const canMoveForward = () => {
    if (!selectedItem) return false;
    if (isCancelado(selectedItem.columnId)) return false;
    const idx = PIPELINE_IDS.indexOf(selectedItem.columnId);
    return idx >= 0 && idx < PIPELINE_IDS.length - 1;
  };

  const canMoveBackward = () => {
    if (!selectedItem) return false;
    if (isCancelado(selectedItem.columnId)) return false;
    const idx = PIPELINE_IDS.indexOf(selectedItem.columnId);
    return idx > 0;
  };

  const handleMoveItem = (direction: "forward" | "backward") => {
    if (!selectedItem) return;
    const currentIdx = PIPELINE_IDS.indexOf(selectedItem.columnId);
    const newIdx = direction === "forward" ? currentIdx + 1 : currentIdx - 1;
    if (newIdx < 0 || newIdx >= PIPELINE_IDS.length) return;

    const targetColumnId = PIPELINE_IDS[newIdx];
    const newStatus = COLUMN_TO_STATUS[targetColumnId];

    const newColumns = columns.map(col => {
      if (col.id === selectedItem.columnId) {
        return { ...col, items: col.items.filter(i => i.id !== selectedItem.item.id) };
      }
      if (col.id === targetColumnId) {
        return { ...col, items: [...col.items, { ...selectedItem.item, daysInStage: 0 }] };
      }
      return col;
    });

    setColumns(newColumns);
    setSelectedItem({ ...selectedItem, columnId: targetColumnId });
    toast.success(`Movido a ${columns.find(c => c.id === targetColumnId)?.title}`);

    const extra: Record<string, unknown> | undefined =
      newStatus === "cerrado"
        ? { sale_price: null, payment_method: "" }
        : undefined;

    moveMutation.mutate({ rawId: selectedItem.item.rawId, status: newStatus, extra });
  };

  const handleDirectStatusChange = () => {
    if (!selectedItem || !pendingStatus) return;

    const targetColumnId = STATUS_TO_COLUMN[pendingStatus];
    const currentColumnId = selectedItem.columnId;

    if (currentColumnId === targetColumnId) return;

    const newColumns = columns.map(col => {
      if (col.id === currentColumnId) {
        return { ...col, items: col.items.filter(i => i.id !== selectedItem.item.id) };
      }
      if (col.id === targetColumnId) {
        return { ...col, items: [...col.items, { ...selectedItem.item, daysInStage: 0 }] };
      }
      return col;
    });

    setColumns(newColumns);
    setSelectedItem({ ...selectedItem, columnId: targetColumnId });
    toast.success(`Movido a ${STATUS_LABELS[pendingStatus]}`);

    const extra: Record<string, unknown> | undefined =
      pendingStatus === "cerrado"
        ? {
            sale_price: parseFloat(cerradoForm.sale_price) || null,
            payment_method: cerradoForm.payment_method,
          }
        : undefined;

    moveMutation.mutate({ rawId: selectedItem.item.rawId, status: pendingStatus, extra });
    setPendingStatus("");
    setCerradoForm({ sale_price: "", payment_method: "" });
  };

  const handleConfirmDragToCerrado = () => {
    if (!pendingDragToCerrado || !dragCerradoForm.sale_price || !dragCerradoForm.payment_method) {
      toast.error("Por favor completa el precio y método de pago");
      return;
    }

    const item = pendingDragToCerrado.item;
    const targetColumnId = "cerrado";

    const newColumns = columns.map(col => {
      // Encontrar la columna actual del item
      const itemInCol = col.items.some(i => i.id === item.id);
      if (itemInCol) {
        return { ...col, items: col.items.filter(i => i.id !== item.id) };
      }
      if (col.id === targetColumnId) {
        return { ...col, items: [...col.items, { ...item, daysInStage: 0 }] };
      }
      return col;
    });

    setColumns(newColumns);
    toast.success(`${item.client} → Cerrado`);

    moveMutation.mutate({
      rawId: item.rawId,
      status: "cerrado",
      extra: {
        sale_price: parseFloat(dragCerradoForm.sale_price),
        payment_method: dragCerradoForm.payment_method,
      },
    });

    setPendingDragToCerrado(null);
    setDragCerradoForm({ sale_price: "", payment_method: "" });
  };

  // ─── drag & drop ─────────────────────────────────────────────────────────

  const handleItemClick = (item: KanbanItem, columnId: string) => {
    setSelectedItem({ item, columnId });
    setIsDetailOpen(true);
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: KanbanItem, columnId: string) => {
    setDraggedItem({ item, sourceColumnId: columnId });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumnId(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumnId !== columnId) setDragOverColumnId(columnId);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { item, sourceColumnId } = draggedItem;
    if (sourceColumnId === targetColumnId) {
      setDraggedItem(null);
      setDragOverColumnId(null);
      return;
    }

    const newStatus = COLUMN_TO_STATUS[targetColumnId];

    // Si es arrastrar a "Cerrado", mostrar dialog para completar campos
    if (newStatus === "cerrado") {
      setPendingDragToCerrado({ item });
      setDragCerradoForm({ sale_price: "", payment_method: "" });
      setDraggedItem(null);
      setDragOverColumnId(null);
      return;
    }

    const newColumns = columns.map(col => {
      if (col.id === sourceColumnId) return { ...col, items: col.items.filter(i => i.id !== item.id) };
      if (col.id === targetColumnId) return { ...col, items: [...col.items, { ...item, daysInStage: 0 }] };
      return col;
    });

    setColumns(newColumns);
    toast.success(`${item.client} → ${columns.find(c => c.id === targetColumnId)?.title}`);

    if (newStatus) moveMutation.mutate({ rawId: item.rawId, status: newStatus });

    setDraggedItem(null);
    setDragOverColumnId(null);
  };

  // ─── card ────────────────────────────────────────────────────────────────

  const renderCard = (item: KanbanItem, columnId: string, draggable = true) => (
    <Card
      key={item.id}
      className={cn(
        "border-border/30 bg-white hover:border-champagne-gold/50 hover:shadow-md transition-all cursor-pointer group overflow-hidden",
        draggable && "cursor-grab active:cursor-grabbing",
        draggedItem?.item.id === item.id && "opacity-50 scale-95"
      )}
      onClick={() => handleItemClick(item, columnId)}
      draggable={draggable}
      onDragStart={draggable ? (e) => handleDragStart(e, item, columnId) : undefined}
      onDragEnd={draggable ? handleDragEnd : undefined}
    >
      {/* Progress strip */}
      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-champagne-gold transition-all"
          style={{ width: `${item.progress}%` }}
        />
      </div>

      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {draggable && (
              <GripVertical className="w-3.5 h-3.5 flex-shrink-0 text-foreground/30 group-hover:text-champagne-gold transition-colors" />
            )}
            <User className="w-3.5 h-3.5 flex-shrink-0 text-champagne-gold" />
            <span className="font-semibold text-midnight text-sm truncate">{item.client}</span>
          </div>
          {/* Property thumbnail */}
          {getMediaUrl(item.propertyImage) ? (
            <img
              src={getMediaUrl(item.propertyImage)!}
              alt=""
              className="w-8 h-8 rounded-md object-cover border border-border/20 flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
              <Home className="w-3.5 h-3.5 text-foreground/30" />
            </div>
          )}
        </div>

        <p className="text-xs text-foreground/60 truncate mb-2">{item.property}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-champagne-gold">{fmtPrice(item.price)}</span>
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
            {item.daysInStage}d
          </Badge>
        </div>

        <div className="flex items-center gap-1 mt-1.5 text-xs text-foreground/50">
          <User className="w-3 h-3" />
          <span className="truncate">{item.agent}</span>
        </div>
      </CardContent>
    </Card>
  );

  // ─── detail content ──────────────────────────────────────────────────────

  const ItemDetailContent = () => {
    if (!selectedItem) return null;

    const currentColumn = columns.find(c => c.id === selectedItem.columnId);
    const propImg = getMediaUrl(selectedItem.item.propertyImage);

    return (
      <div className="space-y-5 p-4">
        {/* Header */}
        <div className="rounded-xl overflow-hidden border border-border/20">
          {propImg && (
            <div className="h-28 w-full">
              <img src={propImg} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-4 bg-champagne-gold/10">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-5 h-5 text-champagne-gold" />
              <span className="font-bold text-xl text-midnight">{selectedItem.item.client}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/60 text-sm">
              <Home className="w-4 h-4" />
              <span className="truncate">{selectedItem.item.property}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-foreground/60 mb-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Progreso
            </div>
            <span className="font-medium text-midnight">{selectedItem.item.progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-champagne-gold transition-all rounded-full"
              style={{ width: `${selectedItem.item.progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/20 rounded-xl text-center">
            <p className="text-xs text-foreground/60">Precio</p>
            <p className="font-bold text-champagne-gold text-sm">{fmtPrice(selectedItem.item.price)}</p>
          </div>
          <div className="p-3 bg-muted/20 rounded-xl text-center">
            <p className="text-xs text-foreground/60">Días en etapa</p>
            <p className="font-bold text-midnight text-sm">{selectedItem.item.daysInStage}</p>
          </div>
        </div>

        {/* Agent + date */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-champagne-gold" />
            <span className="text-foreground/60">Agente:</span>
            <span className="font-medium text-midnight">{selectedItem.item.agent}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-champagne-gold" />
            <span className="text-foreground/60">Última actividad:</span>
            <span className="font-medium text-midnight">{selectedItem.item.lastActivity}</span>
          </div>
        </div>

        {/* Current stage */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground/60">Etapa actual:</span>
          <Badge className={cn("text-white", currentColumn?.color)}>
            {currentColumn?.title}
          </Badge>
        </div>

        {/* Direct status change */}
        <div className="space-y-2 border-t border-border/20 pt-4">
          <p className="text-xs text-foreground/60 font-medium">Mover directamente a:</p>
          <Select
            value={pendingStatus}
            onValueChange={(v) => setPendingStatus(v as PurchaseProcessStatus)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Seleccionar etapa…" />
            </SelectTrigger>
            <SelectContent>
              {PIPELINE_STATUSES.map(s => (
                <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
              ))}
              <SelectItem value="cancelado">
                <span className="flex items-center gap-2 text-red-500">
                  <XCircle className="w-3.5 h-3.5" /> Cancelar proceso
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Cerrado extra fields */}
          {pendingStatus === "cerrado" && (
            <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-medium text-green-700">Campos requeridos para Cerrado</p>
              <div>
                <Label className="text-xs">Precio de venta (MXN)</Label>
                <Input
                  type="number"
                  placeholder="1500000"
                  value={cerradoForm.sale_price}
                  onChange={(e) => setCerradoForm(f => ({ ...f, sale_price: e.target.value }))}
                  className="h-8 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Método de pago</Label>
                <Input
                  placeholder="Efectivo, crédito hipotecario…"
                  value={cerradoForm.payment_method}
                  onChange={(e) => setCerradoForm(f => ({ ...f, payment_method: e.target.value }))}
                  className="h-8 mt-1"
                />
              </div>
            </div>
          )}

          {pendingStatus && (
            <Button
              size="sm"
              variant="gold"
              className="w-full"
              disabled={
                moveMutation.isPending ||
                (pendingStatus === "cerrado" && (!cerradoForm.sale_price || !cerradoForm.payment_method))
              }
              onClick={handleDirectStatusChange}
            >
              Confirmar cambio a {STATUS_LABELS[pendingStatus]}
            </Button>
          )}
        </div>

        {/* Forward / Backward */}
        {!isCancelado(selectedItem.columnId) && (
          <div className="flex gap-3 border-t border-border/20 pt-3">
            <Button
              variant="outline"
              className="flex-1"
              disabled={!canMoveBackward() || moveMutation.isPending}
              onClick={() => handleMoveItem("backward")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Regresar
            </Button>
            <Button
              variant="gold"
              className="flex-1"
              disabled={!canMoveForward() || moveMutation.isPending}
              onClick={() => handleMoveItem("forward")}
            >
              Avanzar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  // ─── mobile view ─────────────────────────────────────────────────────────

  if (isMobile) {
    const currentColumn = columns[activeColumnIndex];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-midnight">Kanban de Compras</h1>
          <p className="text-foreground/60">Flujo de procesos de compra</p>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveColumnIndex(p => Math.max(0, p - 1))}
            disabled={activeColumnIndex === 0}
            className={activeColumnIndex === 0 ? "opacity-30" : ""}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full", currentColumn.color)} />
            <span className="font-semibold text-midnight text-lg">{currentColumn.title}</span>
            <Badge className="bg-muted text-foreground">{currentColumn.items.length}</Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveColumnIndex(p => Math.min(columns.length - 1, p + 1))}
            disabled={activeColumnIndex === columns.length - 1}
            className={activeColumnIndex === columns.length - 1 ? "opacity-30" : ""}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5">
          {columns.map((col, idx) => (
            <button
              key={col.id}
              onClick={() => setActiveColumnIndex(idx)}
              className={cn(
                "h-2 rounded-full transition-all",
                idx === activeColumnIndex ? "w-6 bg-champagne-gold" : "w-2 bg-muted hover:bg-champagne-gold/50",
                col.id === "cancelado" && idx !== activeColumnIndex && "bg-red-200"
              )}
            />
          ))}
        </div>

        <div className="space-y-3 min-h-[300px]">
          {currentColumn.items.length === 0 ? (
            <div className="text-center py-12 text-foreground/50">
              <Home className="w-12 h-12 mx-auto mb-3" />
              <p>Sin procesos en esta etapa</p>
            </div>
          ) : (
            currentColumn.items.map(item => renderCard(item, currentColumn.id, false))
          )}
        </div>

        <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>Detalle del Proceso</DrawerTitle>
            </DrawerHeader>
            {ItemDetailContent()}
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  // ─── desktop view ────────────────────────────────────────────────────────

  const pipelineColumns = columns.filter(c => c.id !== "cancelado");
  const canceladoColumn = columns.find(c => c.id === "cancelado")!;
  const totalActive = pipelineColumns.reduce((a, c) => a + c.items.length, 0);
  const totalCancelados = canceladoColumn?.items.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-midnight">Kanban de Compras</h1>
        <p className="text-foreground/60">
          Flujo de procesos de compra · Arrastra las tarjetas para mover entre etapas
        </p>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {/* Pipeline columns */}
          {pipelineColumns.map(column => (
            <div
              key={column.id}
              className="w-56 flex-shrink-0"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={() => setDragOverColumnId(null)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className={cn("flex items-center justify-between p-3 rounded-t-xl text-white", column.color)}>
                <span className="font-semibold text-sm">{column.title}</span>
                <Badge className="bg-white/20 text-white border-0">{column.items.length}</Badge>
              </div>
              <div className={cn(
                "bg-muted/30 border border-t-0 border-border/30 rounded-b-xl p-3 space-y-3 min-h-[400px] transition-all duration-200",
                dragOverColumnId === column.id && "bg-champagne-gold/10 border-champagne-gold/50 ring-2 ring-champagne-gold/30"
              )}>
                {column.items.length === 0 ? (
                  <div className={cn(
                    "flex flex-col items-center justify-center h-24 text-sm text-foreground/40 italic border-2 border-dashed rounded-lg",
                    dragOverColumnId === column.id ? "border-champagne-gold text-champagne-gold font-medium" : "border-transparent"
                  )}>
                    {dragOverColumnId === column.id ? "Soltar aquí" : "Sin elementos"}
                  </div>
                ) : (
                  column.items.map(item => renderCard(item, column.id))
                )}
              </div>
            </div>
          ))}

          {/* Separator */}
          <div className="flex flex-col items-center justify-center w-6 flex-shrink-0">
            <div className="w-px h-full bg-border/50" />
          </div>

          {/* Cancelado column */}
          <div
            className="w-56 flex-shrink-0"
            onDragOver={(e) => handleDragOver(e, "cancelado")}
            onDragLeave={() => setDragOverColumnId(null)}
            onDrop={(e) => handleDrop(e, "cancelado")}
          >
            <div className={cn("flex items-center justify-between p-3 rounded-t-xl text-white", canceladoColumn.color)}>
              <div className="flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span className="font-semibold text-sm">{canceladoColumn.title}</span>
              </div>
              <Badge className="bg-white/20 text-white border-0">{canceladoColumn.items.length}</Badge>
            </div>
            <div className={cn(
              "bg-slate-50 border border-t-0 border-slate-200 rounded-b-xl p-3 space-y-3 min-h-[400px] transition-all duration-200",
              dragOverColumnId === "cancelado" && "bg-red-50 border-red-300 ring-2 ring-red-200"
            )}>
              {canceladoColumn.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24 text-sm text-foreground/40 italic border-2 border-dashed border-transparent rounded-lg">
                  Sin cancelados
                </div>
              ) : (
                canceladoColumn.items.map(item => renderCard(item, "cancelado"))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-midnight">{totalActive}</p>
            <p className="text-sm text-foreground/60">Activos</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {columns.slice(0, 3).reduce((a, c) => a + c.items.length, 0)}
            </p>
            <p className="text-sm text-foreground/60">Etapa Inicial</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-champagne-gold">
              {columns.slice(3, 6).reduce((a, c) => a + c.items.length, 0)}
            </p>
            <p className="text-sm text-foreground/60">En Proceso</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 hidden md:block">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {columns.find(c => c.id === "cerrado")?.items.length ?? 0}
            </p>
            <p className="text-sm text-foreground/60">Cerrados</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 hidden md:block">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-500">{totalCancelados}</p>
            <p className="text-sm text-foreground/60">Cancelados</p>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Detalle del Proceso</DialogTitle>
          </DialogHeader>
          {ItemDetailContent()}
        </DialogContent>
      </Dialog>

      {/* Drag to Cerrado Modal */}
      <Dialog open={!!pendingDragToCerrado} onOpenChange={(open) => {
        if (!open) setPendingDragToCerrado(null);
      }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-lg">Cerrar Proceso de Compra</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-2">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-700 mb-2">
                {pendingDragToCerrado?.item.client}
              </p>
              <p className="text-xs text-green-600">
                {pendingDragToCerrado?.item.property}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Precio de venta (MXN) *</Label>
              <Input
                type="number"
                placeholder="1500000"
                value={dragCerradoForm.sale_price}
                onChange={(e) => setDragCerradoForm(f => ({ ...f, sale_price: e.target.value }))}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Método de pago *</Label>
              <Input
                placeholder="Efectivo, crédito hipotecario, etc…"
                value={dragCerradoForm.payment_method}
                onChange={(e) => setDragCerradoForm(f => ({ ...f, payment_method: e.target.value }))}
                className="mt-2"
              />
            </div>

            <div className="flex gap-2 pt-4 border-t border-border/30">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPendingDragToCerrado(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="gold"
                className="flex-1"
                disabled={
                  !dragCerradoForm.sale_price || !dragCerradoForm.payment_method || moveMutation.isPending
                }
                onClick={handleConfirmDragToCerrado}
              >
                Confirmar Cierre
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanSection;
