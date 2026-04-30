import {
  ClipboardEdit,
  ShieldCheck,
  Megaphone,
  FileSignature,
} from "lucide-react";

export const SELL_LOCATIONS = [
  "Orizaba",
  "Córdoba",
  "Fortín",
  "Ixtaczoquitlán",
  "Río Blanco",
  "Nogales",
  "Ciudad Mendoza",
  "Otra",
] as const;

export const SELL_STEPS = [
  {
    icon: ClipboardEdit,
    title: "Crea tu anuncio en minutos",
    description: "Sube los datos y ve tu propiedad publicada en tu panel al instante.",
    detail: "Formulario intuitivo. Sin documentos pesados al inicio.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: ShieldCheck,
    title: "Verificación de Luz Verde",
    description: "Validamos legalmente que tu casa esté lista para venderse. Sin sorpresas.",
    detail: "Revisión documental completa por nuestro equipo legal.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Megaphone,
    title: "Marketing de Élite",
    description:
      "Fotografía profesional y exposición directa a compradores que ya tienen crédito aprobado.",
    detail: "Tu propiedad frente a miles de compradores verificados.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: FileSignature,
    title: "Cierre Rápido y Seguro",
    description: "Negociamos, armamos los contratos y te acompañamos a firmar.",
    detail: "Acompañamiento legal de principio a fin.",
    color: "from-violet-400 to-purple-500",
  },
] as const;

export const SELL_FAQS = [
  {
    question: "¿Tiene costo publicar mi propiedad?",
    answer:
      "Absolutamente ninguno. Solo ganamos cuando tú ganas. Nuestro modelo está alineado con tu éxito.",
  },
  {
    question: "¿Cuánto tiempo toma vender?",
    answer:
      "Depende del mercado, pero nuestra estrategia de marketing premium y red de compradores verificados acelera significativamente el proceso.",
  },
  {
    question: "¿Necesito firmar un contrato de exclusividad?",
    answer: "Ofrecemos contratos flexibles adaptados a tus necesidades. Sin letras chiquitas.",
  },
  {
    question: "¿Qué pasa si mi propiedad tiene temas legales?",
    answer:
      "Nuestro equipo legal identifica cualquier situación antes de publicar y te orienta para resolverla rápidamente.",
  },
] as const;

export const SELL_STATS = [
  { value: "500+", label: "Propiedades vendidas" },
  { value: "45", label: "Días promedio de venta" },
  { value: "98%", label: "Clientes satisfechos" },
] as const;
