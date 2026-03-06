import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface MortgageCalculatorWidgetProps {
  propertyPrice: number;
  monthlyIncome: number;
  partnerMonthlyIncome?: number; // Ingreso de pareja (conyugal)
  initialDownPayment: string; // Ahorro actual del usuario
}

interface CalculatorState {
  years: number;
  downPayment: number;
  rate: number;
}

const MortgageCalculatorWidget = ({
  propertyPrice,
  monthlyIncome,
  partnerMonthlyIncome,
  initialDownPayment,
}: MortgageCalculatorWidgetProps) => {
  const initialDownPaymentNum = parseFloat(initialDownPayment) || 0;
  const totalMonthlyIncome = monthlyIncome + (partnerMonthlyIncome || 0);

  const [state, setState] = useState<CalculatorState>({
    years: 15,
    downPayment: Math.min(initialDownPaymentNum, propertyPrice),
    rate: 11,
  });

  // Calcular mensualidad usando fórmula de amortización
  const calculateMonthlyPayment = useMemo(() => {
    const principal = propertyPrice - state.downPayment;
    const monthlyRate = state.rate / 100 / 12;
    const numberOfPayments = state.years * 12;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const monthlyPayment =
      (principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return monthlyPayment;
  }, [propertyPrice, state.downPayment, state.years, state.rate]);

  // Determinar viabilidad (no debe superar 40% del ingreso mensual total)
  const isViable = calculateMonthlyPayment <= totalMonthlyIncome * 0.4;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-gradient-to-br from-champagne-gold/5 to-amber-50 rounded-2xl p-5 border border-champagne-gold/30 space-y-4">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">
          Simula tu Hipoteca
        </p>
        <p className="text-sm text-foreground/70 mb-3">Tu Mensualidad Estimada:</p>
        <p className="text-3xl font-bold text-champagne-gold mb-2">
          {formatCurrency(calculateMonthlyPayment)}
        </p>

        {/* Viability Badge */}
        <Badge
          className={`${
            isViable
              ? "bg-green-100 text-green-700 hover:bg-green-100"
              : "bg-amber-100 text-amber-700 hover:bg-amber-100"
          } font-medium text-xs`}
        >
          {isViable ? (
            <>✅ Viable con tus ingresos</>
          ) : (
            <>⚠️ Supera el 40% de tu sueldo</>
          )}
        </Badge>
      </div>

      {/* Sliders Container */}
      <div className="space-y-6 pt-2">
        {/* Plazo Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-midnight">Plazo</Label>
            <span className="text-sm font-bold text-champagne-gold">
              {state.years} años
            </span>
          </div>
          <Slider
            value={[state.years]}
            onValueChange={(value) =>
              setState((prev) => ({ ...prev, years: value[0] }))
            }
            min={5}
            max={30}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-foreground/50">
            <span>5 años</span>
            <span>30 años</span>
          </div>
        </div>

        {/* Enganche Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-midnight">Enganche</Label>
            <span className="text-sm font-bold text-champagne-gold">
              {formatCurrency(state.downPayment)}
            </span>
          </div>
          <Slider
            value={[state.downPayment]}
            onValueChange={(value) =>
              setState((prev) => ({
                ...prev,
                downPayment: value[0],
              }))
            }
            min={0}
            max={propertyPrice}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-foreground/50">
            <span>$0</span>
            <span>{formatCurrency(propertyPrice)}</span>
          </div>
        </div>

        {/* Tasa Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-midnight">Tasa Anual</Label>
            <span className="text-sm font-bold text-champagne-gold">
              {state.rate.toFixed(1)}%
            </span>
          </div>
          <Slider
            value={[state.rate]}
            onValueChange={(value) =>
              setState((prev) => ({ ...prev, rate: value[0] }))
            }
            min={9}
            max={13}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-foreground/50">
            <span>9%</span>
            <span>13%</span>
          </div>
        </div>
      </div>

      {/* Summary Info */}
      <div className="pt-3 border-t border-champagne-gold/20 space-y-2 text-xs">
        <div className="flex justify-between text-foreground/70">
          <span>Precio de propiedad:</span>
          <span className="font-semibold">{formatCurrency(propertyPrice)}</span>
        </div>
        <div className="flex justify-between text-foreground/70">
          <span>Monto a financiar:</span>
          <span className="font-semibold">
            {formatCurrency(propertyPrice - state.downPayment)}
          </span>
        </div>
        <div className="flex justify-between text-foreground/70">
          <span>{'Tu' + (partnerMonthlyIncome ? ' + su' : '')} ingreso mensual:</span>
          <span className="font-semibold">{formatCurrency(totalMonthlyIncome)}</span>
        </div>
        {partnerMonthlyIncome && (
          <div className="flex justify-between text-foreground/60 text-xs pt-1 border-t border-champagne-gold/10">
            <span className="text-champagne-gold font-medium">💑 Solicitud conyugal</span>
            <span>Tu pareja: {formatCurrency(partnerMonthlyIncome)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MortgageCalculatorWidget;
