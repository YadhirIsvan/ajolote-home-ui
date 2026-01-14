import { useState } from "react";
import { User, Phone, Mail, Upload, Star, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SalesPipeline, { pipelineStages } from "./SalesPipeline";
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
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-foreground/60 hover:text-midnight -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a leads
      </Button>

      {/* Contact Info Card */}
      <Card className="border-champagne-gold/30 bg-gradient-to-br from-champagne-gold/5 to-transparent overflow-hidden">
        <CardContent className="p-0">
          {/* Header with Avatar */}
          <div className="p-6 pb-4 flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-champagne-gold/20 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-champagne-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="text-xl font-bold text-midnight truncate">{lead.name}</h3>
                  <p className="text-sm text-foreground/60 mt-0.5">{lead.lastContact}</p>
                </div>
                <Badge className={`${interest.color} flex items-center gap-1`}>
                  <Star className="w-3 h-3" />
                  {interest.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="px-6 pb-4 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
              <div className="p-2 rounded-lg bg-champagne-gold/10">
                <Phone className="w-4 h-4 text-champagne-gold" />
              </div>
              <div>
                <p className="text-xs text-foreground/50">Teléfono</p>
                <p className="text-sm font-medium text-midnight">{lead.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
              <div className="p-2 rounded-lg bg-champagne-gold/10">
                <Mail className="w-4 h-4 text-champagne-gold" />
              </div>
              <div>
                <p className="text-xs text-foreground/50">Correo electrónico</p>
                <p className="text-sm font-medium text-midnight truncate">{lead.email}</p>
              </div>
            </div>
          </div>

          {/* Upload Button - Full Width */}
          <div className="px-6 pb-6">
            <Button
              variant="outline"
              onClick={onUploadDocs}
              className="w-full h-14 border-2 border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-white font-semibold gap-3 transition-all"
            >
              <Upload className="w-5 h-5" />
              Subir Documentación
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
        <Card className="border-border/30 p-4 md:p-6">
          <SalesPipeline
            currentStage={lead.stage}
            onStageClick={handleStageClick}
            interactive={true}
          />
        </Card>
        <p className="text-xs text-center text-foreground/50">
          Toca cualquier etapa para actualizar el progreso
        </p>
      </div>

      {/* Pipeline Action Sheet */}
      <PipelineActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        currentStage={lead.stage}
        stageName={currentStageName}
        onAdvance={handleAdvance}
        onRevert={handleRevert}
      />
    </div>
  );
};

export default LeadDetailCard;
