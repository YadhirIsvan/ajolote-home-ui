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
  Upload,
  Bath,
  BedDouble,
  Maximize,
  Save,
  Camera,
  Building,
  Mountain,
  Store,
  Filter,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
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

// Types
interface PropertyDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
}

type PropertyType = "casa" | "departamento" | "terreno" | "local";
type PropertyStatus = "pendiente" | "activa" | "vendida";

interface Property {
  id: string;
  title: string;
  type: PropertyType;
  location: string; // municipio
  state: string; // estado
  address: string;
  price: string;
  image: string;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  agent: string | null;
  documents: PropertyDocument[];
  description: string;
  yearBuilt: number;
  parkingSpots: number;
  features: string[];
  submittedAt: string;
}

// Mock data
const mockProperties: Property[] = [
  {
    id: "1",
    title: "Casa en Polanco",
    type: "casa",
    location: "Miguel Hidalgo",
    state: "CDMX",
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
    ],
    description: "Hermosa casa con acabados de lujo en una de las zonas más exclusivas de la ciudad.",
    yearBuilt: 2020,
    parkingSpots: 3,
    features: ["Jardín", "Alberca", "Gym"],
    submittedAt: "2026-01-08",
  },
  {
    id: "2",
    title: "Departamento Roma Norte",
    type: "departamento",
    location: "Cuauhtémoc",
    state: "CDMX",
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
    submittedAt: "2026-01-14",
  },
  {
    id: "3",
    title: "Terreno en Cuernavaca",
    type: "terreno",
    location: "Cuernavaca",
    state: "Morelos",
    address: "Km 85 Carretera México-Cuernavaca",
    price: "3200000",
    image: property3,
    status: "pendiente",
    bedrooms: 0,
    bathrooms: 0,
    sqm: 1500,
    agent: null,
    documents: [],
    description: "Terreno con excelente ubicación y vistas panorámicas.",
    yearBuilt: 0,
    parkingSpots: 0,
    features: ["Vista Panorámica", "Acceso Pavimentado"],
    submittedAt: "2026-01-12",
  },
  {
    id: "4",
    title: "Local Comercial Santa Fe",
    type: "local",
    location: "Cuajimalpa",
    state: "CDMX",
    address: "Centro Comercial Santa Fe, Local 234",
    price: "8500000",
    image: property1,
    status: "activa",
    bedrooms: 0,
    bathrooms: 1,
    sqm: 85,
    agent: "Laura Sánchez",
    documents: [
      { id: "d2", name: "Contrato_Arrendamiento.pdf", type: "legal", uploadedAt: "2026-01-05" },
    ],
    description: "Local comercial en zona de alto tráfico.",
    yearBuilt: 2018,
    parkingSpots: 2,
    features: ["Alto Tráfico", "Seguridad 24/7"],
    submittedAt: "2026-01-02",
  },
];

