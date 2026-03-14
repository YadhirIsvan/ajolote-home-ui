import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertyCard from "@/shared/components/custom/PropertyCard";
import {
  Search,
  Shield,
  Clock,
  UserPlus,
  CalendarCheck,
  Landmark,
  FileCheck,
  PartyPopper,
  ArrowRight,
} from "lucide-react";
import { useFeaturedProperties } from "@/home/hooks/use-featured-properties.hook";
import { HOME_ZONES } from "@/home/types/property.types";
import videoBackground from "@/assets/videos/video-background.mp4";

/* ── Trust bar partners (text placeholders until real logos exist) ── */
const PARTNERS = [
  "Infonavit",
  "BBVA",
  "Scotiabank",
  "Banorte",
  "HSBC",
  "Santander",
  "Fovissste",
  "Cofinavit",
];

/* ── 5 Steps ────────────────────────────────────────────────────── */
const STEPS = [
  {
    icon: UserPlus,
    title: "Registro",
    subtitle: "Crea tu cuenta y dinos qué buscas.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: CalendarCheck,
    title: "Visita",
    subtitle: "Agenda una visita guiada a tu ritmo.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Landmark,
    title: "Financiamiento",
    subtitle: "Pre-aprobación en minutos, sin papeleo.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: FileCheck,
    title: "Validación Legal",
    subtitle: "Verificamos que todo esté en regla.",
    color: "from-violet-400 to-purple-500",
  },
  {
    icon: PartyPopper,
    title: "Compra Exitosa",
    subtitle: "Firma y recibe las llaves de tu hogar.",
    color: "from-pink-400 to-rose-500",
  },
];

const HomePage = () => {
  const [selectedZone, setSelectedZone] = useState<string>("");

  const { properties, isLoading } = useFeaturedProperties({
    zone: selectedZone || undefined,
    limit: 20,
    offset: 0,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* ═══ HERO — IMMERSIVE VIDEO ═══ */}
      <section className="relative min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Video bg */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoBackground} type="video/mp4" />
        </video>

        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/40 to-midnight/80" />

        {/* Content */}
        <div className="relative z-10 container mx-auto text-center px-4 pt-24 pb-20 md:pt-32 md:pb-28">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-5 drop-shadow-lg">
            Encuentra tu
            <br />
            hogar ideal
          </h1>
          <p className="text-base md:text-lg text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
            Propiedades verificadas con validación legal y crediticia
            en la región de Veracruz
          </p>

          {/* Search bar — glass */}
          <div className="max-w-lg mx-auto mb-6">
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-white/15 hover:border-white/30 focus-within:bg-white/15 focus-within:border-white/35">
              <Search className="w-5 h-5 text-white/50 ml-5 flex-shrink-0" />
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger className="flex-1 h-14 text-base bg-transparent border-0 text-white placeholder:text-white/40 focus:ring-0 focus:ring-offset-0 shadow-none pl-3">
                  <SelectValue placeholder="Buscar por zona..." />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50 rounded-xl">
                  {HOME_ZONES.map((zone) => (
                    <SelectItem
                      key={zone}
                      value={zone}
                      className="text-base py-3 cursor-pointer rounded-lg"
                    >
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="gold"
                size="sm"
                asChild
                className="rounded-full mr-2 px-5 h-10 shadow-lg"
              >
                <Link to="/comprar">Buscar</Link>
              </Button>
            </div>
          </div>

          {/* Action links */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <Link
              to="/comprar"
              className="text-white/60 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
            >
              Explorar todo
            </Link>
            <Link
              to="/vender"
              className="text-white/60 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
            >
              Publicar propiedad
            </Link>
          </div>
        </div>

        {/* Floating stat badges — bottom corners */}
        <div className="absolute bottom-6 left-4 md:left-8 z-10 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg">
          <Shield className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="text-white text-xs font-bold leading-none">100%</p>
            <p className="text-white/50 text-[10px] mt-0.5">Verificadas</p>
          </div>
        </div>

        <div className="absolute bottom-6 right-4 md:right-8 z-10 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg">
          <Clock className="w-4 h-4 text-[hsl(var(--champagne-gold))]" />
          <div>
            <p className="text-white text-xs font-bold leading-none">7 min</p>
            <p className="text-white/50 text-[10px] mt-0.5">Pre-aprobación</p>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR — INFINITE SCROLL ═══ */}
      <section className="py-6 border-b border-border/30 bg-background overflow-hidden">
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex animate-scroll-x">
            {[...PARTNERS, ...PARTNERS].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex-shrink-0 px-8 md:px-12 flex items-center justify-center"
              >
                <span className="text-sm md:text-base font-semibold text-foreground/20 hover:text-foreground/60 transition-colors duration-500 whitespace-nowrap tracking-wide select-none cursor-default">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EL CAMINO AVAKANTA — 5 STEPS ═══ */}
      <section className="py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--champagne-gold))] mb-3 block">
              Cómo funciona
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-midnight leading-tight">
              El Camino Avakanta
            </h2>
            <p className="text-foreground/45 text-base md:text-lg mt-4 max-w-lg mx-auto">
              5 pasos para llegar a las llaves de tu nuevo hogar.
            </p>
          </div>

          {/* Steps — horizontal on desktop, vertical on mobile */}
          <div className="relative">
            {/* Dotted connector line — desktop only */}
            <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px border-t-2 border-dashed border-border/40" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-4">
              {STEPS.map((step, index) => (
                <div key={index} className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 group">
                  {/* Icon node */}
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                      <step.icon className="w-6 h-6 text-white" strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="md:text-center md:mt-5">
                    <span className={`text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                      Paso {index + 1}
                    </span>
                    <h3 className="text-base font-bold text-midnight mt-1">{step.title}</h3>
                    <p className="text-sm text-foreground/45 mt-1 leading-relaxed max-w-[180px] md:mx-auto">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PROPERTIES ═══ */}
      <section className="py-24 md:py-32 px-6 bg-gradient-to-b from-secondary/15 via-secondary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 md:mb-16">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--champagne-gold))] mb-2 block">
                Catálogo
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-midnight">
                Propiedades Destacadas
              </h2>
            </div>
            <Button
              variant="ghost"
              asChild
              className="group text-foreground/50 hover:text-midnight self-start sm:self-auto"
            >
              <Link to="/comprar" className="flex items-center gap-2 text-sm font-medium">
                Ver todas
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] rounded-2xl bg-secondary/30 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  image={property.image}
                  price={property.price}
                  title={property.title}
                  location={property.address}
                  beds={property.beds}
                  baths={property.baths}
                  area={property.sqm}
                />
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="text-center mt-14">
            <Button
              variant="gold"
              size="lg"
              asChild
              className="rounded-full px-10 py-6 text-base font-semibold shadow-[0_8px_30px_rgba(184,155,110,0.3)] hover:shadow-[0_12px_40px_rgba(184,155,110,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <Link to="/comprar" className="flex items-center gap-2">
                Explorar Propiedades
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
