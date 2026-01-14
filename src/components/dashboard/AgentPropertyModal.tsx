import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import LeadDetailCard from "./LeadDetailCard";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: number;
  lastContact: string;
  interestLevel?: "alta" | "media" | "baja";
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
}

interface AgentPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "María García",
    email: "maria@email.com",
    phone: "+52 55 1234 5678",
    stage: 4,
    lastContact: "Hace 2 días",
    interestLevel: "alta",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos@email.com",
    phone: "+52 55 8765 4321",
    stage: 2,
    lastContact: "Hace 1 semana",
    interestLevel: "media",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana@email.com",
    phone: "+52 55 1111 2222",
    stage: 6,
    lastContact: "Ayer",
    interestLevel: "alta",
  },
];

const AgentPropertyModal = ({ isOpen, onClose, property }: AgentPropertyModalProps) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [isDragging, setIsDragging] = useState(false);

  if (!property) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleStageChange = (leadId: string, newStage: number, note: string) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, stage: newStage } : lead))
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
    console.log(`Lead ${leadId} moved to stage ${newStage}. Note: ${note}`);
  };

  const handleUploadDocs = () => {
    // Switch to documents tab
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 bg-white overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-border/30 p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-midnight flex items-center gap-4">
              <img
                src={property.image}
                alt={property.title}
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="block truncate">{property.title}</span>
                <p className="text-sm font-normal text-foreground/60 truncate">{property.location}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="p-4 md:p-6">
            <Tabs defaultValue="leads" className="mt-2">
              <TabsList className="grid w-full grid-cols-3 bg-muted/30 p-1">
                <TabsTrigger value="info" className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white text-xs md:text-sm">
                  Info
                </TabsTrigger>
                <TabsTrigger value="leads" className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white text-xs md:text-sm">
                  Leads
                </TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white text-xs md:text-sm">
                  Docs
                </TabsTrigger>
              </TabsList>

              {/* Property Info Tab */}
              <TabsContent value="info" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 md:h-64 rounded-2xl object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-midnight">Detalles</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-muted/20 rounded-xl">
                        <span className="text-foreground/60">Precio</span>
                        <span className="font-semibold text-champagne-gold">{property.price}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/20 rounded-xl">
                        <span className="text-foreground/60">Ubicación</span>
                        <span className="font-medium text-midnight">{property.location}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/20 rounded-xl">
                        <span className="text-foreground/60">Estado</span>
                        <Badge className="bg-green-100 text-green-700">Activa</Badge>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/20 rounded-xl">
                        <span className="text-foreground/60">Leads Activos</span>
                        <span className="font-medium text-midnight">{leads.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Leads & Pipeline Tab */}
              <TabsContent value="leads" className="mt-6">
                {selectedLead ? (
                  <LeadDetailCard
                    lead={selectedLead}
                    onBack={() => setSelectedLead(null)}
                    onUploadDocs={handleUploadDocs}
                    onStageChange={handleStageChange}
                  />
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-midnight">Leads Interesados</h3>
                    {leads.map((lead) => (
                      <Card
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="cursor-pointer hover:border-champagne-gold/50 hover:shadow-md transition-all active:scale-[0.98]"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-champagne-gold/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold text-champagne-gold">
                                  {lead.name.charAt(0)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-semibold text-midnight truncate">{lead.name}</h4>
                                <p className="text-sm text-foreground/60 truncate">{lead.email}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <Badge
                                className={
                                  lead.stage >= 6
                                    ? "bg-green-100 text-green-700"
                                    : lead.stage >= 4
                                    ? "bg-champagne-gold/20 text-champagne-gold"
                                    : "bg-blue-100 text-blue-700"
                                }
                              >
                                Etapa {lead.stage}/9
                              </Badge>
                              <p className="text-xs text-foreground/50">{lead.lastContact}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-6">
                <div className="space-y-6">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${
                      isDragging
                        ? "border-champagne-gold bg-champagne-gold/5"
                        : "border-border/50 hover:border-champagne-gold/50"
                    }`}
                  >
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-champagne-gold/10 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-champagne-gold" />
                    </div>
                    <h3 className="text-base font-semibold text-midnight mb-2">
                      Arrastra documentos aquí
                    </h3>
                    <p className="text-sm text-foreground/60 mb-4">
                      O haz clic para seleccionar
                    </p>
                    <Button variant="gold" size="sm">Seleccionar Archivos</Button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-midnight">Documentos Subidos</h3>
                    {[
                      { name: "Escritura_Casa.pdf", date: "15 Ene 2024", size: "2.4 MB" },
                      { name: "Avaluo_Certificado.pdf", date: "10 Ene 2024", size: "1.8 MB" },
                      { name: "Fotos_Propiedad.zip", date: "08 Ene 2024", size: "15.2 MB" },
                    ].map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 md:p-4 bg-muted/20 rounded-xl border border-border/30"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-champagne-gold/10 rounded-lg flex-shrink-0">
                            <FileText className="w-4 h-4 text-champagne-gold" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-midnight text-sm truncate">{doc.name}</p>
                            <p className="text-xs text-foreground/60">
                              {doc.date} • {doc.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="flex-shrink-0 text-xs">
                          Descargar
                        </Button>
                      </div>
                    ))}
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
