import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SalesPipelineProps {
  currentStage: number;
  onStageClick?: (stage: number, stageName: string) => void;
  interactive?: boolean;
}

export const pipelineStages = [
  { id: 1, label: "Lead", shortLabel: "Lead" },
  { id: 2, label: "Visita", shortLabel: "Visita" },
  { id: 3, label: "Interés", shortLabel: "Int." },
  { id: 4, label: "Pre-Aprob", shortLabel: "Pre" },
  { id: 5, label: "Avalúo", shortLabel: "Aval." },
  { id: 6, label: "Crédito", shortLabel: "Créd." },
  { id: 7, label: "Docs Finales", shortLabel: "Docs" },
  { id: 8, label: "Escrituras", shortLabel: "Esc." },
  { id: 9, label: "Cerrado", shortLabel: "✓" },
];

const SalesPipeline = ({ currentStage, onStageClick, interactive = false }: SalesPipelineProps) => {
  return (
    <div className="w-full">
      {/* Desktop Pipeline */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          {/* Progress Line Background */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-border/50 rounded-full" />
          
          {/* Progress Line Active */}
          <div
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-champagne-gold to-champagne-gold-dark rounded-full transition-all duration-500"
            style={{ width: `${((currentStage - 1) / (pipelineStages.length - 1)) * 100}%` }}
          />

          {/* Stage Indicators */}
          {pipelineStages.map((stage) => (
            <div
              key={stage.id}
              onClick={() => interactive && onStageClick?.(stage.id, stage.label)}
              className={cn(
                "relative z-10 flex flex-col items-center group",
                interactive && "cursor-pointer hover:scale-110 transition-transform duration-200"
              )}
            >
              <div
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  stage.id < currentStage
                    ? "bg-champagne-gold border-champagne-gold text-white"
                    : stage.id === currentStage
                    ? "bg-white border-champagne-gold text-champagne-gold shadow-lg shadow-champagne-gold/30 animate-pulse"
                    : "bg-white border-border/50 text-foreground/40",
                  interactive && stage.id <= currentStage && "hover:shadow-xl hover:shadow-champagne-gold/40"
                )}
              >
                {stage.id < currentStage ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{stage.id}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-[60px]",
                  stage.id <= currentStage ? "text-midnight" : "text-foreground/40"
                )}
              >
                {stage.label}
              </span>
              {/* Interactive Hint */}
              {interactive && stage.id === currentStage && (
                <span className="absolute -bottom-6 text-[10px] text-champagne-gold font-medium">
                  Toca para editar
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Pipeline - Horizontal Scroll with snap */}
      <div className="md:hidden overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide scroll-smooth snap-x snap-mandatory">
        <div className="flex items-center gap-3 min-w-max py-1">
          {pipelineStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center snap-center">
              <button
                type="button"
                onClick={() => interactive && onStageClick?.(stage.id, stage.label)}
                disabled={!interactive}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all duration-200 min-h-[44px] min-w-[44px]",
                  stage.id < currentStage
                    ? "bg-champagne-gold border-champagne-gold text-white"
                    : stage.id === currentStage
                    ? "bg-white border-champagne-gold text-champagne-gold shadow-lg shadow-champagne-gold/20 animate-pulse"
                    : "bg-white border-slate-200 text-foreground/40",
                  interactive && "cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-champagne-gold/50"
                )}
              >
                {stage.id < currentStage ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Circle className={cn(
                    "w-4 h-4",
                    stage.id === currentStage && "fill-champagne-gold/20"
                  )} />
                )}
                <span className="text-xs font-semibold whitespace-nowrap">
                  {stage.shortLabel}
                </span>
              </button>
              {index < pipelineStages.length - 1 && (
                <div
                  className={cn(
                    "w-5 h-0.5 mx-1.5 rounded-full flex-shrink-0",
                    stage.id < currentStage ? "bg-champagne-gold" : "bg-slate-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesPipeline;
