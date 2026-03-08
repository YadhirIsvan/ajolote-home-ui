import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  onSave: () => void;
  isLoading: boolean;
}

const ProfileFieldModal = ({
  isOpen,
  onClose,
  title,
  description,
  value,
  onChange,
  maxLength,
  onSave,
  isLoading,
}: ProfileFieldModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted/20 transition-colors"
        >
          <X className="w-5 h-5 text-foreground/60" />
        </button>

        <h3 className="text-lg font-semibold text-midnight mb-1">{title}</h3>
        <p className="text-sm text-foreground/60 mb-4">{description}</p>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          rows={3}
          className="w-full rounded-xl border border-border/30 bg-muted/5 px-4 py-3 text-sm text-midnight placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-champagne-gold/40 focus:border-champagne-gold/40 resize-none"
          placeholder="Escribe aquí..."
        />
        <p className="text-xs text-foreground/40 text-right mt-1 mb-4">
          {value.length}/{maxLength}
        </p>

        <Button
          onClick={onSave}
          disabled={isLoading}
          className="w-full bg-midnight text-white hover:bg-midnight/90"
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileFieldModal;
