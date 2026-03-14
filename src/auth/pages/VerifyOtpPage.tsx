import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, AlertCircle, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyOtpAction } from "@/auth/actions/verify-otp.actions";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.length < 4) {
      setError("El código debe tener al menos 4 dígitos.");
      return;
    }
    setIsLoading(true);
    setError("");
    const result = await verifyOtpAction(email, token);
    setIsLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/mi-cuenta"), 1000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-lg">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-champagne-gold/10 flex items-center justify-center">
              {success ? (
                <Check className="w-10 h-10 text-champagne-gold" />
              ) : (
                <Mail className="w-10 h-10 text-champagne-gold" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-midnight mb-2">Verificar Código</h1>
            {email && (
              <p className="text-foreground/60">
                Ingresa el código enviado a <span className="font-medium text-midnight">{email}</span>
              </p>
            )}
          </div>

          <div className="bg-white border border-border/30 rounded-2xl shadow-lg p-8">
            {success ? (
              <div className="flex flex-col items-center py-4">
                <p className="text-foreground/70 text-center">
                  Verificación exitosa. Redirigiendo...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-foreground font-medium">
                    Código de verificación
                  </Label>
                  <Input
                    id="token"
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                      setError("");
                    }}
                    className="h-14 border-border/50 focus:border-champagne-gold focus:ring-champagne-gold/20 text-center text-2xl tracking-widest"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-champagne-gold hover:bg-champagne-gold-dark text-white font-semibold"
                >
                  {isLoading ? "Verificando..." : "Verificar"}
                  {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
