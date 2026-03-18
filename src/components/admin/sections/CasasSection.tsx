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
  X,
  Upload,
  Bath,
  BedDouble,
  Maximize,
  Save,
  Camera
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/shared/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

interface PropertyDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
}

interface Property {
  id: string;
  title: string;
  location: string;
  address: string;
  price: string;
  image: string;
  status: "activa" | "pendiente" | "vendida";
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  agent: string | null;
  documents: PropertyDocument[];
  description: string;
  yearBuilt: number;
  parkingSpots: number;
  features: string[];
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Casa en Polanco",
    location: "Polanco, CDMX",
    address: "Av. Presidente Masaryk 123, Polanco V Sección",
    price: "12500000",
    image: property1,
    status: "activa",
    bedrooms: 4,
    bathrooms: 3,
    sqm: 320,
    agent: "Carlos Mendoza",
    documents: [
      { id: "d1", name: "Escrituras.pdf", type: "legal", uploadedAt: "2026-01-10" },
      { id: "d2", name: "Avaluo_2026.pdf", type: "avaluo", uploadedAt: "2026-01-12" },
    ],
    description: "Hermosa casa con acabados de lujo en una de las zonas más exclusivas de la ciudad.",
    yearBuilt: 2020,
    parkingSpots: 3,
    features: ["Jardín", "Alberca", "Gym", "Bodega"],
  },
  {
    id: "2",
    title: "Departamento Roma Norte",
    location: "Roma Norte, CDMX",
    address: "Calle Durango 45, Roma Norte",
    price: "4800000",
    image: property2,
    status: "pendiente",
    bedrooms: 2,
    bathrooms: 2,
    sqm: 120,
    agent: null,
    documents: [],
    description: "Moderno departamento en el corazón de la Roma Norte.",
    yearBuilt: 2022,
    parkingSpots: 1,
    features: ["Roof Garden", "Gym"],
  },
  {
    id: "3",
    title: "Penthouse Santa Fe",
    location: "Santa Fe, CDMX",
    address: "Av. Santa Fe 500, Col. Santa Fe",
    price: "18900000",
    image: property3,
    status: "activa",
    bedrooms: 5,
    bathrooms: 4,
    sqm: 450,
    agent: "Laura Sánchez",
    documents: [
      { id: "d3", name: "Escrituras.pdf", type: "legal", uploadedAt: "2026-01-05" },
      { id: "d4", name: "Avaluo.pdf", type: "avaluo", uploadedAt: "2026-01-08" },
      { id: "d5", name: "Planos_Arquitectonicos.pdf", type: "planos", uploadedAt: "2026-01-09" },
    ],
    description: "Espectacular penthouse con vista panorámica a la ciudad.",
    yearBuilt: 2023,
    parkingSpots: 4,
    features: ["Terraza", "Alberca Privada", "Jacuzzi", "Cine"],
  },
];

const emptyProperty: Omit<Property, "id" | "documents"> = {
  title: "",
  location: "",
  address: "",
  price: "",
  image: property1,
  status: "pendiente",
  bedrooms: 1,
  bathrooms: 1,
  sqm: 0,
  agent: null,
  description: "",
  yearBuilt: new Date().getFullYear(),
  parkingSpots: 1,
  features: [],
};