const emptyProperty: Omit<Property, "id" | "documents" | "submittedAt"> = {
  title: "",
  type: "casa",
  location: "",
  state: "",
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

// Config
const propertyTypeConfig: Record<PropertyType, { label: string; icon: React.ComponentType<any> }> = {
  casa: { label: "Casa", icon: Home },
  departamento: { label: "Departamento", icon: Building },
  terreno: { label: "Terreno", icon: Mountain },
  local: { label: "Local", icon: Store },
};

const statusConfig: Record<PropertyStatus, { label: string; className: string; icon: React.ComponentType<any> }> = {
  activa: { label: "Activa", className: "bg-green-100 text-green-700", icon: CheckCircle },
  pendiente: { label: "Pendiente", className: "bg-orange-100 text-orange-600", icon: Clock },
  vendida: { label: "Vendida", className: "bg-gray-100 text-gray-600", icon: XCircle },
};

const mexicanStates = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "CDMX", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero",
  "Hidalgo", "Jalisco", "Estado de México", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

const PropiedadesSection = () => {
  const isMobile = useIsMobile();
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<PropertyType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"pendiente" | "activa" | "all">("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Property, "id" | "documents" | "submittedAt">>(emptyProperty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || p.type === filterType;
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingCount = properties.filter(p => p.status === "pendiente").length;
  const activeCount = properties.filter(p => p.status === "activa").length;

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
      type: property.type,
      location: property.location,
      state: property.state,
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
        submittedAt: new Date().toISOString().split("T")[0],
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

  const handleActivate = (id: string) => {
    setProperties(prev => prev.map(p => 
      p.id === id ? { ...p, status: "activa" as PropertyStatus } : p
    ));
    if (selectedProperty?.id === id) {
      setSelectedProperty(prev => prev ? { ...prev, status: "activa" } : null);
    }
    toast.success("Propiedad publicada correctamente");
  };

  const formatPrice = (price: string) => {
    const num = parseInt(price);
    return isNaN(num) ? "$0" : `$${num.toLocaleString("es-MX")}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Property Detail Content
  const PropertyDetailContent = () => {
    if (!selectedProperty) return null;
    const TypeIcon = propertyTypeConfig[selectedProperty.type].icon;
    const StatusIcon = statusConfig[selectedProperty.status].icon;
    
    return (
      <div className="space-y-5">
        <img 
          src={selectedProperty.image} 
          alt={selectedProperty.title}
          className="w-full h-48 md:h-56 object-cover rounded-xl"
        />
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="border-champagne-gold/50 text-champagne-gold">
                <TypeIcon className="w-3 h-3 mr-1" />
                {propertyTypeConfig[selectedProperty.type].label}
              </Badge>
              <Badge className={statusConfig[selectedProperty.status].className}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig[selectedProperty.status].label}
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-midnight">{selectedProperty.title}</h3>
            <div className="flex items-center gap-2 text-foreground/60 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{selectedProperty.location}, {selectedProperty.state}</span>
            </div>
          </div>
        </div>

        <div className="text-2xl font-bold text-champagne-gold">
          {formatPrice(selectedProperty.price)}
        </div>

        {selectedProperty.type !== "terreno" && (
          <div className="grid grid-cols-4 gap-3 p-4 bg-muted/30 rounded-xl">
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
        )}

        {selectedProperty.type === "terreno" && (
          <div className="p-4 bg-muted/30 rounded-xl text-center">
            <Maximize className="w-6 h-6 text-champagne-gold mx-auto mb-1" />
            <p className="text-2xl font-bold text-midnight">{selectedProperty.sqm.toLocaleString()}</p>
            <p className="text-sm text-foreground/60">metros cuadrados</p>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-midnight mb-2">Descripción</h4>
          <p className="text-foreground/70 text-sm">{selectedProperty.description}</p>
        </div>

        {selectedProperty.features.length > 0 && (
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
        )}

        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl text-sm">
          <div>
            <p className="text-foreground/60">Agente Asignado</p>
            <p className="font-medium text-midnight">{selectedProperty.agent || "Sin asignar"}</p>
          </div>
          <div>
            <p className="text-foreground/60">Fecha Solicitud</p>
            <p className="font-medium text-midnight">{formatDate(selectedProperty.submittedAt)}</p>
          </div>
          {selectedProperty.yearBuilt > 0 && (
            <div>
              <p className="text-foreground/60">Año Construcción</p>
              <p className="font-medium text-midnight">{selectedProperty.yearBuilt}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          {selectedProperty.status === "pendiente" && (
            <Button 
              variant="gold" 
              className="flex-1" 
              onClick={() => handleActivate(selectedProperty.id)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          )}
          <Button 
            variant={selectedProperty.status === "pendiente" ? "outline" : "gold"}
            className="flex-1" 
            onClick={() => handleEdit(selectedProperty)}
          >
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
      </div>
    );
  };

  // Form Content
  const FormContent = () => (
    <div className="space-y-5 p-4 overflow-y-auto max-h-[70vh]">
      <div className="space-y-2">
        <Label>Título</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Ej: Casa en Polanco"
          className="h-12"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo de Propiedad</Label>
          <Select
            value={formData.type}
            onValueChange={(value: PropertyType) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(propertyTypeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <config.icon className="w-4 h-4" />
                    {config.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select
            value={formData.status}
            onValueChange={(value: PropertyStatus) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="activa">Activa</SelectItem>
              <SelectItem value="vendida">Vendida</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Municipio</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Ej: Miguel Hidalgo"
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select
            value={formData.state}
            onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {mexicanStates.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
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

      <div className="space-y-2">
        <Label>Metros Cuadrados</Label>
        <Input
          type="number"
          value={formData.sqm}
          onChange={(e) => setFormData(prev => ({ ...prev, sqm: parseInt(e.target.value) || 0 }))}
          placeholder="320"
          className="h-12"
        />
      </div>

      {formData.type !== "terreno" && (
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label>Recámaras</Label>
            <Input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>Baños</Label>
            <Input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
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
      )}

      {formData.type !== "terreno" && (
        <div className="space-y-2">
          <Label>Año de Construcción</Label>
          <Input
            type="number"
            value={formData.yearBuilt}
            onChange={(e) => setFormData(prev => ({ ...prev, yearBuilt: parseInt(e.target.value) || 2020 }))}
            className="h-12"
          />
        </div>
      )}

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
        <div className="border-2 border-dashed border-champagne-gold/50 rounded-xl p-6 text-center cursor-pointer hover:bg-champagne-gold/5 transition-colors">
          <Camera className="w-8 h-8 text-champagne-gold mx-auto mb-2" />
          <p className="text-sm text-foreground/60">Click para subir imagen</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Propiedades</h1>
          <p className="text-foreground/60">Gestiona todas las propiedades del sistema</p>
        </div>
        <Button variant="gold" className="gap-2" onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          Nueva Propiedad
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card 
          className={`cursor-pointer border-2 transition-all ${filterStatus === "pendiente" ? "border-orange-400 bg-orange-50" : "border-border/50 hover:border-orange-300"}`}
          onClick={() => setFilterStatus(filterStatus === "pendiente" ? "all" : "pendiente")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-midnight">{pendingCount}</p>
              <p className="text-xs text-foreground/60">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer border-2 transition-all ${filterStatus === "activa" ? "border-green-400 bg-green-50" : "border-border/50 hover:border-green-300"}`}
          onClick={() => setFilterStatus(filterStatus === "activa" ? "all" : "activa")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-midnight">{activeCount}</p>
              <p className="text-xs text-foreground/60">Activas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 md:col-span-2">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-champagne-gold/10">
              <Home className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-midnight">{properties.length}</p>
              <p className="text-xs text-foreground/60">Total Propiedades</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <Input
            placeholder="Buscar por nombre, municipio o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-border/50"
          />
        </div>
        <Button
          variant="outline"
          className={`gap-2 h-12 ${showFilters ? "bg-champagne-gold/10 border-champagne-gold" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">Tipo:</Label>
            <Select
              value={filterType}
              onValueChange={(value: PropertyType | "all") => setFilterType(value)}
            >
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(propertyTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilterType("all");
              setFilterStatus("all");
              setSearchTerm("");
            }}
            className="text-foreground/60"
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProperties.map((property) => {
          const TypeIcon = propertyTypeConfig[property.type].icon;
          const StatusIcon = statusConfig[property.status].icon;
          
          return (
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
                <Badge className={`absolute top-3 right-3 ${statusConfig[property.status].className}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig[property.status].label}
                </Badge>
                <Badge variant="outline" className="absolute top-3 left-3 bg-white/90 border-0">
                  <TypeIcon className="w-3 h-3 mr-1" />
                  {propertyTypeConfig[property.type].label}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-midnight truncate">{property.title}</h3>
                <div className="flex items-center gap-1 text-sm text-foreground/60 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{property.location}, {property.state}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-foreground/60 mb-3">
                  <span>{property.sqm} m²</span>
                  {property.type !== "terreno" && (
                    <>
                      <span>•</span>
                      <span>{property.bedrooms} rec</span>
                      <span>•</span>
                      <span>{property.bathrooms} baños</span>
                    </>
                  )}
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
          );
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
          <p className="text-foreground/50">No se encontraron propiedades</p>
          <Button variant="gold" className="mt-4" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primera Propiedad
          </Button>
        </div>
      )}

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

export default PropiedadesSection;
