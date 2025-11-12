import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import PropertyCard from "@/components/PropertyCard";
import { Search, TrendingUp, Shield, Clock } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const Index = () => {
  const featuredProperties = [
    {
      id: 1,
      image: property1,
      price: "$4,500,000",
      title: "Casa Moderna en Zona Residencial",
      location: "Querétaro, México",
      beds: 3,
      baths: 2,
      area: 180,
      score: 98,
    },
    {
      id: 2,
      image: property2,
      price: "$6,800,000",
      title: "Departamento de Lujo con Vista Panorámica",
      location: "Ciudad de México",
      beds: 2,
      baths: 2,
      area: 145,
      score: 95,
    },
    {
      id: 3,
      image: property3,
      price: "$12,500,000",
      title: "Villa Frente al Mar",
      location: "Cancún, Quintana Roo",
      beds: 4,
      baths: 3,
      area: 320,
      score: 97,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section con estilo "Amanecer Vibrante" */}
      <section className="relative min-h-screen flex items-center justify-center bg-dawn overflow-hidden pt-20">
        {/* Decoración de fauna mexicana sutil */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-carissma rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-ribbon rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            El hogar de tus sueños
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ribbon via-flamingo to-carissma">
              con Vy Cite
            </span>
          </h1>

          <p className="text-xl text-foreground/80 mb-12 max-w-2xl mx-auto">
            La plataforma PropTech que combina tecnología, validación legal y análisis crediticio para tu compra perfecta
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button variant="hero" size="xl" asChild className="min-w-[200px]">
              <Link to="/">
                <Search className="w-5 h-5" />
                Busca tu Casa
              </Link>
            </Button>
            <Button variant="cta" size="xl" asChild className="min-w-[200px]">
              <Link to="/vender">
                <TrendingUp className="w-5 h-5" />
                Publicar
              </Link>
            </Button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card/90 backdrop-blur-sm rounded-xl p-6 hover:shadow-glow-blue transition-all">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-ribbon" />
              </div>
              <div className="text-4xl font-bold text-ribbon mb-2">95+</div>
              <div className="text-sm text-card-foreground/70">Score Legal Promedio</div>
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-xl p-6 hover:shadow-glow-orange transition-all">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-flamingo" />
              </div>
              <div className="text-4xl font-bold text-flamingo mb-2">500+</div>
              <div className="text-sm text-card-foreground/70">Propiedades Verificadas</div>
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-xl p-6 hover:shadow-glow-blue transition-all">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-8 h-8 text-carissma" />
              </div>
              <div className="text-4xl font-bold text-carissma mb-2">100%</div>
              <div className="text-sm text-card-foreground/70">Transparencia de Precios</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Propiedades Destacadas */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Propiedades Destacadas</h2>
            <p className="text-lg text-foreground/70">
              Cada propiedad incluye su Score Legal y validación completa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
