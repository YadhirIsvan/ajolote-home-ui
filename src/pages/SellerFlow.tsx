import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import ScoreWidget from "@/components/ScoreWidget";
import { Upload, FileCheck, CheckCircle2, ArrowRight } from "lucide-react";

const SellerFlow = () => {
  const [currentPhase, setCurrentPhase] = useState(1);

  const phases = [
    { id: 1, label: "Identificación" },
    { id: 2, label: "Documentos" },
    { id: 3, label: "Score Legal" },
    { id: 4, label: "Valuación" },
  ];

  return (
    <div className="min-h-screen bg-dawn">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Vende tu Propiedad con Vy Cite</h1>
            <p className="text-lg text-foreground/70">
              Obtén tu Score Legal y precio de mercado en minutos
            </p>
          </div>

          {/* Barra de Progreso */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {phases.map((phase, index) => (
                <div key={phase.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        currentPhase >= phase.id
                          ? "bg-ribbon text-foreground shadow-glow-blue"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentPhase > phase.id ? <CheckCircle2 className="w-6 h-6" /> : phase.id}
                    </div>
                    <span className="text-xs text-foreground mt-2">{phase.label}</span>
                  </div>
                  {index < phases.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        currentPhase > phase.id ? "bg-ribbon" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contenido según fase */}
          {currentPhase === 1 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6">Identificación y Titularidad</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="curp">CURP</Label>
                  <Input id="curp" placeholder="XXXX000000XXXXXX00" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="rfc">RFC</Label>
                  <Input id="rfc" placeholder="XXXX000000XXX" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="folio">Folio Real (RPP)</Label>
                  <Input id="folio" placeholder="Folio catastral de la propiedad" className="mt-2" />
                </div>
                <Button variant="hero" size="lg" className="w-full" onClick={() => setCurrentPhase(2)}>
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          )}

          {currentPhase === 2 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6">Validación Documental</h2>
              <div className="space-y-6">
                {["Escrituras", "Predial (Último año)", "Identificación Oficial (INE)"].map((doc, index) => (
                  <div key={index} className="border-2 border-dashed border-border rounded-lg p-6 hover:border-ribbon transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <Upload className="w-8 h-8 text-ribbon" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">{doc}</h3>
                        <p className="text-sm text-muted-foreground">Arrastra o haz clic para subir</p>
                      </div>
                      <FileCheck className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                ))}
                <div className="flex gap-4">
                  <Button variant="outline" size="lg" className="flex-1" onClick={() => setCurrentPhase(1)}>
                    Atrás
                  </Button>
                  <Button variant="hero" size="lg" className="flex-1" onClick={() => setCurrentPhase(3)}>
                    Verificar Documentos
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {currentPhase === 3 && (
            <div className="space-y-8">
              <Card className="p-8 text-center">
                <div className="inline-block p-4 bg-ribbon/20 rounded-full mb-6">
                  <CheckCircle2 className="w-16 h-16 text-ribbon" />
                </div>
                <h2 className="text-3xl font-bold text-card-foreground mb-4">¡Validación Completada!</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Tu propiedad ha sido verificada exitosamente
                </p>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <ScoreWidget
                  score={98}
                  title="Score Legal de tu Propiedad"
                  checks={[
                    { label: "Titularidad RPP OK", status: "ok" },
                    { label: "Sin Adeudos", status: "ok" },
                    { label: "Escrituras Correctas", status: "ok" },
                    { label: "Zonificación Válida", status: "ok" },
                  ]}
                />

                <Card className="p-6 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">Siguiente Paso</h3>
                  <p className="text-muted-foreground mb-6">
                    Ahora podemos evaluar el precio de mercado de tu propiedad con nuestro sistema de valuación
                  </p>
                  <Button variant="cta" size="lg" onClick={() => setCurrentPhase(4)}>
                    Evaluar mi Precio
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Card>
              </div>
            </div>
          )}

          {currentPhase === 4 && (
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">Valuación en Proceso</h2>
              <p className="text-muted-foreground mb-8">
                Esta funcionalidad estará disponible próximamente. Nuestro equipo te contactará para continuar con la
                valuación de tu propiedad.
              </p>
              <Button variant="hero" size="lg" onClick={() => setCurrentPhase(1)}>
                Volver al Inicio
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerFlow;
