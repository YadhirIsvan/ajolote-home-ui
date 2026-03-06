import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Calculator, Info } from "lucide-react";
import { useFinancialModal } from "@/contexts/FinancialModalContext";

interface FormData {
  loanType: string;
  monthlyIncome: string;
  partnerMonthlyIncome: string;
  savingsForEnganche: string;
  hasInfonavit: boolean;
  infonautSubcuentaBalance: string;
}

const FinancialProfileModal = () => {
  const { isOpen, closeFinancialModal } = useFinancialModal();
  
  const [formData, setFormData] = useState<FormData>({
    loanType: "",
    monthlyIncome: "",
    partnerMonthlyIncome: "",
    savingsForEnganche: "",
    hasInfonavit: false,
    infonautSubcuentaBalance: "",
  });

  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [calculatedBudget, setCalculatedBudget] = useState(0);

  // Restaurar showResult desde localStorage al abrir el modal
  useEffect(() => {
    if (isOpen) {
      try {
        const savedShowResult = localStorage.getItem("financial_profile_show_result");
        const savedBudget = localStorage.getItem("financial_profile_calculated_budget");
        if (savedShowResult === "true" && savedBudget) {
          setShowResult(true);
          setCalculatedBudget(parseFloat(savedBudget));
        }
      } catch {
        // Silent fail
      }
    }
  }, [isOpen]);

  // Guardar showResult en localStorage cuando cambie
  useEffect(() => {
    if (showResult && calculatedBudget > 0) {
      localStorage.setItem("financial_profile_show_result", "true");
      localStorage.setItem("financial_profile_calculated_budget", calculatedBudget.toString());
    }
  }, [showResult, calculatedBudget]);

  const handleLoanTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      loanType: value,
      // Reset partner income when changing loan type
      partnerMonthlyIncome: value !== "conyugal" ? "" : prev.partnerMonthlyIncome,
    }));
  };

  const handleMonthlyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({
      ...prev,
      monthlyIncome: value,
    }));
  };

  const handlePartnerIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({
      ...prev,
      partnerMonthlyIncome: value,
    }));
  };

  const handleSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({
      ...prev,
      savingsForEnganche: value,
    }));
  };

  const handleInfonavitChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      hasInfonavit: checked,
      infonautSubcuentaBalance: checked ? prev.infonautSubcuentaBalance : "",
    }));
  };

  const handleSubcuentaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({
      ...prev,
      infonautSubcuentaBalance: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!formData.loanType || !formData.monthlyIncome || !formData.savingsForEnganche) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    // Validar ingreso de pareja si es conyugal
    if (formData.loanType === "conyugal" && !formData.partnerMonthlyIncome) {
      alert("Por favor ingresa el ingreso de la persona con la que vas a comprar");
      return;
    }

    if (formData.hasInfonavit && !formData.infonautSubcuentaBalance) {
      alert("Por favor ingresa el saldo de la subcuenta");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const payload = {
        loan_type: formData.loanType,
        monthly_income: parseFloat(formData.monthlyIncome),
        partner_monthly_income: formData.loanType === "conyugal" ? parseFloat(formData.partnerMonthlyIncome) : null,
        savings_for_enganche: parseFloat(formData.savingsForEnganche),
        has_infonavit: formData.hasInfonavit,
        infonavit_subcuenta_balance: formData.hasInfonavit ? parseFloat(formData.infonautSubcuentaBalance) : null,
      };

      // Intentar actualizar primero (PUT), si no existe, crear (POST)
      let response = await fetch("http://localhost:8000/api/v1/client/financial-profile", {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      // Si retorna 404, es la primera vez, así que creamos con POST
      if (response.status === 404) {
        response = await fetch("http://localhost:8000/api/v1/client/financial-profile", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error("Error al guardar el perfil financiero");
      }

      const data = await response.json();
      setCalculatedBudget(data.calculated_budget);
      setLoading(false);
      setShowResult(true);

      // También guardar en localStorage para acceso rápido
      localStorage.setItem("financial_profile", JSON.stringify({
        loanType: formData.loanType,
        monthlyIncome: formData.monthlyIncome,
        partnerMonthlyIncome: formData.partnerMonthlyIncome,
        savingsForEnganche: formData.savingsForEnganche,
        hasInfonavit: formData.hasInfonavit,
        infonautSubcuentaBalance: formData.infonautSubcuentaBalance,
        createdAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al guardar tu perfil. Intenta de nuevo.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Mantener showResult en localStorage si el usuario cierra el modal
    // Solo limpiar form data
    setFormData({
      loanType: "",
      monthlyIncome: "",
      partnerMonthlyIncome: "",
      savingsForEnganche: "",
      hasInfonavit: false,
      infonautSubcuentaBalance: "",
    });
    closeFinancialModal();
  };

  const handleUpdateData = () => {
    // Reset para mostrar formulario de nuevo
    setShowResult(false);
    // Limpiar localStorage del resultado
    localStorage.removeItem("financial_profile_show_result");
    localStorage.removeItem("financial_profile_calculated_budget");
    setFormData({
      loanType: "",
      monthlyIncome: "",
      partnerMonthlyIncome: "",
      savingsForEnganche: "",
      hasInfonavit: false,
      infonautSubcuentaBalance: "",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border border-border/20 shadow-lg">
        {/* Result View */}
        {showResult ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-champagne-gold to-amber-500 flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
                <DialogTitle className="text-2xl font-bold text-midnight">Tu Pre-aprobación Estimada</DialogTitle>
              </div>
            </DialogHeader>

            <Separator className="my-4" />

            {/* Result Content */}
            <div className="space-y-6 py-6">
              {/* Budget Amount */}
              <div className="text-center space-y-2">
                <p className="text-foreground/60 text-sm">Presupuesto Máximo Estimado</p>
                <p className="text-5xl font-bold text-champagne-gold">
                  {formatCurrency(calculatedBudget)}
                </p>
                <p className="text-sm text-foreground/50">MXN</p>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
                <p className="text-sm font-semibold text-blue-900">¿Cómo se calcula?</p>
                <p className="text-xs text-blue-800">
                  Este presupuesto incluye tu ahorro actual más lo que podrías financiar en 15 años con una tasa de interés estimada del 11% anual.
                </p>
              </div>

              {/* Buttons Section */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleClose}
                  className="w-full h-11 bg-champagne-gold hover:bg-champagne-gold-dark text-white font-semibold rounded-lg transition-colors"
                >
                  🏠 Explorar Propiedades
                </Button>

                <button
                  onClick={handleUpdateData}
                  className="w-full h-10 text-sm font-medium text-champagne-gold hover:text-champagne-gold-dark hover:bg-champagne-gold/5 rounded-lg transition-colors py-2 px-4"
                >
                  🔄 ¿Quieres calcular con otros datos? Actualizar información
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Form View */}
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-champagne-gold" />
                <DialogTitle className="text-2xl font-bold text-midnight">Calcula tu Presupuesto</DialogTitle>
              </div>
              <DialogDescription className="text-foreground/60">
                Ingresa tus datos financieros para calcular tu presupuesto máximo de compra
              </DialogDescription>
            </DialogHeader>

            <Separator className="my-4" />

            <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tipo de Crédito */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="loanType" className="text-sm font-semibold text-midnight">
                Tipo de Crédito <span className="text-red-500">*</span>
              </Label>
            </div>
            <Select value={formData.loanType} onValueChange={handleLoanTypeChange}>
              <SelectTrigger id="loanType" className="h-10 rounded-lg">
                <SelectValue placeholder="Selecciona tu tipo de crédito" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {/* Individual */}
                <SelectItem value="individual" className="py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Individual (Banco, Infonavit o Fovissste)</span>
                    <span className="text-xs text-foreground/60">Para comprar yo solo.</span>
                  </div>
                </SelectItem>

                {/* Conyugal */}
                <SelectItem value="conyugal" className="py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Conyugal o Familiar (Unir créditos)</span>
                    <span className="text-xs text-foreground/60">Para comprar con mi pareja, padre o hijos.</span>
                  </div>
                </SelectItem>

                {/* Cofinavit */}
                <SelectItem value="cofinavit" className="py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Cofinavit (Banco + Mi ahorro Infonavit)</span>
                    <span className="text-xs text-foreground/60">Para usar lo que tengo guardado en el IMSS.</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Tooltips de Ayuda */}
            <div className="grid grid-cols-1 gap-2 mt-3">
              {formData.loanType === "individual" && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    Si cotizas en el IMSS/ISSSTE o eres independiente y tienes buen historial.
                  </p>
                </div>
              )}
              {formData.loanType === "conyugal" && (
                <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Info className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700">
                    Pueden sumar ingresos para alcanzar una casa de mayor precio.
                  </p>
                </div>
              )}
              {formData.loanType === "cofinavit" && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Ideal si tienes mucho dinero ahorrado en tu Subcuenta de Vivienda.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ingreso Mensual Neto */}
          <div className="space-y-2">
            <Label htmlFor="monthlyIncome" className="text-sm font-semibold text-midnight">
              {formData.loanType === "conyugal" ? "Tu Ingreso Mensual Neto" : "Ingreso Mensual Neto"} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60 font-medium">$</span>
              <Input
                id="monthlyIncome"
                type="text"
                placeholder="Ej. 40000"
                value={formData.monthlyIncome}
                onChange={handleMonthlyIncomeChange}
                className="pl-7 h-10 rounded-lg"
              />
            </div>
          </div>

          {/* Ingreso de Pareja - Condicional */}
          {formData.loanType === "conyugal" && (
            <div className="space-y-2 pl-2 border-l-2 border-champagne-gold/30">
              <Label htmlFor="partnerIncome" className="text-sm font-semibold text-midnight">
                ¿Cuánto gana la persona con la que vas a comprar? <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60 font-medium">$</span>
                <Input
                  id="partnerIncome"
                  type="text"
                  placeholder="Ej. 35000"
                  value={formData.partnerMonthlyIncome}
                  onChange={handlePartnerIncomeChange}
                  className="pl-7 h-10 rounded-lg"
                />
              </div>
              <p className="text-xs text-foreground/60 mt-2">
                💡 Sumaremos ambos ingresos para calcular tu capacidad de crédito.
              </p>
            </div>
          )}

          {/* Ahorro Actual */}
          <div className="space-y-2">
            <Label htmlFor="savings" className="text-sm font-semibold text-midnight">
              Ahorro Actual para Enganche/Escrituras <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60 font-medium">$</span>
              <Input
                id="savings"
                type="text"
                placeholder="Ej. 150000"
                value={formData.savingsForEnganche}
                onChange={handleSavingsChange}
                className="pl-7 h-10 rounded-lg"
              />
            </div>
          </div>

          {/* Checkbox Infonavit */}
          <div className="flex items-center gap-3 py-2">
            <Checkbox
              id="infonavit"
              checked={formData.hasInfonavit}
              onCheckedChange={(checked) => handleInfonavitChange(checked as boolean)}
            />
            <Label htmlFor="infonavit" className="text-sm font-medium text-midnight cursor-pointer">
              ¿Cuentas con puntos Infonavit?
            </Label>
          </div>

          {/* Saldo Subcuenta - Condicional */}
          {formData.hasInfonavit && (
            <div className="space-y-2 pl-2 border-l-2 border-champagne-gold/30">
              <Label htmlFor="subcuenta" className="text-sm font-semibold text-midnight">
                Saldo de Subcuenta <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60 font-medium">$</span>
                <Input
                  id="subcuenta"
                  type="text"
                  placeholder="Ej. 85000"
                  value={formData.infonautSubcuentaBalance}
                  onChange={handleSubcuentaChange}
                  className="pl-7 h-10 rounded-lg"
                />
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-champagne-gold hover:bg-champagne-gold-dark text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? "Calculando..." : (
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Calcular mi Presupuesto
              </div>
            )}
          </Button>
        </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FinancialProfileModal;
