import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Calendar } from "@/shared/components/ui/calendar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shared/components/ui/carousel";
import {
  ArrowLeft, Share2, MapPin, BedDouble, Bath, Maximize,
  CheckCircle2, Play, Phone, ChevronDown, ChevronUp,
  GraduationCap, ShoppingBag, Hospital, Train, Loader2,
  MessageCircle, Waves, Dumbbell, Shield, ArrowUpDown,
  Car, Leaf, Sun, Bookmark,
} from "lucide-react";
import { usePropertyDetail } from "@/buy/hooks/use-property-detail.buy.hook";
import { TIME_SLOTS } from "@/buy/types/property.types";
import AuthModal from "@/auth/components/AuthModal";
import MortgageCallToAction from "@/buy/components/MortgageCallToAction";
import MortgageCalculatorWidget from "@/buy/components/MortgageCalculatorWidget";
import SimilarPropertiesSection from "@/buy/components/SimilarPropertiesSection";
import { useFinancialModal } from "@/shared/hooks/financial-modal.context";
import { tokenStore } from "@/shared/api/token.store";

const getPOIIcon = (iconType: string) => {
  switch (iconType) {
    case "school":   return <GraduationCap className="w-4 h-4" />;
    case "shopping": return <ShoppingBag className="w-4 h-4" />;
    case "hospital": return <Hospital className="w-4 h-4" />;
    case "transport": return <Train className="w-4 h-4" />;
    default:         return <MapPin className="w-4 h-4" />;
  }
};

const getAmenityIcon = (iconName: string) => {
  switch (iconName) {
    case "waves":    return <Waves className="w-5 h-5" />;
    case "dumbbell": return <Dumbbell className="w-5 h-5" />;
    case "shield":   return <Shield className="w-5 h-5" />;
    case "arrow-up-down": return <ArrowUpDown className="w-5 h-5" />;
    case "car":      return <Car className="w-5 h-5" />;
    case "leaf":     return <Leaf className="w-5 h-5" />;
    case "sun":      return <Sun className="w-5 h-5" />;
    default:         return <MapPin className="w-5 h-5" />;
  }
};

const extractYouTubeId = (input: string | undefined): string | null => {
  if (!input) return null;

  // If it's already a short ID format (11 chars of alphanumeric, dash, underscore)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  // Try to extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  // If no pattern matches but it looks like a URL, try one more time
  try {
    const url = new URL(input);
    const videoId = url.searchParams.get('v');
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return videoId;
    }
  } catch {
    // Not a valid URL, return input as-is and let YouTube handle the error
  }

  // Return as-is and let YouTube give an error message
  return input;
};

