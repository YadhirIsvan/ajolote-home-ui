import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Mail, ArrowRight, Check, CircleAlert, Loader2 } from "lucide-react";
import { useAuthModal } from "@/auth/hooks/use-auth-modal.auth.hook";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onLoginSuccess }: AuthModalProps) => {
  const {
    step,
    email,
    setEmail,
    token,
    setToken,
    error,
    isLoading,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    goToEmailStep,
    handleGoogleLogin,
    handleAppleLogin,
    handleEmailSubmit,
    handleTokenVerify,
    handleBack,
    handleOpenChange,
  } = useAuthModal({ onLoginSuccess, onClose });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-midnight">
            {step === "options" && "Iniciar Sesión"}
            {step === "email" && "Continuar con Email"}
            {step === "verify" && "Verificar Código"}
            {step === "success" && "¡Bienvenido!"}
          </DialogTitle>
          <DialogDescription className="text-foreground/60">
            {step === "options" && "Elige cómo deseas ingresar a tu cuenta"}
            {step === "email" && "Te enviaremos un código de acceso"}
            {step === "verify" && `Ingresa el código enviado a ${email}`}
            {step === "success" && "Ingresando a tu cuenta..."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {/* ── OPTIONS ── */}
          {step === "options" && (
            <>
              <Button
                variant="outline"
                disabled={isLoading}
                className="w-full h-14 border-border/50 hover:bg-muted/30 hover:border-champagne-gold transition-all"
                onClick={handleGoogleLogin}
              >
                <div className="flex items-center justify-center gap-3 w-full">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-champagne-gold" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  <span className="text-foreground font-medium">Continuar con Google</span>
                </div>
              </Button>

{/* Contenedor oculto para Google Sign-In fallback */}
              <div id="google-signin-btn" className="hidden" />

              {/* Error para Google/Apple */}
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <CircleAlert className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="relative my-2">
                <Separator className="bg-border/50" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-muted-foreground">
                  o
                </span>
              </div>

              <Button
                variant="outline"
                disabled={isLoading}
                className="w-full h-14 border-border/50 hover:bg-muted/30 hover:border-champagne-gold transition-all"
                onClick={goToEmailStep}
              >
                <div className="flex items-center justify-center gap-3 w-full">
                  <Mail className="w-5 h-5 text-champagne-gold" />
                  <span className="text-foreground font-medium">Continuar con Email</span>
                </div>
              </Button>
            </>
          )}

          {/* ── EMAIL ── */}
          {step === "email" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                  className="h-14 border-border/50 focus:border-champagne-gold focus:ring-champagne-gold/20"
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <CircleAlert className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleEmailSubmit}
                disabled={isLoading}
                className="w-full h-14 bg-champagne-gold hover:bg-champagne-gold-dark text-white font-semibold"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Enviar código <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={isLoading}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Volver
              </Button>
            </div>
          )}

          {/* ── VERIFY ── */}
          {step === "verify" && (
            <div className="space-y-4">
              {/* Código OTP — siempre visible */}
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
                  onChange={(e) => setToken(e.target.value)}
                  className="h-14 border-border/50 focus:border-champagne-gold focus:ring-champagne-gold/20 text-center text-2xl tracking-widest"
                  maxLength={6}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              {/* Campos de perfil — siempre visibles, todos opcionales */}
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground font-medium text-sm">
                      Nombre <span className="text-muted-foreground text-xs">(opcional)</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Juan"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 border-border/50 focus:border-champagne-gold focus:ring-champagne-gold/20"
                      maxLength={100}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground font-medium text-sm">
                      Apellido <span className="text-muted-foreground text-xs">(opcional)</span>
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="García"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 border-border/50 focus:border-champagne-gold focus:ring-champagne-gold/20"
                      maxLength={100}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-medium text-sm">
                    Teléfono <span className="text-muted-foreground text-xs">(opcional)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 border-border/50 focus:border-champagne-gold focus:ring-champagne-gold/20"
                    maxLength={20}
                    disabled={isLoading}
                  />
                </div>
              </>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <CircleAlert className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleTokenVerify}
                disabled={isLoading}
                className="w-full h-14 bg-champagne-gold hover:bg-champagne-gold-dark text-white font-semibold"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Verificar <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={isLoading}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Volver
              </Button>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {step === "success" && (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 rounded-full bg-champagne-gold/10 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-champagne-gold" />
              </div>
              <p className="text-foreground/70 text-center">
                Redirigiendo a tu cuenta...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
