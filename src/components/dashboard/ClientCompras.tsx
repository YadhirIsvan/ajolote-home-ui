import { useState, useRef } from "react";
import { ArrowLeft, MapPin, CheckCircle2, Clock, AlertCircle, Upload, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClientComprasProps {
  onBack: () => void;
}

interface Step {
  label: string;
  done: boolean;
  current?: boolean;
  allowUpload?: boolean;
}

const mockCompras = [
  {
    id: 1,
    title: "Casa en Polanco",
    address: "Col. Polanco, CDMX",
    price: "$12,500,000",
    progress: 50,
    status: "En proceso",
    agent: "María López",
    steps: [
      { label: "Solicitud enviada", done: true },
      { label: "Visita", done: true },
      { label: "Documentos verificados", done: false, current: true, allowUpload: true },
      { label: "Crédito aprobado", done: false },
      { label: "Firma de contrato", done: false },
      { label: "Entrega de llaves", done: false },
    ] as Step[],
    image: "/placeholder.svg",
    nextAction: "Subir documentos",
  },
];

const ClientCompras = ({ onBack }: ClientComprasProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<Record<number, string[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePropertyId, setActivePropertyId] = useState<number | null>(null);

  const handleFileUpload = (propertyId: number, files: FileList | null) => {
    if (!files) return;
    const newNames = Array.from(files).map((f) => f.name);
    setUploadedFiles((prev) => ({
      ...prev,
      [propertyId]: [...(prev[propertyId] || []), ...newNames],
    }));
  };

  const triggerUpload = (propertyId: number) => {
    setActivePropertyId(propertyId);
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          if (activePropertyId !== null) {
            handleFileUpload(activePropertyId, e.target.files);
            e.target.value = "";
          }
        }}
      />

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-foreground/60 hover:text-champagne-gold transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al Dashboard
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-midnight">Proceso de Compra</h1>
        <p className="text-sm text-foreground/60 mt-1">{mockCompras.length} propiedad en proceso</p>
      </div>

      {/* Property Cards */}
      {mockCompras.map((prop) => {
        const files = uploadedFiles[prop.id] || [];
        const currentStep = prop.steps.find((s) => s.current);
        const showUploadAction = currentStep?.allowUpload;

        return (
          <Card key={prop.id} className="border border-border/20 bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {/* Top Section */}
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-56 h-44 sm:h-auto bg-muted/30 relative flex-shrink-0">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                  <Badge className="absolute top-3 left-3 bg-champagne-gold text-white text-xs">
                    {prop.status}
                  </Badge>
                </div>

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-midnight">{prop.title}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-foreground/50 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {prop.address}
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-champagne-gold">{prop.price}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-sm text-foreground/60">
                    <span>Agente asignado:</span>
                    <span className="font-medium text-midnight">{prop.agent}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-midnight">Progreso general</span>
                      <span className="text-sm font-bold text-champagne-gold">{prop.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-champagne-gold to-champagne-gold-dark rounded-full transition-all"
                        style={{ width: `${prop.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps Timeline */}
              <div className="px-6 py-5 border-t border-border/10">
                <h4 className="text-sm font-semibold text-midnight mb-4">Etapas del proceso</h4>
                <div className="space-y-0">
                  {prop.steps.map((step, i) => (
                    <div key={step.label}>
                      <div className="flex items-start gap-3 relative">
                        {/* Connector Line */}
                        {i < prop.steps.length - 1 && (
                          <div
                            className={`absolute left-[11px] top-6 w-0.5 ${step.done ? "bg-champagne-gold/40" : "bg-border/30"}`}
                            style={{ height: step.current && step.allowUpload && files.length > 0 ? `${32 + files.length * 28 + 16}px` : "32px" }}
                          />
                        )}
                        {/* Icon */}
                        <div className="mt-0.5 flex-shrink-0">
                          {step.done ? (
                            <CheckCircle2 className="w-[22px] h-[22px] text-champagne-gold" />
                          ) : step.current ? (
                            <Clock className="w-[22px] h-[22px] text-amber-500 animate-pulse" />
                          ) : (
                            <div className="w-[22px] h-[22px] rounded-full border-2 border-border/30" />
                          )}
                        </div>
                        {/* Label */}
                        <div className={`${step.current && step.allowUpload && files.length > 0 ? "pb-2" : "pb-6"} ${step.current ? "font-semibold text-midnight" : step.done ? "text-foreground/70" : "text-foreground/40"}`}>
                          <span className="text-sm">{step.label}</span>
                          {step.current && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">En curso</span>
                          )}
                        </div>
                      </div>

                      {/* Uploaded files subsection */}
                      {step.current && step.allowUpload && files.length > 0 && (
                        <div className="ml-[35px] pb-4 space-y-1.5">
                          {files.map((name, fi) => (
                            <div key={fi} className="flex items-center gap-2 text-xs text-foreground/60 bg-muted/20 rounded-lg px-3 py-1.5">
                              <FileText className="w-3.5 h-3.5 text-champagne-gold flex-shrink-0" />
                              <span className="truncate">{name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Action */}
              <div className="px-6 py-4 bg-champagne-gold/5 border-t border-champagne-gold/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-champagne-gold" />
                  <span className="text-foreground/70">Siguiente paso:</span>
                  <span className="font-semibold text-midnight">{prop.nextAction}</span>
                </div>
                {showUploadAction ? (
                  <Button variant="gold" size="sm" onClick={() => triggerUpload(prop.id)}>
                    <Upload className="w-4 h-4 mr-1" />
                    Subir documentos
                  </Button>
                ) : (
                  <Button variant="gold" size="sm">
                    Agendar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ClientCompras;
