import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Search, Menu, X, User, CreditCard } from "lucide-react";
import ajoloteLogo from "@/assets/ajolote-logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
            <img src={ajoloteLogo} alt="Vy Cite" className="w-9 h-9 transition-transform group-hover:scale-105" />
            <span className="text-xl font-bold text-primary">Vy Cite</span>
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

          {/* Desktop CTA */}
          <Button variant="gold" size="default" asChild className="hidden md:flex">
            <Link to="/credito">
              <CreditCard className="w-4 h-4" />
              Obtén tu Crédito
            </Link>
          </Button>

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
                    <img src={ajoloteLogo} alt="Vy Cite" className="w-8 h-8" />
                    <span className="text-lg font-bold text-primary">Vy Cite</span>
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

                {/* Mobile CTA */}
                <div className="p-4 border-t border-border">
                  <Button variant="gold" className="w-full" asChild onClick={() => setIsOpen(false)}>
                    <Link to="/credito">
                      <CreditCard className="w-4 h-4" />
                      Obtén tu Crédito
                    </Link>
                  </Button>
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
