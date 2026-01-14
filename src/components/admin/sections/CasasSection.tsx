import { useState } from "react";
import { 
  Home, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Search,
  FileText,
  Eye,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  status: "activa" | "pendiente" | "vendida";
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  agent: string | null;
  documents: string[];
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Casa en Polanco",
    location: "Polanco, CDMX",
    price: "$12,500,000",
    image: property1,
    status: "activa",
    bedrooms: 4,
    bathrooms: 3,
    sqm: 320,
    agent: "Carlos Mendoza",
    documents: ["Escrituras.pdf", "Avaluo.pdf"],
  },
  {
    id: "2",
    title: "Departamento Roma Norte",
    location: "Roma Norte, CDMX",
    price: "$4,800,000",
    image: property2,
    status: "pendiente",
    bedrooms: 2,
    bathrooms: 2,
    sqm: 120,
    agent: null,
    documents: [],
  },
  {
    id: "3",
    title: "Penthouse Santa Fe",
    location: "Santa Fe, CDMX",
    price: "$18,900,000",
    image: property3,
    status: "activa",
    bedrooms: 5,
    bathrooms: 4,
    sqm: 450,
    agent: "Laura Sánchez",
    documents: ["Escrituras.pdf", "Avaluo.pdf", "Planos.pdf"],
  },
];

const CasasSection = () => {
  const isMobile = useIsMobile();
  const [properties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetail = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailOpen(true);
  };

  const statusConfig = {
    activa: { label: "Activa", className: "bg-green-100 text-green-700" },
    pendiente: { label: "Pendiente", className: "bg-orange-100 text-orange-600" },
    vendida: { label: "Vendida", className: "bg-gray-100 text-gray-600" },
  };

  const PropertyDetailContent = () => {
    if (!selectedProperty) return null;
    
    return (
      <div className="space-y-6 p-4">
        <img 
          src={selectedProperty.image} 
          alt={selectedProperty.title}
          className="w-full h-48 md:h-64 object-cover rounded-xl"
        />
        
        <div>
          <h3 className="text-xl font-bold text-midnight">{selectedProperty.title}</h3>
          <div className="flex items-center gap-2 text-foreground/60 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{selectedProperty.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-champagne-gold">{selectedProperty.price}</span>
          <Badge className={statusConfig[selectedProperty.status].className}>
            {statusConfig[selectedProperty.status].label}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-xl">
          <div className="text-center">
            <p className="text-lg font-bold text-midnight">{selectedProperty.bedrooms}</p>
            <p className="text-sm text-foreground/60">Recámaras</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-midnight">{selectedProperty.bathrooms}</p>
            <p className="text-sm text-foreground/60">Baños</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-midnight">{selectedProperty.sqm}</p>
            <p className="text-sm text-foreground/60">m²</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-midnight mb-2">Agente Asignado</h4>
          <p className="text-foreground/70">
            {selectedProperty.agent || "Sin asignar"}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-midnight mb-3">Documentos</h4>
          {selectedProperty.documents.length === 0 ? (
            <p className="text-foreground/60 text-sm">No hay documentos</p>
          ) : (
            <div className="space-y-2">
              {selectedProperty.documents.map((doc, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
                >
                  <FileText className="w-5 h-5 text-champagne-gold" />
                  <span className="text-sm text-midnight">{doc}</span>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" className="w-full mt-3 border-dashed border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10">
            <Plus className="w-4 h-4 mr-2" />
            Subir Documento
          </Button>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="gold" className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Gestión de Casas</h1>
          <p className="text-foreground/60">CRUD completo de propiedades</p>
        </div>
        <Button variant="gold" className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Propiedad
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
        <Input
          placeholder="Buscar por nombre o ubicación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 border-border/50"
        />
      </div>

      {/* Properties Grid - Cards on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProperties.map((property) => (
          <Card
            key={property.id}
            className="overflow-hidden border-border/50 hover:border-champagne-gold/50 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => handleViewDetail(property)}
          >
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge
                className={`absolute top-3 right-3 ${statusConfig[property.status].className}`}
              >
                {statusConfig[property.status].label}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-midnight truncate">{property.title}</h3>
              <div className="flex items-center gap-1 text-sm text-foreground/60 mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-champagne-gold">{property.price}</span>
                <Button variant="ghost" size="sm" className="text-champagne-gold">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Detail Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>Detalle de Propiedad</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto">
              <PropertyDetailContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalle de Propiedad</DialogTitle>
            </DialogHeader>
            <PropertyDetailContent />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CasasSection;
