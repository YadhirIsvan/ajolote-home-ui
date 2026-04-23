import { useState, useEffect } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Loader2, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { PhoneInputField } from "@/shared/components/custom/PhoneInputField";

interface PhoneConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhone: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  onConfirm: (phone: string) => void | Promise<void>;
}

export const PhoneConfirmationModal = ({
  open,
  onOpenChange,
  currentPhone,
  isSubmitting,
  errorMessage,
  onConfirm,
}: PhoneConfirmationModalProps) => {
  const missingPhone = !currentPhone;
  const [editing, setEditing] = useState(missingPhone);
  const [phone, setPhone] = useState<string | undefined>(currentPhone || undefined);

  useEffect(() => {
    if (open) {
      setEditing(!currentPhone);
      setPhone(currentPhone || undefined);
    }
  }, [open, currentPhone]);

  const isPhoneValid = !!phone && isValidPhoneNumber(phone);

  const handleConfirmCurrent = () => {
    if (currentPhone) onConfirm(currentPhone);
  };

  const handleSaveAndSchedule = () => {
    if (!phone || !isPhoneValid) return;
    onConfirm(phone);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary text-center">
            {editing && missingPhone
              ? "Necesitamos tu teléfono"
              : editing
                ? "Actualiza tu teléfono"
                : "¿A este número nos contactaremos?"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {!editing && (
            <>
              <p className="text-sm text-foreground/70 text-center">
                Usaremos este número para coordinar tu visita.
              </p>
              <div className="flex items-center justify-center gap-2 bg-muted rounded-xl py-4 px-3">
                <Phone className="w-4 h-4 text-champagne" />
                <span className="text-base font-medium text-primary">
                  {currentPhone}
                </span>
              </div>
              {errorMessage && (
                <p
                  role="alert"
                  className="text-sm text-destructive text-center"
                >
                  {errorMessage}
                </p>
              )}
              <div className="flex flex-col gap-2">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleConfirmCurrent}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Agendando...
                    </>
                  ) : (
                    "Es correcto, agendar"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setEditing(true)}
                  disabled={isSubmitting}
                >
                  Actualizar número
                </Button>
              </div>
            </>
          )}

          {editing && (
            <>
              {missingPhone && (
                <p className="text-sm text-foreground/70 text-center">
                  Para agendar tu visita necesitamos un teléfono de contacto.
                </p>
              )}
              <PhoneInputField
                id="phone-confirm"
                label="Teléfono"
                value={phone}
                onChange={setPhone}
                disabled={isSubmitting}
                autoFocus
              />
              {errorMessage && (
                <p
                  role="alert"
                  className="text-sm text-destructive text-center"
                >
                  {errorMessage}
                </p>
              )}
              <div className="flex flex-col gap-2">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleSaveAndSchedule}
                  disabled={!isPhoneValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar y agendar"
                  )}
                </Button>
                {!missingPhone && (
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      setEditing(false);
                      setPhone(currentPhone || undefined);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneConfirmationModal;
