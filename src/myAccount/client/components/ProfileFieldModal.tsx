import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

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
  icon?: React.ReactNode;
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
  icon,
}: ProfileFieldModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top bar with X */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1.5 rounded-xl hover:bg-muted/30 transition-colors"
          >
            <X className="w-5 h-5 text-foreground/50" />
          </button>
          <span className="text-xs text-foreground/30 font-medium">
            {value.length}/{maxLength}
          </span>
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-6">
          {/* Icon */}
          {icon && (
            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--champagne-gold))]/10 flex items-center justify-center mb-4">
              {icon}
            </div>
          )}

          {/* Title as friendly question */}
          <h3 className="text-xl font-bold text-midnight leading-tight mb-1.5">
            {title}
          </h3>
          <p className="text-sm text-foreground/50 mb-5 leading-relaxed">
            {description}
          </p>

          {/* Input */}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
            rows={3}
            autoFocus
            className="w-full rounded-2xl border border-border/40 bg-secondary/20 px-4 py-3.5 text-sm text-midnight placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--champagne-gold))]/30 focus:border-[hsl(var(--champagne-gold))]/40 resize-none transition-all"
            placeholder="Escribe aquí..."
          />

          {/* Save button */}
          <div className="flex justify-end mt-5">
            <Button
              onClick={onSave}
              disabled={isLoading}
              className="bg-midnight text-white hover:bg-midnight/90 rounded-xl px-8 h-11 text-sm font-semibold shadow-sm"
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFieldModal;
