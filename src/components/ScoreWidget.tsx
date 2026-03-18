import { Card } from "@/shared/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ScoreWidgetProps {
  score: number;
  title: string;
  subtitle?: string;
  checks?: { label: string; status: "ok" | "pending" | "error" }[];
}

const ScoreWidget = ({ score, title, subtitle, checks }: ScoreWidgetProps) => {
  // Calcular el color del score basado en el valor
  const getScoreColor = (value: number) => {
    if (value >= 90) return "text-ribbon";
    if (value >= 70) return "text-flamingo";
    return "text-destructive";
  };

  const scoreColor = getScoreColor(score);

  return (
    <Card className="p-6 bg-card-gradient border-border/50">
      <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>}

      {/* Medidor Circular */}
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40">
          {/* Círculo de fondo */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            {/* Círculo de progreso */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={scoreColor}
              strokeDasharray={`${(score / 100) * 283} 283`}
              style={{ transition: "stroke-dasharray 1s ease-in-out" }}
            />
          </svg>
          {/* Score en el centro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>

      {/* Lista de checks */}
      {checks && checks.length > 0 && (
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center gap-2">
              {check.status === "ok" ? (
                <CheckCircle2 className="w-5 h-5 text-ribbon flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <span className="text-sm text-card-foreground">{check.label}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ScoreWidget;
