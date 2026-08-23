import jsPDF from "jspdf";
import { Ticket } from "@/lib/types";
import PriorityBadge from "./PriorityBadge";
import CategoryBadge from "./CategoryBadge";

const escalationStyle: Record<Ticket["escalation"], string> = {
  N1: "text-status-ok border-status-ok/25 bg-status-ok/8",
  N2: "text-priority-medium border-priority-medium/25 bg-priority-medium/8",
  N3: "text-priority-critical border-priority-critical/25 bg-priority-critical/8",
};

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const date = ticket.created_at
    ? new Date(ticket.created_at).toLocaleString(undefined)
    : new Date().toLocaleString(undefined);
function exportPDF() {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Zertal Desk — Ticket de Incidente", 20, 20);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`ID: ${ticket.id}`, 20, 35);
  doc.text(`Categoría: ${ticket.category}`, 20, 43);
  doc.text(`Prioridad: ${ticket.priority}`, 20, 51);
  doc.text(`Escalamiento: ${ticket.escalation}`, 20, 59);
  doc.text(`Estado: ${ticket.status}`, 20, 67);
  doc.text(`Usuarios afectados: ${ticket.affected_users === "multiple" ? "Múltiples" : "Un usuario"}`, 20, 75);
  doc.text(`Fecha: ${date}`, 20, 83);
  
  doc.setFont("helvetica", "bold");
  doc.text("Resumen técnico:", 20, 95);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(ticket.summary, 170);
  doc.text(lines, 20, 103);

  doc.save(`${ticket.id}.pdf`);
}
  return (
    <div className="rounded-xl border border-border bg-surface p-5 hover:border-border/80 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <button
  onClick={() => navigator.clipboard.writeText(ticket.id)}
  className="font-mono text-sm font-semibold text-foreground hover:text-accent transition-colors flex items-center gap-1.5 group"
  title="Copiar ID"
>
  {ticket.id}
  <span className="text-muted opacity-0 group-hover:opacity-100 transition-opacity text-xs">⎘</span>
</button>
        <span className={`rounded-full border px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide shrink-0 ${escalationStyle[ticket.escalation]}`}>
          Escalado a {ticket.escalation}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-foreground/80 mb-4">{ticket.summary}</p>

      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={ticket.category} />
        <PriorityBadge priority={ticket.priority} />
        <span className="inline-flex items-center rounded-full border border-border bg-surface-raised px-2.5 py-0.5 text-xs font-mono text-muted">
          {ticket.affected_users === "multiple" ? "Múltiples usuarios" : "Un usuario"}
        </span>
        <span className="inline-flex items-center rounded-full border border-status-ok/25 bg-status-ok/8 px-2.5 py-0.5 text-xs font-mono text-status-ok">
          {ticket.status}
        </span>
      </div>

      <div className="mt-3 font-mono text-[11px] text-muted/60">{date}</div>
      {ticket.history && ticket.history.length > 0 && (
  <details className="mt-3">
    <summary className="font-mono text-[11px] text-muted cursor-pointer hover:text-foreground transition-colors">
      Ver conversación ({ticket.history.filter(m => m.role === "user").length} mensajes del usuario)
    </summary>
    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
      {ticket.history.map((m, i) => {
        if (m.role === "assistant") return null;
        return (
          <div key={i} className="text-xs text-foreground/70 bg-surface-raised rounded-lg px-3 py-2">
            <span className="font-mono text-muted text-[10px] mr-2">Usuario:</span>
            {m.content}
          </div>
        );
      })}
    </div>
  </details>
)}
<button
  onClick={exportPDF}
  className="mt-3 w-full rounded-lg border border-border bg-surface-raised py-1.5 text-xs font-mono text-muted hover:text-foreground hover:bg-surface transition-all duration-200"
>
  ↓ Exportar PDF
</button>
    </div>
  );
}
