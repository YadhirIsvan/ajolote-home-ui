import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowLeft,
  Share2,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  CheckCircle2,
  Play,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const PropertyDetail = () => {
  const { id } = useParams();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mock data - en producción vendría de una API
  const property = {
    id: 1,
    images: [property1, property2, property3, property1, property2],
    price: "$4,500,000",
    title: "Casa Moderna en Zona Residencial Premium",
    location: "Orizaba, Veracruz",
    beds: 3,
    baths: 2,
    area: 180,
    verified: true,
    status: "Disponible",
    description:
      "Hermosa casa de diseño contemporáneo en una de las zonas más exclusivas de Orizaba. Cuenta con amplios espacios, jardín privado, y acabados de primera calidad. Perfecta para familias que buscan confort y seguridad. La propiedad incluye cocina integral de granito, pisos de mármol en áreas comunes, sistema de seguridad inteligente, y estacionamiento para 2 vehículos. Ubicada cerca de escuelas, hospitales y centros comerciales.",
    hasVideoTour: true,
    hasFloorPlan: true,
    agent: {
      name: "María González",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      phone: "+52 272 123 4567",
      email: "maria@vycite.com",
    },
  };

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
  ];

  const truncatedDescription = property.description.slice(0, 150) + "...";

  const handleConfirmAppointment = () => {
    if (selectedDate && selectedTime) {
      console.log("Appointment scheduled:", { date: selectedDate, time: selectedTime });
      setShowScheduleModal(false);
      setSelectedDate(undefined);
      setSelectedTime(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border lg:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <Button variant="ghost" size="icon" asChild className="text-primary">
            <Link to="/comprar">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="text-primary">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Desktop Navigation */}
      <div className="hidden lg:block pt-6 pb-4 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild className="text-primary hover:text-champagne">
              <Link to="/comprar">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Propiedades
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-primary">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-24 lg:pb-16">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Title & Location */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start gap-2">
              <h1 className="text-xl font-bold text-primary leading-tight flex-1">
                {property.title}
              </h1>
              {property.verified && (
                <div className="flex items-center gap-1 bg-champagne/10 text-champagne px-2 py-1 rounded-full text-xs font-medium shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  Verificado
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{property.location}</span>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="px-4 mb-4">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-medium">
                      <img
                        src={image}
                        alt={`${property.title} - Vista ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm" />
              <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm" />
            </Carousel>
          </div>

          {/* Price */}
          <div className="px-4 mb-4">
            <p className="text-3xl font-bold text-champagne">{property.price}</p>
            <p className="text-xs text-muted-foreground">MXN</p>
          </div>

          {/* Key Specs */}
          <div className="px-4 mb-6">
            <div className="flex items-center gap-6 py-3 px-4 bg-muted/50 rounded-2xl">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">{property.beds} Rec</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">{property.baths} Baños</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">{property.area}m²</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-4 mb-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Descripción</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {showFullDescription ? property.description : truncatedDescription}
            </p>
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="flex items-center gap-1 text-champagne text-sm font-medium mt-2 min-h-[44px]"
            >
              {showFullDescription ? (
                <>
                  Leer menos <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Leer más <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Video Tour */}
          {property.hasVideoTour && (
            <div className="px-4 mb-6">
              <h3 className="text-lg font-semibold text-primary mb-3">Recorrido Virtual</h3>
              <div className="aspect-video bg-primary/5 rounded-2xl relative overflow-hidden shadow-medium">
                <img
                  src={property.images[0]}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                  <button className="w-16 h-16 bg-champagne rounded-full flex items-center justify-center shadow-gold transition-transform hover:scale-110">
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Floor Plan */}
          {property.hasFloorPlan && (
            <div className="px-4 mb-6">
              <h3 className="text-lg font-semibold text-primary mb-3">Planos</h3>
              <div className="aspect-[4/3] bg-muted/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Plano disponible</p>
                  <Button variant="gold-outline" size="sm" className="mt-3">
                    Ver Plano
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Agent Card */}
          <div className="px-4 mb-6">
            <h3 className="text-lg font-semibold text-primary mb-3">Agente Inmobiliario</h3>
            <Card className="p-4 rounded-2xl shadow-soft">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-champagne"
                />
                <div>
                  <p className="font-semibold text-primary">{property.agent.name}</p>
                  <p className="text-sm text-muted-foreground">Agente Certificado</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="container mx-auto px-6 pt-8">
            {/* Bento Box Gallery */}
            <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[500px] mb-8">
              <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-medium">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              {property.images.slice(1, 5).map((image, index) => (
                <div key={index} className="rounded-2xl overflow-hidden shadow-soft">
                  <img
                    src={image}
                    alt={`Vista ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="col-span-2 space-y-8">
                {/* Title & Badge */}
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-primary">{property.title}</h1>
                    {property.verified && (
                      <div className="flex items-center gap-1 bg-champagne/10 text-champagne px-3 py-1.5 rounded-full text-sm font-medium shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        Verificado
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span>{property.location}</span>
                  </div>
                </div>

                {/* Key Specs */}
                <div className="flex items-center gap-8 py-4 px-6 bg-muted/50 rounded-2xl w-fit">
                  <div className="flex items-center gap-3">
                    <BedDouble className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-primary">{property.beds}</p>
                      <p className="text-xs text-muted-foreground">Recámaras</p>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex items-center gap-3">
                    <Bath className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-primary">{property.baths}</p>
                      <p className="text-xs text-muted-foreground">Baños</p>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex items-center gap-3">
                    <Maximize className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-primary">{property.area}m²</p>
                      <p className="text-xs text-muted-foreground">Área Total</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Descripción</h3>
                  <p className="text-foreground/70 leading-relaxed">{property.description}</p>
                </div>

                {/* Video Tour */}
                {property.hasVideoTour && (
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-4">Recorrido Virtual</h3>
                    <div className="aspect-video bg-primary/5 rounded-2xl relative overflow-hidden shadow-medium">
                      <img
                        src={property.images[0]}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                        <button className="w-20 h-20 bg-champagne rounded-full flex items-center justify-center shadow-gold transition-transform hover:scale-110">
                          <Play className="w-9 h-9 text-white ml-1" fill="white" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floor Plan */}
                {property.hasFloorPlan && (
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-4">Planos</h3>
                    <div className="aspect-[16/9] bg-muted/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground mb-4">Plano de la propiedad disponible</p>
                        <Button variant="gold-outline">Ver Plano Completo</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sticky */}
              <div className="col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Price Card */}
                  <Card className="p-6 rounded-2xl shadow-medium">
                    <p className="text-4xl font-bold text-champagne mb-1">{property.price}</p>
                    <p className="text-sm text-muted-foreground mb-6">MXN</p>

                    <Button
                      variant="gold"
                      size="lg"
                      className="w-full mb-4"
                      onClick={() => setShowScheduleModal(true)}
                    >
                      Agendar Visita
                    </Button>

                    {/* Agent */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={property.agent.photo}
                          alt={property.agent.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-champagne"
                        />
                        <div>
                          <p className="font-semibold text-primary">{property.agent.name}</p>
                          <p className="text-sm text-muted-foreground">Agente Certificado</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 lg:hidden z-40">
        <Button
          variant="gold"
          size="lg"
          className="w-full shadow-gold"
          onClick={() => setShowScheduleModal(true)}
        >
          Agendar Visita
        </Button>
      </div>

      {/* Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-background">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary text-center">
              Programa tu visita
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Calendar */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-xl border border-border"
              />
            </div>

            {/* Time Slots */}
            <div>
              <p className="text-sm font-medium text-primary mb-3">Selecciona un horario</p>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                      selectedTime === time
                        ? "bg-champagne text-white shadow-gold"
                        : "bg-muted text-primary hover:bg-champagne/10"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <Button
              variant="gold"
              size="lg"
              className="w-full"
              onClick={handleConfirmAppointment}
              disabled={!selectedDate || !selectedTime}
            >
              Confirmar Cita
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetail;
