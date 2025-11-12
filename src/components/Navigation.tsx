import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle, LayoutDashboard, User } from "lucide-react";
import ajoloteLogo from "@/assets/ajolote-logo.png";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={ajoloteLogo} alt="Vy Cite" className="w-10 h-10 transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold text-foreground">Vy Cite</span>
          </Link>

          {/* Menu Central */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-ribbon transition-colors">
              <Home className="w-4 h-4" />
              <span className="font-medium">Comprar</span>
            </Link>
            <Link to="/vender" className="flex items-center gap-2 text-foreground hover:text-flamingo transition-colors">
              <PlusCircle className="w-4 h-4" />
              <span className="font-medium">Vender</span>
            </Link>
            <Link to="/servicios" className="flex items-center gap-2 text-foreground hover:text-carissma transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              <span className="font-medium">Servicios</span>
            </Link>
            <Link to="/mi-cuenta" className="flex items-center gap-2 text-foreground hover:text-ribbon transition-colors">
              <User className="w-4 h-4" />
              <span className="font-medium">Mi Cuenta</span>
            </Link>
          </div>

          {/* CTA Fijo */}
          <Button variant="cta" size="lg" asChild className="hidden md:flex">
            <Link to="/credito">
              OBTÉN TU CRÉDITO
              <span className="text-xs opacity-90">(7 MIN)</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
