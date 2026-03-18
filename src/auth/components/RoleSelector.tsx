import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Card } from "@/shared/components/ui/card";
import { User, Briefcase, Shield } from "lucide-react";
import type { UserRole } from "@/auth/types/auth.types";

interface RoleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect: (role: UserRole) => void;
}

const roles: { id: UserRole; title: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    id: "cliente",
    title: "Cliente",
    description: "Busco comprar o vender mi propiedad.",
    icon: User,
  },
  {
    id: "agente",
    title: "Agente",
    description: "Gestionar mis propiedades y prospectos.",
    icon: Briefcase,
  },
  {
    id: "admin",
    title: "Administrador",
    description: "Control total de la plataforma.",
    icon: Shield,
  },
];

const RoleSelector = ({ isOpen, onClose, onRoleSelect }: RoleSelectorProps) => {
  const handleRoleClick = (role: UserRole) => {
    onRoleSelect(role);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white border-none shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-2xl font-bold text-midnight">
            ¿Cómo deseas ingresar hoy?
          </DialogTitle>
          <DialogDescription className="text-foreground/60">
            Selecciona tu rol para personalizar tu experiencia
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {roles.map((role) => (
            <Card
              key={role.id}
              onClick={() => handleRoleClick(role.id)}
              className="p-6 cursor-pointer border border-border/50 hover:border-champagne-gold hover:shadow-lg transition-all duration-300 group bg-white"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-full bg-champagne-gold/10 group-hover:bg-champagne-gold/20 transition-colors">
                  <role.icon className="w-7 h-7 text-champagne-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-midnight mb-1">
                    {role.title}
                  </h3>
                  <p className="text-foreground/60 text-sm">{role.description}</p>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-border/50 group-hover:border-champagne-gold group-hover:bg-champagne-gold/10 transition-all flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-champagne-gold transition-colors" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelector;
