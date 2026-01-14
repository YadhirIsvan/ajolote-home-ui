import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight,
  User,
  Home,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface KanbanItem {
  id: string;
  client: string;
  property: string;
  agent: string;
  lastActivity: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  items: KanbanItem[];
}

const initialColumns: KanbanColumn[] = [
  {
    id: "lead",
    title: "Lead",
    color: "bg-blue-500",
    items: [
      { id: "1", client: "María García", property: "Casa Polanco", agent: "Carlos M.", lastActivity: "Hace 2h" },
      { id: "2", client: "Juan López", property: "Depto Roma", agent: "Laura S.", lastActivity: "Hace 1d" },
    ],
  },
  {
    id: "visita",
    title: "Visita",
    color: "bg-indigo-500",
    items: [
      { id: "3", client: "Ana Martínez", property: "Penthouse SF", agent: "Roberto D.", lastActivity: "Hace 3h" },
    ],
  },
  {
    id: "interes",
    title: "Interés",
    color: "bg-purple-500",
    items: [
      { id: "4", client: "Pedro Hernández", property: "Casa Coyoacán", agent: "Carlos M.", lastActivity: "Hace 5h" },
      { id: "5", client: "Sofía Ruiz", property: "Loft Condesa", agent: "Ana M.", lastActivity: "Hace 1d" },
    ],
  },
  {
    id: "pre-aprob",
    title: "Pre-Aprob",
    color: "bg-champagne-gold",
    items: [
      { id: "6", client: "Carlos Mendez", property: "Casa Polanco", agent: "Laura S.", lastActivity: "Hace 2d" },
    ],
  },
  {
    id: "avaluo",
    title: "Avalúo",
    color: "bg-orange-500",
    items: [],
  },
  {
    id: "credito",
    title: "Crédito",
    color: "bg-amber-500",
    items: [
      { id: "7", client: "Roberto Silva", property: "Depto Roma", agent: "Roberto D.", lastActivity: "Hace 3d" },
    ],
  },
  {
    id: "docs",
    title: "Docs Finales",
    color: "bg-teal-500",
    items: [],
  },
  {
    id: "escrituras",
    title: "Escrituras",
    color: "bg-emerald-500",
    items: [
      { id: "8", client: "Laura Pérez", property: "Penthouse SF", agent: "Carlos M.", lastActivity: "Hace 1d" },
    ],
  },
  {
    id: "cerrado",
    title: "Cerrado",
    color: "bg-green-600",
    items: [
      { id: "9", client: "Miguel Torres", property: "Casa Coyoacán", agent: "Ana M.", lastActivity: "Hace 5d" },
    ],
  },
];

const KanbanSection = () => {
  const isMobile = useIsMobile();
  const [columns] = useState<KanbanColumn[]>(initialColumns);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right" && activeColumnIndex < columns.length - 1) {
      setActiveColumnIndex(prev => prev + 1);
    } else if (direction === "left" && activeColumnIndex > 0) {
      setActiveColumnIndex(prev => prev - 1);
    }
  };

  const KanbanCard = ({ item }: { item: KanbanItem }) => (
    <Card className="border-border/30 bg-white hover:border-champagne-gold/50 hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-champagne-gold" />
          <span className="font-semibold text-midnight text-sm">{item.client}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground/60 mb-1">
          <Home className="w-3 h-3" />
          <span className="truncate">{item.property}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <Badge variant="outline" className="text-xs">
            {item.agent}
          </Badge>
          <span className="text-xs text-foreground/50">{item.lastActivity}</span>
        </div>
      </CardContent>
    </Card>
  );

  // Mobile: Single Column View with Swipe
  if (isMobile) {
    const currentColumn = columns[activeColumnIndex];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-midnight">Kanban Global</h1>
          <p className="text-foreground/60">Vista de flujos de trabajo</p>
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
                "w-2 h-2 rounded-full transition-all",
                idx === activeColumnIndex ? "w-6 bg-champagne-gold" : "bg-muted hover:bg-champagne-gold/50"
              )}
            />
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {currentColumn.items.length === 0 ? (
            <div className="text-center py-12 text-foreground/50">
              <Calendar className="w-12 h-12 mx-auto mb-3" />
              <p>Sin elementos en esta etapa</p>
            </div>
          ) : (
            currentColumn.items.map((item) => (
              <KanbanCard key={item.id} item={item} />
            ))
          )}
        </div>
      </div>
    );
  }

  // Desktop: Full Kanban View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-midnight">Kanban Global</h1>
        <p className="text-foreground/60">Vista de flujos de trabajo</p>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="w-64 flex-shrink-0">
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
              <div className="bg-muted/30 border border-t-0 border-border/30 rounded-b-xl p-3 space-y-3 min-h-[400px]">
                {column.items.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-sm text-foreground/40 italic">
                    Sin elementos
                  </div>
                ) : (
                  column.items.map((item) => (
                    <KanbanCard key={item.id} item={item} />
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
              {columns[8].items.length}
            </p>
            <p className="text-sm text-foreground/60">Cerrados</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KanbanSection;
