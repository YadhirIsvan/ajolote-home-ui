import { useState, useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import {
  ClipboardEdit, ShieldCheck, Megaphone, FileSignature,
  ArrowRight, Play, X, Check, Star,
} from "lucide-react";
import SellerLeadForm from "@/sell/components/SellerLeadForm";
import { useSellPage } from "@/sell/hooks/use-sell-page.hook";

/* ── Steps Data ─────────────────────────────────────────────────── */
const STEPS = [
  {
    icon: ClipboardEdit,
    title: "Crea tu anuncio en minutos",
    description: "Sube los datos y ve tu propiedad publicada en tu panel al instante.",
    detail: "Formulario intuitivo. Sin documentos pesados al inicio.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: ShieldCheck,
    title: "Verificación de Luz Verde",
    description: "Validamos legalmente que tu casa esté lista para venderse. Sin sorpresas.",
    detail: "Revisión documental completa por nuestro equipo legal.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Megaphone,
    title: "Marketing de Élite",
    description: "Fotografía profesional y exposición directa a compradores que ya tienen crédito aprobado.",
    detail: "Tu propiedad frente a miles de compradores verificados.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: FileSignature,
    title: "Cierre Rápido y Seguro",
    description: "Negociamos, armamos los contratos y te acompañamos a firmar.",
    detail: "Acompañamiento legal de principio a fin.",
    color: "from-violet-400 to-purple-500",
  },
];

const FAQS = [
  { question: "¿Tiene costo publicar mi propiedad?", answer: "Absolutamente ninguno. Solo ganamos cuando tú ganas. Nuestro modelo está alineado con tu éxito." },
  { question: "¿Cuánto tiempo toma vender?", answer: "Depende del mercado, pero nuestra estrategia de marketing premium y red de compradores verificados acelera significativamente el proceso." },
  { question: "¿Necesito firmar un contrato de exclusividad?", answer: "Ofrecemos contratos flexibles adaptados a tus necesidades. Sin letras chiquitas." },
  { question: "¿Qué pasa si mi propiedad tiene temas legales?", answer: "Nuestro equipo legal identifica cualquier situación antes de publicar y te orienta para resolverla rápidamente." },
];

const STATS = [
  { value: "500+", label: "Propiedades vendidas" },
  { value: "45", label: "Días promedio de venta" },
  { value: "98%", label: "Clientes satisfechos" },
];

/* ── Timeline Step Component ────────────────────────────────────── */
const TimelineStep = ({
  step,
  index,
  isVisible,
}: {
  step: typeof STEPS[0];
  index: number;
  isVisible: boolean;
}) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`relative flex items-start gap-6 md:gap-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Timeline line + node */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110`}>
          <step.icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.8} />
        </div>
        {index < STEPS.length - 1 && (
          <div className={`w-px flex-1 min-h-[60px] transition-all duration-1000 ${isVisible ? "bg-gradient-to-b from-border to-transparent" : "bg-transparent"}`}
            style={{ transitionDelay: `${index * 150 + 300}ms` }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-10 md:pb-14">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
            Paso {index + 1}
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-midnight mb-2 leading-tight">
          {step.title}
        </h3>
        <p className="text-foreground/60 text-base leading-relaxed mb-3 max-w-lg">
          {step.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-foreground/40">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{step.detail}</span>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ──────────────────────────────────────────────────── */
const SellPage = () => {
  const { isFormOpen, setIsFormOpen, isVideoOpen, setIsVideoOpen, openForm, openVideo } = useSellPage();
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleSteps((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    const container = stepsRef.current;
    if (container) {
      container.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-28 md:pt-36 pb-20 md:pb-28 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-[hsl(var(--champagne-gold))]/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] rounded-full bg-[hsl(var(--champagne-gold))]/3 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--champagne-gold))]/10 border border-[hsl(var(--champagne-gold))]/20 mb-8 animate-fade-in">
            <Star className="w-3.5 h-3.5 text-[hsl(var(--champagne-gold))]" fill="currentColor" />
            <span className="text-xs font-semibold text-[hsl(var(--champagne-gold))] tracking-wide uppercase">
              Método Avakanta
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-midnight leading-[1.08] tracking-tight mb-6">
            Vende tu casa.
            <br />
            <span className="bg-gradient-to-r from-[hsl(var(--champagne-gold))] to-[hsl(var(--champagne-gold-dark))] bg-clip-text text-transparent">
              Sin dramas.
            </span>
            <br />
            En 4 pasos.
          </h1>

          <p className="text-lg md:text-xl text-foreground/55 max-w-2xl mx-auto mb-10 leading-relaxed">
            Olvídate del papeleo infinito. Sube tu propiedad a la plataforma,
            nosotros verificamos que todo esté en regla, hacemos magia con el
            marketing y tú solo firmas.
          </p>

          {/* CTA Button — hidden on mobile (sticky bar covers it) */}
          <Button
            size="lg"
            className="group relative hidden md:inline-flex bg-gradient-to-r from-[hsl(var(--champagne-gold))] to-[hsl(var(--champagne-gold-dark))] text-white rounded-full px-10 py-7 text-lg font-semibold shadow-[0_8px_30px_rgba(184,155,110,0.35)] hover:shadow-[0_12px_40px_rgba(184,155,110,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            onClick={openForm}
          >
            Comenzar ahora
            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 mt-14">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-midnight">{stat.value}</p>
                <p className="text-xs md:text-sm text-foreground/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4 STEPS — VERTICAL TIMELINE ═══ */}
      <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-background via-secondary/20 to-background">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--champagne-gold))] mb-3 block">
              Cómo funciona
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-midnight leading-tight">
              Tu camino a una
              <br className="hidden sm:block" />
              venta exitosa
            </h2>
          </div>

          <div ref={stepsRef}>
            {STEPS.map((step, index) => (
              <div key={index} data-index={index}>
                <TimelineStep
                  step={step}
                  index={index}
                  isVisible={visibleSteps.has(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VIDEO SECTION — CINEMATIC ═══ */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-[hsl(var(--champagne-gold))]/[0.04] blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Title + Subtitle — centered above video */}
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--champagne-gold))] mb-4 block">
              Descubre el método
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-midnight leading-[1.1] tracking-tight mb-5">
              Mira cómo vendemos tu
              <br className="hidden sm:block" />
              propiedad en tiempo récord
            </h2>
            <p className="text-foreground/50 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Más de 500 propietarios ya confiaron en el método Vakanta
              para maximizar sus ganancias sin estrés.
            </p>
          </div>

          {/* Video container — wide & cinematic */}
          <div className="relative group cursor-pointer" onClick={openVideo}>
            {/* Outer glow ring */}
            <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-b from-[hsl(var(--champagne-gold))]/20 via-transparent to-[hsl(var(--champagne-gold))]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />

            <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(15,23,42,0.14)] group-hover:shadow-[0_35px_100px_rgba(15,23,42,0.22)] transition-all duration-700">
              <AspectRatio ratio={16 / 9}>
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80"
                  alt="Video sobre nuestro proceso de venta"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                />
                {/* Cinematic overlay — gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20 transition-colors duration-500 group-hover:from-black/40 group-hover:via-black/5 group-hover:to-black/15" />
              </AspectRatio>

              {/* Glassmorphism play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping [animation-duration:2.5s]" />
                  {/* Button */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:scale-110 group-hover:bg-white/25 group-hover:border-white/40 group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)]">
                    <Play className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white ml-1 drop-shadow-md" fill="white" />
                  </div>
                </div>
              </div>

              {/* Bottom text overlay on the video */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <p className="text-white/90 font-semibold text-sm md:text-base">
                      El método Vakanta
                    </p>
                    <p className="text-white/50 text-xs md:text-sm mt-0.5">
                      2:45 min
                    </p>
                  </div>

                  {/* Floating badge — social proof */}
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400" fill="currentColor" />
                      ))}
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <span className="text-white/80 text-xs font-medium">
                      4.9/5 en reseñas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating stat badges below video */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8">
            {[
              { value: "30 días", label: "Cierre promedio" },
              { value: "500+", label: "Propiedades vendidas" },
              { value: "$0", label: "Costo de publicación" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-background border border-border/40 shadow-sm hover:shadow-md hover:border-[hsl(var(--champagne-gold))]/20 transition-all duration-300"
              >
                <span className="text-base md:text-lg font-bold text-midnight">{item.value}</span>
                <span className="text-xs md:text-sm text-foreground/40">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 md:py-28 px-6 bg-secondary/20">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--champagne-gold))] mb-3 block">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-midnight">
              Preguntas Frecuentes
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background border border-border/30 rounded-2xl px-6 data-[state=open]:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="text-midnight font-semibold text-left hover:no-underline py-5 text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/55 pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(var(--champagne-gold))]/5 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-2xl text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-midnight mb-6 leading-tight">
            ¿Listo para dar
            <br />
            el siguiente paso?
          </h2>
          <p className="text-foreground/50 text-lg mb-10 max-w-md mx-auto">
            Comienza hoy y descubre lo fácil que es vender tu propiedad con nosotros.
          </p>
          {/* Hidden on mobile — sticky bar covers it */}
          <Button
            size="lg"
            className="group relative hidden md:inline-flex bg-gradient-to-r from-[hsl(var(--champagne-gold))] to-[hsl(var(--champagne-gold-dark))] text-white rounded-full px-10 py-7 text-lg font-semibold shadow-[0_8px_30px_rgba(184,155,110,0.35)] hover:shadow-[0_12px_40px_rgba(184,155,110,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            onClick={openForm}
          >
            Empezar ahora
            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* ═══ STICKY MOBILE CTA ═══ */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur-md border-t border-border/50 p-4 z-50">
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-[hsl(var(--champagne-gold))] to-[hsl(var(--champagne-gold-dark))] text-white rounded-full py-6 text-lg font-semibold shadow-lg"
          onClick={openForm}
        >
          Comenzar ahora
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
      <div className="h-24 md:hidden" />

      {/* ═══ MODALS ═══ */}
      <SellerLeadForm open={isFormOpen} onOpenChange={setIsFormOpen} />

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-midnight border-0 overflow-hidden rounded-2xl">
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
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

export default SellPage;
