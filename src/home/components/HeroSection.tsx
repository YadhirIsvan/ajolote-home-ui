import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Shield, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { CityItem } from "@/shared/actions/get-cities.actions";

const VIDEO_WEBM   = "/videos/video-background.webm";
const VIDEO_MP4    = "/videos/video-background.mp4";
const VIDEO_POSTER = "/videos/poster.webp";

interface HeroSectionProps {
  cities: CityItem[];
  isLoadingCities: boolean;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onSearch: () => void;
}

const HeroSection = ({ cities, isLoadingCities, selectedCity, onCityChange, onSearch }: HeroSectionProps) => {
  const [isVideoReady, setIsVideoReady] = useState(false);

  return (
    <section className="relative min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src={VIDEO_POSTER}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <video
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setIsVideoReady(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isVideoReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={VIDEO_WEBM} type="video/webm" />
        <source src={VIDEO_MP4} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/40 to-midnight/80" />

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

        <div className="max-w-lg mx-auto mb-6">
          <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-white/15 hover:border-white/30 focus-within:bg-white/15 focus-within:border-white/35">
            <Search className="w-5 h-5 text-white/50 ml-5 flex-shrink-0" />
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger className="flex-1 h-14 text-base bg-transparent border-0 text-white placeholder:text-white/40 focus:ring-0 focus:ring-offset-0 shadow-none pl-3">
                <SelectValue placeholder={isLoadingCities ? "Cargando..." : "Buscar por ciudad..."} />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50 rounded-xl">
                {cities.map((city) => (
                  <SelectItem
                    key={city.id}
                    value={city.name}
                    className="text-base py-3 cursor-pointer rounded-lg"
                  >
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="gold"
              size="sm"
              className="rounded-full mr-2 px-5 h-10 shadow-lg cursor-pointer"
              onClick={onSearch}
            >
              Buscar
            </Button>
          </div>
        </div>

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
  );
};

export default HeroSection;
