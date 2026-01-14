import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SalesPipelineProps {
  currentStage: number;
  onStageClick?: (stage: number) => void;
}

const pipelineStages = [
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

const SalesPipeline = ({ currentStage, onStageClick }: SalesPipelineProps) => {
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
              onClick={() => onStageClick?.(stage.id)}
              className={cn(
                "relative z-10 flex flex-col items-center cursor-pointer group",
                onStageClick && "hover:scale-105 transition-transform"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  stage.id < currentStage
                    ? "bg-champagne-gold border-champagne-gold text-white"
                    : stage.id === currentStage
                    ? "bg-white border-champagne-gold text-champagne-gold shadow-lg shadow-champagne-gold/20"
                    : "bg-white border-border/50 text-foreground/40"
                )}
              >
                {stage.id < currentStage ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{stage.id}</span>
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
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Pipeline - Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max">
          {pipelineStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <div
                onClick={() => onStageClick?.(stage.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full border transition-all cursor-pointer",
                  stage.id < currentStage
                    ? "bg-champagne-gold border-champagne-gold text-white"
                    : stage.id === currentStage
                    ? "bg-white border-champagne-gold text-champagne-gold shadow-md"
                    : "bg-white border-border/50 text-foreground/40"
                )}
              >
                {stage.id < currentStage ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                <span className="text-xs font-medium whitespace-nowrap">
                  {stage.shortLabel}
                </span>
              </div>
              {index < pipelineStages.length - 1 && (
                <div
                  className={cn(
                    "w-4 h-0.5 mx-1",
                    stage.id < currentStage ? "bg-champagne-gold" : "bg-border/50"
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
