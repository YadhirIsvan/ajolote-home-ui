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
    {
      id: 4,
      image: property1,
      price: "$3,200,000",
      title: "Casa Colonial Restaurada",
      location: "Guanajuato, México",
      beds: 4,
      baths: 3,
      area: 220,
      score: 96,
    },
    {
      id: 5,
      image: property2,
      price: "$5,900,000",
      title: "Penthouse Contemporáneo",
      location: "Guadalajara, Jalisco",
      beds: 3,
      baths: 3,
      area: 200,
      score: 94,
    },
    {
      id: 6,
      image: property3,
      price: "$8,500,000",
      title: "Residencia con Alberca",
      location: "Mérida, Yucatán",
      beds: 5,
      baths: 4,
      area: 380,
      score: 99,
    },
    {
      id: 7,
      image: property1,
      price: "$2,800,000",
      title: "Departamento en Torre Premium",
      location: "Monterrey, Nuevo León",
      beds: 2,
      baths: 2,
      area: 120,
      score: 93,
    },
    {
      id: 8,
      image: property2,
      price: "$7,200,000",
      title: "Casa Minimalista con Jardín",
      location: "San Miguel de Allende, Guanajuato",
      beds: 3,
      baths: 2,
      area: 250,
      score: 97,
    },
    {
      id: 9,
      image: property3,
      price: "$15,000,000",
      title: "Mansion Frente al Golf",
      location: "Los Cabos, Baja California Sur",
      beds: 6,
      baths: 5,
      area: 500,
      score: 98,
    },
    {
      id: 10,
      image: property1,
      price: "$4,100,000",
      title: "Loft Industrial Remodelado",
      location: "Puebla, México",
      beds: 2,
      baths: 1,
      area: 140,
      score: 92,
    },
    {
      id: 11,
      image: property2,
      price: "$9,500,000",
      title: "Casa en Condominio Exclusivo",
      location: "Valle de Bravo, Estado de México",
      beds: 4,
      baths: 3,
      area: 300,
      score: 96,
    },
    {
      id: 12,
      image: property3,
      price: "$5,600,000",
      title: "Residencia Ecológica Sustentable",
      location: "Tulum, Quintana Roo",
      beds: 3,
      baths: 2,
      area: 190,
      score: 95,
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

          {/* Filtro Rápido */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por ubicación..."
                className="w-full px-6 py-3 rounded-lg bg-card border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ribbon"
              />
            </div>
            <select className="px-6 py-3 rounded-lg bg-card border border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-ribbon">
              <option value="">Tipo de Propiedad</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
            </select>
            <Button variant="hero" size="lg">
              <Search className="w-5 h-5" />
              Buscar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          {/* CTA Ver Todas */}
          <div className="text-center mt-12">
            <Button variant="hero" size="xl" asChild>
              <Link to="/">
                Ver Todas las Propiedades
                <TrendingUp className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
