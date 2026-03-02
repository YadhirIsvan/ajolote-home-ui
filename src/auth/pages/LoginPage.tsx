import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/shared/components/custom/Navigation";
import AuthModal from "@/auth/components/AuthModal";

interface LoginPageProps {
  showAuthModal: boolean;
  onOpenAuthModal: () => void;
  onCloseAuthModal: () => void;
  onLoginSuccess: () => void;
}

const LoginPage = ({
  showAuthModal,
  onOpenAuthModal,
  onCloseAuthModal,
  onLoginSuccess,
}: LoginPageProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-lg">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-champagne-gold/10 flex items-center justify-center">
              <User className="w-10 h-10 text-champagne-gold" />
            </div>
            <h1 className="text-3xl font-bold text-midnight mb-4">Mi Cuenta</h1>
            <p className="text-foreground/60 mb-8 max-w-md mx-auto">
              Inicia sesión para gestionar tu perfil, propiedades y más
            </p>
            <Button
              onClick={onOpenAuthModal}
              className="h-14 px-10 bg-champagne-gold hover:bg-champagne-gold-dark text-white font-semibold text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={onCloseAuthModal}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  );
};

export default LoginPage;
