import { useState } from "react";
import { 
  User, 
  Search, 
  Phone, 
  Mail,
  ShoppingCart,
  Home,
  Plus,
  FileText,
  ChevronRight,
  Edit,
  Trash2,
  Save,
  Check,
  Lock,
  Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/shared/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";

interface ClientDocument {
  id: string;
  name: string;
  uploadedAt: string;
}

interface ClientProperty {
  id: string;
  title: string;
  image: string;
  stage: string;
  documents: ClientDocument[];
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  buyingProperties: ClientProperty[];
  sellingProperties: ClientProperty[];
}

const buyingStages = ["Lead", "Visita", "Interés", "Pre-Aprob", "Avalúo", "Crédito", "Docs Finales", "Escrituras", "Cerrado"];
const sellingStages = ["Contacto Inicial", "Evaluación", "Valuación", "Presentación", "Firma Contrato", "Marketing", "Publicación"];

const sellingStagesInfo = [
  { stage: "Contacto Inicial", duration: "1-2 días" },
  { stage: "Evaluación", duration: "2-7 días" },
  { stage: "Valuación", duration: "1-3 días" },
  { stage: "Presentación", duration: "1-2 días" },
  { stage: "Firma Contrato", duration: "1-7 días" },
  { stage: "Marketing", duration: "3-7 días" },
  { stage: "Publicación", duration: "1-2 días" },
];

const mockClients: Client[] = [
  {
    id: "1",
    name: "María García",
    email: "maria@email.com",
    phone: "+52 55 1234 5678",
    avatar: "MG",
    buyingProperties: [
      { id: "b1", title: "Casa en Polanco", image: property1, stage: "Pre-Aprob", documents: [{ id: "d1", name: "INE.pdf", uploadedAt: "2026-01-10" }, { id: "d2", name: "Comprobante.pdf", uploadedAt: "2026-01-11" }] },
    ],
    sellingProperties: [
      { id: "s1", title: "Depto Condesa", image: property2, stage: "Marketing", documents: [{ id: "d3", name: "Escrituras.pdf", uploadedAt: "2026-01-08" }] },
    ],
  },
  {
    id: "2",
    name: "Juan López",
    email: "juan@email.com",
    phone: "+52 55 9876 5432",
    avatar: "JL",
    buyingProperties: [
      { id: "b2", title: "Penthouse Santa Fe", image: property2, stage: "Visita", documents: [] },
    ],
    sellingProperties: [],
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana@email.com",
    phone: "+52 55 5555 1234",
    avatar: "AM",
    buyingProperties: [],
    sellingProperties: [
      { id: "s2", title: "Casa en Coyoacán", image: property1, stage: "Evaluación", documents: [{ id: "d4", name: "Escrituras.pdf", uploadedAt: "2026-01-05" }, { id: "d5", name: "Avalúo.pdf", uploadedAt: "2026-01-07" }] },
    ],
  },
];

const emptyClient: Omit<Client, "id" | "buyingProperties" | "sellingProperties" | "avatar"> = {
  name: "",
  email: "",
  phone: "",
};

const ClientesSection = () => {
  const isMobile = useIsMobile();
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyClient);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyClient);
    setIsFormOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
    });
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  const handleSave = () => {
    if (editingId) {
      setClients(prev => prev.map(c => 
        c.id === editingId ? { ...c, ...formData } : c
      ));
      toast.success("Cliente actualizado");
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        ...formData,
        avatar: formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
        buyingProperties: [],
        sellingProperties: [],
      };
      setClients(prev => [...prev, newClient]);
      toast.success("Cliente creado");
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    setIsDetailOpen(false);
    toast.success("Cliente eliminado");
  };

  const handleChangeStage = (clientId: string, propertyId: string, newStage: string, type: "buying" | "selling") => {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      
      if (type === "buying") {
        return {
          ...c,
          buyingProperties: c.buyingProperties.map(p => 
            p.id === propertyId ? { ...p, stage: newStage } : p
          )
        };
      } else {
        return {
          ...c,
          sellingProperties: c.sellingProperties.map(p => 
            p.id === propertyId ? { ...p, stage: newStage } : p
          )
        };
      }
    }));
    
    if (selectedClient?.id === clientId) {
      setSelectedClient(prev => {
        if (!prev) return null;
        if (type === "buying") {
          return {
            ...prev,
            buyingProperties: prev.buyingProperties.map(p => 
              p.id === propertyId ? { ...p, stage: newStage } : p
            )
          };
        } else {
          return {
            ...prev,
            sellingProperties: prev.sellingProperties.map(p => 
              p.id === propertyId ? { ...p, stage: newStage } : p
            )
          };
        }
      });
    }
    toast.success(`Etapa actualizada a "${newStage}"`);
  };

  const handleUploadDocument = (clientId: string, propertyId: string, type: "buying" | "selling") => {
    const newDoc: ClientDocument = {
      id: Date.now().toString(),
      name: `Documento_${Date.now()}.pdf`,
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      
      if (type === "buying") {
        return {
          ...c,
          buyingProperties: c.buyingProperties.map(p => 
            p.id === propertyId ? { ...p, documents: [...p.documents, newDoc] } : p
          )
        };
      } else {
        return {
          ...c,
          sellingProperties: c.sellingProperties.map(p => 
            p.id === propertyId ? { ...p, documents: [...p.documents, newDoc] } : p
          )
        };
      }
    }));
    
    // Update selected client
    if (selectedClient?.id === clientId) {
      setSelectedClient(prev => {
        if (!prev) return null;
        if (type === "buying") {
          return {
            ...prev,
            buyingProperties: prev.buyingProperties.map(p => 
              p.id === propertyId ? { ...p, documents: [...p.documents, newDoc] } : p
            )
          };
        } else {
          return {
            ...prev,
            sellingProperties: prev.sellingProperties.map(p => 
              p.id === propertyId ? { ...p, documents: [...p.documents, newDoc] } : p
            )
          };
        }
      });
    }
    
    toast.success("Documento subido");
  };

  const handleDeleteDocument = (clientId: string, propertyId: string, docId: string, type: "buying" | "selling") => {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      
      if (type === "buying") {
        return {
          ...c,
          buyingProperties: c.buyingProperties.map(p => 
            p.id === propertyId ? { ...p, documents: p.documents.filter(d => d.id !== docId) } : p
          )
        };
      } else {
        return {
          ...c,
          sellingProperties: c.sellingProperties.map(p => 
            p.id === propertyId ? { ...p, documents: p.documents.filter(d => d.id !== docId) } : p
          )
        };
      }
    }));
    
    if (selectedClient?.id === clientId) {
      setSelectedClient(prev => {
        if (!prev) return null;
        if (type === "buying") {
          return {
            ...prev,
            buyingProperties: prev.buyingProperties.map(p => 
              p.id === propertyId ? { ...p, documents: p.documents.filter(d => d.id !== docId) } : p
            )
          };
        } else {
          return {
            ...prev,
            sellingProperties: prev.sellingProperties.map(p => 
              p.id === propertyId ? { ...p, documents: p.documents.filter(d => d.id !== docId) } : p
            )
          };
        }
      });
    }
    
    toast.success("Documento eliminado");
  };

  const PropertyCard = ({ property, stages, clientId, type }: { property: ClientProperty; stages: string[]; clientId: string; type: "buying" | "selling" }) => {
    const currentStageIndex = stages.indexOf(property.stage);
    
    return (
      <Card className="border-border/30 hover:border-champagne-gold/50 transition-all">
        <CardContent className="p-4">
          <div className="flex gap-4 mb-4">
            <img 
              src={property.image} 
              alt={property.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-midnight truncate">{property.title}</h4>
              <Badge className="bg-champagne-gold/20 text-champagne-gold-dark mt-1">
                {property.stage}
              </Badge>
            </div>
          </div>

          {/* Pipeline Visualization */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-foreground/60">Pipeline</p>
            <div className="space-y-1">
              {stages.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const stageInfo = type === "selling" ? sellingStagesInfo.find(s => s.stage === stage) : null;
                
                return (
                  <div 
                    key={stage}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-xs transition-all cursor-pointer",
                      isCompleted && "bg-green-50 text-green-700",
                      isCurrent && "bg-champagne-gold/20 text-champagne-gold-dark border border-champagne-gold/30",
                      !isCompleted && !isCurrent && "bg-muted/30 text-foreground/50"
                    )}
                    onClick={() => handleChangeStage(clientId, property.id, stage, type)}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3" />
                    ) : isCurrent ? (
                      <div className="w-3 h-3 rounded-full bg-champagne-gold" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    <span className="flex-1">{stage}</span>
                    {stageInfo && <span className="text-foreground/40">{stageInfo.duration}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-midnight">Documentos ({property.documents.length})</p>
            {property.documents.length > 0 ? (
              <div className="space-y-1">
                {property.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-champagne-gold" />
                      <span className="text-xs text-midnight truncate">{doc.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-red-400 hover:text-red-500"
                      onClick={() => handleDeleteDocument(clientId, property.id, doc.id, type)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-foreground/50">Sin documentos</p>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-dashed border-champagne-gold text-champagne-gold"
              onClick={() => handleUploadDocument(clientId, property.id, type)}
            >
              <Upload className="w-3 h-3 mr-1" />
              Subir Documento
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ClientDetailContent = () => {
    if (!selectedClient) return null;

    return (
      <div className="space-y-6">
        {/* Client Header */}
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-champagne-gold flex items-center justify-center text-white text-xl font-bold">
              {selectedClient.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-midnight">{selectedClient.name}</h3>
              <div className="flex items-center gap-2 text-sm text-foreground/60 mt-1">
                <Mail className="w-4 h-4" />
                <span className="truncate">{selectedClient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <Phone className="w-4 h-4" />
                <span>{selectedClient.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(selectedClient)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-400 hover:text-red-500"
              onClick={() => handleDelete(selectedClient.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Properties Tabs */}
        <Tabs defaultValue="buying" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2 bg-muted/30">
            <TabsTrigger 
              value="buying" 
              className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              En Compra ({selectedClient.buyingProperties.length})
            </TabsTrigger>
            <TabsTrigger 
              value="selling" 
              className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white gap-2"
            >
              <Home className="w-4 h-4" />
              En Venta ({selectedClient.sellingProperties.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buying" className="space-y-4 mt-4">
            {selectedClient.buyingProperties.length === 0 ? (
              <div className="text-center py-8 text-foreground/50">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3" />
                <p>No hay propiedades en proceso de compra</p>
              </div>
            ) : (
              selectedClient.buyingProperties.map((prop) => (
                <PropertyCard 
                  key={prop.id} 
                  property={prop} 
                  stages={buyingStages} 
                  clientId={selectedClient.id}
                  type="buying"
                />
              ))
            )}
            <Button variant="outline" className="w-full border-dashed border-champagne-gold text-champagne-gold">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Propiedad en Compra
            </Button>
          </TabsContent>

          <TabsContent value="selling" className="space-y-4 mt-4">
            {selectedClient.sellingProperties.length === 0 ? (
              <div className="text-center py-8 text-foreground/50">
                <Home className="w-12 h-12 mx-auto mb-3" />
                <p>No hay propiedades en proceso de venta</p>
              </div>
            ) : (
              selectedClient.sellingProperties.map((prop) => (
                <PropertyCard 
                  key={prop.id} 
                  property={prop} 
                  stages={sellingStages} 
                  clientId={selectedClient.id}
                  type="selling"
                />
              ))
            )}
            <Button variant="outline" className="w-full border-dashed border-champagne-gold text-champagne-gold">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Propiedad en Venta
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const FormContent = () => (
    <div className="space-y-5 p-4">
      <div className="space-y-2">
        <Label>Nombre Completo</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="María García"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="maria@email.com"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="+52 55 1234 5678"
          className="h-12"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Directorio de Clientes</h1>
          <p className="text-foreground/60">CRM avanzado con pipelines de compra y venta</p>
        </div>
        <Button variant="gold" className="gap-2" onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
        <Input
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 border-border/50"
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <Card 
            key={client.id} 
            className="border-border/50 hover:border-champagne-gold/50 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleClientClick(client)}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-champagne-gold flex items-center justify-center text-white text-xl font-bold">
                  {client.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-midnight truncate">{client.name}</h3>
                  <p className="text-sm text-foreground/60 truncate">{client.email}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-foreground/40" />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <ShoppingCart className="w-4 h-4 text-champagne-gold" />
                  <span className="text-midnight">{client.buyingProperties.length} comprando</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Home className="w-4 h-4 text-champagne-gold" />
                  <span className="text-midnight">{client.sellingProperties.length} vendiendo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client Detail Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>Perfil de Cliente</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto p-4">
              <ClientDetailContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Perfil de Cliente</DialogTitle>
            </DialogHeader>
            <ClientDetailContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Form Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>{editingId ? "Editar Cliente" : "Nuevo Cliente"}</DrawerTitle>
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
            </DialogHeader>
            <FormContent />
            <DialogFooter>
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

export default ClientesSection;
