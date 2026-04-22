import PhoneInput from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Label } from "@/shared/components/ui/label";

interface PhoneInputFieldProps {
  id?: string;
  label: string;
  hint?: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  defaultCountry?: Country;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const PhoneInputField = ({
  id = "phone",
  label,
  hint,
  value,
  onChange,
  defaultCountry = "MX",
  disabled,
  autoFocus,
}: PhoneInputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-foreground font-medium text-sm">
        {label}{" "}
        {hint && <span className="text-muted-foreground text-xs">{hint}</span>}
      </Label>
      <PhoneInput
        id={id}
        international
        defaultCountry={defaultCountry}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoFocus={autoFocus}
        className="ajolote-phone-input"
      />
    </div>
  );
};
