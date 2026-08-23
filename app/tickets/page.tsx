"use client";

import { useEffect, useState } from "react";
import { Ticket } from "@/lib/types";
import { getTickets } from "@/lib/tickets";
import TicketCard from "@/components/TicketCard";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Tickets</h1>
          <p className="mt-1 text-sm text-muted">
            {tickets.length} incidente{tickets.length !== 1 ? "s" : ""} escalado{tickets.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
          Todavía no se generó ningún ticket. Cuando un diagnóstico no resuelva un caso, va a aparecer acá.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      )}
    </div>
  );
}
