import { Calendar, Home, Users } from "lucide-react";

interface EmptyStateProps {
  type: "appointments" | "properties" | "leads";
  message?: string;
}

const icons = {
  appointments: Calendar,
  properties: Home,
  leads: Users,
};

const messages = {
  appointments: "Todo en orden por hoy, Champ",
  properties: "Sin propiedades asignadas",
  leads: "Sin leads por el momento",
};

const EmptyState = ({ type, message }: EmptyStateProps) => {
  const Icon = icons[type];
  const displayMessage = message || messages[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-champagne-gold/5 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-champagne-gold/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-champagne-gold/60" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-champagne-gold/20" />
        <div className="absolute bottom-2 left-0 w-2 h-2 rounded-full bg-champagne-gold/30" />
      </div>

      <h3 className="text-lg font-semibold text-midnight mb-2">{displayMessage}</h3>
      <p className="text-sm text-foreground/50 text-center max-w-xs">
        {type === "appointments"
          ? "No tienes citas programadas para hoy. ¡Disfruta tu día!"
          : type === "properties"
          ? "Las propiedades que te asignen aparecerán aquí."
          : "Los nuevos prospectos aparecerán aquí."}
      </p>
    </div>
  );
};

export default EmptyState;
