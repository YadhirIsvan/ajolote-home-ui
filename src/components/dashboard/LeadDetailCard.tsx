import { useState } from "react";
import { User, Phone, Mail, Upload, Star, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import SalesPipeline, { pipelineStages } from "./SalesPipeline";
import VerticalPipeline from "./VerticalPipeline";
import PipelineActionSheet from "./PipelineActionSheet";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: number;
  lastContact: string;
  interestLevel?: "alta" | "media" | "baja";
}

interface LeadDetailCardProps {
  lead: Lead;
  onBack: () => void;
  onUploadDocs: () => void;
  onStageChange: (leadId: string, newStage: number, note: string) => void;
}

const interestConfig = {
  alta: { label: "Alto Interés", color: "bg-green-100 text-green-700" },
  media: { label: "Interés Medio", color: "bg-champagne-gold/20 text-champagne-gold" },
  baja: { label: "Bajo Interés", color: "bg-gray-100 text-gray-600" },
};

const LeadDetailCard = ({ lead, onBack, onUploadDocs, onStageChange }: LeadDetailCardProps) => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedStage, setSelectedStage] = useState<{ id: number; name: string } | null>(null);
  const isMobile = useIsMobile();

  const interestLevel = lead.interestLevel || "media";
  const interest = interestConfig[interestLevel];

  const handleStageClick = (stageId: number, stageName: string) => {
    setSelectedStage({ id: stageId, name: stageName });
    setShowActionSheet(true);
  };

  const handleAdvance = (note: string) => {
    if (lead.stage < 9) {
      onStageChange(lead.id, lead.stage + 1, note);
    }
  };

  const handleRevert = (note: string) => {
    if (lead.stage > 1) {
      onStageChange(lead.id, lead.stage - 1, note);
    }
  };

  const currentStageName = pipelineStages.find((s) => s.id === lead.stage)?.label || "";

  return (
    <div className="space-y-5 px-0">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-foreground/60 hover:text-midnight -ml-2 min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a clientes
      </Button>

      {/* Contact Info Card */}
      <Card className="border border-slate-100 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {/* Header with Avatar - Stacked on mobile */}
          <div className="p-4 md:p-6 pb-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-2xl bg-champagne-gold/20 flex items-center justify-center">
                <User className="w-10 h-10 text-champagne-gold" />
              </div>
              <div className="w-full">
                <h3 className="text-xl font-bold text-midnight break-words">{lead.name}</h3>
                <p className="text-sm text-foreground/60 mt-1">{lead.lastContact}</p>
                <div className="mt-2">
                  <Badge className={`${interest.color} inline-flex items-center gap-1`}>
                    <Star className="w-3 h-3" />
                    {interest.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details - Vertical list */}
          <div className="px-4 md:px-6 pb-4 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-2.5 rounded-lg bg-champagne-gold/10 flex-shrink-0">
                <Phone className="w-4 h-4 text-champagne-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground/50">Teléfono</p>
                <p className="text-sm font-medium text-midnight">{lead.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-2.5 rounded-lg bg-champagne-gold/10 flex-shrink-0">
                <Mail className="w-4 h-4 text-champagne-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground/50">Correo electrónico</p>
                <p className="text-sm font-medium text-midnight break-all">{lead.email}</p>
              </div>
            </div>
          </div>

          {/* Upload Button - Full Width with proper touch target */}
          <div className="px-4 md:px-6 pb-5">
            <Button
              variant="gold"
              onClick={onUploadDocs}
              className="w-full min-h-[52px] font-semibold gap-3"
            >
              <Upload className="w-5 h-5" />
              Subir Documentación del Cliente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-midnight">Pipeline de Venta</h4>
          <Badge className="bg-champagne-gold/10 text-champagne-gold">
            Etapa {lead.stage}/9
          </Badge>
        </div>
        
        {/* Use Vertical Pipeline on mobile, Horizontal on desktop */}
        <Card className="border border-slate-100 shadow-sm p-4 md:p-6 bg-white">
          {isMobile ? (
            <VerticalPipeline
              currentStage={lead.stage}
              onStageClick={handleStageClick}
              interactive={true}
            />
          ) : (
            <SalesPipeline
              currentStage={lead.stage}
              onStageClick={handleStageClick}
              interactive={true}
            />
          )}
        </Card>
        
        <p className="text-xs text-center text-foreground/50">
          Toca cualquier etapa para actualizar el progreso
        </p>
      </div>

      {/* Pipeline Action Sheet - Uses Drawer on mobile, Dialog on desktop */}
      <PipelineActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        currentStage={lead.stage}
        stageName={currentStageName}
        onAdvance={handleAdvance}
        onRevert={handleRevert}
        isMobile={isMobile}
      />
    </div>
  );
};

export default LeadDetailCard;
