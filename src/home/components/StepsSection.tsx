import {
  UserPlus,
  CalendarCheck,
  Landmark,
  FileCheck,
  PartyPopper,
} from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Registro",
    subtitle: "Crea tu cuenta y dinos qué buscas.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: CalendarCheck,
    title: "Visita",
    subtitle: "Agenda una visita guiada a tu ritmo.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Landmark,
    title: "Financiamiento",
    subtitle: "Pre-aprobación en minutos, sin papeleo.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: FileCheck,
    title: "Validación Legal",
    subtitle: "Verificamos que todo esté en regla.",
    color: "from-violet-400 to-purple-500",
  },
  {
    icon: PartyPopper,
    title: "Compra Exitosa",
    subtitle: "Firma y recibe las llaves de tu hogar.",
    color: "from-pink-400 to-rose-500",
  },
];

const StepsSection = () => (
  <section className="py-24 md:py-32 px-6">
    <div className="container mx-auto max-w-5xl">
      <div className="text-center mb-16 md:mb-20">
        <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--champagne-gold))] mb-3 block">
          Cómo funciona
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-midnight leading-tight">
          El Camino Avakanta
        </h2>
        <p className="text-foreground/45 text-base md:text-lg mt-4 max-w-lg mx-auto">
          5 pasos para llegar a las llaves de tu nuevo hogar.
        </p>
      </div>

      <div className="relative">
        <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px border-t-2 border-dashed border-border/40" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-4">
          {STEPS.map((step, index) => (
            <div key={index} className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 group">
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                  <step.icon className="w-6 h-6 text-white" strokeWidth={1.8} />
                </div>
              </div>
              <div className="md:text-center md:mt-5">
                <span className={`text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                  Paso {index + 1}
                </span>
                <h3 className="text-base font-bold text-midnight mt-1">{step.title}</h3>
                <p className="text-sm text-foreground/45 mt-1 leading-relaxed max-w-[180px] md:mx-auto">
                  {step.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default StepsSection;
