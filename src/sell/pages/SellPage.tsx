import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import { ArrowRight, Play, X, Star } from "lucide-react";
import SellerLeadForm from "@/sell/components/SellerLeadForm";
import TimelineStep from "@/sell/components/TimelineStep";
import { useSellPage } from "@/sell/hooks/use-sell-page.sell.hook";
import { useScrollVisibility } from "@/sell/hooks/use-scroll-visibility.sell.hook";
import { SELL_STEPS, SELL_FAQS, SELL_STATS } from "@/sell/constants/sell.constants";

const SellPage = () => {
  const { isFormOpen, setIsFormOpen, isVideoOpen, setIsVideoOpen, openForm, openVideo, showAuthHint } = useSellPage();
  const { visibleIndexes, containerRef } = useScrollVisibility(SELL_STEPS.length);

  return (
    <div className="min-h-screen bg-background">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-28 md:pt-36 pb-20 md:pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-[hsl(var(--champagne-gold))]/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] rounded-full bg-[hsl(var(--champagne-gold))]/3 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
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

          <div className="hidden md:flex flex-col items-center gap-2">
            <Button
              size="lg"
              className="group relative bg-gradient-to-r from-[hsl(var(--champagne-gold))] to-[hsl(var(--champagne-gold-dark))] text-white rounded-full px-10 py-7 text-lg font-semibold shadow-[0_8px_30px_rgba(184,155,110,0.35)] hover:shadow-[0_12px_40px_rgba(184,155,110,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
              onClick={openForm}
            >
              Comenzar ahora
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            {showAuthHint && (
              <p className="text-sm text-foreground/50">
                Debes{" "}
                <Link to="/mi-cuenta" className="text-[hsl(var(--champagne-gold))] font-medium hover:underline">
                  iniciar sesión
                </Link>{" "}
                para continuar
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 mt-14">
            {SELL_STATS.map((stat) => (
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

          <div ref={containerRef}>
            {SELL_STEPS.map((step, index) => (
              <div key={index} data-index={index}>
                <TimelineStep
                  step={step}
                  index={index}
                  isVisible={visibleIndexes.has(index)}
                  isLast={index === SELL_STEPS.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VIDEO SECTION — CINEMATIC ═══ */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-[hsl(var(--champagne-gold))]/[0.04] blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
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

          <div className="relative group cursor-pointer" onClick={openVideo}>
            <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-b from-[hsl(var(--champagne-gold))]/20 via-transparent to-[hsl(var(--champagne-gold))]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />

            <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(15,23,42,0.14)] group-hover:shadow-[0_35px_100px_rgba(15,23,42,0.22)] transition-all duration-700">
              <AspectRatio ratio={16 / 9}>
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80"
                  alt="Video sobre nuestro proceso de venta"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20 transition-colors duration-500 group-hover:from-black/40 group-hover:via-black/5 group-hover:to-black/15" />
              </AspectRatio>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping [animation-duration:2.5s]" />
                  <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:scale-110 group-hover:bg-white/25 group-hover:border-white/40 group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)]">
                    <Play className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white ml-1 drop-shadow-md" fill="white" />
                  </div>
                </div>
              </div>

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
            {SELL_FAQS.map((faq, index) => (
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
          <div className="hidden md:flex flex-col items-center gap-2">
            <Button
              size="lg"
              className="group relative bg-gradient-to-r from-[hsl(var(--champagne-gold))] to-[hsl(var(--champagne-gold-dark))] text-white rounded-full px-10 py-7 text-lg font-semibold shadow-[0_8px_30px_rgba(184,155,110,0.35)] hover:shadow-[0_12px_40px_rgba(184,155,110,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
              onClick={openForm}
            >
              Empezar ahora
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            {showAuthHint && (
              <p className="text-sm text-foreground/50">
                Debes{" "}
                <Link to="/mi-cuenta" className="text-[hsl(var(--champagne-gold))] font-medium hover:underline">
                  iniciar sesión
                </Link>{" "}
                para continuar
              </p>
            )}
          </div>
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
        {showAuthHint && (
          <p className="text-center text-xs text-foreground/50 mt-2">
            Debes{" "}
            <span className="text-[hsl(var(--champagne-gold))] font-medium">
              iniciar sesión
            </span>{" "}
            para continuar
          </p>
        )}
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
              src="https://www.youtube.com/embed/OV0IWFMCJL8?autoplay=1&rel=0"
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
