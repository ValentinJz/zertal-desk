import { Ticket } from "./types";

const STORAGE_KEY = "ai-it-helpdesk-tickets";

// Para el MVP no usamos una base de datos real: los tickets se guardan en
// localStorage del navegador. Alcanza para la demo y evita la fricción de
// configurar Supabase/Postgres contra el reloj. Si más adelante se quiere
// persistencia real multi-usuario, esto se reemplaza por llamadas a una API
// con una tabla "tickets" — la forma de los datos (Ticket, en types.ts) no
// cambiaría.

export function saveTicket(ticket: Ticket) {
  if (typeof window === "undefined") return;
  const existing = getTickets();
  const updated = [ticket, ...existing];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getTickets(): Ticket[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
