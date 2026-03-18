import { useState } from "react";
import {
  Home,
  Users,
  Calendar,
  Shuffle,
  Tag,
  UserCircle,
  Kanban,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  History,
  BarChart3,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/shared/hooks/use-mobile.hook";
import type { AdminTab } from "@/myAccount/admin/types/admin.types";

interface AdminTabsNavigationProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "propiedades", label: "Propiedades", icon: Home },
  { id: "agentes", label: "Agentes", icon: Users },
  { id: "citas", label: "Citas", icon: Calendar },
  { id: "asignar", label: "Asignar", icon: Shuffle },
  { id: "asignar-ventas", label: "Asignar Ventas", icon: Tag },
  { id: "clientes", label: "Clientes", icon: UserCircle },
  { id: "kanban", label: "Kanban", icon: Kanban },
  { id: "kanban-ventas", label: "Kanban Ventas", icon: TrendingUp },
  { id: "historial", label: "Historial", icon: History },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

const AdminTabsNavigation = ({ activeTab, onTabChange }: AdminTabsNavigationProps) => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isMobile) {
    return (
      <div className="sticky top-14 z-30 bg-white border-b border-border/50 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 p-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-champagne-gold text-white shadow-md"
                    : "text-foreground/60 hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-14 bottom-0 z-40 bg-white border-r border-border/50 shadow-lg transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-6 w-8 h-8 rounded-full bg-white border border-border shadow-md hover:bg-muted z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </Button>

      <div
        className={cn(
          "p-4 border-b border-border/50",
          isCollapsed ? "px-2" : "px-4"
        )}
      >
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-midnight uppercase tracking-wide">
            Navegación
          </h2>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                isCollapsed ? "justify-center p-3" : "px-4 py-3",
                isActive
                  ? "bg-champagne-gold text-white shadow-lg"
                  : "text-foreground/60 hover:bg-muted/50 hover:text-midnight"
              )}
              title={isCollapsed ? tab.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{tab.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminTabsNavigation;
