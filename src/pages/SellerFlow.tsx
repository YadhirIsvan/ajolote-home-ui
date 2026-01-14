import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Home,
  Camera,
  Handshake,
  Award,
  ImageIcon,
  EyeOff,
  UserCheck,
  ArrowRight,
} from "lucide-react";

const SellerFlow = () => {
  const [showStickyFooter, setShowStickyFooter] = useState(true);

  const steps = [
    {
      icon: Home,
      title: "Registra tu propiedad",
      description: "Formulario rápido de 2 minutos. Sin documentos pesados al inicio.",
    },
    {
      icon: Camera,
      title: "Marketing de Élite",
      description: "Fotografía profesional y exposición ante compradores verificados.",
    },
    {
      icon: Handshake,
      title: "Cierre Seguro",
      description: "Negociación experta y acompañamiento legal hasta la firma.",
    },
  ];

  const trustPoints = [
    { icon: Award, label: "Asesores Certificados" },
    { icon: ImageIcon, label: "Fotos Profesionales" },
    { icon: EyeOff, label: "Cero Costos Ocultos" },
    { icon: UserCheck, label: "Compradores Verificados" },
  ];

  const faqs = [
    {
      question: "¿Tiene costo publicar?",
      answer: "Absolutamente ninguno. Solo ganamos cuando tú ganas.",
    },
    {
      question: "¿Cuánto tiempo toma?",
      answer: "Nuestra estrategia de marketing premium acelera el proceso significativamente.",
    },
    {
      question: "¿Necesito exclusividad?",
      answer: "Ofrecemos contratos flexibles adaptados a tus necesidades.",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight mb-6">
            Vende tu propiedad con la exclusividad que merece.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Sin complicaciones, sin riesgos y con el respaldo de expertos. Tú te relajas, nosotros nos encargamos del resto.
          </p>
          <Button
            size="lg"
            className="bg-[hsl(var(--champagne-gold))] hover:bg-[hsl(var(--champagne-gold-dark))] text-white rounded-xl px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Quiero vender ahora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* 3 Steps Journey */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-12">
            Tu camino a una venta exitosa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="p-8 bg-background border border-border/50 shadow-sm hover:shadow-md transition-all rounded-2xl text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[hsl(var(--champagne-gold))]/10 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-[hsl(var(--champagne-gold))]" />
                </div>
                <div className="text-sm font-medium text-[hsl(var(--champagne-gold))] mb-2">
                  Paso {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Authority Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-5 bg-background rounded-xl border border-border/30"
              >
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--champagne-gold))]/10 flex items-center justify-center flex-shrink-0">
                  <point.icon className="w-6 h-6 text-[hsl(var(--champagne-gold))]" />
                </div>
                <span className="text-primary font-medium">{point.label}</span>
              </div>
            ))}
          </div>

          {/* Highlight Box */}
          <div className="bg-[hsl(var(--champagne-gold))]/5 border-2 border-[hsl(var(--champagne-gold))]/30 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-lg md:text-xl text-primary font-medium">
              Solo cobramos comisión si tu propiedad se vende.{" "}
              <span className="text-[hsl(var(--champagne-gold))] font-semibold">
                Tu éxito es el nuestro.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-10">
            Preguntas Frecuentes
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background border border-border/50 rounded-xl px-6 data-[state=open]:shadow-md transition-all"
              >
                <AccordionTrigger className="text-primary font-semibold text-left hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-primary mb-6">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-muted-foreground mb-8">
            Comienza hoy y descubre el valor real de tu propiedad.
          </p>
          <Button
            size="lg"
            className="bg-[hsl(var(--champagne-gold))] hover:bg-[hsl(var(--champagne-gold-dark))] text-white rounded-xl px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Empezar ahora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Sticky Footer CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur-md border-t border-border p-4 z-50">
        <Button
          size="lg"
          className="w-full bg-[hsl(var(--champagne-gold))] hover:bg-[hsl(var(--champagne-gold-dark))] text-white rounded-xl py-6 text-lg font-semibold shadow-lg"
          onClick={scrollToTop}
        >
          Quiero vender ahora
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Bottom padding for sticky footer on mobile */}
      <div className="h-24 md:hidden" />
    </div>
  );
};

export default SellerFlow;
