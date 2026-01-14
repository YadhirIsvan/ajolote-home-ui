import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Ingresa un correo electrónico válido");

const AuthGate = () => {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      });
    }
    setGoogleLoading(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    const { error } = await signInWithEmail(email);
    
    if (error) {
      toast({
        title: "Error al enviar el token",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEmailSent(true);
    }
    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[hsl(var(--champagne-gold))]/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[hsl(var(--champagne-gold))]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              ¡Revisa tu correo!
            </h1>
            <p className="text-muted-foreground text-lg">
              Hemos enviado un enlace mágico a <span className="font-semibold text-primary">{email}</span>
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            Haz clic en el enlace para acceder a tu cuenta. El enlace expira en 1 hora.
          </p>
          
          <Button
            variant="outline"
            onClick={() => setEmailSent(false)}
            className="w-full"
          >
            Usar otro correo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3">
            Bienvenido a tu Espacio Premium
          </h1>
          <p className="text-muted-foreground">
            Accede a tu cuenta para gestionar tus propiedades y crédito
          </p>
        </div>

        {/* Social Auth Buttons */}
        <div className="space-y-4 mb-8">
          <Button
            variant="outline"
            className="w-full h-14 text-base font-medium border-2 hover:bg-muted/50 transition-all"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continuar con Google
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 text-base font-medium border-2 hover:bg-muted/50 transition-all"
            disabled
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Continuar con Apple
            <span className="ml-2 text-xs text-muted-foreground">(Próximamente)</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-4 text-muted-foreground">
              O con tu correo
            </span>
          </div>
        </div>

        {/* Email Auth */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className={`h-14 pl-12 text-base border-2 ${
                  emailError ? "border-destructive" : ""
                }`}
              />
            </div>
            {emailError && (
              <p className="text-sm text-destructive mt-2">{emailError}</p>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full h-14 text-base font-semibold bg-[hsl(var(--champagne-gold))] hover:bg-[hsl(var(--champagne-gold))]/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Ingresar con Token"
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Al continuar, aceptas nuestros{" "}
          <a href="#" className="underline hover:text-primary">
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a href="#" className="underline hover:text-primary">
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthGate;
