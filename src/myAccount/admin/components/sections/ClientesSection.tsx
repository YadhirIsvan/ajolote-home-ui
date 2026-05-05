import { useState } from "react";
import type { AdminClient, AdminClientDetail } from "@/myAccount/admin/types/admin.types";
import { useAdminClientes } from "@/myAccount/admin/hooks/use-admin-clientes.admin.hook";
import {
  PURCHASE_PROCESS_STATUS_LABELS,
  PURCHASE_PIPELINE_STAGES,
  SALE_PROCESS_STATUS_LABELS,
  SALE_PIPELINE_STAGES,
} from "@/myAccount/admin/constants/admin.constants";
import { getMediaUrl, getInitials } from "@/myAccount/admin/utils/admin.utils";
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
  Upload,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/shared/components/ui/drawer";
import { useIsMobile } from "@/shared/hooks/use-mobile.hook";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ClientesSection = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const { clientsQuery, clients, detailQuery, clientDetail } = useAdminClientes({
    searchTerm,
    selectedClientId,
    isDetailOpen,
  });

  // ─── handlers ─────────────────────────────────────────────────────────────

  const handleClientClick = (client: AdminClient) => {
    setSelectedClientId(client.id);
    setIsDetailOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", phone: "" });
    setIsFormOpen(true);
  };

  const handleEdit = (client: AdminClientDetail) => {
    setEditingId(client.id);
    setFormData({ name: client.name, email: client.email, phone: client.phone });
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  const handleSave = () => {
    toast.info("Creación/edición de clientes disponible próximamente");
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    toast.info("Eliminación de clientes disponible próximamente");
    setIsDetailOpen(false);
  };

  // ─── avatar render helper ─────────────────────────────────────────────────

  const AvatarCircle = ({ avatar, name, size = "md" }: { avatar: string | null; name: string; size?: "sm" | "md" | "lg" }) => {
    const sizeClasses = { sm: "w-10 h-10 text-sm", md: "w-14 h-14 text-xl", lg: "w-16 h-16 text-xl" };
    const imgUrl = getMediaUrl(avatar);

    if (imgUrl) {
      return (
        <img
          src={imgUrl}
          alt={name}
          className={cn("rounded-full object-cover", sizeClasses[size])}
          loading="lazy"
        />
      );
    }

    return (
      <div className={cn("rounded-full bg-champagne-gold flex items-center justify-center text-white font-bold", sizeClasses[size])}>
        {getInitials(name)}
      </div>
    );
  };

  // ─── pipeline visualization ───────────────────────────────────────────────

  const PipelineSteps = ({ currentStatus, pipeline, labels }: { currentStatus: string; pipeline: string[]; labels: Record<string, string> }) => {
    const currentIdx = pipeline.indexOf(currentStatus);
    const isCancelled = currentStatus === "cancelado";

    return (
      <div className="space-y-1">
        {pipeline.map((status, idx) => {
          const isCompleted = !isCancelled && idx < currentIdx;
          const isCurrent = !isCancelled && idx === currentIdx;

          return (
            <div
              key={status}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg text-xs transition-all",
                isCompleted && "bg-green-50 text-green-700",
                isCurrent && "bg-champagne-gold/20 text-champagne-gold-dark border border-champagne-gold/30",
                !isCompleted && !isCurrent && "bg-muted/30 text-foreground/50"
              )}
            >
              {isCompleted ? (
                <Check className="w-3 h-3" />
              ) : isCurrent ? (
                <div className="w-3 h-3 rounded-full bg-champagne-gold" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
              <span className="flex-1">{labels[status] ?? status}</span>
            </div>
          );
        })}
        {isCancelled && (
          <div className="flex items-center gap-2 p-2 rounded-lg text-xs bg-red-50 text-red-600 border border-red-200">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Cancelado</span>
          </div>
        )}
      </div>
    );
  };

  // ─── detail content ───────────────────────────────────────────────────────

  const ClientDetailContent = () => {
    if (detailQuery.isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-foreground/50">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-champagne-gold" />
          <p>Cargando datos del cliente...</p>
        </div>
      );
    }

    if (!clientDetail) return null;

    return (
      <div className="space-y-6">
        {/* Client Header */}
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
          <div className="flex items-center gap-4">
            <AvatarCircle avatar={clientDetail.avatar} name={clientDetail.name} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-midnight">{clientDetail.name}</h3>
              <div className="flex items-center gap-2 text-sm text-foreground/60 mt-1">
                <Mail className="w-4 h-4" />
                <span className="truncate">{clientDetail.email}</span>
              </div>
              {clientDetail.phone && (
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Phone className="w-4 h-4" />
                  <span>{clientDetail.phone}</span>
                </div>
              )}
              {clientDetail.city && (
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <MapPin className="w-4 h-4" />
                  <span>{clientDetail.city}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(clientDetail)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-400 hover:text-red-500"
              onClick={handleDelete}
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
              En Compra ({clientDetail.purchaseProcesses.length})
            </TabsTrigger>
            <TabsTrigger
              value="selling"
              className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white gap-2"
            >
              <Home className="w-4 h-4" />
              En Venta ({clientDetail.saleProcesses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buying" className="space-y-4 mt-4">
            {clientDetail.purchaseProcesses.length === 0 ? (
              <div className="text-center py-8 text-foreground/50">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3" />
                <p>No hay propiedades en proceso de compra</p>
              </div>
            ) : (
              clientDetail.purchaseProcesses.map((proc) => {
                const propImg = getMediaUrl(proc.property.image);
                return (
                  <Card key={proc.id} className="border-border/30 hover:border-champagne-gold/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex gap-4 mb-4">
                        {propImg ? (
                          <img src={propImg} alt={proc.property.title} className="w-20 h-20 rounded-lg object-cover" loading="lazy" />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                            <Home className="w-8 h-8 text-foreground/30" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-midnight truncate">{proc.property.title}</h4>
                          <Badge className="bg-champagne-gold/20 text-champagne-gold-dark mt-1">
                            {PURCHASE_PROCESS_STATUS_LABELS[proc.status] ?? proc.status}
                          </Badge>
                          <div className="flex items-center gap-1 mt-1 text-xs text-foreground/50">
                            <User className="w-3 h-3" />
                            <span>{proc.agent.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-foreground/60 mb-1">
                          <span>Progreso</span>
                          <span className="font-medium text-midnight">{proc.overallProgress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-champagne-gold transition-all rounded-full"
                            style={{ width: `${proc.overallProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Pipeline */}
                      <div className="space-y-2 mb-3">
                        <p className="text-xs font-medium text-foreground/60">Pipeline</p>
                        <PipelineSteps
                          currentStatus={proc.status}
                          pipeline={PURCHASE_PIPELINE_STAGES}
                          labels={PURCHASE_PROCESS_STATUS_LABELS}
                        />
                      </div>

                      {/* Documents */}
                      {proc.documents && proc.documents.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-midnight">Documentos ({proc.documents.length})</p>
                          <div className="space-y-1">
                            {proc.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
                                <FileText className="w-3 h-3 text-champagne-gold" />
                                <span className="text-xs text-midnight truncate">{doc.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="selling" className="space-y-4 mt-4">
            {clientDetail.saleProcesses.length === 0 ? (
              <div className="text-center py-8 text-foreground/50">
                <Home className="w-12 h-12 mx-auto mb-3" />
                <p>No hay propiedades en proceso de venta</p>
              </div>
            ) : (
              clientDetail.saleProcesses.map((proc) => {
                const propImg = getMediaUrl(proc.property.image);
                return (
                  <Card key={proc.id} className="border-border/30 hover:border-champagne-gold/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex gap-4 mb-4">
                        {propImg ? (
                          <img src={propImg} alt={proc.property.title} className="w-20 h-20 rounded-lg object-cover" loading="lazy" />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                            <Home className="w-8 h-8 text-foreground/30" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-midnight truncate">{proc.property.title}</h4>
                          <Badge className="bg-champagne-gold/20 text-champagne-gold-dark mt-1">
                            {SALE_PROCESS_STATUS_LABELS[proc.status] ?? proc.status}
                          </Badge>
                          <div className="flex items-center gap-1 mt-1 text-xs text-foreground/50">
                            <User className="w-3 h-3" />
                            <span>{proc.agent.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pipeline */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground/60">Pipeline</p>
                        <PipelineSteps
                          currentStatus={proc.status}
                          pipeline={SALE_PIPELINE_STAGES}
                          labels={SALE_PROCESS_STATUS_LABELS}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
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
          placeholder="Maria Garcia"
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
        <Label>Telefono</Label>
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
        {clientsQuery.isLoading && (
          <p className="col-span-3 text-center text-foreground/60 py-8">Cargando clientes...</p>
        )}
        {clients.map((client) => (
          <Card
            key={client.id}
            className="border-border/50 hover:border-champagne-gold/50 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => handleClientClick(client)}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <AvatarCircle avatar={client.avatar} name={client.name} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-midnight truncate">{client.name}</h3>
                  <p className="text-sm text-foreground/60 truncate">{client.email}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-foreground/40" />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <ShoppingCart className="w-4 h-4 text-champagne-gold" />
                  <span className="text-midnight">{client.purchaseProcessesCount} comprando</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Home className="w-4 h-4 text-champagne-gold" />
                  <span className="text-midnight">{client.saleProcessesCount} vendiendo</span>
                </div>
              </div>

              {client.city && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-foreground/50">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{client.city}</span>
                </div>
              )}
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
