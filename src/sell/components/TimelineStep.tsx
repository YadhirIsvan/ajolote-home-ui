import { Check } from "lucide-react";
import type { SELL_STEPS } from "@/sell/constants/sell.constants";

interface TimelineStepProps {
  step: (typeof SELL_STEPS)[number];
  index: number;
  isVisible: boolean;
  isLast: boolean;
}

const TimelineStep = ({ step, index, isVisible, isLast }: TimelineStepProps) => {
  return (
    <div
      className={`relative flex items-start gap-6 md:gap-10 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110`}
        >
          <step.icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.8} />
        </div>
        {!isLast && (
          <div
            className={`w-px flex-1 min-h-[60px] transition-all duration-1000 ${
              isVisible ? "bg-gradient-to-b from-border to-transparent" : "bg-transparent"
            }`}
            style={{ transitionDelay: `${index * 150 + 300}ms` }}
          />
        )}
      </div>

      <div className="flex-1 pb-10 md:pb-14">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}
          >
            Paso {index + 1}
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-midnight mb-2 leading-tight">
          {step.title}
        </h3>
        <p className="text-foreground/60 text-base leading-relaxed mb-3 max-w-lg">
          {step.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-foreground/40">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{step.detail}</span>
        </div>
      </div>
    </div>
  );
};

export default TimelineStep;
