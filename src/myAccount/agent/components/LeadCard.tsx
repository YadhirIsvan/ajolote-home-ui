import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { AgentLead } from "@/myAccount/agent/types/agent.types";

interface LeadCardProps {
  lead: AgentLead;
  onClick: () => void;
}

const stageLabels: Record<number, string> = {
  1: "Lead",
  2: "Visita",
  3: "Interés",
  4: "Pre-Aprob",
  5: "Avalúo",
  6: "Crédito",
  7: "Docs Finales",
  8: "Escrituras",
  9: "Cerrado",
};

const interestConfig = {
  alta: { icon: "★★★", color: "text-green-600" },
  media: { icon: "★★☆", color: "text-champagne-gold" },
  baja: { icon: "★☆☆", color: "text-slate-400" },
};

const LeadCard = ({ lead, onClick }: LeadCardProps) => {
  const interest = interestConfig[lead.interestLevel || "media"];
  const stageLabel = stageLabels[lead.stage] || `Etapa ${lead.stage}`;

  return (
    <Card className="border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-champagne-gold/30 transition-all duration-200 active:scale-[0.98]">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl bg-champagne-gold/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-champagne-gold">
                {lead.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-midnight text-base leading-tight truncate">
                {lead.name}
              </h4>
              <p className={`text-sm mt-0.5 ${interest.color}`}>{interest.icon}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-champagne-gold/15 text-champagne-gold border-champagne-gold/30 border px-3 py-1.5 text-xs font-semibold">
            {stageLabel}
          </Badge>
          <span className="text-xs text-foreground/50">Etapa {lead.stage} de 9</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <p className="text-xs text-foreground/50">
            Última actividad: {lead.lastContact}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onClick}
          className="w-full min-h-[48px] border-slate-200 hover:border-champagne-gold hover:bg-champagne-gold/5 text-midnight font-medium gap-2"
        >
          Gestionar Cliente
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
