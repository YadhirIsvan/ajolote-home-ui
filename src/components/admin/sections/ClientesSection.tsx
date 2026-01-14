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
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";

interface ClientProperty {
  id: string;
  title: string;
  image: string;
  stage: string;
  documents: string[];
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

const mockClients: Client[] = [
  {
    id: "1",
    name: "María García",
    email: "maria@email.com",
    phone: "+52 55 1234 5678",
    avatar: "MG",
    buyingProperties: [
      { id: "b1", title: "Casa en Polanco", image: property1, stage: "Pre-Aprob", documents: ["INE.pdf", "Comprobante.pdf"] },
    ],
    sellingProperties: [
      { id: "s1", title: "Depto Condesa", image: property2, stage: "Marketing", documents: ["Escrituras.pdf"] },
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
      { id: "s2", title: "Casa en Coyoacán", image: property1, stage: "Evaluación", documents: ["Escrituras.pdf", "Avalúo.pdf"] },
    ],
  },
];

const ClientesSection = () => {
  const isMobile = useIsMobile();
  const [clients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  };

  const PropertyCard = ({ property, stages }: { property: ClientProperty; stages: string[] }) => {
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

          {/* Mini Pipeline */}
          <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {stages.map((stage, idx) => (
              <div 
                key={stage}
                className={cn(
                  "flex-shrink-0 w-2 h-2 rounded-full",
                  idx <= currentStageIndex ? "bg-champagne-gold" : "bg-muted"
                )}
                title={stage}
              />
            ))}
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-midnight">Documentos ({property.documents.length})</p>
            {property.documents.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {property.documents.map((doc, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    {doc}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-foreground/50">Sin documentos</p>
            )}
            <Button variant="outline" size="sm" className="w-full border-dashed border-champagne-gold text-champagne-gold">
              <Plus className="w-3 h-3 mr-1" />
              Subir Documento
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="gold" size="sm" className="flex-1">
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>
            <Button variant="outline" size="sm" className="border-red-200 text-red-500 hover:bg-red-50">
              <Trash2 className="w-3 h-3" />
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
        <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl">
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
                <PropertyCard key={prop.id} property={prop} stages={buyingStages} />
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
                <PropertyCard key={prop.id} property={prop} stages={sellingStages} />
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Directorio de Clientes</h1>
          <p className="text-foreground/60">Perfiles detallados con CRM avanzado</p>
        </div>
        <Button variant="gold" className="gap-2">
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
    </div>
  );
};

export default ClientesSection;
