import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/shared/hooks/auth.context";
import { useScrollDirection } from "@/shared/hooks/use-scroll-direction.hook";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetPortal, SheetOverlay } from "@/shared/components/ui/sheet";
import { Calendar } from "@/shared/components/ui/calendar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shared/components/ui/carousel";
import {
  ArrowLeft, Share2, MapPin, BedDouble, Bath, Maximize,
  CircleCheckBig, Play, ChevronDown, ChevronUp,
  GraduationCap, ShoppingBag, Hospital, Train, Loader2,
  Waves, Dumbbell, Shield, ArrowUpDown,
  Car, Leaf, Sun, Bookmark, MessageCircle, Phone, Copy, Mail,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { usePropertyDetail } from "@/buy/hooks/use-property-detail.buy.hook";
import { TIME_SLOTS } from "@/buy/types/property.types";
import AuthModal from "@/auth/components/AuthModal";
import MortgageCallToAction from "@/buy/components/MortgageCallToAction";
import MortgageCalculatorWidget from "@/buy/components/MortgageCalculatorWidget";
import SimilarPropertiesSection from "@/buy/components/SimilarPropertiesSection";
import { useFinancialModal } from "@/shared/hooks/financial-modal.context";

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
  const navVisible = useScrollDirection();

  const [expandMortgage, setExpandMortgage] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
    isScheduling,
    scheduleError,
    isSaved,
    showSaveAuthModal,
    setShowSaveAuthModal,
    handleToggleSave,
    handleSaveAuthSuccess,
    showCallConfirmModal,
    setShowCallConfirmModal,
    handleCallClick,
    handleConfirmCall,
    financialProfile,
    showMortgageCalculator,
  } = usePropertyDetail();

  const { isAuthenticated } = useAuth();

  const lightboxPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + displayImages.length) % displayImages.length);
  }, [lightboxIndex, displayImages.length]);

  const lightboxNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % displayImages.length);
  }, [lightboxIndex, displayImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") lightboxPrev();
      else if (e.key === "ArrowRight") lightboxNext();
      else if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, lightboxPrev, lightboxNext]);

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

  const handleShare = () => setShowShareSheet(true);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
      setShowShareSheet(false);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const shareUrl = window.location.href;
  const shareText = `${property.title} — ${property.price} MXN\n📍 ${property.address}`;

  const shareOptions = [
    {
      label: "WhatsApp",
      bg: "bg-[#25D366]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`, "_blank");
        setShowShareSheet(false);
      },
    },
    {
      label: "Facebook",
      bg: "bg-[#1877F2]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
        setShowShareSheet(false);
      },
    },
    {
      label: "X",
      bg: "bg-black",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
        setShowShareSheet(false);
      },
    },
    {
      label: "Correo",
      bg: "bg-red-500",
      icon: <Mail className="w-7 h-7 text-white" />,
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;
        setShowShareSheet(false);
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Mobile Header — fixed, follows the nav hide/show animation */}
      <header
        className="fixed left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border lg:hidden"
        style={{ top: navVisible ? "4rem" : "0", transition: "top 0.3s ease" }}
      >
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
            <Button variant="ghost" size="icon" className="text-primary" onClick={handleShare}>
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
            <Button variant="ghost" size="icon" className="text-primary" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-14 lg:pt-0 pb-24 lg:pb-16">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start gap-2">
              <h1 className="text-xl font-bold text-primary leading-tight flex-1">{property.title}</h1>
              {property.verified && (
                <div className="flex items-center gap-1 bg-champagne/10 text-champagne px-2 py-1 rounded-full text-xs font-medium shrink-0">
                  <CircleCheckBig className="w-3 h-3" />
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
                    <div
                      className="aspect-[4/3] rounded-2xl overflow-hidden shadow-medium cursor-pointer"
                      onClick={() => setLightboxIndex(index)}
                    >
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
            <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
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
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
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
              <div
                className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-medium cursor-pointer"
                onClick={() => setLightboxIndex(0)}
              >
                <img src={displayImages[0]} alt={property.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              {displayImages.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden shadow-soft cursor-pointer"
                  onClick={() => setLightboxIndex(index + 1)}
                >
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
                        <CircleCheckBig className="w-4 h-4" />
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
                  <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
                    {showFullDescription ? property.description : truncatedDescription}
                  </p>
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="flex items-center gap-1 text-champagne text-sm font-medium mt-2"
                  >
                    {showFullDescription ? (
                      <>Leer menos <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Leer más <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
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
                            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
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

      {/* Confirm call modal */}
      <Dialog open={showCallConfirmModal} onOpenChange={setShowCallConfirmModal}>
        <DialogContent className="sm:max-w-xs rounded-2xl bg-background text-center">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <Phone className="w-12 h-12 text-champagne" />
            </div>
            <DialogTitle className="text-xl font-bold text-primary">
              Llamar al Agente
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Se abrirá la aplicación de llamadas con el número del agente.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowCallConfirmModal(false)}>
              Cancelar
            </Button>
            <Button variant="gold" className="flex-1" onClick={handleConfirmCall}>
              Llamar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
        onLoginSuccess={handleSaveAuthSuccess}
      />

      {/* Diálogo de éxito después de agendar */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-sm rounded-2xl bg-background text-center">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <CircleCheckBig className="w-16 h-16 text-champagne" />
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

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium select-none">
            {lightboxIndex + 1} / {displayImages.length}
          </div>

          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
            className="absolute left-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-champagne text-white transition-all hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <img
            src={displayImages[lightboxIndex]}
            alt={`${property.title} - Vista ${lightboxIndex + 1}`}
            className="max-h-[75vh] max-w-[75vw] object-contain rounded-2xl shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
            className="absolute right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-champagne text-white transition-all hover:scale-110 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Thumbnail strip */}
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {displayImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`w-12 h-8 rounded-lg overflow-hidden transition-all border-2 ${
                  i === lightboxIndex
                    ? "border-champagne scale-110 shadow-gold"
                    : "border-white/20 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Share Bottom Sheet */}
      <Sheet open={showShareSheet} onOpenChange={setShowShareSheet}>
        <SheetPortal>
          <SheetOverlay onClick={() => setShowShareSheet(false)} />
          <div
            className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl shadow-xl
                        data-[state=open]:animate-in data-[state=closed]:animate-out
                        data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom
                        data-[state=closed]:duration-300 data-[state=open]:duration-500"
            data-state={showShareSheet ? "open" : "closed"}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <SheetTitle className="text-center text-base font-semibold px-6 pt-3 pb-4 text-primary">
              Compartir propiedad
            </SheetTitle>

            {/* Property snippet */}
            <div className="mx-4 mb-4 flex items-center gap-3 bg-muted/50 rounded-2xl p-3">
              <img
                src={displayImages[0]}
                alt={property.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary truncate">{property.title}</p>
                <p className="text-sm font-bold text-champagne">{property.price} MXN</p>
                <p className="text-xs text-muted-foreground truncate">{property.address}</p>
              </div>
            </div>

            {/* Copy URL row */}
            <button
              onClick={handleCopyLink}
              className="mx-4 mb-5 flex items-center gap-3 bg-muted/30 border border-border rounded-2xl px-4 py-3 w-[calc(100%-2rem)] hover:bg-muted/50 active:scale-[0.98] transition-all text-left"
            >
              <Copy className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground flex-1 truncate">{shareUrl}</span>
              <span className="text-xs font-semibold text-champagne bg-champagne/10 px-3 py-1.5 rounded-full shrink-0">
                Copiar
              </span>
            </button>

            {/* Share options */}
            <div className="flex gap-5 justify-center px-6 mb-6 overflow-x-auto">
              {shareOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={opt.action}
                  className="flex flex-col items-center gap-2 min-w-[4rem] active:scale-95 transition-transform"
                >
                  <div className={`w-14 h-14 rounded-2xl ${opt.bg} flex items-center justify-center shadow-sm`}>
                    {opt.icon}
                  </div>
                  <span className="text-xs text-muted-foreground">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Cancel */}
            <div className="px-4 pb-10">
              <Button
                variant="outline"
                className="w-full rounded-2xl h-12 text-base font-medium"
                onClick={() => setShowShareSheet(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </SheetPortal>
      </Sheet>

    </div>
  );
};

export default PropertyDetailPage;
