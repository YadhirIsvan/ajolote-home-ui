import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import ScoreWidget from "@/components/ScoreWidget";
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize, Calendar, TrendingUp } from "lucide-react";
import property1 from "@/assets/property-1.jpg";

const PropertyDetail = () => {
  const { id } = useParams();

  // Mock data - en producción vendría de una API
  const property = {
    id: 1,
    image: property1,
    price: "$4,500,000",
    title: "Casa Moderna en Zona Residencial Premium",
    location: "Querétaro, México",
    beds: 3,
    baths: 2,
    area: 180,
    score: 98,
    description:
      "Hermosa casa de diseño contemporáneo en una de las zonas más exclusivas de Querétaro. Cuenta con amplios espacios, jardín privado, y acabados de primera calidad. Perfecta para familias que buscan confort y seguridad.",
  };

  const legalChecks = [
    { label: "Titularidad RPP Verificada", status: "ok" as const },
    { label: "Sin Adeudos Prediales", status: "ok" as const },
    { label: "Escrituras en Orden", status: "ok" as const },
    { label: "Zonificación Correcta", status: "ok" as const },
  ];

  return (
    <div className="min-h-screen bg-dawn">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Botón de regreso */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Volver a Propiedades
            </Link>
          </Button>

          {/* Grid de 3 Paneles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Panel Izquierdo - Datos */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="p-6">
                <h1 className="text-2xl font-bold text-card-foreground mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>

                <div className="text-3xl font-bold text-flamingo mb-6">{property.price}</div>

                {/* Características */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <BedDouble className="w-6 h-6 text-ribbon mx-auto mb-2" />
                    <div className="text-lg font-semibold text-card-foreground">{property.beds}</div>
                    <div className="text-xs text-muted-foreground">Recámaras</div>
                  </div>
                  <div className="text-center">
                    <Bath className="w-6 h-6 text-ribbon mx-auto mb-2" />
                    <div className="text-lg font-semibold text-card-foreground">{property.baths}</div>
                    <div className="text-xs text-muted-foreground">Baños</div>
                  </div>
                  <div className="text-center">
                    <Maximize className="w-6 h-6 text-ribbon mx-auto mb-2" />
                    <div className="text-lg font-semibold text-card-foreground">{property.area}m²</div>
                    <div className="text-xs text-muted-foreground">Área</div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-3">Descripción</h3>
                  <p className="text-sm text-card-foreground/70 leading-relaxed">{property.description}</p>
                </div>
              </Card>

              {/* Historia de Precios */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-ribbon" />
                  <h3 className="text-lg font-semibold text-card-foreground">Historia de Precios</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Precio Inicial</span>
                    <span className="font-semibold text-card-foreground">$4,800,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Precio Actual</span>
                    <span className="font-semibold text-flamingo">{property.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Actualizado</span>
                    <span className="text-muted-foreground">Hace 2 días</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Panel Central - Visual */}
            <div className="lg:col-span-6">
              <Card className="overflow-hidden">
                <div className="aspect-[16/10] relative">
                  <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="text-sm text-foreground">Tour Virtual 360° Disponible</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 overflow-x-auto">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                        <img src={property.image} alt={`Vista ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Panel Derecho - Score y CTAs */}
            <div className="lg:col-span-3 space-y-6">
              <ScoreWidget score={property.score} title="Score Legal de Propiedad" checks={legalChecks} />

              {/* Widget de Comprador - Simulado con usuario logueado */}
              <Card className="p-6 bg-flamingo/10 border-flamingo/30">
                <div className="text-center mb-4">
                  <div className="inline-block bg-flamingo text-foreground px-4 py-2 rounded-lg font-bold text-lg mb-3">
                    ¡APTO!
                  </div>
                  <p className="text-sm text-card-foreground">Compatible con tu crédito aprobado</p>
                </div>

                <div className="bg-card rounded-lg p-4 mb-4">
                  <div className="text-xs text-muted-foreground mb-1">Tu Pago Mensual Estimado</div>
                  <div className="text-3xl font-bold text-flamingo">$28,500</div>
                  <div className="text-xs text-muted-foreground mt-1">MXN / mes a 20 años</div>
                </div>

                <div className="space-y-3">
                  <Button variant="cta" size="lg" className="w-full">
                    COMPRAR ESTA PROPIEDAD
                  </Button>
                  <Button variant="hero" size="lg" className="w-full">
                    AGENDAR VISITA
                  </Button>
                </div>
              </Card>

              {/* Mapa de Ubicación */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-card-foreground mb-3">Ubicación y POIs</h3>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-ribbon" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
