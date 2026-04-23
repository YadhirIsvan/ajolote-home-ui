import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { PhoneInputField } from "@/shared/components/custom/PhoneInputField";
import { useClientConfig } from "@/myAccount/client/hooks/use-client-config.client.hook";

interface ClientProfileEditFormProps {
  onBack: () => void;
}

const ClientProfileEditForm = ({ onBack }: ClientProfileEditFormProps) => {
  const { profile, updateProfile, isSaving } = useClientConfig();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name ?? "");
      setLastName(profile.last_name ?? "");
      setPhone(profile.phone ?? "");
      setCity(profile.city ?? "");
    }
  }, [profile]);

  const isPhoneValid = Boolean(phone) && isValidPhoneNumber(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!isPhoneValid) {
      setError("Ingresa un teléfono válido.");
      return;
    }

    const result = await updateProfile({
      phone,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      city: city.trim(),
    });

    if (!result.success) {
      setError(result.message ?? "No se pudo guardar el perfil.");
      return;
    }

    setSuccess(true);
    setTimeout(onBack, 1200);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        disabled={isSaving}
        className="flex items-center gap-2 text-sm text-foreground/60 hover:text-champagne-gold transition-colors group disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver
      </button>

      <div>
        <h1 className="text-2xl font-bold text-midnight">Editar Datos Personales</h1>
        <p className="text-sm text-foreground/60 mt-1">
          Actualiza tu información de perfil
        </p>
      </div>

      <Card className="border border-border/30 bg-white shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="text-sm text-green-800">
                  Perfil actualizado correctamente
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-xs font-medium text-foreground/50 uppercase tracking-wider"
                >
                  Nombre
                </label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre"
                  disabled={isSaving}
                  maxLength={100}
                  className="border border-border/30 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-xs font-medium text-foreground/50 uppercase tracking-wider"
                >
                  Apellido
                </label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tu apellido"
                  disabled={isSaving}
                  maxLength={100}
                  className="border border-border/30 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <PhoneInputField
                  label="Teléfono"
                  hint="(requerido)"
                  value={phone}
                  onChange={(v) => setPhone(v ?? "")}
                  defaultCountry="MX"
                  disabled={isSaving}
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label
                  htmlFor="city"
                  className="text-xs font-medium text-foreground/50 uppercase tracking-wider"
                >
                  Ciudad
                </label>
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Tu ciudad"
                  disabled={isSaving}
                  maxLength={100}
                  className="border border-border/30 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isSaving}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="gold"
                disabled={isSaving || !isPhoneValid}
                className="flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProfileEditForm;
