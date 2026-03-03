export type ClientSubView = "dashboard" | "config" | "ventas" | "compras";

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar: string | null;
  city: string;
}

export interface NotificationPreferences {
  new_properties: boolean;
  price_updates: boolean;
  appointment_reminders: boolean;
  offers: boolean;
}

export interface PropertySaleSummary {
  id: number;
  title: string;
  address: string;
  price: string;
  image: string;
  status: string;
  views: number;
  interested: number;
  daysListed: number;
  trend: string;
  progressStep: number;
}

export interface SaleProcessAgent {
  name: string;
  phone: string;
  email: string;
}

export interface SaleProcessStage {
  name: string;
  status: "completed" | "current" | "pending";
  completed_at: string | null;
}

export interface SaleProcessHistoryEntry {
  previous_status: string;
  new_status: string;
  changed_at: string;
  notes: string;
}

export interface PropertySaleItem extends PropertySaleSummary {
  agent?: SaleProcessAgent;
  stages?: SaleProcessStage[];
  history?: SaleProcessHistoryEntry[];
}

export interface PropertiesSaleResponse {
  propertiesAmount: number;
  totalViews: number;
  interestedAmount: number;
  totalValue: number;
  properties: PropertySaleSummary[];
}

export interface PropertyBuySummary {
  id: number;
  title: string;
  address: string;
  price: string;
  image: string;
  status: string;
  agent_name: string;
  overallProgress: number;
  processStage: string;
  documents_count: number;
}

export interface PropertyFileItem {
  id: number;
  name: string;
  file_url: string;
  mime_type: string;
  size_bytes: number;
  document_stage: string;
  uploaded_at?: string;
}

export interface RecentActivityItem {
  name: string;
  description: string;
  time: number;
}

export interface Step {
  label: string;
  done: boolean;
  current?: boolean;
  allowUpload?: boolean;
}