const CasasSection = () => {
  const isMobile = useIsMobile();
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Property, "id" | "documents">>(emptyProperty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetail = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyProperty);
    setIsFormOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingId(property.id);
    setFormData({
      title: property.title,
      location: property.location,
      address: property.address,
      price: property.price,
      image: property.image,
      status: property.status,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqm: property.sqm,
      agent: property.agent,
      description: property.description,
      yearBuilt: property.yearBuilt,
      parkingSpots: property.parkingSpots,
      features: property.features,
    });
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  const handleSave = () => {
    if (editingId) {
      setProperties(prev => prev.map(p => 
        p.id === editingId 
          ? { ...p, ...formData }
          : p
      ));
      toast.success("Propiedad actualizada correctamente");
    } else {
      const newProperty: Property = {
        id: Date.now().toString(),
        ...formData,
        documents: [],
      };
      setProperties(prev => [...prev, newProperty]);
      toast.success("Propiedad creada correctamente");
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setIsDetailOpen(false);
    toast.success("Propiedad eliminada");
  };

  const handleUploadDocument = (propertyId: string) => {
    const newDoc: PropertyDocument = {
      id: Date.now().toString(),
      name: `Documento_${Date.now()}.pdf`,
      type: "otro",
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    setProperties(prev => prev.map(p => 
      p.id === propertyId 
        ? { ...p, documents: [...p.documents, newDoc] }
        : p
    ));
    if (selectedProperty?.id === propertyId) {
      setSelectedProperty(prev => prev ? { ...prev, documents: [...prev.documents, newDoc] } : null);
    }
    toast.success("Documento subido correctamente");
  };

  const handleDeleteDocument = (propertyId: string, docId: string) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId 
        ? { ...p, documents: p.documents.filter(d => d.id !== docId) }
        : p
    ));
    if (selectedProperty?.id === propertyId) {
      setSelectedProperty(prev => prev ? { ...prev, documents: prev.documents.filter(d => d.id !== docId) } : null);
    }
    toast.success("Documento eliminado");
  };

  const formatPrice = (price: string) => {
    const num = parseInt(price);
    return isNaN(num) ? "$0" : `$${num.toLocaleString("es-MX")}`;
  };

  const statusConfig = {
    activa: { label: "Activa", className: "bg-green-100 text-green-700" },
    pendiente: { label: "Pendiente", className: "bg-orange-100 text-orange-600" },
    vendida: { label: "Vendida", className: "bg-gray-100 text-gray-600" },
  };

  const docTypeConfig: Record<string, { label: string; color: string }> = {
    legal: { label: "Legal", color: "bg-blue-100 text-blue-700" },
    avaluo: { label: "Avalúo", color: "bg-purple-100 text-purple-700" },
    planos: { label: "Planos", color: "bg-green-100 text-green-700" },
    otro: { label: "Otro", color: "bg-gray-100 text-gray-600" },
  };

  const PropertyDetailContent = () => {
    if (!selectedProperty) return null;
    
    return (
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-muted/30 mb-4">
          <TabsTrigger value="info" className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white">
            Información
          </TabsTrigger>
          <TabsTrigger value="docs" className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white">
            Documentos ({selectedProperty.documents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <img 
            src={selectedProperty.image} 
            alt={selectedProperty.title}
            className="w-full h-48 md:h-64 object-cover rounded-xl"
          />
          
          <div>
            <h3 className="text-xl font-bold text-midnight">{selectedProperty.title}</h3>
            <div className="flex items-center gap-2 text-foreground/60 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{selectedProperty.address}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-champagne-gold">{formatPrice(selectedProperty.price)}</span>
            <Badge className={statusConfig[selectedProperty.status].className}>
              {statusConfig[selectedProperty.status].label}
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-3 p-4 bg-muted/20 rounded-xl">
            <div className="text-center">
              <BedDouble className="w-5 h-5 text-champagne-gold mx-auto mb-1" />
              <p className="text-lg font-bold text-midnight">{selectedProperty.bedrooms}</p>
              <p className="text-xs text-foreground/60">Rec.</p>
            </div>
            <div className="text-center">
              <Bath className="w-5 h-5 text-champagne-gold mx-auto mb-1" />
              <p className="text-lg font-bold text-midnight">{selectedProperty.bathrooms}</p>
              <p className="text-xs text-foreground/60">Baños</p>
            </div>
            <div className="text-center">
              <Maximize className="w-5 h-5 text-champagne-gold mx-auto mb-1" />
              <p className="text-lg font-bold text-midnight">{selectedProperty.sqm}</p>
              <p className="text-xs text-foreground/60">m²</p>
            </div>
            <div className="text-center">
              <Home className="w-5 h-5 text-champagne-gold mx-auto mb-1" />
              <p className="text-lg font-bold text-midnight">{selectedProperty.parkingSpots}</p>
              <p className="text-xs text-foreground/60">Estac.</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-midnight mb-2">Descripción</h4>
            <p className="text-foreground/70 text-sm">{selectedProperty.description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-midnight mb-2">Características</h4>
            <div className="flex flex-wrap gap-2">
              {selectedProperty.features.map((feature, idx) => (
                <Badge key={idx} variant="outline" className="border-champagne-gold/50 text-champagne-gold">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-xl">
            <div>
              <p className="text-xs text-foreground/60">Año de Construcción</p>
              <p className="font-medium text-midnight">{selectedProperty.yearBuilt}</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60">Agente Asignado</p>
              <p className="font-medium text-midnight">{selectedProperty.agent || "Sin asignar"}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="gold" className="flex-1" onClick={() => handleEdit(selectedProperty)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              className="border-red-200 text-red-500 hover:bg-red-50"
              onClick={() => handleDelete(selectedProperty.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <div className="space-y-3">
            {selectedProperty.documents.length === 0 ? (
              <div className="text-center py-8 text-foreground/50">
                <FileText className="w-12 h-12 mx-auto mb-3" />
                <p>No hay documentos</p>
              </div>
            ) : (
              selectedProperty.documents.map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-champagne-gold/10">
                      <FileText className="w-5 h-5 text-champagne-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-midnight truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={docTypeConfig[doc.type]?.color || docTypeConfig.otro.color}>
                          {docTypeConfig[doc.type]?.label || "Otro"}
                        </Badge>
                        <span className="text-xs text-foreground/50">{doc.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => handleDeleteDocument(selectedProperty.id, doc.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div 
            className="border-2 border-dashed border-champagne-gold/50 rounded-xl p-8 text-center hover:bg-champagne-gold/5 transition-colors cursor-pointer"
            onClick={() => handleUploadDocument(selectedProperty.id)}
          >
            <Upload className="w-10 h-10 text-champagne-gold mx-auto mb-3" />
            <p className="font-medium text-midnight">Subir Documento</p>
            <p className="text-sm text-foreground/50 mt-1">PDF, JPG o PNG hasta 10MB</p>
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  const FormContent = () => (
    <div className="space-y-5 p-4 overflow-y-auto max-h-[70vh]">
      <div className="space-y-2">
        <Label>Título</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Casa en Polanco"
          className="h-12"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ubicación</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Polanco, CDMX"
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "activa" | "pendiente" | "vendida") => 
              setFormData(prev => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activa">Activa</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="vendida">Vendida</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Dirección Completa</Label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Av. Presidente Masaryk 123"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>Precio (MXN)</Label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          placeholder="12500000"
          className="h-12"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="space-y-2">
          <Label>Recámaras</Label>
          <Input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 1 }))}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label>Baños</Label>
          <Input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 1 }))}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label>m²</Label>
          <Input
            type="number"
            value={formData.sqm}
            onChange={(e) => setFormData(prev => ({ ...prev, sqm: parseInt(e.target.value) || 0 }))}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label>Estac.</Label>
          <Input
            type="number"
            value={formData.parkingSpots}
            onChange={(e) => setFormData(prev => ({ ...prev, parkingSpots: parseInt(e.target.value) || 0 }))}
            className="h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Año de Construcción</Label>
        <Input
          type="number"
          value={formData.yearBuilt}
          onChange={(e) => setFormData(prev => ({ ...prev, yearBuilt: parseInt(e.target.value) || 2020 }))}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>Descripción</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe la propiedad..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Imagen (Simulado)</Label>
        <div className="border-2 border-dashed border-champagne-gold/50 rounded-xl p-6 text-center">
          <Camera className="w-8 h-8 text-champagne-gold mx-auto mb-2" />
          <p className="text-sm text-foreground/60">Click para subir imagen</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Gestión de Casas</h1>
          <p className="text-foreground/60">CRUD completo de propiedades</p>
        </div>
        <Button variant="gold" className="gap-2" onClick={handleCreate}>
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
              {property.documents.length > 0 && (
                <Badge className="absolute top-3 left-3 bg-midnight text-white">
                  <FileText className="w-3 h-3 mr-1" />
                  {property.documents.length}
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-midnight truncate">{property.title}</h3>
              <div className="flex items-center gap-1 text-sm text-foreground/60 mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-foreground/60 mb-3">
                <span>{property.bedrooms} rec</span>
                <span>{property.bathrooms} baños</span>
                <span>{property.sqm} m²</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-champagne-gold">{formatPrice(property.price)}</span>
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
            <div className="overflow-y-auto p-4">
              <PropertyDetailContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalle de Propiedad</DialogTitle>
            </DialogHeader>
            <PropertyDetailContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Create/Edit Form Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DrawerContent className="max-h-[95vh]">
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>{editingId ? "Editar Propiedad" : "Nueva Propiedad"}</DrawerTitle>
            </DrawerHeader>
            <FormContent />
            <DrawerFooter className="border-t border-border/30">
              <Button variant="gold" onClick={handleSave} className="w-full h-12">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Propiedad" : "Nueva Propiedad"}</DialogTitle>
            </DialogHeader>
            <FormContent />
            <DialogFooter className="pt-4 border-t">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button variant="gold" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CasasSection;
