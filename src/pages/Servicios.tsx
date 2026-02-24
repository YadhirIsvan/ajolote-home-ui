import Navigation from "@/shared/components/custom/Navigation";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, FileText, MessageCircle, Shield } from "lucide-react";

const Servicios = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tuatara via-tuatara-dark to-tuatara">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Centro de Ayuda
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Información importante sobre el proceso de pagos
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-white/95 backdrop-blur-sm shadow-elegant">
          {/* Alert Header */}
          <div className="flex items-start gap-4 mb-8 p-6 bg-ribbon/10 rounded-lg border-l-4 border-ribbon">
            <Clock className="w-8 h-8 text-ribbon flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-ribbon mb-2">
                ⚙️ Razones por las que aún no se aprueba el pago
              </h2>
            </div>
          </div>

          {/* Reasons List */}
          <div className="space-y-6 mb-12">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-flamingo flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">El comprador no terminó la operación.</h3>
                <p className="text-muted-foreground">
                  A veces llenan los datos de la tarjeta, pero no confirman el pago (no dan el último clic o no validan con su banco).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-flamingo flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">El pago está en revisión.</h3>
                <p className="text-muted-foreground mb-2">
                  Las plataformas (como Mercado Pago, Facebook Checkout, etc.) revisan que la tarjeta sea válida, tenga fondos y que no haya riesgo de fraude.
                </p>
                <p className="text-sm text-flamingo font-medium">
                  🔸 Esa revisión puede tardar de unos minutos a varias horas, y en algunos casos hasta 1 o 2 días hábiles.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-flamingo flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">El banco del comprador está demorando la autorización.</h3>
                <p className="text-muted-foreground">
                  Algunas transferencias SPEI o pagos con tarjeta no se reflejan de inmediato, sobre todo si fue fuera de horario bancario o fin de semana.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-flamingo flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">El comprador solo generó la orden, pero aún no pagó.</h3>
                <p className="text-muted-foreground">
                  En muchos casos la plataforma muestra "Cobro pendiente" cuando el comprador solo creó el intento de pago, sin completarlo.
                </p>
              </div>
            </div>
          </div>

          {/* What to Do Section */}
          <div className="bg-gradient-dawn/10 rounded-lg p-6 md:p-8 border-2 border-ribbon/20">
            <h2 className="text-2xl font-bold text-ribbon mb-6 flex items-center gap-3">
              <MessageCircle className="w-7 h-7" />
              🧠 Qué debes hacer tú ahora
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-ribbon flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">✅ No entregues el producto.</h3>
                  <p className="text-muted-foreground">
                    Hasta que veas que el estado cambia de "Pendiente" a "Aprobado" o "Pagado".
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-ribbon flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">✅ Monitorea tu panel o app.</h3>
                  <p className="text-muted-foreground">
                    En cuanto se apruebe, recibirás una notificación oficial dentro de la plataforma (no por correo suelto).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-ribbon flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">✅ Si pasan más de 48 h sin movimiento, escríbele al comprador de forma amable:</h3>
                  <div className="bg-white/80 rounded-lg p-4 mt-3 border-l-4 border-carissma">
                    <p className="text-sm italic">
                      "Hola, parece que tu pago aún no se acreditó. Puedes verificar si tu banco o la plataforma te dio algún aviso de validación o error."
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-ribbon flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">✅ Y si sigue igual, contacta directamente al soporte de la plataforma</h3>
                  <p className="text-muted-foreground">
                    Con el número de operación <span className="font-mono font-semibold text-flamingo">132959855597</span> para que te digan el estado real del pago.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Servicios;
