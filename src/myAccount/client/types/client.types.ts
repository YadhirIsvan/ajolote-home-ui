export type ClientSubView = "dashboard" | "config" | "ventas" | "compras";

export interface UserProfile {
  Name: string;
  PhoneMunber?: number;
  PhoneNumber?: number;
  Email: string;
  City: string;
  NewProperties: boolean;
  PriceUpdates: boolean;
  AppointmentReminders: boolean;
  Offers: boolean;
}

export interface PropertySaleSummary {
  id: number;
  title: string;
  address: string;
  price: string;
  status: string;
  views: number;
  interested: number;
  daysListed: number;
  image: string;
  trend: number;
  progressStep: number;
}

export interface PropertiesSaleResponse {
  propertiesAmount?: number;
  totalViews?: number;
  interestedAmount?: number;
  totalValue?: number;
  properties?: PropertySaleSummary[];
}

export interface PropertySaleItem extends PropertySaleSummary {
  type?: string;
  sqm?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface PropertyBuySummary {
  id: number;
  title: string;
  address: string;
  price: string;
  image: string;
  status: string;
  agent_name: string;
  overallProgress: string;
  processStage: string;
  fileNames: string[];
}

export interface PropertyFileItem {
  name: string;
  mimeType: string;
  size: number;
}

export interface RecentActivityItem {
  name: string;
  descripction: string;
  time: number;
}

export interface Step {
  label: string;
  done: boolean;
  current?: boolean;
  allowUpload?: boolean;
}
