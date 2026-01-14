import { Check, Lock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerticalPipelineProps {
  currentStage: number;
  onStageClick?: (stage: number, stageName: string) => void;
  interactive?: boolean;
}

export const pipelineStages = [
  { id: 1, label: "Lead", description: "Contacto inicial" },
  { id: 2, label: "Visita", description: "Agendar recorrido" },
  { id: 3, label: "Interés", description: "Confirmación de interés" },
  { id: 4, label: "Pre-Aprobación", description: "Revisión crediticia" },
  { id: 5, label: "Avalúo", description: "Valuación de propiedad" },
  { id: 6, label: "Crédito", description: "Aprobación del crédito" },
  { id: 7, label: "Docs Finales", description: "Documentación legal" },
  { id: 8, label: "Escrituras", description: "Firma de escrituras" },
  { id: 9, label: "Cerrado", description: "Venta completada" },
];

const VerticalPipeline = ({ currentStage, onStageClick, interactive = false }: VerticalPipelineProps) => {
  return (
    <div className="w-full">
      <div className="relative space-y-0">
        {pipelineStages.map((stage, index) => (
          <div key={stage.id} className="relative">
            {/* Vertical connector line */}
            {index < pipelineStages.length - 1 && (
              <div 
                className={cn(
                  "absolute left-[21px] top-[44px] w-0.5 h-8 transition-colors duration-300",
                  stage.id < currentStage ? "bg-champagne-gold" : "bg-slate-200"
                )}
              />
            )}
            
            <button
              type="button"
              onClick={() => interactive && onStageClick?.(stage.id, stage.label)}
              disabled={!interactive}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200",
                interactive && "cursor-pointer active:scale-[0.98]",
                stage.id === currentStage && "bg-champagne-gold/5 border border-champagne-gold/30",
                stage.id !== currentStage && "hover:bg-slate-50"
              )}
            >
              {/* Stage Icon */}
              <div
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all duration-300",
                  stage.id < currentStage
                    ? "bg-champagne-gold border-champagne-gold text-white"
                    : stage.id === currentStage
                    ? "bg-white border-champagne-gold text-champagne-gold shadow-md shadow-champagne-gold/20 animate-pulse"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                )}
              >
                {stage.id < currentStage ? (
                  <Check className="w-5 h-5" />
                ) : stage.id > currentStage ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4 fill-champagne-gold/30" />
                )}
              </div>
              
              {/* Stage Info */}
              <div className="flex-1 text-left min-w-0">
                <p className={cn(
                  "font-semibold text-sm",
                  stage.id <= currentStage ? "text-midnight" : "text-slate-400"
                )}>
                  {stage.label}
                </p>
                <p className={cn(
                  "text-xs mt-0.5",
                  stage.id <= currentStage ? "text-foreground/60" : "text-slate-300"
                )}>
                  {stage.description}
                </p>
              </div>
              
              {/* Status Badge */}
              <div className="flex-shrink-0">
                {stage.id < currentStage && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Completado
                  </span>
                )}
                {stage.id === currentStage && (
                  <span className="text-xs font-medium text-champagne-gold bg-champagne-gold/10 px-2 py-1 rounded-full">
                    En curso
                  </span>
                )}
                {stage.id > currentStage && (
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                    Pendiente
                  </span>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalPipeline;
