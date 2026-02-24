export interface AgentProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  leads: number;
  status: string;
}

export type AppointmentStatus =
  | "programada"
  | "confirmada"
  | "en_progreso"
  | "completada"
  | "cancelada"
  | "reagendada";

export interface AgentAppointment {
  id: string;
  client: string;
  property: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

export interface AgentLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: number;
  lastContact: string;
  interestLevel?: "alta" | "media" | "baja";
}
