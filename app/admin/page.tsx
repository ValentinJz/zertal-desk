"use client";
import { useEffect, useState } from "react";
import { Ticket } from "@/lib/types";
import { getTickets } from "@/lib/tickets";
import TicketCard from "@/components/TicketCard";
import RouteGuard from "@/components/RouteGuard";

const STATS = [
  { label: "Tickets abiertos", value: "—", key: "open" },
  { label: "Críticos",         value: "—", key: "critical" },
  { label: "Escalados N3",     value: "—", key: "n3" },
];

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [now, setNow] = useState(new Date());

useEffect(() => {
  const interval = setInterval(() => setNow(new Date()), 1000);
  return () => clearInterval(interval);
}, []);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  function closeTicket(id: string) {
  const updated = tickets.map(t =>
    t.id === id ? { ...t, status: "Closed" as const } : t
  );
  setTickets(updated);
  localStorage.setItem("ai-it-helpdesk-tickets", JSON.stringify(updated));
}

  useEffect(() => {
    const t = getTickets();
    setTickets(t);
  }, []);

  const open     = tickets.filter(t => t.status === "Open").length;
  const critical = tickets.filter(t => t.priority === "Crítica").length;
  const n3       = tickets.filter(t => t.escalation === "N3").length;
  const filtered = (filter === "all" 
  ? tickets 
  : filter === "closed"
  ? tickets.filter(t => t.status === "Closed")
  : tickets.filter(t => t.priority === filter)
).filter(t => 
  search === "" || 
  t.id.toLowerCase().includes(search.toLowerCase()) || 
  t.summary.toLowerCase().includes(search.toLowerCase())
);

  return (
    <RouteGuard allowedRoles={["admin"]}>
    <div className="relative min-h-[calc(100vh-65px)] overflow-hidden">
      <div className="orb w-80 h-80 bg-accent/6 top-0 right-0" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 opacity-0 animate-fade-up" style={{animationFillMode:"forwards"}}>
          <p className="font-mono text-xs text-muted uppercase tracking-widest mb-1">Panel interno</p>
          <h1 className="text-2xl font-bold tracking-tight">Centro de operaciones IT</h1>
          <p className="font-mono text-xs text-muted mt-1">
  {now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
  {" — "}
  {now.toLocaleTimeString(undefined)}
</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10 opacity-0 animate-fade-up delay-100" style={{animationFillMode:"forwards"}}>
          {[
            { label: "Tickets abiertos", value: open,     color: "text-foreground" },
            { label: "Críticos",         value: critical, color: "text-priority-critical" },
            { label: "Escalados N3",     value: n3,       color: "text-priority-high" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-5">
              <div className={`text-3xl font-bold font-mono mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Lista de tickets */}
        <div className="opacity-0 animate-fade-up delay-200" style={{animationFillMode:"forwards"}}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
  <h2 className="font-mono text-sm text-muted uppercase tracking-wide">
    Incidentes recientes
  </h2>
  <input
  value={search}
  onChange={e => setSearch(e.target.value)}
  placeholder="Buscar por ID o descripción..."
  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none input-glow transition-all duration-300 mb-4"
/>
  <div className="flex gap-2 flex-wrap">
    {["all", "Crítica", "Alta", "Media", "Baja", "closed"].map(f => (
      <button
        key={f}
        onClick={() => setFilter(f)}
        className={`px-3 py-1 rounded-lg font-mono text-xs transition-all duration-200 ${
          filter === f
            ? "bg-accent/15 text-accent border border-accent/30"
            : "text-muted border border-border hover:text-foreground hover:bg-surface-raised"
        }`}
      >
        {f === "all" ? "Todos" : f === "closed" ? "Cerrados" : f}
      </button>
    ))}
  </div>
</div>

          {tickets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <div className="text-3xl mb-3">📭</div>
              <p className="text-sm text-muted">No hay tickets todavía.</p>
              <p className="text-xs text-muted/60 mt-1">
                Cuando un usuario no pueda resolver su problema, el ticket va a aparecer acá.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map(t => (
  <div key={t.id} className="relative">
    <TicketCard ticket={t} />
    {t.status === "Open" && (
      <button
        onClick={() => closeTicket(t.id)}
        className="mt-2 w-full rounded-lg border border-status-ok/25 bg-status-ok/8 py-2 text-xs font-mono text-status-ok hover:bg-status-ok/15 transition-all duration-200"
      >
        ✓ Marcar como resuelto
      </button>
    )}
    {t.status === "Closed" && (
      <div className="mt-2 w-full rounded-lg border border-border py-2 text-center text-xs font-mono text-muted">
        Cerrado
      </div>
    )}
  </div>
))}
            </div>
          )}
        </div>
      </div>
    </div> </RouteGuard>
  );
}
