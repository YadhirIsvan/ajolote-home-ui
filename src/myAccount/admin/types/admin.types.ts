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
  thumb?: string;
  medium?: string;
  large?: string;
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
  email: string | null;
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
  updatedAt: string | null;
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
  updatedAt: string | null;
}

// ─── Seller Leads ─────────────────────────────────────────────────────────────
export type SellerLeadStatus =
  | "new"
  | "contacted"
  | "in_review"
  | "converted"
  | "rejected";

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
  closedAt: string | null;
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

// ─── Backend raw types (snake_case — mirrors actual API responses) ─────────────

export interface BackendAdminProperty {
  id: number;
  title: string;
  address: string;
  price: string;
  currency: string;
  property_type: string;
  listing_type: string;
  status: string;
  is_featured: boolean;
  is_verified: boolean;
  is_active: boolean;
  image: string | null;
  agent: { id: number; name: string } | null;
  documents_count: number;
  created_at: string;
}

export interface BackendAdminPropertyImage {
  id: number;
  image_url: string;
  thumb?: string;
  medium?: string;
  large?: string;
  is_cover: boolean;
  sort_order: number;
}

export interface BackendAdminPropertyDetail extends BackendAdminProperty {
  description: string;
  property_condition: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  construction_sqm: string;
  land_sqm: string;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_zip: string;
  city: { id: number; name: string; state_id: number } | null;
  zone: string;
  video_id: string;
  latitude: string;
  longitude: string;
  images: BackendAdminPropertyImage[];
  amenities: { id: number; name: string; icon: string }[];
}

export interface BackendCatalogState {
  id: number;
  name: string;
  code: string;
  country_id: number;
}

export interface BackendCatalogCity {
  id: number;
  name: string;
  state_id: number;
}

export interface BackendCatalogAmenity {
  id: number;
  name: string;
  icon: string;
}

export interface BackendAdminAgent {
  id: number;
  membership_id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  zone: string;
  bio: string;
  score: string;
  properties_count: number;
  sales_count: number;
  leads_count: number;
  active_leads: number;
}

export interface BackendAgentScheduleBreak {
  id: number;
  break_type: string;
  name: string;
  start_time: string;
  end_time: string;
}

export interface BackendAgentSchedule {
  id: number;
  name: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  start_time: string;
  end_time: string;
  has_lunch_break: boolean;
  lunch_start: string | null;
  lunch_end: string | null;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  priority: number;
  breaks: BackendAgentScheduleBreak[];
}

export interface BackendAdminAppointment {
  id: number;
  matricula: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  appointment_type: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  property: { id: number; title: string };
  agent: { id: number; name: string };
}

export interface BackendAdminAssignmentProperty {
  id: number;
  title: string;
  property_type: string;
}

export interface BackendAdminAssignmentAgent {
  id: number;
  membership_id: number;
  name: string;
  is_visible: boolean;
}

export interface BackendAdminAssignment {
  property: BackendAdminAssignmentProperty;
  agents: BackendAdminAssignmentAgent[];
}

export interface BackendAdminAssignmentsResponse {
  unassigned_properties: BackendAdminAssignmentProperty[];
  assignments: BackendAdminAssignment[];
}

export interface BackendSaleProcessAssignmentEntry {
  sale_process_id: number;
  property: {
    id: number;
    title: string;
    property_type: string;
    image: string | null;
    price: string | null;
    address: string;
  };
  status: string;
  agent: { membership_id: number; name: string } | null;
}

export interface BackendSaleProcessAssignmentsResponse {
  unassigned: BackendSaleProcessAssignmentEntry[];
  assigned: BackendSaleProcessAssignmentEntry[];
}

export interface BackendAdminClient {
  id: number;
  membership_id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  city: string;
  purchase_processes_count: number;
  sale_processes_count: number;
  date_joined: string;
}

export interface BackendAdminClientPurchaseProcess {
  id: number;
  status: string;
  overall_progress: number;
  property: { id: number; title: string; image: string | null };
  agent: { name: string };
  documents: { id: number; name: string; uploaded_at: string }[];
  created_at: string;
}

export interface BackendAdminClientSaleProcess {
  id: number;
  status: string;
  property: { id: number; title: string; image: string | null };
  agent: { name: string };
  created_at: string;
}

export interface BackendAdminClientDetail {
  id: number;
  membership_id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  city: string;
  purchase_processes: BackendAdminClientPurchaseProcess[];
  sale_processes: BackendAdminClientSaleProcess[];
}

export interface BackendAdminPurchaseProcess {
  id: number;
  status: string;
  overall_progress: number;
  client: { id: number; name: string; avatar: string | null };
  property: { id: number; title: string; image: string | null; price: string };
  agent: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

export interface BackendAdminSaleProcess {
  id: number;
  status: string;
  property: { id: number; title: string; image: string | null };
  client: { id: number; name: string } | null;
  agent: { id: number; name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface BackendAdminSellerLead {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  property_type: string;
  location: string;
  expected_price: string;
  status: string;
  assigned_agent: { id: number; name: string } | null;
  created_at: string;
}

export interface BackendAdminSaleHistoryItem {
  id: number;
  property: { title: string; property_type: string; zone: string };
  client: { name: string };
  agent: { name: string };
  sale_price: string;
  payment_method: string;
  closed_at: string;
}

export interface BackendAdminInsights {
  period: string;
  sales_by_month: { month: string; count: number; total_amount: string }[];
  distribution_by_type: { property_type: string; count: number; percentage: number }[];
  activity_by_zone: { zone: string; views: number; leads: number; sales: number }[];
  top_agents: { id: number; name: string; sales_count: number; leads_count: number; score: string }[];
  summary: {
    total_properties: number;
    total_sales: number;
    total_revenue: string;
    active_leads: number;
  };
}