const PropertyDetailPage = () => {
  const { openFinancialModal } = useFinancialModal();

  // State for mortgage calculator expansion on mobile
  const [expandMortgage, setExpandMortgage] = useState(false);

  const {
    property,
    isLoading,
    isError,
    showFullDescription,
    setShowFullDescription,
    showScheduleModal,
    setShowScheduleModal,
    showAuthModal,
    setShowAuthModal,
    showSuccessModal,
    setShowSuccessModal,
    showVideoModal,
    setShowVideoModal,
    showCallConfirmModal,
    setShowCallConfirmModal,
    successData,
    selectedDate,
    handleDateSelect,
    selectedTime,
    setSelectedTime,
    availableSlots,
    slotsLoading,
    truncatedDescription,
    displayImages,
    nearbyPOIs,
    hasVideoTour,
    handleScheduleClick,
    handleAuthSuccess,
    handleConfirmAppointment,
    handleCallClick,
    handleConfirmCall,
    isScheduling,
    scheduleError,
    isSaved,
    showSaveAuthModal,
    setShowSaveAuthModal,
    handleToggleSave,
    financialProfile,
    showMortgageCalculator,
  } = usePropertyDetail();

  const isAuthenticated = !!tokenStore.getAccessToken();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando propiedad...</p>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Propiedad no encontrada</p>
      </div>
    );
  }

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
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="text-primary" onClick={handleToggleSave}>
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-champagne text-champagne' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
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
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start gap-2">
              <h1 className="text-xl font-bold text-primary leading-tight flex-1">{property.title}</h1>
              {property.verified && (
                <div className="flex items-center gap-1 bg-champagne/10 text-champagne px-2 py-1 rounded-full text-xs font-medium shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  Verificado
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{property.address}</span>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="px-4 mb-4">
            <Carousel className="w-full">
              <CarouselContent>
                {displayImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-medium">
                      <img src={image} alt={`${property.title} - Vista ${index + 1}`} className="w-full h-full object-cover" />
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
                <span className="text-sm font-medium text-primary">{property.sqm}m²</span>
              </div>
            </div>
          </div>

          {/* Amenities - Mobile */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="px-4 mb-6">
              <h3 className="text-lg font-semibold text-primary mb-3">Amenidades</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-3 bg-muted/50 rounded-xl px-3 py-3">
                    <span className="text-champagne">{getAmenityIcon(amenity.icon)}</span>
                    <span className="text-sm font-medium text-foreground">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Tour */}
          <div className="px-4 mb-6">
            <h3 className="text-lg font-semibold text-primary mb-3">Recorrido Virtual</h3>
            <div className="aspect-video bg-primary/5 rounded-2xl relative overflow-hidden shadow-medium">
              <img src={property.images[0]} alt="Video thumbnail" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="w-16 h-16 bg-champagne rounded-full flex items-center justify-center shadow-gold transition-transform hover:scale-110"
                >
                  <Play className="w-7 h-7 text-white ml-1" fill="white" />
                </button>
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
                <>Leer menos <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Leer más <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>

          {/* Google Maps */}
          <div className="px-4 mb-6">
            <h3 className="text-lg font-semibold text-primary mb-3">Ubicación Exacta</h3>
            <div className="rounded-2xl overflow-hidden shadow-medium">
              <iframe
                key={`${property.coordinates.lat}-${property.coordinates.lng}`}
                src={`https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&z=16&output=embed`}
                width="100%"
                height="250"
                style={{ border: 0 }}
                loading="lazy"
                className="w-full"
                title="Ubicación de la propiedad"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {nearbyPOIs.map((poi, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2.5 text-sm">
                  <span className="text-champagne">{getPOIIcon(poi.icon)}</span>
                  <span className="text-foreground/70">{poi.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mortgage Calculator or CTA - Mobile Collapsible — solo para usuarios autenticados */}
          {isAuthenticated && (
          <div className="px-4 mb-6">
            <button
              onClick={() => setExpandMortgage(!expandMortgage)}
              className="w-full flex items-center justify-between bg-muted/50 rounded-2xl px-4 py-4 mb-2 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-primary">Simula tu Hipoteca</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${expandMortgage ? 'rotate-180' : ''}`} />
            </button>

            {/* Collapsible Content */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: expandMortgage ? '1000px' : '0px',
                opacity: expandMortgage ? 1 : 0,
              }}
            >
              <div className="bg-muted/50 rounded-2xl px-4 py-4 mt-2">
                {showMortgageCalculator && financialProfile ? (
                  <MortgageCalculatorWidget
                    propertyPrice={parseFloat(property.price.replace(/[^0-9.]/g, "")) || 0}
                    monthlyIncome={parseFloat(financialProfile.monthlyIncome) || 0}
                    partnerMonthlyIncome={financialProfile.loanType === "conyugal" ? parseFloat(financialProfile.partnerMonthlyIncome) || 0 : undefined}
                    initialDownPayment={financialProfile.savingsForEnganche || "0"}
                  />
                ) : (
                  <MortgageCallToAction onCalculateCredit={() => openFinancialModal()} />
                )}
              </div>
            </div>
          </div>
          )}

          {/* Agent Card */}
          {property.agent && (
          <div className="px-4 mb-6">
            <h3 className="text-lg font-semibold text-primary mb-3">Agente Inmobiliario</h3>
            <Card className="p-4 rounded-2xl shadow-soft">
              <div className="flex items-center gap-4 mb-4">
                <img src={property.agent.photo} alt={property.agent.name} className="w-16 h-16 rounded-full object-cover border-2 border-champagne" />
                <div>
                  <p className="font-semibold text-primary">{property.agent.name}</p>
                  <p className="text-sm text-muted-foreground">Agente Certificado</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => {
                    const phone = property.agent!.phone.replace(/\D/g, '');
                    const message = `Hola, me interesa la propiedad:\n\n📍 ${property.title}\n💰 ${property.price} MXN\n📌 ${property.address}\n\n🛏️ ${property.beds} Recámaras | 🚿 ${property.baths} Baños | 📐 ${property.sqm}m²\n\n¿Puedes brindarme más información?`;
                    const encodedMessage = encodeURIComponent(message);
                    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white"
                  onClick={() => handleCallClick(property.agent!.phone)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar
                </Button>
              </div>
            </Card>
          </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="container mx-auto px-6 pt-8">
            {/* Bento Box Gallery */}
            <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[500px] mb-8">
              <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-medium">
                <img src={displayImages[0]} alt={property.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              {displayImages.slice(1, 5).map((image, index) => (
                <div key={index} className="rounded-2xl overflow-hidden shadow-soft">
                  <img src={image} alt={`Vista ${index + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
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
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-primary">{property.title}</h1>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-primary hover:text-champagne shrink-0 mt-1"
                      onClick={handleToggleSave}
                    >
                      <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-champagne text-champagne' : ''}`} />
                    </Button>
                    {property.verified && (
                      <div className="flex items-center gap-1 bg-champagne/10 text-champagne px-3 py-1.5 rounded-full text-sm font-medium shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        Verificado
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span>{property.address}</span>
                  </div>
                </div>

                {/* Key Specs */}
                <div className="flex flex-wrap items-center gap-8 py-4 px-6 bg-muted/50 rounded-2xl">
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
                      <p className="font-semibold text-primary">{property.sqm}m²</p>
                      <p className="text-xs text-muted-foreground">Área Construcción</p>
                    </div>
                  </div>
                  {property.landSqm && (
                    <>
                      <div className="w-px h-10 bg-border" />
                      <div className="flex items-center gap-3">
                        <Maximize className="w-6 h-6 text-primary" />
                        <div>
                          <p className="font-semibold text-primary">{property.landSqm}m²</p>
                          <p className="text-xs text-muted-foreground">Área Terreno</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-4">Amenidades</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {property.amenities.map((amenity) => (
                        <div key={amenity.id} className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
                          <span className="text-champagne text-xl">{getAmenityIcon(amenity.icon)}</span>
                          <span className="text-sm font-medium text-foreground">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Descripción</h3>
                  <p className="text-foreground/70 leading-relaxed">{property.description}</p>
                </div>

                {/* Video Tour */}
                {hasVideoTour && (
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-4">Recorrido Virtual</h3>
                    <div className="aspect-video bg-primary/5 rounded-2xl relative overflow-hidden shadow-medium">
                      <img src={property.videoImg || displayImages[0]} alt="Video thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                        <button
                          onClick={() => setShowVideoModal(true)}
                          className="w-20 h-20 bg-champagne rounded-full flex items-center justify-center shadow-gold transition-transform hover:scale-110"
                        >
                          <Play className="w-9 h-9 text-white ml-1" fill="white" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Google Maps Desktop */}
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-4">Ubicación Exacta</h3>
                  <div className="rounded-2xl overflow-hidden shadow-medium">
                    <iframe
                      key={`${property.coordinates.lat}-${property.coordinates.lng}`}
                      src={`https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&z=16&output=embed`}
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      loading="lazy"
                      className="w-full"
                      title="Ubicación de la propiedad"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {nearbyPOIs.map((poi, index) => (
                      <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-3 text-sm">
                        <span className="text-champagne">{getPOIIcon(poi.icon)}</span>
                        <span className="text-foreground/70">{poi.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Sticky */}
              <div className="col-span-1">
                <div className="sticky top-8 space-y-6">
                  <Card className="p-6 rounded-2xl shadow-medium">
                    <p className="text-4xl font-bold text-champagne mb-1">{property.price}</p>
                    <p className="text-sm text-muted-foreground mb-6">MXN</p>
                    <Button variant="gold" size="lg" className="w-full mb-4" onClick={handleScheduleClick}>
                      Agendar Visita
                    </Button>

                    {/* Mortgage Calculator or CTA — solo para usuarios autenticados */}
                    {isAuthenticated && (
                    <div className="mb-4">
                      {showMortgageCalculator && financialProfile ? (
                        <MortgageCalculatorWidget
                          propertyPrice={parseFloat(property.price.replace(/[^0-9.]/g, "")) || 0}
                          monthlyIncome={parseFloat(financialProfile.monthlyIncome) || 0}
                          partnerMonthlyIncome={financialProfile.loanType === "conyugal" ? parseFloat(financialProfile.partnerMonthlyIncome) || 0 : undefined}
                          initialDownPayment={financialProfile.savingsForEnganche || "0"}
                        />
                      ) : (
                        <MortgageCallToAction onCalculateCredit={() => openFinancialModal()} />
                      )}
                    </div>
                    )}

                    {property.agent && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-4 mb-4">
                        <img src={property.agent.photo} alt={property.agent.name} className="w-14 h-14 rounded-full object-cover border-2 border-champagne" />
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
                          onClick={() => {
                            const phone = property.agent!.phone.replace(/\D/g, '');
                            const message = `Hola, me interesa la propiedad:\n\n📍 ${property.title}\n💰 ${property.price} MXN\n📌 ${property.address}\n\n🛏️ ${property.beds} Recámaras | 🚿 ${property.baths} Baños | 📐 ${property.sqm}m²\n\n¿Puedes brindarme más información?`;
                            const encodedMessage = encodeURIComponent(message);
                            window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white"
                          onClick={() => handleCallClick(property.agent!.phone)}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Propiedades similares */}
        {property.similarProperties.length > 0 && (
          <SimilarPropertiesSection properties={property.similarProperties} />
        )}
      </main>

      {/* Mobile Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 lg:hidden z-40">
        <Button variant="gold" size="lg" className="w-full shadow-gold" onClick={handleScheduleClick}>
          Agendar Visita
        </Button>
      </div>

      {/* Auth Modal — se abre si el usuario no está logueado (agendar visita) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleAuthSuccess}
      />

      {/* Auth Modal — se abre si el usuario no está logueado (guardar propiedad) */}
      <AuthModal
        isOpen={showSaveAuthModal}
        onClose={() => setShowSaveAuthModal(false)}
        onLoginSuccess={() => {
          setShowSaveAuthModal(false);
          handleToggleSave();
        }}
      />

      {/* Diálogo de éxito después de agendar */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-sm rounded-2xl bg-background text-center">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <CheckCircle2 className="w-16 h-16 text-champagne" />
            </div>
            <DialogTitle className="text-xl font-bold text-primary">
              ¡Cita Registrada!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 pb-2">
            {successData && (
              <>
                <p className="text-sm text-muted-foreground">
                  Tu visita ha sido agendada exitosamente.
                </p>
                <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Matrícula</span>
                    <span className="font-semibold text-primary">{successData.matricula}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fecha</span>
                    <span className="font-semibold text-primary">{successData.scheduled_date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hora</span>
                    <span className="font-semibold text-primary">{successData.scheduled_time.slice(0, 5)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Agente</span>
                    <span className="font-semibold text-primary">{successData.agent.name}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recibirás una confirmación por correo electrónico.
                </p>
              </>
            )}
            <Button variant="gold" className="w-full mt-2" onClick={() => setShowSuccessModal(false)}>
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-background">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary text-center">
              Programa tu visita
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                className="rounded-xl border border-border"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-primary mb-3">Selecciona un horario</p>
              {slotsLoading ? (
                <div className="text-center py-4 text-sm text-foreground/60">
                  Cargando horarios disponibles...
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                        selectedTime === slot
                          ? "bg-champagne text-white shadow-gold"
                          : "bg-muted text-primary hover:bg-champagne/10"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="text-center py-4 text-sm text-foreground/60">
                  No hay horarios disponibles para esta fecha. Por favor selecciona otra.
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-foreground/60">
                  Selecciona una fecha para ver horarios disponibles
                </div>
              )}
            </div>
            {scheduleError && (
              <p className="text-sm text-destructive text-center">{scheduleError}</p>
            )}
            <Button
              variant="gold"
              size="lg"
              className="w-full"
              onClick={handleConfirmAppointment}
              disabled={!selectedDate || !selectedTime || isScheduling || slotsLoading}
            >
              {isScheduling ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Agendando...</>
              ) : (
                "Confirmar Cita"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-2xl rounded-2xl bg-background">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary text-center">
              Recorrido Virtual
            </DialogTitle>
          </DialogHeader>
          <div className="w-full aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${extractYouTubeId(property.videoId)}?autoplay=1`}
              title="Recorrido virtual de la propiedad"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Call Confirmation Modal */}
      <Dialog open={showCallConfirmModal} onOpenChange={setShowCallConfirmModal}>
        <DialogContent className="sm:max-w-sm rounded-2xl bg-background text-center">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <Phone className="w-12 h-12 text-champagne" />
            </div>
            <DialogTitle className="text-xl font-bold text-primary">
              Llamar al Agente
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 pb-2">
            <p className="text-sm text-muted-foreground">
              ¿Deseas llamar al agente al número {property.agent?.phone}?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCallConfirmModal(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white"
                onClick={handleConfirmCall}
              >
                Llamar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetailPage;
