import { useState, useRef, useCallback, useEffect } from "react";
import {
  Home,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Search,
  Eye,
  Save,
  Camera,
  Building,
  Mountain,
  Store,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Star,
  Loader2,
  Tag,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/shared/components/ui/drawer";
import { useIsMobile } from "@/shared/hooks/use-mobile.hook";
import { toast } from "sonner";
import { formatMoney, formatSqm, parseRawNumber, parseRawDecimal } from "@/shared/utils/format-input";
import {
  getAdminPropertyDetailAction,
  createAdminPropertyAction,
  updateAdminPropertyAction,
  uploadAdminPropertyImagesAction,
  deleteAdminPropertyImageAction,
  type PropertyFormPayload,
} from "@/myAccount/admin/actions/get-admin-properties.actions";
import type {
  AdminProperty,
  AdminPropertyImage,
} from "@/myAccount/admin/types/admin.types";
import { useAdminProperties } from "@/myAccount/admin/hooks/use-admin-properties.admin.hook";
import { getMediaUrl, extractYouTubeId } from "@/myAccount/admin/utils/admin.utils";

// ─── Local types ──────────────────────────────────────────────────────────────

type PropertyType = "casa" | "departamento" | "terreno" | "local";
type PropertyStatus = "pendiente" | "activa" | "vendida";

type ListingType = "sale" | "pending_listing";

interface Property {
  id: string;
  rawId: number;
  title: string;
  type: PropertyType;
  listingType: ListingType;
  address: string;
  price: string;
  image: string;
  status: PropertyStatus;
  agent: string | null;
  submittedAt: string;
  isFeatured: boolean;
}

interface PropertyFormData {
  title: string;
  description: string;
  listing_type: "sale" | "pending_listing";
  status: "disponible" | "vendida";
  property_type: "house" | "apartment" | "land" | "commercial";
  property_condition: "new" | "semi_new" | "used";
  price: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  construction_sqm: string;
  land_sqm: string;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_zip: string;
  state_id: number | "";
  city_id: number | "";
  zone: string;
  video_id: string;
  latitude: string;
  longitude: string;
  is_featured: boolean;
  amenity_ids: number[];
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

const mapPropertyType = (type: string): PropertyType => {
  const m: Record<string, PropertyType> = {
    house: "casa",
    apartment: "departamento",
    land: "terreno",
    commercial: "local",
  };
  return m[type] ?? "casa";
};

const mapPropertyStatus = (p: AdminProperty): PropertyStatus => {
  if (p.status === "vendida") return "vendida";
  if (p.isActive) return "activa";
  return "pendiente";
};

const mapAdminProperty = (p: AdminProperty): Property => ({
  id: String(p.id),
  rawId: p.id,
  title: p.title,
  address: p.address,
  price: p.price,
  image: getMediaUrl(p.image),
  type: mapPropertyType(p.propertyType),
  listingType: (p.listingType === "pending_listing" ? "pending_listing" : "sale") as ListingType,
  status: mapPropertyStatus(p),
  agent: p.agent?.name ?? null,
  submittedAt: p.createdAt.split("T")[0],
  isFeatured: p.isFeatured,
});

// ─── Config ───────────────────────────────────────────────────────────────────

const propertyTypeConfig: Record<PropertyType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  casa: { label: "Casa", icon: Home },
  departamento: { label: "Departamento", icon: Building },
  terreno: { label: "Terreno", icon: Mountain },
  local: { label: "Local", icon: Store },
};

const statusConfig: Record<PropertyStatus, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  activa: { label: "Activa", className: "bg-green-100 text-green-700", icon: CheckCircle },
  pendiente: { label: "Pendiente", className: "bg-orange-100 text-orange-600", icon: Clock },
  vendida: { label: "Vendida", className: "bg-gray-100 text-gray-600", icon: XCircle },
};

