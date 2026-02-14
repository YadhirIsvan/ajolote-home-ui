import { ArrowLeft, ShoppingCart, MapPin, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClientComprasProps {
  onBack: () => void;
}

const mockCompras = [
  {
    id: 1,
    title: "Casa en Polanco",
    address: "Col. Polanco, CDMX",
    price: "$12,500,000",
    progress: 60,
    status: "En proceso",
    agent: "María López",
    steps: [
      { label: "Solicitud enviada", done: true },
      { label: "Documentos verificados", done: true },
      { label: "Crédito aprobado", done: true },
      { label: "Firma de contrato", done: false, current: true },
      { label: "Entrega de llaves", done: false },
    ],
    image: "/placeholder.svg",
    nextAction: "Agendar firma de contrato",
  },
];

const ClientCompras = ({ onBack }: ClientComprasProps) => {
  return (
    <div className="space-y-6">
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
      {mockCompras.map((prop) => (
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
                  <div key={step.label} className="flex items-start gap-3 relative">
                    {/* Connector Line */}
                    {i < prop.steps.length - 1 && (
                      <div className={`absolute left-[11px] top-6 w-0.5 h-8 ${step.done ? "bg-champagne-gold/40" : "bg-border/30"}`} />
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
                    <div className={`pb-6 ${step.current ? "font-semibold text-midnight" : step.done ? "text-foreground/70" : "text-foreground/40"}`}>
                      <span className="text-sm">{step.label}</span>
                      {step.current && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">En curso</span>
                      )}
                    </div>
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
              <Button variant="gold" size="sm">
                Agendar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientCompras;
