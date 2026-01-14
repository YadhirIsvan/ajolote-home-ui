import { useState } from "react";
import { Upload, FileText, Home, Users, ChevronLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import LeadDetailCard from "./LeadDetailCard";
import LeadCard from "./LeadCard";

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
  const isMobile = useIsMobile();

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
      <DialogContent className="sm:max-w-4xl max-h-[95vh] md:max-h-[90vh] p-0 bg-white overflow-hidden">
        {/* Sticky Property Header - Always visible context */}
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

              {/* Property Info Tab */}
              <TabsContent value="info" className="mt-6">
                <div className="space-y-6">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 md:h-64 rounded-2xl object-cover"
                  />
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-midnight">Detalles de la Propiedad</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-foreground/60 text-sm">Precio</span>
                        <span className="font-bold text-champagne-gold">{property.price}</span>
                      </div>
                      <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-foreground/60 text-sm">Ubicación</span>
                        <span className="font-medium text-midnight text-sm text-right max-w-[60%]">{property.location}</span>
                      </div>
                      <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-foreground/60 text-sm">Estado</span>
                        <Badge className="bg-green-100 text-green-700">Activa</Badge>
                      </div>
                      <div className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-foreground/60 text-sm">Leads Activos</span>
                        <span className="font-bold text-midnight">{leads.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Leads Tab - Card-based layout */}
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
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-midnight">Clientes Interesados</h3>
                      <Badge variant="outline" className="border-champagne-gold/30 text-champagne-gold">
                        {leads.length} total
                      </Badge>
                    </div>
                    
                    {/* Lead Cards - Vertical stack for mobile */}
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

              {/* Documents Tab - Expediente de la Propiedad */}
              <TabsContent value="documents" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-midnight">Expediente de la Propiedad</h3>
                  
                  {/* Large Upload Zone with dashed Gold border */}
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
                    <Button 
                      variant="gold" 
                      className="min-h-[52px] px-8 font-semibold gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Subir Archivo
                    </Button>
                  </div>

                  {/* Uploaded Documents List */}
                  <div className="space-y-3">
                    <h4 className="text-base font-semibold text-midnight">Documentos Subidos</h4>
                    {[
                      { name: "Escritura_Casa.pdf", date: "15 Ene 2024", size: "2.4 MB" },
                      { name: "Avaluo_Certificado.pdf", date: "10 Ene 2024", size: "1.8 MB" },
                      { name: "Fotos_Propiedad.zip", date: "08 Ene 2024", size: "15.2 MB" },
                    ].map((doc, index) => (
                      <Card key={index} className="border border-slate-100 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-champagne-gold/10 rounded-xl flex-shrink-0">
                              <FileText className="w-5 h-5 text-champagne-gold" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-midnight text-sm truncate">{doc.name}</p>
                              <p className="text-xs text-foreground/50 mt-0.5">
                                {doc.date} • {doc.size}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="flex-shrink-0 text-xs text-champagne-gold hover:text-champagne-gold-dark">
                              Descargar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
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
