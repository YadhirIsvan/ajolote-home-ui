import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload, FileText, Home, Users, RefreshCw } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import LeadDetailCard from "@/myAccount/agent/components/LeadDetailCard";
import LeadCard from "@/myAccount/agent/components/LeadCard";
import { getAgentPropertyLeadsAction } from "@/myAccount/agent/actions/get-agent-property-leads.actions";
import type { AgentProperty, AgentLead } from "@/myAccount/agent/types/agent.types";

interface AgentPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: AgentProperty | null;
}

const getStatusBadgeStyles = (displayStatus: string): string => {
  switch (displayStatus) {
    case "registrar_propiedad":
      return "bg-yellow-100 text-yellow-700";
    case "aprobar_estado":
      return "bg-blue-100 text-blue-700";
    case "marketing":
      return "bg-purple-100 text-purple-700";
    case "vendida":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const formatStatusLabel = (displayStatus: string): string => {
  const labels: Record<string, string> = {
    registrar_propiedad: "Registrar Propiedad",
    aprobar_estado: "Aprobar Estado",
    marketing: "Marketing",
    vendida: "Vendida",
  };
  return labels[displayStatus] || displayStatus;
};

const AgentPropertyModal = ({ isOpen, onClose, property }: AgentPropertyModalProps) => {
  const [selectedLead, setSelectedLead] = useState<AgentLead | null>(null);
  const [localLeadUpdates, setLocalLeadUpdates] = useState<Record<number, number>>({});
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();

  const leadsQuery = useQuery({
    queryKey: ["agent-property-leads", property?.id],
    queryFn: () => getAgentPropertyLeadsAction(property!.id),
    enabled: !!property?.id && isOpen,
    staleTime: 0, // Considera datos stale inmediatamente
    refetchInterval: 5000, // Refetch cada 5 segundos
  });

  const leads: AgentLead[] = (leadsQuery.data ?? []).map((lead) =>
    localLeadUpdates[lead.id] !== undefined
      ? { ...lead, stage: localLeadUpdates[lead.id] }
      : lead
  );

  if (!property) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleStageChange = (leadId: number, newStage: number, _note: string) => {
    setLocalLeadUpdates((prev) => ({ ...prev, [leadId]: newStage }));
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] md:max-h-[90vh] p-0 bg-white overflow-hidden">
        {/* Sticky Property Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <img
                src={property.image}
                alt={property.title}
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover flex-shrink-0 border border-slate-100"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-base md:text-lg font-bold text-midnight truncate">
                  {property.title}
                </h2>
                <p className="text-xs md:text-sm text-foreground/60 truncate mt-0.5">
                  {property.location}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge className="bg-green-50 text-green-700 text-[10px] md:text-xs">
                    <Home className="w-3 h-3 mr-1" />
                    Activa
                  </Badge>
                  <Badge className="bg-champagne-gold/10 text-champagne-gold text-[10px] md:text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {leads.length} Leads
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(95vh-100px)] md:h-[calc(90vh-100px)]">
          <div className="p-4 md:p-6">
            <Tabs defaultValue="leads" className="mt-0">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100/80 p-1 rounded-xl">
                <TabsTrigger
                  value="info"
                  className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white text-xs md:text-sm rounded-lg min-h-[40px]"
                >
                  Info
                </TabsTrigger>
                <TabsTrigger
                  value="leads"
                  className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white text-xs md:text-sm rounded-lg min-h-[40px]"
                >
                  Clientes
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white text-xs md:text-sm rounded-lg min-h-[40px]"
                >
                  Expediente
                </TabsTrigger>
              </TabsList>

              {/* Info Tab */}
              <TabsContent value="info" className="mt-6">
                <div className="space-y-6">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 md:h-64 rounded-2xl object-cover"
                  />
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-midnight">
                      Detalles de la Propiedad
                    </h3>
                    <div className="space-y-2">
                      {[
                        { label: "Precio", value: property.price, className: "font-bold text-champagne-gold" },
                        { label: "Ubicación", value: property.location, className: "font-medium text-midnight text-sm text-right max-w-[60%]" },
                        { label: "Estado", value: null },
                        { label: "Leads Activos", value: String(leads.length), className: "font-bold text-midnight" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <span className="text-foreground/60 text-sm">{item.label}</span>
                          {item.label === "Estado" ? (
                            <Badge className={getStatusBadgeStyles(property.displayStatus)}>
                              {formatStatusLabel(property.displayStatus)}
                            </Badge>
                          ) : (
                            <span className={item.className}>{item.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Leads Tab */}
              <TabsContent value="leads" className="mt-6">
                {selectedLead ? (
                  <LeadDetailCard
                    lead={selectedLead}
                    onBack={() => setSelectedLead(null)}
                    onUploadDocs={() => {}}
                    onStageChange={handleStageChange}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-midnight">Clientes Interesados</h3>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="border-champagne-gold/30 text-champagne-gold"
                        >
                          {leads.length} total
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => leadsQuery.refetch()}
                          className="gap-2 border-champagne-gold/30 hover:border-champagne-gold hover:bg-champagne-gold/5"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span className="hidden sm:inline">Actualizar</span>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {leads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onClick={() => setSelectedLead(lead)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-midnight">Expediente de la Propiedad</h3>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${
                      isDragging
                        ? "border-champagne-gold bg-champagne-gold/5"
                        : "border-champagne-gold/50 hover:border-champagne-gold bg-champagne-gold/[0.02]"
                    }`}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-champagne-gold/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-champagne-gold" />
                    </div>
                    <h4 className="text-base font-semibold text-midnight mb-2">
                      Arrastra documentos aquí
                    </h4>
                    <p className="text-sm text-foreground/60 mb-5">
                      Escrituras, avalúos, fotos y más
                    </p>
                    <Button variant="gold" className="min-h-[52px] px-8 font-semibold gap-2">
                      <Upload className="w-5 h-5" />
                      Subir Archivo
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-base font-semibold text-midnight">Documentos Subidos</h4>
                    <p className="text-sm text-foreground/50 text-center py-4">Sin documentos subidos</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AgentPropertyModal;
