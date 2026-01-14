import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, CheckCircle2, Home, Building2, Castle, Warehouse } from "lucide-react";

// Validation schemas
const step1Schema = z.object({
  propertyType: z.string().min(1, "Selecciona un tipo de propiedad"),
  location: z.string().min(1, "Selecciona una ubicación"),
  squareMeters: z.string().min(1, "Ingresa los metros cuadrados").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Ingresa un número válido"
  ),
});

const step2Schema = z.object({
  bedrooms: z.string().min(1, "Selecciona el número de recámaras"),
  bathrooms: z.string().min(1, "Selecciona el número de baños"),
  expectedPrice: z.string().optional(),
});

const step3Schema = z.object({
  fullName: z.string().trim().min(2, "Ingresa tu nombre completo").max(100, "Nombre muy largo"),
  phone: z.string().trim().min(10, "Ingresa un teléfono válido").max(15, "Teléfono muy largo").regex(/^[0-9+\-\s()]+$/, "Solo números y símbolos válidos"),
  email: z.string().trim().email("Ingresa un correo válido").max(255, "Correo muy largo"),
});

interface SellerLeadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const propertyTypes = [
  { id: "casa", label: "Casa", icon: Home },
  { id: "departamento", label: "Depto", icon: Building2 },
  { id: "terreno", label: "Terreno", icon: Castle },
  { id: "local", label: "Local", icon: Warehouse },
];

const locations = [
  "Orizaba",
  "Córdoba",
  "Fortín",
  "Ixtaczoquitlán",
  "Río Blanco",
  "Nogales",
  "Ciudad Mendoza",
  "Otra",
];

const SellerLeadForm = ({ open, onOpenChange }: SellerLeadFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data
  const [formData, setFormData] = useState({
    propertyType: "",
    location: "",
    squareMeters: "",
    bedrooms: "",
    bathrooms: "",
    expectedPrice: "",
    fullName: "",
    phone: "",
    email: "",
  });

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    try {
      if (step === 1) {
        step1Schema.parse({
          propertyType: formData.propertyType,
          location: formData.location,
          squareMeters: formData.squareMeters,
        });
      } else if (step === 2) {
        step2Schema.parse({
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          expectedPrice: formData.expectedPrice,
        });
      } else if (step === 3) {
        step3Schema.parse({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        });
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    // For now, we just show the success state
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after closing
    setTimeout(() => {
      setCurrentStep(1);
      setIsSubmitted(false);
      setFormData({
        propertyType: "",
        location: "",
        squareMeters: "",
        bedrooms: "",
        bathrooms: "",
        expectedPrice: "",
        fullName: "",
        phone: "",
        email: "",
      });
      setErrors({});
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0 bg-background border-0 shadow-2xl rounded-2xl">
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
                  <Label className="text-sm font-medium text-primary mb-3 block">
                    Tipo de propiedad
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {propertyTypes.map((type) => (
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
                  <Label className="text-sm font-medium text-primary mb-3 block">
                    Ubicación
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => updateFormData("location", value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-border focus:border-[hsl(var(--champagne-gold))] focus:ring-[hsl(var(--champagne-gold))]">
                      <SelectValue placeholder="Selecciona una ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && (
                    <p className="text-destructive text-sm mt-2">{errors.location}</p>
                  )}
                </div>

                {/* Square Meters */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">
                    Metros cuadrados
                  </Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Ej: 150"
                    value={formData.squareMeters}
                    onChange={(e) => updateFormData("squareMeters", e.target.value)}
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
                  <Label className="text-sm font-medium text-primary mb-3 block">
                    Número de Recámaras
                  </Label>
                  <div className="flex gap-3">
                    {["1", "2", "3", "4", "5+"].map((num) => (
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
                  <Label className="text-sm font-medium text-primary mb-3 block">
                    Número de Baños
                  </Label>
                  <div className="flex gap-3">
                    {["1", "2", "3", "4+"].map((num) => (
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
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="Ej: 2,500,000"
                      value={formData.expectedPrice}
                      onChange={(e) => updateFormData("expectedPrice", e.target.value)}
                      className="h-12 pl-8 rounded-xl border-border focus:border-[hsl(var(--champagne-gold))] focus-visible:ring-[hsl(var(--champagne-gold))]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">
                    Nombre completo
                  </Label>
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    className="h-12 rounded-xl border-border focus:border-[hsl(var(--champagne-gold))] focus-visible:ring-[hsl(var(--champagne-gold))]"
                    maxLength={100}
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-sm mt-2">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">
                    Teléfono / WhatsApp
                  </Label>
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="Ej: 272 123 4567"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="h-12 rounded-xl border-border focus:border-[hsl(var(--champagne-gold))] focus-visible:ring-[hsl(var(--champagne-gold))]"
                    maxLength={15}
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-2">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label className="text-sm font-medium text-primary mb-3 block">
                    Correo electrónico
                  </Label>
                  <Input
                    type="email"
                    inputMode="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="h-12 rounded-xl border-border focus:border-[hsl(var(--champagne-gold))] focus-visible:ring-[hsl(var(--champagne-gold))]"
                    maxLength={255}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-2">{errors.email}</p>
                  )}
                </div>
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
                className={`h-12 rounded-xl bg-[hsl(var(--champagne-gold))] hover:bg-[hsl(var(--champagne-gold-dark))] text-white font-semibold ${
                  currentStep === 1 ? "w-full" : "flex-1"
                }`}
              >
                {currentStep === totalSteps ? (
                  "Enviar mi propiedad"
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
