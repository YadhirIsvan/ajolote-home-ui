export interface AgentProperty {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
  leads: number;
  status: string;
  displayStatus: string;
}

export interface AgentDashboardStats {
  activeLeads: number;
  todayAppointments: number;
  monthSales: number;
}

export interface AgentDashboard {
  agent: {
    id: number;
    name: string;
    avatar: string | null;
    zone: string;
    score: string;
  };
  stats: AgentDashboardStats;
}

export type AppointmentStatus =
  | "programada"
  | "confirmada"
  | "en_progreso"
  | "completada"
  | "cancelada"
  | "reagendada"
  | "no_show";

export interface AgentAppointment {
  id: number;
  client: string;
  property: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  matricula?: string;
  durationMinutes?: number;
  clientPhone?: string;
}

export interface AgentLead {
  id: number;
  name: string;
  email: string;
  phone: string;
  stage: number;
  lastContact?: string;
  interestLevel?: "alta" | "media" | "baja";
}
