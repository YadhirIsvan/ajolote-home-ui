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

export interface AdminPropertyImage {
  id: number;
  image_url: string;
  is_cover: boolean;
  sort_order: number;
}

export interface AdminPropertyDetail extends AdminProperty {
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
  images: AdminPropertyImage[];
  amenities: { id: number; name: string; icon: string }[];
}

export interface CatalogState {
  id: number;
  name: string;
  code: string;
  country_id: number;
}

export interface CatalogCity {
  id: number;
  name: string;
  state_id: number;
}

export interface CatalogAmenity {
  id: number;
  name: string;
  icon: string;
}

// ─── Agentes ─────────────────────────────────────────────────────────────────
export interface AdminAgent {
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

// ─── Horarios ────────────────────────────────────────────────────────────────
export interface AgentScheduleBreak {
  id: number;
  break_type: string;
  name: string;
  start_time: string;
  end_time: string;
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
  start_time: string;
  end_time: string;
  has_lunch_break: boolean;
  lunch_start: string | null;
  lunch_end: string | null;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
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
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  appointment_type: AppointmentType;
  client_name: string;
  client_email: string;
  client_phone: string;
  property: { id: number; title: string };
  agent: { id: number; name: string };
}

// ─── Asignaciones ────────────────────────────────────────────────────────────
export interface AdminAssignmentProperty {
  id: number;
  title: string;
  property_type: string;
}

export interface AdminAssignmentAgent {
  id: number;
  membership_id: number;
  name: string;
  is_visible: boolean;
}

export interface AdminAssignment {
  property: AdminAssignmentProperty;
  agents: AdminAssignmentAgent[];
}

export interface AdminAssignmentsResponse {
  unassigned_properties: AdminAssignmentProperty[];
  assignments: AdminAssignment[];
}

// ─── Asignaciones SaleProcess ────────────────────────────────────────────────
export interface SaleProcessAssignmentEntry {
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

export interface SaleProcessAssignmentsResponse {
  unassigned: SaleProcessAssignmentEntry[];
  assigned: SaleProcessAssignmentEntry[];
}

// ─── Clientes ────────────────────────────────────────────────────────────────
export interface AdminClient {
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

// ─── Detalle de cliente ──────────────────────────────────────────────────────
export interface AdminClientPurchaseProcess {
  id: number;
  status: PurchaseProcessStatus;
  overall_progress: number;
  property: { id: number; title: string; image: string | null };
  agent: { name: string };
  documents: { id: number; name: string; uploaded_at: string }[];
  created_at: string;
}

export interface AdminClientSaleProcess {
  id: number;
  status: SaleProcessStatus;
  property: { id: number; title: string; image: string | null };
  agent: { name: string };
  created_at: string;
}

export interface AdminClientDetail {
  id: number;
  membership_id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  city: string;
  purchase_processes: AdminClientPurchaseProcess[];
  sale_processes: AdminClientSaleProcess[];
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
  overall_progress: number;
  client: { id: number; name: string; avatar: string | null };
  property: { id: number; title: string; image: string | null; price: string };
  agent: { id: number; name: string };
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
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
  full_name: string;
  email: string;
  phone: string;
  property_type: string;
  location: string;
  expected_price: string;
  status: SellerLeadStatus;
  assigned_agent: { id: number; name: string } | null;
  created_at: string;
}

// ─── Historial ────────────────────────────────────────────────────────────────
export interface AdminSaleHistoryItem {
  id: number;
  property: { title: string; property_type: string; zone: string };
  client: { name: string };
  agent: { name: string };
  sale_price: string;
  payment_method: string;
  closed_at: string;
}

// ─── Insights ─────────────────────────────────────────────────────────────────
export interface AdminInsights {
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
