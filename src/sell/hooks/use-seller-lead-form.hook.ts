import { useState } from "react";
import { z } from "zod";
import type { SellerLeadData } from "@/sell/actions/submit-seller-lead.actions";

const step1Schema = z.object({
  propertyType: z.string().min(1, "Selecciona un tipo de propiedad"),
  location: z.string().min(1, "Selecciona una ubicación"),
  squareMeters: z
    .string()
    .min(1, "Ingresa los metros cuadrados")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Ingresa un número válido"),
});

const step2Schema = z.object({
  bedrooms: z.string().min(1, "Selecciona el número de recámaras"),
  bathrooms: z.string().min(1, "Selecciona el número de baños"),
  expectedPrice: z.string().optional(),
});

const EMPTY_FORM: SellerLeadData = {
  propertyType: "",
  location: "",
  squareMeters: "",
  bedrooms: "",
  bathrooms: "",
  expectedPrice: "",
  fullName: "",
  phone: "",
  email: "",
};

interface UseSellerLeadFormOptions {
  onOpenChange: (open: boolean) => void;
  mode?: "default" | "add";
  onPropertyAdded?: (data: Record<string, string>) => void;
}

export const useSellerLeadForm = ({
  onOpenChange,
  mode = "default",
  onPropertyAdded,
}: UseSellerLeadFormOptions) => {
  const TOTAL_STEPS = 2;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<SellerLeadData>(EMPTY_FORM);

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) newErrors[e.path[0] as string] = e.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (mode === "add" && onPropertyAdded) {
      onPropertyAdded(formData as unknown as Record<string, string>);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCurrentStep(1);
      setIsSubmitted(false);
      setFormData(EMPTY_FORM);
      setErrors({});
    }, 300);
  };

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    progressPercentage,
    formData,
    errors,
    isSubmitted,
    mode,
    updateFormData,
    handleNext,
    handleBack,
    handleClose,
  };
};
