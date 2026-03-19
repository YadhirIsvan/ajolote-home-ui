export type AdminTab =
  | "propiedades"
  | "agentes"
  | "citas"
  | "asignar"
  | "asignar-ventas"
  | "clientes"
  | "kanban"
  | "kanban-ventas"
  | "historial"
  | "insights";

export type AdminSection =
  | "dashboard"
  | "casas"
  | "agentes"
  | "citas"
  | "config-citas"
  | "asignar"
  | "clientes"
  | "kanban";

// ─── Paginated wrapper ───────────────────────────────────────────────────────
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── Propiedades ─────────────────────────────────────────────────────────────
export interface AdminProperty {
  id: number;
  title: string;
  address: string;
  price: string;
  currency: string;
  propertyType: string;
  listingType: string;
  status: string;
  isFeatured: boolean;
  isVerified: boolean;
  isActive: boolean;
  image: string | null;
  agent: { id: number; name: string } | null;
  documentsCount: number;
  createdAt: string;
}

export interface AdminPropertyImage {
  id: number;
  imageUrl: string;
  isCover: boolean;
  sortOrder: number;
}

export interface AdminPropertyDetail extends AdminProperty {
  description: string;
  propertyCondition: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  constructionSqm: string;
  landSqm: string;
  addressStreet: string;
  addressNumber: string;
  addressNeighborhood: string;
  addressZip: string;
  city: { id: number; name: string; stateId: number } | null;
  zone: string;
  videoId: string;
  latitude: string;
  longitude: string;
  images: AdminPropertyImage[];
  amenities: { id: number; name: string; icon: string }[];
}

export interface CatalogState {
  id: number;
  name: string;
  code: string;
  countryId: number;
}

export interface CatalogCity {
  id: number;
  name: string;
  stateId: number;
}

export interface CatalogAmenity {
  id: number;
  name: string;
  icon: string;
}

// ─── Agentes ─────────────────────────────────────────────────────────────────
export interface AdminAgent {
  id: number;
  membershipId: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  zone: string;
  bio: string;
  score: string;
  propertiesCount: number;
  salesCount: number;
  leadsCount: number;
  activeLeads: number;
}

// ─── Horarios ────────────────────────────────────────────────────────────────
export interface AgentScheduleBreak {
  id: number;
  breakType: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface AgentSchedule {
  id: number;
  name: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  startTime: string;
  endTime: string;
  hasLunchBreak: boolean;
  lunchStart: string | null;
  lunchEnd: string | null;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  priority: number;
  breaks: AgentScheduleBreak[];
}

// ─── Citas ───────────────────────────────────────────────────────────────────
export type AppointmentType =
  | "primera_visita"
  | "seguimiento"
  | "cierre_contrato"
  | "entrega_llaves"
  | "avaluo";

export interface AdminAppointment {
  id: number;
  matricula: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  status: string;
  appointmentType: AppointmentType;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  property: { id: number; title: string };
  agent: { id: number; name: string };
}

// ─── Asignaciones ────────────────────────────────────────────────────────────
export interface AdminAssignmentProperty {
  id: number;
  title: string;
  propertyType: string;
}

export interface AdminAssignmentAgent {
  id: number;
  membershipId: number;
  name: string;
  isVisible: boolean;
}

export interface AdminAssignment {
  property: AdminAssignmentProperty;
  agents: AdminAssignmentAgent[];
}

export interface AdminAssignmentsResponse {
  unassignedProperties: AdminAssignmentProperty[];
  assignments: AdminAssignment[];
}

// ─── Asignaciones SaleProcess ────────────────────────────────────────────────
export interface SaleProcessAssignmentEntry {
  saleProcessId: number;
  property: {
    id: number;
    title: string;
    propertyType: string;
    image: string | null;
    price: string | null;
    address: string;
  };
  status: string;
  agent: { membershipId: number; name: string } | null;
}

export interface SaleProcessAssignmentsResponse {
  unassigned: SaleProcessAssignmentEntry[];
  assigned: SaleProcessAssignmentEntry[];
}

// ─── Clientes ────────────────────────────────────────────────────────────────
export interface AdminClient {
  id: number;
  membershipId: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  city: string;
  purchaseProcessesCount: number;
  saleProcessesCount: number;
  dateJoined: string;
}

// ─── Detalle de cliente ──────────────────────────────────────────────────────
export interface AdminClientPurchaseProcess {
  id: number;
  status: PurchaseProcessStatus;
  overallProgress: number;
  property: { id: number; title: string; image: string | null };
  agent: { name: string };
  documents: { id: number; name: string; uploaded_at: string }[];
  createdAt: string;
}

export interface AdminClientSaleProcess {
  id: number;
  status: SaleProcessStatus;
  property: { id: number; title: string; image: string | null };
  agent: { name: string };
  createdAt: string;
}

export interface AdminClientDetail {
  id: number;
  membershipId: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  city: string;
  purchaseProcesses: AdminClientPurchaseProcess[];
  saleProcesses: AdminClientSaleProcess[];
}

// ─── Pipeline de compra ──────────────────────────────────────────────────────
export type PurchaseProcessStatus =
  | "lead"
  | "visita"
  | "interes"
  | "pre_aprobacion"
  | "avaluo"
  | "credito"
  | "docs_finales"
  | "escrituras"
  | "cerrado"
  | "cancelado";

export interface AdminPurchaseProcess {
  id: number;
  status: PurchaseProcessStatus;
  overallProgress: number;
  client: { id: number; name: string; avatar: string | null };
  property: { id: number; title: string; image: string | null; price: string };
  agent: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

// ─── Pipeline de venta ───────────────────────────────────────────────────────
export type SaleProcessStatus =
  | "nuevo"
  | "contactado"
  | "en_revision"
  | "vendedor_completado"
  | "contacto_inicial"
  | "evaluacion"
  | "valuacion"
  | "firma_contrato"
  | "marketing"
  | "publicar"
  | "cancelado";

export interface AdminSaleProcess {
  id: number;
  status: SaleProcessStatus;
  property: { id: number; title: string; image: string | null };
  client: { id: number; name: string } | null;
  agent: { id: number; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Seller Leads ─────────────────────────────────────────────────────────────
export type SellerLeadStatus =
  | "new"
  | "contacted"
  | "visit_scheduled"
  | "converted"
  | "discarded";

export interface AdminSellerLead {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  propertyType: string;
  location: string;
  expectedPrice: string;
  status: SellerLeadStatus;
  assignedAgent: { id: number; name: string } | null;
  createdAt: string;
}

// ─── Historial ────────────────────────────────────────────────────────────────
export interface AdminSaleHistoryItem {
  id: number;
  property: { title: string; propertyType: string; zone: string };
  client: { name: string };
  agent: { name: string };
  salePrice: string;
  paymentMethod: string;
  closedAt: string;
}

// ─── Insights ─────────────────────────────────────────────────────────────────
export interface AdminInsights {
  period: string;
  salesByMonth: { month: string; count: number; totalAmount: string }[];
  distributionByType: { propertyType: string; count: number; percentage: number }[];
  activityByZone: { zone: string; views: number; leads: number; sales: number }[];
  topAgents: { id: number; name: string; salesCount: number; leadsCount: number; score: string }[];
  summary: {
    totalProperties: number;
    totalSales: number;
    totalRevenue: string;
    activeLeads: number;
  };
}
