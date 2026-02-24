import { ArrowLeft, MapPin, CheckCircle2, Clock, AlertCircle, Upload, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClientCompras } from "@/myAccount/client/hooks/use-client-compras.hook";
import type {
  PropertyBuySummary,
  PropertyFileItem,
  Step,
} from "@/myAccount/client/types/client.types";
import { UseMutationResult } from "@tanstack/react-query";

interface ClientComprasProps {
  onBack: () => void;
}

interface PropertyDetailCardProps {
  prop: PropertyBuySummary;
  files: PropertyFileItem[];
  filesLoading: boolean;
  steps: Step[];
  onUpload: () => void;
  uploadMutation: UseMutationResult<void, Error, { propertyId: number; files: File[] }>;
}

const PropertyDetailCard = ({
  prop,
  files,
  filesLoading,
  steps,
  onUpload,
  uploadMutation,
}: PropertyDetailCardProps) => {
  const docStep = steps.find((s) => s.label === "Documentos verificados");
  const showUploadAction = docStep?.allowUpload;
  const progressNum = parseInt(prop.overallProgress?.replace(/%/g, "") || "0", 10);

  return (
    <Card className="border border-border/20 bg-white rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-56 h-44 sm:h-auto bg-muted/30 relative flex-shrink-0">
            <img
              src={prop.image || "/placeholder.svg"}
              alt={prop.title}
              className="w-full h-full object-cover"
            />
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
              <span className="font-medium text-midnight">{prop.agent_name}</span>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-midnight">Progreso general</span>
                <span className="text-sm font-bold text-champagne-gold">
                  {prop.overallProgress}
                </span>
              </div>
              <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-champagne-gold to-champagne-gold-dark rounded-full transition-all"
                  style={{ width: `${progressNum}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-border/10">
          <h4 className="text-sm font-semibold text-midnight mb-4">Etapas del proceso</h4>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.label}>
                <div className="flex items-start gap-3 relative">
                  {i < steps.length - 1 && (
                    <div
                      className={`absolute left-[11px] top-6 w-0.5 ${
                        step.done ? "bg-champagne-gold/40" : "bg-border/30"
                      }`}
                      style={{
                        height:
                          step.current && step.allowUpload && (files.length > 0 || filesLoading)
                            ? `${32 + Math.max(files.length, 1) * 28 + 16}px`
                            : "32px",
                      }}
                    />
                  )}
                  <div className="mt-0.5 flex-shrink-0">
                    {step.done ? (
                      <CheckCircle2 className="w-[22px] h-[22px] text-champagne-gold" />
                    ) : step.current ? (
                      <Clock className="w-[22px] h-[22px] text-amber-500 animate-pulse" />
                    ) : (
                      <div className="w-[22px] h-[22px] rounded-full border-2 border-border/30" />
                    )}
                  </div>
                  <div
                    className={`${
                      step.current && step.allowUpload && (files.length > 0 || filesLoading)
                        ? "pb-2"
                        : "pb-6"
                    } ${
                      step.current
                        ? "font-semibold text-midnight"
                        : step.done
                        ? "text-foreground/70"
                        : "text-foreground/40"
                    }`}
                  >
                    <span className="text-sm">{step.label}</span>
                    {step.current && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        En curso
                      </span>
                    )}
                  </div>
                </div>
                {step.current && step.allowUpload && (
                  <div className="ml-[35px] pb-4 space-y-1.5">
                    {filesLoading ? (
                      <div className="text-xs text-foreground/50">Cargando documentos...</div>
                    ) : files.length > 0 ? (
                      files.map((f, fi) => (
                        <div
                          key={fi}
                          className="flex items-center gap-2 text-xs text-foreground/60 bg-muted/20 rounded-lg px-3 py-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-champagne-gold flex-shrink-0" />
                          <span className="truncate">{f.name}</span>
                          <span className="text-foreground/40">
                            ({(f.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ))
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-champagne-gold/5 border-t border-champagne-gold/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-champagne-gold" />
            <span className="text-foreground/70">Siguiente paso:</span>
            <span className="font-semibold text-midnight">
              {showUploadAction ? "Subir documentos" : "Agendar"}
            </span>
          </div>
          {showUploadAction ? (
            <Button
              variant="gold"
              size="sm"
              onClick={onUpload}
              disabled={uploadMutation.isPending}
            >
              <Upload className="w-4 h-4 mr-1" />
              {uploadMutation.isPending ? "Subiendo..." : "Subir documentos"}
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
};

const ClientCompras = ({ onBack }: ClientComprasProps) => {
  const {
    comprasList,
    comprasLoading,
    selectedPropertyId,
    setSelectedPropertyId,
    singleProperty,
    viewingDetailId,
    viewingProperty,
    displayList,
    filesData,
    filesLoading,
    uploadMutation,
    fileInputRef,
    activePropertyId,
    setActivePropertyId,
    handleFileSelect,
    triggerUpload,
    buildStepsFromProgress,
  } = useClientCompras();

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
            handleFileSelect(activePropertyId, e.target.files);
            setActivePropertyId(null);
          }
        }}
      />

      {/* Back */}
      <button
        onClick={() =>
          viewingDetailId && comprasList.length > 1
            ? setSelectedPropertyId(null)
            : onBack()
        }
        className="flex items-center gap-2 text-sm text-foreground/60 hover:text-champagne-gold transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {viewingDetailId && comprasList.length > 1
          ? "Volver a lista"
          : "Volver al Dashboard"}
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-midnight">Proceso de Compra</h1>
        <p className="text-sm text-foreground/60 mt-1">
          {comprasLoading ? "Cargando..." : `${comprasList.length} propiedad(es) en proceso`}
        </p>
      </div>

      {comprasLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : comprasList.length === 0 ? (
        <p className="text-muted-foreground">No tienes compras en proceso</p>
      ) : comprasList.length === 1 && singleProperty ? (
        <PropertyDetailCard
          prop={singleProperty}
          files={filesData}
          filesLoading={filesLoading}
          steps={buildStepsFromProgress(singleProperty.overallProgress)}
          onUpload={() => triggerUpload(singleProperty.id)}
          uploadMutation={uploadMutation}
        />
      ) : viewingDetailId && viewingProperty ? (
        <PropertyDetailCard
          prop={viewingProperty}
          files={filesData}
          filesLoading={filesLoading}
          steps={buildStepsFromProgress(viewingProperty.overallProgress)}
          onUpload={() => triggerUpload(viewingProperty.id)}
          uploadMutation={uploadMutation}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayList.map((prop) => (
            <Card
              key={prop.id}
              className="border border-border/20 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPropertyId(prop.id)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-40 sm:h-auto bg-muted/30 relative flex-shrink-0">
                    <img
                      src={prop.image || "/placeholder.svg"}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-champagne-gold text-white text-xs">
                      {prop.status}
                    </Badge>
                  </div>
                  <div className="flex-1 p-5">
                    <h3 className="text-lg font-semibold text-midnight">{prop.title}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-foreground/50 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {prop.address}
                    </div>
                    <p className="text-xl font-bold text-champagne-gold mt-2">{prop.price}</p>
                    <p className="text-sm text-foreground/60 mt-1">
                      Agente: {prop.agent_name}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-champagne-gold rounded-full"
                          style={{ width: prop.overallProgress || "0%" }}
                        />
                      </div>
                      <span className="text-xs font-medium">{prop.overallProgress}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientCompras;
