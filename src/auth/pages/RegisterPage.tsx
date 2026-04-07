import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, CircleAlert, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useRegister } from "@/auth/hooks/use-register.auth.hook";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [userExists, setUserExists] = useState(false);
  const { register, isLoading } = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setUserExists(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.first_name || !form.last_name) {
      setError("Nombre, apellido y correo son obligatorios.");
      return;
    }
    setError("");
    setUserExists(false);
    const result = await register({
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      ...(form.phone ? { phone: form.phone } : {}),
    });
    if (result.success) {
      navigate("/auth/verify", { state: { email: form.email } });
    } else if (result.userExists) {
      setUserExists(true);
      setError(result.message);
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
              <UserPlus className="w-10 h-10 text-champagne-gold" />
            </div>
            <h1 className="text-3xl font-bold text-midnight mb-2">Crear Cuenta</h1>
            <p className="text-foreground/60">
              Regístrate para acceder a todos los servicios de Avakanta
            </p>
          </div>

          <div className="bg-white border border-border/30 rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-foreground font-medium">
                    Nombre <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Juan"
                    value={form.first_name}
                    onChange={handleChange}
                    className="h-12 border-border/50 focus:border-champagne-gold focus:ring-champagne-gold/20"
                    maxLength={100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-foreground font-medium">
                    Apellido <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="García"
                    value={form.last_name}
                    onChange={handleChange}
                    className="h-12 border-border/50 focus:border-champagne-gold focus:ring-champagne-gold/20"
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Correo electrónico <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={handleChange}
                  className="h-12 border-border/50 focus:border-champagne-gold focus:ring-champagne-gold/20"
                  maxLength={254}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">
                  Teléfono <span className="text-muted-foreground text-xs">(opcional)</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+52 55 1234 5678"
                  value={form.phone}
                  onChange={handleChange}
                  className="h-12 border-border/50 focus:border-champagne-gold focus:ring-champagne-gold/20"
                  maxLength={20}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-destructive text-sm">
                  <CircleAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {userExists && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-champagne-gold text-champagne-gold hover:bg-champagne-gold/5"
                  onClick={() => navigate("/mi-cuenta")}
                >
                  Iniciar Sesión
                </Button>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-champagne-gold hover:bg-champagne-gold-dark text-white font-semibold"
              >
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-foreground/60">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => navigate("/mi-cuenta")}
              className="text-champagne-gold hover:underline font-medium"
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
