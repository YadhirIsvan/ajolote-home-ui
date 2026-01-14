import { useState } from "react";
import { X, Upload, User, Phone, Mail, Calendar, FileText, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SalesPipeline from "./SalesPipeline";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: number;
  lastContact: string;
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
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos@email.com",
    phone: "+52 55 8765 4321",
    stage: 2,
    lastContact: "Hace 1 semana",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana@email.com",
    phone: "+52 55 1111 2222",
    stage: 6,
    lastContact: "Ayer",
  },
];

const AgentPropertyModal = ({ isOpen, onClose, property }: AgentPropertyModalProps) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
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
    // Handle file upload logic here
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-midnight flex items-center gap-4">
            <img
              src={property.image}
              alt={property.title}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <span>{property.title}</span>
              <p className="text-sm font-normal text-foreground/60">{property.location}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30">
            <TabsTrigger value="info" className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white">
              Información
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white">
              Leads & Pipeline
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white">
              Documentos
            </TabsTrigger>
          </TabsList>

          {/* Property Info Tab */}
          <TabsContent value="info" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-64 rounded-2xl object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-midnight mb-2">Detalles</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="text-foreground/60">Precio</span>
                      <span className="font-semibold text-champagne-gold">{property.price}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="text-foreground/60">Ubicación</span>
                      <span className="font-medium text-midnight">{property.location}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="text-foreground/60">Estado</span>
                      <Badge className="bg-green-100 text-green-700">Activa</Badge>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="text-foreground/60">Leads Activos</span>
                      <span className="font-medium text-midnight">{mockLeads.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Leads & Pipeline Tab */}
          <TabsContent value="leads" className="mt-6 space-y-6">
            {selectedLead ? (
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLead(null)}
                  className="text-foreground/60"
                >
                  ← Volver a leads
                </Button>

                <Card className="border-champagne-gold/30 bg-gradient-to-br from-champagne-gold/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                        <User className="w-8 h-8 text-champagne-gold" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-midnight">{selectedLead.name}</h3>
                        <p className="text-foreground/60">{selectedLead.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <Button variant="gold" className="gap-2">
                        <Phone className="w-4 h-4" />
                        Llamar
                      </Button>
                      <Button variant="outline" className="gap-2 border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-white">
                        <Mail className="w-4 h-4" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h4 className="text-lg font-semibold text-midnight mb-4">Pipeline de Venta</h4>
                  <SalesPipeline currentStage={selectedLead.stage} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-midnight">Leads Interesados</h3>
                {mockLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="cursor-pointer hover:border-champagne-gold/50 hover:shadow-md transition-all"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-champagne-gold/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-champagne-gold" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-midnight">{lead.name}</h4>
                            <p className="text-sm text-foreground/60">{lead.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
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
                            <p className="text-xs text-foreground/50 mt-1">{lead.lastContact}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-foreground/40" />
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
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  isDragging
                    ? "border-champagne-gold bg-champagne-gold/5"
                    : "border-border/50 hover:border-champagne-gold/50"
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-champagne-gold/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-champagne-gold" />
                </div>
                <h3 className="text-lg font-semibold text-midnight mb-2">
                  Arrastra documentos aquí
                </h3>
                <p className="text-foreground/60 mb-4">
                  O haz clic para seleccionar archivos
                </p>
                <Button variant="gold">Seleccionar Archivos</Button>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-midnight">Documentos Subidos</h3>
                {[
                  { name: "Escritura_Casa.pdf", date: "15 Ene 2024", size: "2.4 MB" },
                  { name: "Avaluo_Certificado.pdf", date: "10 Ene 2024", size: "1.8 MB" },
                  { name: "Fotos_Propiedad.zip", date: "08 Ene 2024", size: "15.2 MB" },
                ].map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-champagne-gold/10 rounded-lg">
                        <FileText className="w-5 h-5 text-champagne-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-midnight">{doc.name}</p>
                        <p className="text-sm text-foreground/60">
                          {doc.date} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Descargar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AgentPropertyModal;
