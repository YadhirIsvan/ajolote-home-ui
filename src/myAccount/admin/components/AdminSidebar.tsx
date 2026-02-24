import { useState } from "react";
import {
  Home,
  Users,
  Calendar,
  Settings,
  UserCircle,
  Shuffle,
  LayoutDashboard,
  Menu,
  LogOut,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import ajoloteLogo from "@/assets/ajolote-logo.png";
import type { AdminSection } from "@/myAccount/admin/types/admin.types";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
}

const menuItems: {
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "casas", label: "Casas", icon: Home },
  { id: "agentes", label: "Agentes", icon: Users },
  { id: "citas", label: "Citas", icon: Calendar },
  { id: "config-citas", label: "Config. Citas", icon: Clock },
  { id: "asignar", label: "Asignar Propiedad", icon: Shuffle },
  { id: "clientes", label: "Clientes", icon: UserCircle },
  { id: "kanban", label: "Kanban", icon: Settings },
];

const AdminSidebar = ({
  activeSection,
  onSectionChange,
  onLogout,
}: AdminSidebarProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleSectionClick = (section: AdminSection) => {
    onSectionChange(section);
    if (isMobile) setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-midnight text-white">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src={ajoloteLogo}
            alt="Ajolote"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="font-bold text-lg">Ajolote</h1>
            <p className="text-xs text-white/60">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px]",
                isActive
                  ? "bg-champagne-gold text-white shadow-lg"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-50 bg-midnight text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={ajoloteLogo}
              alt="Ajolote"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold">Admin Panel</span>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 border-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
        <div className="h-14" />
      </>
    );
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 z-40">
      <SidebarContent />
    </aside>
  );
};

export default AdminSidebar;
