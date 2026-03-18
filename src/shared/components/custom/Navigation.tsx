import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import { Home, Search, Menu, User, CreditCard, LogOut, ChevronDown, Headset } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { useFinancialModal } from "@/shared/hooks/financial-modal.context";
import { useScrollDirection } from "@/shared/hooks/use-scroll-direction.hook";
import { useAuth } from "@/auth/hooks/use-auth.auth.hook";
import vakantaLogo from "@/assets/vakanta-logo.png";

interface UserInfo {
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string | null;
}

const getInitial = (user?: UserInfo | null): string => {
  if (!user) return "?";
  if (user.first_name) return user.first_name.charAt(0).toUpperCase();
  return user.email.charAt(0).toUpperCase();
};

const getDisplayName = (user?: UserInfo | null): string => {
  if (!user) return "Mi Perfil";
  if (user.first_name) return user.first_name;
  return user.email.split("@")[0];
};

const Navigation = () => {
  const { openFinancialModal } = useFinancialModal();
  const { isAuthenticated, user, handleLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navVisible = useScrollDirection();

  const isActive = (path: string) => location.pathname === path;
  const isOnMiCuenta = location.pathname.startsWith("/mi-cuenta");

  const showProfileButton = isAuthenticated && isOnMiCuenta;

  const navLinks = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/comprar", label: "Comprar", icon: Search },
    { path: "/vender", label: "Vender", icon: Home },
    { path: "/mi-cuenta", label: "Mi Cuenta", icon: User },
  ];

  return (
    <nav
      style={{ transform: navVisible ? "translateY(0)" : "translateY(-100%)", transition: "transform 0.3s ease" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
    >
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
                <Button variant="ghost" className="hidden md:flex items-center gap-2.5 px-2 py-1.5 h-auto rounded-full hover:bg-champagne-gold/5 transition-all">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-champagne-gold/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-champagne-gold to-champagne-gold-dark flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                      {getInitial(user)}
                    </div>
                  )}
                  <span className="font-medium text-sm text-midnight">{getDisplayName(user)}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-foreground/40 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-1.5 rounded-xl shadow-lg border border-border/40">
                {user && (
                  <>
                    <div className="px-3 py-2.5">
                      <p className="text-sm font-semibold text-midnight truncate">
                        {user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.email}
                      </p>
                      {user.first_name && (
                        <p className="text-xs text-foreground/50 truncate mt-0.5">{user.email}</p>
                      )}
                    </div>
                    <div className="h-px bg-border/40 mx-1.5" />
                  </>
                )}
                <button
                  onClick={() => { setProfileOpen(false); window.open("mailto:soporte@avakanta.com", "_blank"); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-midnight rounded-lg hover:bg-champagne-gold/5 transition-colors mt-0.5"
                >
                  <Headset className="w-4 h-4 text-champagne-gold" />
                  Soporte Técnico
                </button>
                <div className="h-px bg-border/40 mx-1.5" />
                <button
                  onClick={() => { setProfileOpen(false); handleLogout(); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors mb-0.5"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button 
              variant="gold" 
              size="default" 
              className="hidden md:flex"
              onClick={openFinancialModal}
            >
              <CreditCard className="w-4 h-4" />
              Simula tu Crédito
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
              <SheetTitle className="sr-only">Menu de navegacion</SheetTitle>
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
                      {user && (
                        <div className="flex items-center gap-3 px-1 pb-3 mb-1 border-b border-border/30">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-champagne-gold/30" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-champagne-gold to-champagne-gold-dark flex items-center justify-center text-white text-sm font-semibold">
                              {getInitial(user)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-midnight truncate">
                              {user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.email}
                            </p>
                            {user.first_name && (
                              <p className="text-xs text-foreground/50 truncate">{user.email}</p>
                            )}
                          </div>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 border-champagne-gold/30"
                        onClick={() => { setIsOpen(false); window.open("mailto:soporte@avakanta.com", "_blank"); }}
                      >
                        <Headset className="w-4 h-4 text-champagne-gold" />
                        Soporte Técnico
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-600 hover:bg-red-50"
                        onClick={() => { setIsOpen(false); handleLogout(); }}
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="gold" 
                      className="w-full" 
                      onClick={() => { setIsOpen(false); openFinancialModal(); }}
                    >
                      <CreditCard className="w-4 h-4" />
                      Simula tu Crédito
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
