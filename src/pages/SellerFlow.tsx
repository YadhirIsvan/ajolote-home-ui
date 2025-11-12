import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import ScoreWidget from "@/components/ScoreWidget";
import { Upload, FileCheck, CheckCircle2, ArrowRight, TrendingUp } from "lucide-react";

const SellerFlow = () => {
  const [currentPhase, setCurrentPhase] = useState(1);

  const phases = [
    { id: 1, label: "Identificación" },
    { id: 2, label: "Documentos" },
    { id: 3, label: "Score Legal" },
    { id: 4, label: "Valuación" },
    { id: 5, label: "Comisión" },
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
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6">Valuación y Precio de Mercado</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="yearBuilt">Año de Construcción</Label>
                    <Input id="yearBuilt" type="number" placeholder="2020" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="remodel">Última Remodelación</Label>
                    <Input id="remodel" type="number" placeholder="2023" className="mt-2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="flooring">Tipo de Acabado en Pisos</Label>
                  <select
                    id="flooring"
                    className="w-full mt-2 px-4 py-2 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ribbon"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="marmol">Mármol</option>
                    <option value="granito">Granito</option>
                    <option value="porcelanato">Porcelanato</option>
                    <option value="madera">Madera</option>
                    <option value="loseta">Loseta</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="kitchen">Tipo de Cocina</Label>
                  <select
                    id="kitchen"
                    className="w-full mt-2 px-4 py-2 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ribbon"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="integral">Integral de Lujo</option>
                    <option value="equipada">Equipada</option>
                    <option value="basica">Básica</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="amenities">Amenidades Adicionales</Label>
                  <textarea
                    id="amenities"
                    rows={4}
                    placeholder="Ej: Alberca, Gimnasio, Jardín, Roof Garden, etc."
                    className="w-full mt-2 px-4 py-2 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ribbon resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="lg" className="flex-1" onClick={() => setCurrentPhase(3)}>
                    Atrás
                  </Button>
                  <Button variant="cta" size="lg" className="flex-1" onClick={() => setCurrentPhase(5)}>
                    Iniciar Análisis de Mercado
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {currentPhase === 5 && (
            <div className="space-y-8">
              <Card className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-flamingo/20 rounded-full mb-6">
                    <TrendingUp className="w-16 h-16 text-flamingo" />
                  </div>
                  <h2 className="text-3xl font-bold text-card-foreground mb-4">Análisis Completado</h2>
                  <p className="text-lg text-muted-foreground">
                    Hemos analizado propiedades comparables en tu zona
                  </p>
                </div>

                <div className="bg-gradient-to-br from-ribbon/10 to-flamingo/10 rounded-xl p-8 mb-8">
                  <div className="text-center">
                    <p className="text-sm text-foreground/70 mb-2">Precio Sugerido de Mercado</p>
                    <p className="text-5xl font-bold text-flamingo mb-4">$8,450,000</p>
                    <p className="text-sm text-foreground/60">Basado en 15 propiedades similares</p>
                  </div>
                </div>

                <div className="bg-card/50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">Propuesta de Comisión Vy Cite</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-foreground/70">Comisión preferencial</span>
                    <span className="text-2xl font-bold text-ribbon">1%</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-foreground/70">Monto de comisión</span>
                    <span className="text-2xl font-bold text-foreground">$84,500</span>
                  </div>
                  <div className="bg-ribbon/10 rounded-lg p-4 mt-4">
                    <p className="text-sm text-foreground/80">
                      ✓ Publicación premium con Score Legal visible<br />
                      ✓ Conexión con compradores pre-aprobados<br />
                      ✓ Gestión completa del proceso de venta<br />
                      ✓ Asesoría legal incluida
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="lg" className="flex-1" onClick={() => setCurrentPhase(4)}>
                    Revisar Valuación
                  </Button>
                  <Button variant="cta" size="lg" className="flex-1">
                    Publicar y Aceptar Comisión (1%)
                    <CheckCircle2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerFlow;
