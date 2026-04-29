import { Mail, CircleAlert, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useVerifyOtpPage } from "@/auth/hooks/use-verify-otp-page.auth.hook";

const VerifyOtpPage = () => {
  const { email, token, error, success, isLoading, setToken, handleSubmit, handleBack } =
    useVerifyOtpPage();

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
                Ingresa el código enviado a{" "}
                <span className="font-medium text-midnight">{email}</span>
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
                    }}
                    className="h-14 border-border/50 focus:border-champagne-gold focus:ring-champagne-gold/20 text-center text-2xl tracking-widest"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <CircleAlert className="w-4 h-4 flex-shrink-0" />
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
                  onClick={handleBack}
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
