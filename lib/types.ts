export type Priority = "Baja" | "Media" | "Alta" | "Crítica";

export type Category =
  | "Red / Internet"
  | "VPN"
  | "Windows"
  | "Linux"
  | "Impresoras"
  | "Accesos / Cuentas"
  | "Hardware"
  | "Aplicaciones"
  | "Otros"
  | "Seguridad"
  | "Infraestructura"
  | "PC no bootea";
export type Escalation = "N1" | "N2" | "N3";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

// Lo que la IA devuelve en cada turno. "phase" le dice al frontend qué UI mostrar.
export interface AssistantTurn {
  phase: "classification" | "question" | "diagnosis" | "resolved_check" | "ticket";
  category: Category | null;
  priority: Priority | null;
  message: string;
  quick_replies: string[] | null; // ej: ["Sí", "No"] para que el usuario no tenga que tipear
  diagnosis: {
    probable_cause: string;
    solution_steps: string[];
  } | null;
  ticket: Ticket | null;
}

export interface Ticket {
  id: string;
  category: Category;
  priority: Priority;
  status: "Open" | "Closed";
  escalation: Escalation;
  affected_users: "single" | "multiple";
  summary: string;
  created_at: string;
  history?: { role: string; content: string }[];
}
