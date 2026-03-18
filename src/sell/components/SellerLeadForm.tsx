import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowLeft, CheckCircle2, Home, Building2, Castle, Warehouse, Loader2 } from "lucide-react";
import { useSellerLeadForm } from "@/sell/hooks/use-seller-lead-form.sell.hook";
import { getCitiesAction, type CityItem } from "@/shared/actions/get-cities.actions";
import { useAuth } from "@/auth/hooks/use-auth.auth.hook";
import { formatMoney, formatSqm, formatPhone, parseRawNumber, parseRawDecimal } from "@/shared/utils/format-input";

const PROPERTY_TYPES = [
  { id: "casa", label: "Casa", icon: Home },
  { id: "departamento", label: "Depto", icon: Building2 },
  { id: "terreno", label: "Terreno", icon: Castle },
  { id: "local", label: "Local", icon: Warehouse },
] as const;

const LOCATIONS = [
  "Orizaba", "Córdoba", "Fortín", "Ixtaczoquitlán",
  "Río Blanco", "Nogales", "Ciudad Mendoza", "Otra",
] as const;

export interface SellerLeadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "default" | "add";
  onPropertyAdded?: (data: Record<string, string>) => void;
}

const SellerLeadForm = ({ open, onOpenChange, mode = "default", onPropertyAdded }: SellerLeadFormProps) => {
  const { user } = useAuth();
  const {
    currentStep,
    totalSteps,
    progressPercentage,
    formData,
    errors,
    isSubmitted,
    isSubmitting,
    updateFormData,
    handleNext,
    handleBack,
    handleClose,
  } = useSellerLeadForm({
    onOpenChange,
    mode,
    onPropertyAdded,
    membershipId: user?.membership_id
  });

  const { data: citiesData = [] } = useQuery({
    queryKey: ["sell-cities"],
    queryFn: getCitiesAction,
    staleTime: 1000 * 60 * 60,
  });

  const cities: CityItem[] = citiesData ?? [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto scrollbar-desktop p-0 gap-0 bg-background border-0 shadow-2xl rounded-2xl">
        {/* Progress Bar */}
        {!isSubmitted && (
          <div className="h-1 bg-secondary w-full rounded-t-2xl overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--champagne-gold))] transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        {isSubmitted ? (
          /* Success State */
          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[hsl(var(--champagne-gold))]/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[hsl(var(--champagne-gold))]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              ¡Recibido, Champ!
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Un asesor experto te contactará en menos de 24 horas.
            </p>
            <Button
              onClick={handleClose}
              className="bg-[hsl(var(--champagne-gold))] hover:bg-[hsl(var(--champagne-gold-dark))] text-white rounded-xl px-8 py-6"
            >
              Cerrar
            </Button>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6">
              <div className="text-sm text-[hsl(var(--champagne-gold))] font-medium mb-1">
                Paso {currentStep} de {totalSteps}
              </div>
              <DialogTitle className="text-2xl font-bold text-primary">
                {currentStep === 1 && "La Propiedad"}
                {currentStep === 2 && "Detalles"}
                {currentStep === 3 && "Contacto"}
              </DialogTitle>
            </DialogHeader>

            {/* Step 1: Property Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Property Type Chips */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">Tipo de propiedad</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {PROPERTY_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => updateFormData("propertyType", type.id)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.propertyType === type.id
                            ? "border-[hsl(var(--champagne-gold))] bg-[hsl(var(--champagne-gold))]/5"
                            : "border-border hover:border-[hsl(var(--champagne-gold))]/50"
                        }`}
                      >
                        <type.icon
                          className={`w-6 h-6 ${
                            formData.propertyType === type.id
                              ? "text-[hsl(var(--champagne-gold))]"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            formData.propertyType === type.id
                              ? "text-[hsl(var(--champagne-gold))]"
                              : "text-primary"
                          }`}
                        >
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.propertyType && (
                    <p className="text-destructive text-sm mt-2">{errors.propertyType}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">Ubicación</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => updateFormData("location", value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-border focus:border-[hsl(var(--champagne-gold))] focus:ring-[hsl(var(--champagne-gold))]">
                      <SelectValue placeholder="Selecciona una ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.name}>{city.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && (
                    <p className="text-destructive text-sm mt-2">{errors.location}</p>
                  )}
                </div>

                {/* Square Meters */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">Metros cuadrados de terreno</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Ej: 150"
                    value={formatSqm(formData.squareMeters)}
                    onChange={(e) => updateFormData("squareMeters", parseRawDecimal(e.target.value))}
                    className="h-12 rounded-xl border-border focus:border-[hsl(var(--champagne-gold))] focus-visible:ring-[hsl(var(--champagne-gold))]"
                  />
                  {errors.squareMeters && (
                    <p className="text-destructive text-sm mt-2">{errors.squareMeters}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Bedrooms */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">Número de Recámaras</Label>
                  <div className="flex gap-3">
                    {(["0", "1", "2", "3", "4", "5+"] as const).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => updateFormData("bedrooms", num)}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                          formData.bedrooms === num
                            ? "border-[hsl(var(--champagne-gold))] bg-[hsl(var(--champagne-gold))]/5 text-[hsl(var(--champagne-gold))]"
                            : "border-border text-primary hover:border-[hsl(var(--champagne-gold))]/50"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {errors.bedrooms && (
                    <p className="text-destructive text-sm mt-2">{errors.bedrooms}</p>
                  )}
                </div>

                {/* Bathrooms */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">Número de Baños</Label>
                  <div className="flex gap-3">
                    {(["0", "1", "2", "3", "4+"] as const).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => updateFormData("bathrooms", num)}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                          formData.bathrooms === num
                            ? "border-[hsl(var(--champagne-gold))] bg-[hsl(var(--champagne-gold))]/5 text-[hsl(var(--champagne-gold))]"
                            : "border-border text-primary hover:border-[hsl(var(--champagne-gold))]/50"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {errors.bathrooms && (
                    <p className="text-destructive text-sm mt-2">{errors.bathrooms}</p>
                  )}
                </div>

                {/* Expected Price */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">
                    Precio pretendido{" "}
                    <span className="text-muted-foreground font-normal">(Opcional)</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Ej: 2,500,000"
                      value={formatMoney(formData.expectedPrice)}
                      onChange={(e) => updateFormData("expectedPrice", parseRawNumber(e.target.value))}
                      className="h-12 pl-8 rounded-xl border-border focus:border-[hsl(var(--champagne-gold))] focus-visible:ring-[hsl(var(--champagne-gold))]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">Nombre Completo</Label>
                  <Input
                    type="text"
                    placeholder="Ej: Juan González"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    className="h-12 rounded-xl border-border focus:border-[hsl(var(--champagne-gold))] focus-visible:ring-[hsl(var(--champagne-gold))]"
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-sm mt-2">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">Teléfono</Label>
                  <Input
                    type="tel"
                    placeholder="Ej: 272 123 4567"
                    value={formatPhone(formData.phone)}
                    onChange={(e) => updateFormData("phone", e.target.value.replace(/[^0-9+]/g, ""))}
                    className="h-12 rounded-xl border-border focus:border-[hsl(var(--champagne-gold))] focus-visible:ring-[hsl(var(--champagne-gold))]"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-2">{errors.phone}</p>
                  )}
                </div>

                {errors.submit && (
                  <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{errors.submit}</p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-12 rounded-xl border-border text-primary hover:bg-secondary"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Atrás
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className={`h-12 rounded-xl bg-[hsl(var(--champagne-gold))] hover:bg-[hsl(var(--champagne-gold-dark))] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentStep === 1 ? "w-full" : "flex-1"
                }`}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {currentStep === totalSteps ? (
                  mode === "add" ? "Agregar" : "Enviar mi propiedad"
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SellerLeadForm;
