import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Search, Menu, X, User, CreditCard, Settings, LogOut, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import vakantaLogo from "@/assets/vakanta-logo.png";

interface NavigationProps {
  isClientAuthenticated?: boolean;
  onLogout?: () => void;
  onNavigateConfig?: () => void;
}

const Navigation = ({ isClientAuthenticated, onLogout, onNavigateConfig }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isOnMiCuenta = location.pathname.startsWith("/mi-cuenta");

  const showProfileButton = isClientAuthenticated && isOnMiCuenta;

  const navLinks = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/comprar", label: "Comprar", icon: Search },
    { path: "/vender", label: "Vender", icon: Home },
    { path: "/mi-cuenta", label: "Mi Cuenta", icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={vakantaLogo} alt="Vakanta" className="h-10 transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-champagne"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA / Profile */}
          {showProfileButton ? (
            <Popover open={profileOpen} onOpenChange={setProfileOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="hidden md:flex items-center gap-2 border-champagne-gold/30 text-midnight hover:bg-champagne-gold/5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-champagne-gold to-champagne-gold-dark flex items-center justify-center text-white text-xs font-bold">
                    JD
                  </div>
                  <span className="font-medium">Mi Perfil</span>
                  <ChevronDown className="w-3.5 h-3.5 text-foreground/50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-52 p-2">
                <button
                  onClick={() => { setProfileOpen(false); onNavigateConfig?.(); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-midnight rounded-lg hover:bg-champagne-gold/5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-champagne-gold" />
                  Configuración
                </button>
                <div className="h-px bg-border/50 my-1" />
                <button
                  onClick={() => { setProfileOpen(false); onLogout?.(); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button variant="gold" size="default" asChild className="hidden md:flex">
              <Link to="/credito">
                <CreditCard className="w-4 h-4" />
                Obtén tu Crédito
              </Link>
            </Button>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <img src={vakantaLogo} alt="Vakanta" className="h-9" />
                  </Link>
                </div>

                {/* Mobile Links */}
                <div className="flex-1 py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-4 text-base font-medium transition-colors ${
                        isActive(link.path)
                          ? "text-champagne bg-muted"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-border space-y-2">
                  {showProfileButton ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 border-champagne-gold/30"
                        onClick={() => { setIsOpen(false); onNavigateConfig?.(); }}
                      >
                        <Settings className="w-4 h-4 text-champagne-gold" />
                        Configuración
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-600 hover:bg-red-50"
                        onClick={() => { setIsOpen(false); onLogout?.(); }}
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <Button variant="gold" className="w-full" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/credito">
                        <CreditCard className="w-4 h-4" />
                        Obtén tu Crédito
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