const emptyForm: PropertyFormData = {
  title: "",
  description: "",
  listing_type: "sale" as const,
  status: "disponible",
  property_type: "house",
  property_condition: "new",
  price: "",
  bedrooms: 1,
  bathrooms: 1,
  parking_spaces: 1,
  construction_sqm: "",
  land_sqm: "",
  address_street: "",
  address_number: "",
  address_neighborhood: "",
  address_zip: "",
  state_id: "",
  city_id: "",
  zone: "",
  video_id: "",
  latitude: "",
  longitude: "",
  is_featured: false,
  amenity_ids: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

const PropiedadesSection = () => {
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // List state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<PropertyType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"pendiente" | "activa" | "all">("all");
  const [filterListing, setFilterListing] = useState<ListingType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Detail modal
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>(emptyForm);
  const [existingImages, setExistingImages] = useState<AdminPropertyImage[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Cascading cities
  const selectedStateId = formData.state_id !== "" ? (formData.state_id as number) : null;

  const {
    propertiesQuery,
    statesQuery,
    citiesQuery,
    amenitiesQuery,
    deleteMutation,
    toggleFeaturedMutation,
    invalidateProperties,
  } = useAdminProperties({ isFormOpen, selectedStateId });

  // ─── Derived data ────────────────────────────────────────────────────────────

  const properties = (propertiesQuery.data?.results ?? []).map(mapAdminProperty);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || p.type === filterType;
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    const matchesListing = filterListing === "all" || p.listingType === filterListing;
    return matchesSearch && matchesType && matchesStatus && matchesListing;
  });

  const pendingCount = properties.filter(p => p.status === "pendiente").length;
  const activeCount = properties.filter(p => p.status === "activa").length;
  const pendingListingCount = properties.filter(p => p.listingType === "pending_listing").length;
  const saleCount = properties.filter(p => p.listingType === "sale").length;

  // ─── Handlers — list ─────────────────────────────────────────────────────────

  const handleViewDetail = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setExistingImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setIsFormOpen(true);
  };

  const handleEdit = async (property: Property) => {
    setEditingId(property.rawId);
    setFormData(emptyForm);
    setExistingImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setIsLoadingDetail(true);
    setIsFormOpen(true);
    setIsDetailOpen(false);

    try {
      const detail = await getAdminPropertyDetailAction(property.rawId);

      setExistingImages(detail.images ?? []);

      const stateId = detail.city?.stateId ?? "";
      const cityId = detail.city?.id ?? "";

      setFormData({
        title: detail.title ?? "",
        description: detail.description ?? "",
        listing_type: (detail.listingType as "sale" | "pending_listing") ?? "sale",
        status: (detail.status as "disponible" | "vendida") ?? "disponible",
        property_type: (detail.propertyType as "house" | "apartment" | "land" | "commercial") ?? "house",
        property_condition: (detail.propertyCondition as "new" | "semi_new" | "used") ?? "new",
        price: detail.price ?? "",
        bedrooms: detail.bedrooms ?? 1,
        bathrooms: detail.bathrooms ?? 1,
        parking_spaces: detail.parkingSpaces ?? 1,
        construction_sqm: detail.constructionSqm ?? "",
        land_sqm: detail.landSqm ?? "",
        address_street: detail.addressStreet ?? "",
        address_number: detail.addressNumber ?? "",
        address_neighborhood: detail.addressNeighborhood ?? "",
        address_zip: detail.addressZip ?? "",
        state_id: stateId,
        city_id: cityId,
        zone: detail.zone ?? "",
        video_id: detail.videoId ?? "",
        latitude: detail.latitude ?? "",
        longitude: detail.longitude ?? "",
        is_featured: detail.isFeatured ?? false,
        amenity_ids: (detail.amenities ?? []).map((a) => a.id),
      });
    } catch {
      toast.error("Error al cargar el detalle de la propiedad");
      setIsFormOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleDelete = (rawId: number) => {
    deleteMutation.mutate(rawId, { onSuccess: () => setIsDetailOpen(false) });
  };

  const handleToggleFeatured = (rawId: number) => {
    toggleFeaturedMutation.mutate(rawId);
  };

  // ─── Handlers — form ──────────────────────────────────────────────────────────

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setNewImageFiles((prev) => [...prev, ...arr]);
    arr.forEach((file) => {
      const url = URL.createObjectURL(file);
      setNewImagePreviews((prev) => [...prev, url]);
    });
  }, []);

  const handleRemoveNewImage = (index: number) => {
    setNewImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Cleanup object URLs when form closes
  useEffect(() => {
    if (!isFormOpen) {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormOpen]);

  const handleDeleteImage = async (imageId: number) => {
    if (editingId === null) return;
    try {
      await deleteAdminPropertyImageAction(editingId, imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      toast.error("Error al eliminar la imagen");
    }
  };

  const handleDeleteAllImages = async () => {
    if (editingId === null) return;
    try {
      await Promise.all(existingImages.map((img) => deleteAdminPropertyImageAction(editingId, img.id)));
      setExistingImages([]);
    } catch {
      toast.error("Error al eliminar las imágenes");
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("El título es requerido");
      return;
    }

    setIsSaving(true);
    try {
      const payload: PropertyFormPayload = {
        title: formData.title,
        description: formData.description,
        listing_type: formData.listing_type,
        status: formData.status,
        property_type: formData.property_type,
        property_condition: formData.property_condition,
        price: formData.price,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        parking_spaces: formData.parking_spaces,
        construction_sqm: formData.construction_sqm,
        land_sqm: formData.land_sqm,
        address_street: formData.address_street,
        address_number: formData.address_number,
        address_neighborhood: formData.address_neighborhood,
        address_zip: formData.address_zip,
        city: formData.city_id !== "" ? formData.city_id : null,
        zone: formData.zone,
        video_id: extractYouTubeId(formData.video_id),
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        is_featured: formData.is_featured,
        amenity_ids: formData.amenity_ids,
      };

      let propertyId: number;

      if (editingId !== null) {
        const updated = await updateAdminPropertyAction(editingId, payload);
        propertyId = updated.id;
      } else {
        const created = await createAdminPropertyAction(payload);
        propertyId = created.id;
      }

      if (newImageFiles.length > 0) {
        try {
          const hasCover = existingImages.some((img) => img.isCover);
          await uploadAdminPropertyImagesAction(propertyId, newImageFiles, !hasCover);
        } catch {
          toast.error("Propiedad guardada, pero hubo un error al subir las imágenes");
        }
      }

      await invalidateProperties();
      toast.success(editingId !== null ? "Propiedad actualizada" : "Propiedad creada");
      setIsFormOpen(false);
    } catch {
      toast.error("Error al guardar la propiedad");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAmenityToggle = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      amenity_ids: prev.amenity_ids.includes(id)
        ? prev.amenity_ids.filter((aid) => aid !== id)
        : [...prev.amenity_ids, id],
    }));
  };

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state_id: Number(value), city_id: "" }));
  };

  // ─── Sub-components ───────────────────────────────────────────────────────────

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

  const PropertyDetailContent = () => {
    if (!selectedProperty) return null;
    const TypeIcon = propertyTypeConfig[selectedProperty.type].icon;
    const StatusIcon = statusConfig[selectedProperty.status].icon;

    return (
      <div className="space-y-5">
        {selectedProperty.image && (
          <img
            src={selectedProperty.image}
            alt={selectedProperty.title}
            className="w-full h-48 md:h-56 object-cover rounded-xl"
          />
        )}

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
              {selectedProperty.isFeatured && (
                <Badge className="bg-champagne-gold/20 text-champagne-gold-dark">Destacada</Badge>
              )}
            </div>
            <h3 className="text-xl font-bold text-midnight">{selectedProperty.title}</h3>
            {selectedProperty.address && (
              <div className="flex items-center gap-2 text-foreground/60 mt-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{selectedProperty.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-2xl font-bold text-champagne-gold">{selectedProperty.price}</div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl text-sm">
          <div>
            <p className="text-foreground/60">Agente Asignado</p>
            <p className="font-medium text-midnight">{selectedProperty.agent || "Sin asignar"}</p>
          </div>
          <div>
            <p className="text-foreground/60">Fecha Solicitud</p>
            <p className="font-medium text-midnight">{formatDate(selectedProperty.submittedAt)}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="gold"
            className="flex-1"
            onClick={() => handleToggleFeatured(selectedProperty.rawId)}
            disabled={toggleFeaturedMutation.isPending}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {selectedProperty.isFeatured ? "Quitar Destacado" : "Destacar"}
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => handleEdit(selectedProperty)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            className="border-red-200 text-red-500 hover:bg-red-50"
            onClick={() => handleDelete(selectedProperty.rawId)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  const FormContent = () => {
    if (isLoadingDetail) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-champagne-gold" />
        </div>
      );
    }

    const states = statesQuery.data ?? [];
    const cities = citiesQuery.data ?? [];
    const amenities = amenitiesQuery.data ?? [];

    return (
      <div className="space-y-6 p-4 overflow-y-auto max-h-[70vh]">
        {/* ── Información General ── */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">
            Información General
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Ej: Casa en Polanco"
                className="h-11"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Descripción</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe la propiedad..."
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label>Tipo de propiedad</Label>
              <Select
                value={formData.property_type}
                onValueChange={(v) => setFormData((p) => ({ ...p, property_type: v as PropertyFormData["property_type"] }))}
              >
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">Casa</SelectItem>
                  <SelectItem value="apartment">Departamento</SelectItem>
                  <SelectItem value="land">Terreno</SelectItem>
                  <SelectItem value="commercial">Local comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Tipo de listado</Label>
              <Select
                value={formData.listing_type}
                onValueChange={(v) => setFormData((p) => ({ ...p, listing_type: v as "sale" | "pending_listing" }))}
              >
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Venta</SelectItem>
                  <SelectItem value="pending_listing">En listado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Condición</Label>
              <Select
                value={formData.property_condition}
                onValueChange={(v) => setFormData((p) => ({ ...p, property_condition: v as PropertyFormData["property_condition"] }))}
              >
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nueva</SelectItem>
                  <SelectItem value="semi_new">Semi-nueva</SelectItem>
                  <SelectItem value="used">Usada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Estado de la propiedad</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData((p) => ({ ...p, status: v as "disponible" | "vendida" }))}
              >
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="vendida">Vendida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ── Precios y Medidas ── */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">
            Precios y Medidas
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Precio (MXN)</Label>
              <Input
                value={formatMoney(formData.price)}
                onChange={(e) => setFormData((p) => ({ ...p, price: parseRawNumber(e.target.value) }))}
                placeholder="12,500,000"
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label>m² construcción</Label>
              <Input
                value={formatSqm(formData.construction_sqm)}
                onChange={(e) => setFormData((p) => ({ ...p, construction_sqm: parseRawDecimal(e.target.value) }))}
                placeholder="200"
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label>m² terreno</Label>
              <Input
                value={formatSqm(formData.land_sqm)}
                onChange={(e) => setFormData((p) => ({ ...p, land_sqm: parseRawDecimal(e.target.value) }))}
                placeholder="300"
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label>Recámaras</Label>
              <Input
                type="number"
                min={0}
                value={formData.bedrooms}
                onChange={(e) => setFormData((p) => ({ ...p, bedrooms: Number(e.target.value) }))}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label>Baños</Label>
              <Input
                type="number"
                min={0}
                value={formData.bathrooms}
                onChange={(e) => setFormData((p) => ({ ...p, bathrooms: Number(e.target.value) }))}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label>Estacionamientos</Label>
              <Input
                type="number"
                min={0}
                value={formData.parking_spaces}
                onChange={(e) => setFormData((p) => ({ ...p, parking_spaces: Number(e.target.value) }))}
                className="h-11"
              />
            </div>
          </div>
        </div>

        {/* ── Ubicación ── */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">
            Ubicación
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Estado</Label>
              <Select
                value={formData.state_id !== "" ? String(formData.state_id) : ""}
                onValueChange={handleStateChange}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={statesQuery.isLoading ? "Cargando..." : "Seleccionar"} />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Ciudad</Label>
              <Select
                value={formData.city_id !== "" ? String(formData.city_id) : ""}
                onValueChange={(v) => setFormData((p) => ({ ...p, city_id: Number(v) }))}
                disabled={!formData.state_id}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={citiesQuery.isLoading ? "Cargando..." : "Seleccionar"} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Zona</Label>
              <Select
                value={formData.zone}
                onValueChange={(v) => setFormData((p) => ({ ...p, zone: v }))}
              >
                <SelectTrigger className="h-11"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="norte">Norte</SelectItem>
                  <SelectItem value="sur">Sur</SelectItem>
                  <SelectItem value="centro">Centro</SelectItem>
                  <SelectItem value="oriente">Oriente</SelectItem>
                  <SelectItem value="poniente">Poniente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Calle</Label>
              <Input
                value={formData.address_street}
                onChange={(e) => setFormData((p) => ({ ...p, address_street: e.target.value }))}
                placeholder="Av. Presidente Masaryk"
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label>Número</Label>
              <Input
                value={formData.address_number}
                onChange={(e) => setFormData((p) => ({ ...p, address_number: e.target.value }))}
                placeholder="123"
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label>Colonia</Label>
              <Input
                value={formData.address_neighborhood}
                onChange={(e) => setFormData((p) => ({ ...p, address_neighborhood: e.target.value }))}
                placeholder="Polanco"
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label>Código postal</Label>
              <Input
                value={formData.address_zip}
                onChange={(e) => setFormData((p) => ({ ...p, address_zip: e.target.value }))}
                placeholder="11560"
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label>Latitud</Label>
              <Input
                value={formData.latitude}
                onChange={(e) => setFormData((p) => ({ ...p, latitude: e.target.value }))}
                placeholder="18.8500"
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label>Longitud</Label>
              <Input
                value={formData.longitude}
                onChange={(e) => setFormData((p) => ({ ...p, longitude: e.target.value }))}
                placeholder="-97.1000"
                className="h-11"
              />
            </div>
          </div>
        </div>

        {/* ── Extras ── */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">
            Extras
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Video de YouTube</Label>
              <Input
                value={formData.video_id}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, video_id: e.target.value }))
                }
                placeholder="URL o ID del video (ej: https://youtube.com/watch?v=dQw4w9WgXcQ)"
                className="h-11"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData((p) => ({ ...p, is_featured: checked }))}
              />
              <Label htmlFor="is_featured" className="cursor-pointer flex items-center gap-1">
                <Star className="w-4 h-4 text-champagne-gold" />
                Propiedad destacada
              </Label>
            </div>
          </div>
        </div>

        {/* ── Amenidades ── */}
        {amenities.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">
              Amenidades
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <Checkbox
                    checked={formData.amenity_ids.includes(amenity.id)}
                    onCheckedChange={() => handleAmenityToggle(amenity.id)}
                  />
                  <span className="text-sm">{amenity.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── Imágenes ── */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">
            Imágenes
          </h4>

          {/* Existing images (edit mode) */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground/60">Imágenes actuales</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs"
                  onClick={handleDeleteAllImages}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Eliminar todas
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border/50">
                    <img
                      src={getMediaUrl(img.imageUrl)}
                      alt=""
                      className="w-full h-24 object-cover"
                    />
                    {img.isCover && (
                      <Badge className="absolute bottom-1 left-1 text-[10px] bg-champagne-gold text-white px-1 py-0">
                        Portada
                      </Badge>
                    )}
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New images preview */}
          {newImagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {newImagePreviews.map((url, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-champagne-gold/40">
                  <img src={url} alt="" className="w-full h-24 object-cover" />
                  <button
                    onClick={() => handleRemoveNewImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload zone */}
          <div
            className="border-2 border-dashed border-champagne-gold/50 rounded-xl p-6 text-center cursor-pointer hover:bg-champagne-gold/5 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelect(e.dataTransfer.files);
            }}
          >
            <Camera className="w-8 h-8 text-champagne-gold mx-auto mb-2" />
            <p className="text-sm text-foreground/60">
              Click o arrastra imágenes aquí
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
        <Card
          className={`cursor-pointer border-2 transition-all ${filterListing === "pending_listing" ? "border-violet-400 bg-violet-50" : "border-border/50 hover:border-violet-300"}`}
          onClick={() => setFilterListing(filterListing === "pending_listing" ? "all" : "pending_listing")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-100">
              <Tag className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-midnight">{pendingListingCount}</p>
              <p className="text-xs text-foreground/60">Pending Listing</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer border-2 transition-all ${filterListing === "sale" ? "border-blue-400 bg-blue-50" : "border-border/50 hover:border-blue-300"}`}
          onClick={() => setFilterListing(filterListing === "sale" ? "all" : "sale")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-midnight">{saleCount}</p>
              <p className="text-xs text-foreground/60">En Venta</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-champagne-gold/10">
              <Home className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-midnight">{properties.length}</p>
              <p className="text-xs text-foreground/60">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <Input
            placeholder="Buscar por nombre o dirección..."
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
          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">Listado:</Label>
            <Select
              value={filterListing}
              onValueChange={(value: ListingType | "all") => setFilterListing(value)}
            >
              <SelectTrigger className="w-[160px] h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending_listing">Pending Listing</SelectItem>
                <SelectItem value="sale">En Venta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setFilterType("all"); setFilterStatus("all"); setFilterListing("all"); setSearchTerm(""); }}
            className="text-foreground/60"
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Properties Grid */}
      {propertiesQuery.isLoading ? (
        <div className="text-center py-12 text-foreground/50">Cargando propiedades...</div>
      ) : (
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
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-40 md:h-48 bg-muted/30 flex items-center justify-center">
                      <Home className="w-12 h-12 text-foreground/20" />
                    </div>
                  )}
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
                  {property.address && (
                    <div className="flex items-center gap-1 text-sm text-foreground/60 mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{property.address}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-champagne-gold">{property.price}</span>
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
      )}

      {!propertiesQuery.isLoading && filteredProperties.length === 0 && (
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
              {PropertyDetailContent()}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalle de Propiedad</DialogTitle>
            </DialogHeader>
            {PropertyDetailContent()}
          </DialogContent>
        </Dialog>
      )}

      {/* Create/Edit Form Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DrawerContent className="max-h-[95vh]">
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>{editingId !== null ? "Editar Propiedad" : "Nueva Propiedad"}</DrawerTitle>
            </DrawerHeader>
            {FormContent()}
            <DrawerFooter className="border-t border-border/30">
              <Button variant="gold" onClick={handleSave} className="w-full h-12" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingId !== null ? "Editar Propiedad" : "Nueva Propiedad"}</DialogTitle>
            </DialogHeader>
            {FormContent()}
            <DialogFooter className="pt-4 border-t flex-shrink-0">
              <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSaving}>
                Cancelar
              </Button>
              <Button variant="gold" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PropiedadesSection;
