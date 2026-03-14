import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Calculator, Info, Loader2 } from "lucide-react";
import { useFinancialModal } from "@/contexts/FinancialModalContext";
import AuthModal from "@/auth/components/AuthModal";
import { formatMoney, parseRawNumber } from "@/shared/utils/format-input";

interface FormData {
  loanType: string;
  monthlyIncome: string;
  partnerMonthlyIncome: string;
  savingsForEnganche: string;
  hasInfonavit: boolean;
  infonautSubcuentaBalance: string;
}

const emptyForm: FormData = {
  loanType: "",
  monthlyIncome: "",
  partnerMonthlyIncome: "",
  savingsForEnganche: "",
  hasInfonavit: false,
  infonautSubcuentaBalance: "",
};

const FinancialProfileModal = () => {
  const { isOpen, showAuthFirst, closeFinancialModal, closeAuthModal, onAuthSuccess } = useFinancialModal();

  const [formData, setFormData] = useState<FormData>({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [calculatedBudget, setCalculatedBudget] = useState(0);

  // Al abrir el modal, consultar la API para ver si ya tiene perfil financiero
  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const fetchProfile = async () => {
      setFetchingProfile(true);
      try {
        const response = await fetch("http://localhost:8000/api/v1/client/financial-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.calculated_budget) {
            setCalculatedBudget(data.calculated_budget);
            setShowResult(true);
            setFormData({
              loanType: data.loan_type || "",
              monthlyIncome: data.monthly_income?.toString() || "",
              partnerMonthlyIncome: data.partner_monthly_income?.toString() || "",
              savingsForEnganche: data.savings_for_enganche?.toString() || "",
              hasInfonavit: data.has_infonavit || false,
              infonautSubcuentaBalance: data.infonavit_subcuenta_balance?.toString() || "",
            });
          } else {
            // Tiene perfil pero sin presupuesto calculado
            setShowResult(false);
          }
        } else {
          // 404 o error = no tiene perfil, mostrar formulario
          setShowResult(false);
        }
      } catch {
        setShowResult(false);
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfile();
  }, [isOpen]);

  const handleLoanTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      loanType: value,
      partnerMonthlyIncome: value !== "conyugal" ? "" : prev.partnerMonthlyIncome,
    }));
  };

  const handleMonthlyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseRawNumber(e.target.value);
    setFormData((prev) => ({ ...prev, monthlyIncome: value }));
  };

  const handlePartnerIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseRawNumber(e.target.value);
    setFormData((prev) => ({ ...prev, partnerMonthlyIncome: value }));
  };

  const handleSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseRawNumber(e.target.value);
    setFormData((prev) => ({ ...prev, savingsForEnganche: value }));
  };

  const handleInfonavitChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      hasInfonavit: checked,
      infonautSubcuentaBalance: checked ? prev.infonautSubcuentaBalance : "",
    }));
  };

  const handleSubcuentaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseRawNumber(e.target.value);
    setFormData((prev) => ({ ...prev, infonautSubcuentaBalance: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.loanType || !formData.monthlyIncome || !formData.savingsForEnganche) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

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

      let response = await fetch("http://localhost:8000/api/v1/client/financial-profile", {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

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
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al guardar tu perfil. Intenta de nuevo.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ ...emptyForm });
    setShowResult(false);
    setCalculatedBudget(0);
    closeFinancialModal();
  };

  const handleUpdateData = () => {
    setShowResult(false);
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
    <>
      {/* Auth Modal — si el usuario no está logueado */}
      <AuthModal
        isOpen={showAuthFirst}
        onClose={closeAuthModal}
        onLoginSuccess={onAuthSuccess}
      />

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto scrollbar-desktop bg-white rounded-2xl border border-border/20 shadow-lg">
          {/* Loading while fetching profile */}
          {fetchingProfile ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-8 h-8 text-champagne-gold animate-spin" />
              <p className="text-sm text-foreground/60">Consultando tu perfil financiero...</p>
            </div>
          ) : showResult ? (
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

              <div className="space-y-6 py-6">
                <div className="text-center space-y-2">
                  <p className="text-foreground/60 text-sm">Presupuesto Máximo Estimado</p>
                  <p className="text-5xl font-bold text-champagne-gold">
                    {formatCurrency(calculatedBudget)}
                  </p>
                  <p className="text-sm text-foreground/50">MXN</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
                  <p className="text-sm font-semibold text-blue-900">¿Cómo se calcula?</p>
                  <p className="text-xs text-blue-800">
                    Este presupuesto incluye tu ahorro actual más lo que podrías financiar en 15 años con una tasa de interés estimada del 11% anual.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={handleClose}
                    className="w-full h-11 bg-champagne-gold hover:bg-champagne-gold-dark text-white font-semibold rounded-lg transition-colors"
                  >
                    Explorar Propiedades
                  </Button>

                  <button
                    onClick={handleUpdateData}
                    className="w-full h-10 text-sm font-medium text-champagne-gold hover:text-champagne-gold-dark hover:bg-champagne-gold/5 rounded-lg transition-colors py-2 px-4"
                  >
                    ¿Quieres calcular con otros datos? Actualizar información
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
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
                <SelectItem value="individual" className="py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Individual (Banco, Infonavit o Fovissste)</span>
                    <span className="text-xs text-foreground/60">Para comprar yo solo.</span>
                  </div>
                </SelectItem>
                <SelectItem value="conyugal" className="py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Conyugal o Familiar (Unir créditos)</span>
                    <span className="text-xs text-foreground/60">Para comprar con mi pareja, padre o hijos.</span>
                  </div>
                </SelectItem>
                <SelectItem value="cofinavit" className="py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Cofinavit (Banco + Mi ahorro Infonavit)</span>
                    <span className="text-xs text-foreground/60">Para usar lo que tengo guardado en el IMSS.</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

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
                placeholder="Ej. 40,000"
                value={formatMoney(formData.monthlyIncome)}
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
                  placeholder="Ej. 35,000"
                  value={formatMoney(formData.partnerMonthlyIncome)}
                  onChange={handlePartnerIncomeChange}
                  className="pl-7 h-10 rounded-lg"
                />
              </div>
              <p className="text-xs text-foreground/60 mt-2">
                Sumaremos ambos ingresos para calcular tu capacidad de crédito.
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
                placeholder="Ej. 150,000"
                value={formatMoney(formData.savingsForEnganche)}
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
                  placeholder="Ej. 85,000"
                  value={formatMoney(formData.infonautSubcuentaBalance)}
                  onChange={handleSubcuentaChange}
                  className="pl-7 h-10 rounded-lg"
                />
              </div>
            </div>
          )}

          <Separator className="my-6" />

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
    </>
  );
};

export default FinancialProfileModal;
