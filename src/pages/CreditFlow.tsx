import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import ScoreWidget from "@/components/ScoreWidget";
import { Calculator, Upload, CheckCircle2, Clock } from "lucide-react";

const CreditFlow = () => {
  const [currentView, setCurrentView] = useState("simulacion"); // simulacion, resultado, documentos, seguimiento

  return (
    <div className="min-h-screen bg-dawn">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {currentView === "simulacion" && (
            <div>
              <div className="text-center mb-12">
                <div className="inline-block p-4 bg-ribbon/20 rounded-full mb-6">
                  <Calculator className="w-12 h-12 text-ribbon" />
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4">Obtén tu Crédito</h1>
                <p className="text-lg text-foreground/70">Solo 7 minutos para conocer tu capacidad de compra</p>
              </div>

              <Card className="p-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="ingreso">Ingreso Mensual Bruto (MXN)</Label>
                    <Input id="ingreso" type="number" placeholder="45000" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="edad">Edad</Label>
                    <Input id="edad" type="number" placeholder="35" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="ahorro">Ahorro Disponible para Enganche (MXN)</Label>
                    <Input id="ahorro" type="number" placeholder="500000" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="deudas">Deudas Mensuales Actuales (MXN)</Label>
                    <Input id="deudas" type="number" placeholder="5000" className="mt-2" />
                  </div>

                  <div className="pt-6">
                    <Button variant="cta" size="xl" className="w-full" onClick={() => setCurrentView("resultado")}>
                      CALCULAR MI SCORE Y MONTO
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {currentView === "resultado" && (
            <div className="space-y-8">
              <Card className="p-8 text-center bg-card-gradient">
                <div className="inline-block p-4 bg-flamingo/20 rounded-full mb-6">
                  <CheckCircle2 className="w-16 h-16 text-flamingo" />
                </div>
                <h2 className="text-3xl font-bold text-card-foreground mb-4">¡Felicidades!</h2>
                <p className="text-lg text-muted-foreground mb-8">Has sido pre-aprobado para un crédito</p>

                <div className="bg-flamingo/10 rounded-xl p-8 mb-8">
                  <div className="text-sm text-muted-foreground mb-2">Tu Crédito Máximo Aprobado</div>
                  <div className="text-5xl font-bold text-flamingo mb-2">$5,200,000</div>
                  <div className="text-sm text-muted-foreground">MXN</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="bg-card rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">Enganche Recomendado</div>
                    <div className="text-2xl font-bold text-card-foreground">$520,000</div>
                  </div>
                  <div className="bg-card rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-1">Pago Mensual Estimado</div>
                    <div className="text-2xl font-bold text-card-foreground">$32,800</div>
                  </div>
                </div>
              </Card>

              <ScoreWidget
                score={87}
                title="Tu Score de Comprador"
                subtitle="Basado en tu perfil crediticio y capacidad de pago"
                checks={[
                  { label: "Capacidad de Pago: Excelente", status: "ok" },
                  { label: "Historial Crediticio: Bueno", status: "ok" },
                  { label: "Enganche Suficiente", status: "ok" },
                ]}
              />

              <Card className="p-8">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">Siguiente Paso</h3>
                <p className="text-muted-foreground mb-6">
                  Para formalizar tu crédito, necesitamos que subas algunos documentos para verificación
                </p>
                <Button variant="cta" size="lg" className="w-full" onClick={() => setCurrentView("documentos")}>
                  Subir Documentos
                </Button>
              </Card>
            </div>
          )}

          {currentView === "documentos" && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6">Verificación de Documentos</h2>
              <p className="text-muted-foreground mb-8">
                Sube los siguientes documentos de forma segura. Todos tus datos están protegidos.
              </p>

              <div className="space-y-6">
                {[
                  "Comprobantes de Ingresos (3 últimos meses)",
                  "Identificación Oficial (INE)",
                  "Comprobante de Domicilio",
                  "Estado de Cuenta Bancario",
                ].map((doc, index) => (
                  <div
                    key={index}
                    className="border-2 border-dashed border-border rounded-lg p-6 hover:border-ribbon transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <Upload className="w-8 h-8 text-ribbon" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">{doc}</h3>
                        <p className="text-sm text-muted-foreground">Arrastra o haz clic para subir</p>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground" />
                    </div>
                  </div>
                ))}

                <Button variant="hero" size="lg" className="w-full" onClick={() => setCurrentView("seguimiento")}>
                  Continuar con Verificación
                </Button>
              </div>
            </Card>
          )}

          {currentView === "seguimiento" && (
            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-ribbon/20 rounded-full mb-6">
                  <Clock className="w-12 h-12 text-ribbon animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground mb-4">Verificación en Proceso</h2>
                <p className="text-muted-foreground">
                  Nuestro equipo está revisando tus documentos. Te notificaremos cuando tengamos una actualización.
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                {[
                  { label: "Solicitud Recibida", status: "completed", date: "Hoy, 10:30 AM" },
                  { label: "Documentos en Revisión", status: "current", date: "En proceso" },
                  { label: "Aprobación Bancaria", status: "pending", date: "Pendiente" },
                  { label: "Crédito Listo", status: "pending", date: "Pendiente" },
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === "completed"
                          ? "bg-ribbon text-foreground"
                          : step.status === "current"
                          ? "bg-flamingo text-foreground animate-pulse"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">{step.label}</h3>
                      <p className="text-sm text-muted-foreground">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <Button variant="outline" size="lg" className="w-full" onClick={() => setCurrentView("simulacion")}>
                  Volver al Inicio
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditFlow;
