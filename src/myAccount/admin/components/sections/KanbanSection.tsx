import { useState, DragEvent } from "react";
import { 
  ChevronLeft, 
  ChevronRight,
  User,
  Home,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  GripVertical
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface KanbanItem {
  id: string;
  client: string;
  property: string;
  agent: string;
  lastActivity: string;
  price: string;
  daysInStage: number;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  items: KanbanItem[];
}

const initialColumns: KanbanColumn[] = [
  { id: "lead",       title: "Lead",        color: "bg-blue-500",         items: [] },
  { id: "visita",     title: "Visita",      color: "bg-indigo-500",       items: [] },
  { id: "interes",    title: "Interés",     color: "bg-purple-500",       items: [] },
  { id: "pre-aprob",  title: "Pre-Aprob",   color: "bg-champagne-gold",   items: [] },
  { id: "avaluo",     title: "Avalúo",      color: "bg-orange-500",       items: [] },
  { id: "credito",    title: "Crédito",     color: "bg-amber-500",        items: [] },
  { id: "docs",       title: "Docs Finales",color: "bg-teal-500",         items: [] },
  { id: "escrituras", title: "Escrituras",  color: "bg-emerald-500",      items: [] },
  { id: "cerrado",    title: "Cerrado",     color: "bg-green-600",        items: [] },
];

const KanbanSection = () => {
  const isMobile = useIsMobile();
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<{ item: KanbanItem; columnId: string } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ item: KanbanItem; sourceColumnId: string } | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right" && activeColumnIndex < columns.length - 1) {
      setActiveColumnIndex(prev => prev + 1);
    } else if (direction === "left" && activeColumnIndex > 0) {
      setActiveColumnIndex(prev => prev - 1);
    }
  };

  const handleItemClick = (item: KanbanItem, columnId: string) => {
    setSelectedItem({ item, columnId });
    setIsDetailOpen(true);
  };

  const handleMoveItem = (direction: "forward" | "backward") => {
    if (!selectedItem) return;

    const currentIndex = columns.findIndex(c => c.id === selectedItem.columnId);
    const newIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex < 0 || newIndex >= columns.length) return;

    const newColumns = columns.map((col, idx) => {
      if (idx === currentIndex) {
        return { ...col, items: col.items.filter(i => i.id !== selectedItem.item.id) };
      }
      if (idx === newIndex) {
        return { ...col, items: [...col.items, { ...selectedItem.item, daysInStage: 0 }] };
      }
      return col;
    });

    setColumns(newColumns);
    setSelectedItem({ ...selectedItem, columnId: columns[newIndex].id });
    toast.success(`Movido a ${columns[newIndex].title}`);
  };

  // Drag and Drop Handlers
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
    if (dragOverColumnId !== columnId) {
      setDragOverColumnId(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumnId(null);
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

    const newColumns = columns.map((col) => {
      if (col.id === sourceColumnId) {
        return { ...col, items: col.items.filter(i => i.id !== item.id) };
      }
      if (col.id === targetColumnId) {
        return { ...col, items: [...col.items, { ...item, daysInStage: 0 }] };
      }
      return col;
    });

    const targetColumn = columns.find(c => c.id === targetColumnId);
    setColumns(newColumns);
    toast.success(`${item.client} movido a ${targetColumn?.title}`);
    
    setDraggedItem(null);
    setDragOverColumnId(null);
  };

  const getCurrentColumnName = () => {
    if (!selectedItem) return "";
    return columns.find(c => c.id === selectedItem.columnId)?.title || "";
  };

  const canMoveForward = () => {
    if (!selectedItem) return false;
    const currentIndex = columns.findIndex(c => c.id === selectedItem.columnId);
    return currentIndex < columns.length - 1;
  };

  const canMoveBackward = () => {
    if (!selectedItem) return false;
    const currentIndex = columns.findIndex(c => c.id === selectedItem.columnId);
    return currentIndex > 0;
  };

  const KanbanCard = ({ item, columnId, draggable = true }: { item: KanbanItem; columnId: string; draggable?: boolean }) => (
    <Card 
      className={cn(
        "border-border/30 bg-white hover:border-champagne-gold/50 hover:shadow-md transition-all cursor-pointer group",
        draggable && "cursor-grab active:cursor-grabbing",
        draggedItem?.item.id === item.id && "opacity-50 scale-95"
      )}
      onClick={() => handleItemClick(item, columnId)}
      draggable={draggable}
      onDragStart={(e) => handleDragStart(e, item, columnId)}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {draggable && (
              <GripVertical className="w-4 h-4 text-foreground/30 group-hover:text-champagne-gold transition-colors" />
            )}
            <User className="w-4 h-4 text-champagne-gold" />
            <span className="font-semibold text-midnight text-sm">{item.client}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {item.daysInStage}d
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground/60 mb-1">
          <Home className="w-3 h-3" />
          <span className="truncate">{item.property}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-bold text-champagne-gold">{item.price}</span>
          <span className="text-xs text-foreground/50">{item.lastActivity}</span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-foreground/50">
          <User className="w-3 h-3" />
          {item.agent}
        </div>
      </CardContent>
    </Card>
  );

  const ItemDetailContent = () => {
    if (!selectedItem) return null;

    return (
      <div className="space-y-6 p-4">
        <div className="p-4 bg-champagne-gold/10 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-champagne-gold" />
            <span className="font-bold text-xl text-midnight">{selectedItem.item.client}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground/60">
            <Home className="w-4 h-4" />
            <span>{selectedItem.item.property}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/20 rounded-xl text-center">
            <p className="text-xs text-foreground/60">Precio</p>
            <p className="font-bold text-champagne-gold">{selectedItem.item.price}</p>
          </div>
          <div className="p-3 bg-muted/20 rounded-xl text-center">
            <p className="text-xs text-foreground/60">Días en Etapa</p>
            <p className="font-bold text-midnight">{selectedItem.item.daysInStage}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-champagne-gold" />
            <span className="text-foreground/60">Agente:</span>
            <span className="font-medium text-midnight">{selectedItem.item.agent}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-champagne-gold" />
            <span className="text-foreground/60">Última Actividad:</span>
            <span className="font-medium text-midnight">{selectedItem.item.lastActivity}</span>
          </div>
        </div>

        <div className="p-4 bg-midnight/5 rounded-xl">
          <p className="text-xs text-foreground/60 mb-2">Etapa Actual</p>
          <Badge className={cn("text-white", columns.find(c => c.id === selectedItem.columnId)?.color)}>
            {getCurrentColumnName()}
          </Badge>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            disabled={!canMoveBackward()}
            onClick={() => handleMoveItem("backward")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Regresar
          </Button>
          <Button 
            variant="gold" 
            className="flex-1"
            disabled={!canMoveForward()}
            onClick={() => handleMoveItem("forward")}
          >
            Avanzar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Mobile: Single Column View with Swipe
  if (isMobile) {
    const currentColumn = columns[activeColumnIndex];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-midnight">Kanban Global</h1>
          <p className="text-foreground/60">Vista de flujos de trabajo • Arrastra para mover</p>
        </div>

        {/* Column Selector */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleSwipe("left")}
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
            onClick={() => handleSwipe("right")}
            disabled={activeColumnIndex === columns.length - 1}
            className={activeColumnIndex === columns.length - 1 ? "opacity-30" : ""}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1.5">
          {columns.map((col, idx) => (
            <button
              key={col.id}
              onClick={() => setActiveColumnIndex(idx)}
              className={cn(
                "h-2 rounded-full transition-all",
                idx === activeColumnIndex ? "w-6 bg-champagne-gold" : "w-2 bg-muted hover:bg-champagne-gold/50"
              )}
            />
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-3 min-h-[300px]">
          {currentColumn.items.length === 0 ? (
            <div className="text-center py-12 text-foreground/50">
              <Calendar className="w-12 h-12 mx-auto mb-3" />
              <p>Sin elementos en esta etapa</p>
            </div>
          ) : (
            currentColumn.items.map((item) => (
              <KanbanCard key={item.id} item={item} columnId={currentColumn.id} draggable={false} />
            ))
          )}
        </div>

        {/* Detail Drawer */}
        <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>Detalle del Lead</DrawerTitle>
            </DrawerHeader>
            <ItemDetailContent />
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  // Desktop: Full Kanban View with Drag & Drop
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-midnight">Kanban Global</h1>
        <p className="text-foreground/60">Vista de flujos de trabajo • Arrastra las tarjetas para mover leads entre etapas</p>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => (
            <div 
              key={column.id} 
              className="w-64 flex-shrink-0"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={cn(
                "flex items-center justify-between p-3 rounded-t-xl text-white",
                column.color
              )}>
                <span className="font-semibold text-sm">{column.title}</span>
                <Badge className="bg-white/20 text-white border-0">
                  {column.items.length}
                </Badge>
              </div>

              {/* Column Content */}
              <div className={cn(
                "bg-muted/30 border border-t-0 border-border/30 rounded-b-xl p-3 space-y-3 min-h-[400px] transition-all duration-200",
                dragOverColumnId === column.id && "bg-champagne-gold/10 border-champagne-gold/50 ring-2 ring-champagne-gold/30"
              )}>
                {column.items.length === 0 ? (
                  <div className={cn(
                    "flex flex-col items-center justify-center h-24 text-sm text-foreground/40 italic border-2 border-dashed rounded-lg transition-colors",
                    dragOverColumnId === column.id ? "border-champagne-gold bg-champagne-gold/5" : "border-transparent"
                  )}>
                    {dragOverColumnId === column.id ? (
                      <span className="text-champagne-gold font-medium">Soltar aquí</span>
                    ) : (
                      <span>Sin elementos</span>
                    )}
                  </div>
                ) : (
                  column.items.map((item) => (
                    <KanbanCard key={item.id} item={item} columnId={column.id} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-midnight">
              {columns.reduce((acc, col) => acc + col.items.length, 0)}
            </p>
            <p className="text-sm text-foreground/60">Total Leads</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {columns.slice(0, 3).reduce((acc, col) => acc + col.items.length, 0)}
            </p>
            <p className="text-sm text-foreground/60">Etapa Inicial</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-champagne-gold">
              {columns.slice(3, 6).reduce((acc, col) => acc + col.items.length, 0)}
            </p>
            <p className="text-sm text-foreground/60">En Proceso</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 hidden md:block">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">
              {columns.slice(6, 8).reduce((acc, col) => acc + col.items.length, 0)}
            </p>
            <p className="text-sm text-foreground/60">Etapa Final</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 hidden md:block">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {columns[8]?.items.length || 0}
            </p>
            <p className="text-sm text-foreground/60">Cerrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalle del Lead</DialogTitle>
          </DialogHeader>
          <ItemDetailContent />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanSection;
