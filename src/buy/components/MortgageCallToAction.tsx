import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface MortgageCallToActionProps {
  onCalculateCredit: () => void;
}

const MortgageCallToAction = ({ onCalculateCredit }: MortgageCallToActionProps) => {
  return (
    <div className="bg-gradient-to-br from-champagne-gold/10 to-amber-50 rounded-2xl p-5 border border-champagne-gold/20">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl mt-0.5">💳</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-midnight">
            ¿Quieres saber si te alcanza para esta propiedad?
          </p>
          <p className="text-xs text-foreground/60 mt-1">
            Calcula tu presupuesto máximo en menos de 2 minutos
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-white transition-all"
        onClick={onCalculateCredit}
      >
        Calcula tu crédito aquí
      </Button>
    </div>
  );
};

export default MortgageCallToAction;
