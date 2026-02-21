import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import SellerLeadForm from "@/components/SellerLeadForm";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
  Play,
  X,
} from "lucide-react";

const SellerFlow = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

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

  const openForm = () => {
    setIsFormOpen(true);
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
            onClick={openForm}
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

      {/* Video Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Video Thumbnail */}
            <div className="order-1">
              <div
                className="relative cursor-pointer group"
                onClick={() => setIsVideoOpen(true)}
              >
                <AspectRatio ratio={16 / 9}>
                  <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] transition-all duration-300 group-hover:shadow-[0_25px_60px_rgba(15,23,42,0.2)]">
                    <img
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80"
                      alt="Video sobre nuestro proceso de venta"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-primary/20 transition-opacity duration-300 group-hover:bg-primary/30" />
                  </div>
                </AspectRatio>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[hsl(var(--champagne-gold))] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="order-2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                Tu propiedad en las mejores manos
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Conoce de voz de nuestros expertos cómo logramos vender tu propiedad al mejor precio en tiempo récord.
              </p>
              <p className="text-sm text-primary/70 font-medium">
                Más de 500 propietarios han confiado en nuestro método.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Authority Section */}
      <section className="py-16 px-6 bg-secondary/30">
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
            onClick={openForm}
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
          onClick={openForm}
        >
          Quiero vender ahora
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Bottom padding for sticky footer on mobile */}
      <div className="h-24 md:hidden" />

      {/* Lead Capture Form Modal */}
      <SellerLeadForm open={isFormOpen} onOpenChange={setIsFormOpen} />

      {/* Video Lightbox Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-primary border-0 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Video Player */}
          <AspectRatio ratio={16 / 9}>
            <iframe
              src="https://www.youtube.com/embed/MKG_6BqnhpI?autoplay=1&rel=0"
              title="Video de presentación"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </AspectRatio>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerFlow;
