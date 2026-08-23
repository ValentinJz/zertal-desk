"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AssistantTurn, ChatMessage, Category, Priority } from "@/lib/types";
import { saveTicket } from "@/lib/tickets";
import CategoryBadge from "@/components/CategoryBadge";
import PriorityBadge from "@/components/PriorityBadge";
import TicketCard from "@/components/TicketCard";

const CATEGORIES = [
  { label: "Red / Internet",     icon: "⚡", desc: "Sin conexión, DNS, Wi-Fi" },
  { label: "VPN",                icon: "🔒", desc: "Acceso remoto, túnel" },
  { label: "Windows",            icon: "🖥️",  desc: "PC lenta, errores del SO" },
  { label: "Linux",              icon: "🐧", desc: "Terminal, permisos, servicios" },
  { label: "Impresoras",         icon: "🖨️",  desc: "Offline, cola atascada" },
  { label: "Accesos / Cuentas",  icon: "🔑", desc: "Contraseñas, permisos" },
  { label: "Hardware",           icon: "🔧", desc: "Pantalla, teclado, batería" },
  { label: "Aplicaciones",       icon: "📦", desc: "Apps que fallan o no abren" },
  { label: "Otros",              icon: "💬", desc: "Otro tipo de incidente" },
];

const PHASE_LABELS: Record<string, string> = {
  classification: "Clasificando",
  question:       "Diagnosticando",
  diagnosis:      "Analizando",
  resolved_check: "Verificando",
  ticket:         "Escalando",
};

export default function Home() {
  const [history,  setHistory]  = useState<ChatMessage[]>([]);
  const [turns,    setTurns]    = useState<AssistantTurn[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [input,    setInput]    = useState("");
  const [placeholder, setPlaceholder] = useState("Pregunta lo que quieras");
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

useEffect(() => {
  const examples = [
    "Ej: No tengo conexión a Internet...",
    "Ej: Mi VPN no conecta...",
    "Ej: No puedo imprimir...",
    "Ej: Mi PC está muy lenta...",
    "Ej: No puedo acceder a mis archivos...",
    "Ej: Olvidé mi contraseña...",
  ];
  let i = 0;
  const interval = setInterval(() => {
    setPlaceholderVisible(true);
    setTimeout(() => {
      i = (i + 1) % examples.length;
      setPlaceholder(examples[i]);
      setPlaceholderVisible(true);
    }, 300);
  }, 3000);
  return () => clearInterval(interval);
}, []);
  const [loading,  setLoading]  = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const router = useRouter();

useEffect(() => {
  const role = localStorage.getItem("zt_role");
  if (!role) router.push("/login");
}, []);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, loading]);

  const lastTurn   = turns.at(-1) ?? null;
  const started    = history.length > 0;
  const caseClosed = !!lastTurn?.ticket ||
    (lastTurn?.phase === "resolved_check" && !lastTurn.quick_replies);
  const currentPhase = lastTurn?.phase ?? null;

  async function send(message: string) {
    if (!message.trim() || loading) return;
    setError(null);
    const newHistory: ChatMessage[] = [...history, { role: "user", content: message }];
    setHistory(newHistory);
    setInput("");
    const startTime = Date.now();
    setLoading(true);

    try {
      const res = await fetch("/api/diagnose", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ history: newHistory, knownCategory: category }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al consultar el diagnóstico");
      }
      const turn: AssistantTurn = await res.json();
      setHistory(h => [...h, { role: "assistant", content: JSON.stringify(turn) }]);
      setTurns(t => [...t, turn]);
      if (turn.category) setCategory(turn.category);
      if (turn.priority) setPriority(turn.priority);
      if (turn.ticket) {
  const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2ozNl+gs9yxezVHaZ3M5MiYWzFgpOT/3KxiKEVxsd76+MmANkhujcj/8diLRTZmiMT//PGnXzFkid//+fSxbkBukMT//PGnXzBliMT//PGnXzFkid//+fSxbkBukMT//vSwcUF2kcj///LApGY4bIzI///ywqtnPm+Szf//9ManbkN0mc7///TNqG5Fe5/S////1s+3jFuHwtH////g3Myun3aWwtT////p6N7RxLCklpCNi4qKi4yOkJOWmp");
  audio.volume = 0.3;
  audio.play().catch(() => {});
}
      if (turn.ticket) saveTicket({ 
      ...turn.ticket, 
      created_at: new Date().toISOString(),
      history: newHistory 
});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error inesperado.");
    } finally {
      setResponseTime(Math.round((Date.now() - startTime) / 1000));
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function reset() {
    setHistory([]); setTurns([]); setCategory(null); setPriority(null); setError(null);
  }

  /* ── PANTALLA DE INICIO ── */
  if (!started) return (
    <div className="relative min-h-[calc(100vh-65px)] overflow-hidden">
      {/* Orbs de fondo */}
      <div className="orb w-96 h-96 bg-accent/8 top-20 -left-32" />
      <div className="orb w-80 h-80 bg-status-ok/6 bottom-20 -right-24" />

      {/* Grid sutil */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-20 pb-16">

        {/* Hero */}
        <div className="text-center mb-14 opacity-0 animate-fade-up" style={{animationFillMode:"forwards"}}>
          <div className="inline-flex items-center gap-2 rounded-full border border-status-ok/20 bg-status-ok/5 px-4 py-1.5 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-status-ok animate-pulse-glow" />
            <span className="font-mono text-xs text-status-ok tracking-wide">Sistema disponible — Soporte 24/7</span>
          </div>

<h1 className="text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
            ¿En qué podemos
            <span className="block text-accent/90">ayudarte hoy?</span>
          </h1>
          <p className="text-muted text-lg max-w-md mx-auto leading-relaxed">
            Describí tu problema y la IA lo va a clasificar, diagnosticar y resolver —
            o escalar al equipo técnico si es necesario.
          </p>
        </div> 

        {/* Input principal */}
        <div className="opacity-0 animate-fade-up delay-200 max-w-xl mx-auto mb-14" style={{animationFillMode:"forwards"}}>
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="relative">
  <input
    ref={inputRef}
    value={input}
    onChange={e => setInput(e.target.value)}
    className="w-full rounded-2xl border border-border bg-surface px-5 py-4 pr-32 text-sm text-foreground focus:outline-none input-glow transition-all duration-300"
    autoFocus
  />
  {!input && (
    <span
      key={placeholder}
      className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-muted pointer-events-none animate-fade-in"
    >
      {placeholder}
    </span>
  )}
  <button
    type="submit"
    disabled={!input.trim()}
    className="absolute right-2 top-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-30 hover:bg-accent/90 transition-all duration-200 active:scale-95"
  >
    Iniciar →
  </button>
</form>
        </div>

        {/* Grid de categorías */}
        <div className="opacity-0 animate-fade-up delay-300" style={{animationFillMode:"forwards"}}>
          <p className="text-center font-mono text-xs text-muted uppercase tracking-widest mb-5">
            O seleccioná una categoría
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.label}
                onClick={() => send(`Tengo un problema con: ${cat.label}`)}
                className="group relative rounded-xl border border-border bg-surface p-4 text-left transition-all duration-200 hover:border-accent/40 hover:bg-surface-raised hover:-translate-y-0.5 active:translate-y-0"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="mb-2 text-xl">{cat.icon}</div>
                <div className="text-xs font-medium text-foreground mb-0.5">{cat.label}</div>
                <div className="text-[11px] text-muted leading-snug">{cat.desc}</div>
                <div className="absolute inset-0 rounded-xl bg-accent/3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── CHAT / DIAGNÓSTICO ── */
  return (
    <div className="mx-auto flex max-w-2xl flex-col min-h-[calc(100vh-65px)] px-6 py-8 gap-6">

      {/* Barra de estado */}
      <div className="animate-fade-in flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-status-ok animate-pulse-glow" />
          <span className="font-mono text-[11px] text-muted uppercase tracking-wide">
            {currentPhase ? PHASE_LABELS[currentPhase] : "Iniciando"}
          </span>
          {(category || priority) && (
            <>
              <span className="text-border mx-1">|</span>
              {category && <CategoryBadge category={category} />}
              {priority && <PriorityBadge priority={priority} />}
            </>
          )}
        </div>
        <button
          onClick={reset}
          className="font-mono text-xs text-muted hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-surface"
        >
          ← Nuevo caso
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex flex-col gap-4 flex-1">
        {history.map((m, i) => {
          if (m.role === "user") return (
            <div key={i} className="animate-message ml-auto max-w-[78%]">
              <div className="rounded-2xl rounded-br-sm bg-accent/12 border border-accent/15 px-4 py-3 text-sm text-foreground leading-relaxed">
                {m.content}
              </div>
            </div>
          );

          const turn: AssistantTurn = JSON.parse(m.content);
          return (
            <div key={i} className="animate-message mr-auto max-w-[85%] space-y-3">
              <div className="rounded-2xl rounded-bl-sm border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground/90">
                {turn.message}
              </div>
              {i === history.length - 1 && responseTime && (
  <div className="font-mono text-[10px] text-muted/50 mt-1">
    ⚡ Respondió en {responseTime}s
  </div>
)}

              {turn.diagnosis && (
                <div className="rounded-xl border border-accent/20 bg-accent/4 p-4 text-sm space-y-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-1.5">
                      Causa probable
                    </p>
                    <p className="text-foreground/85 leading-relaxed">{turn.diagnosis.probable_cause}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-1.5">
                      Pasos sugeridos
                    </p>
                    <ol className="space-y-1.5 pl-4 list-decimal text-foreground/85">
                      {turn.diagnosis.solution_steps.map((s, idx) => (
                        <li key={idx} className="leading-relaxed">{s}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {turn.ticket && <TicketCard ticket={turn.ticket} />}
            </div>
          );
        })}

        {loading && (
          <div className="animate-fade-in mr-auto">
            <div className="rounded-2xl rounded-bl-sm border border-border bg-surface px-4 py-3.5 flex items-center gap-1.5">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          </div>
        )}

        {error && (
          <div className="animate-fade-in rounded-xl border border-priority-critical/25 bg-priority-critical/8 px-4 py-3 text-sm text-priority-critical">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {lastTurn?.quick_replies && !caseClosed && (
        <div className="flex flex-wrap gap-2">
          {lastTurn.quick_replies.map(qr => (
            <button
              key={qr}
              onClick={() => send(qr)}
              className="rounded-xl border border-accent/30 bg-accent/8 px-5 py-2 text-sm text-accent hover:bg-accent/15 hover:border-accent/50 transition-all duration-200 active:scale-95"
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      {!caseClosed && (
        <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Respondé la pregunta o describí más el problema..."
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none input-glow transition-all duration-300"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white disabled:opacity-30 hover:bg-accent/90 transition-all duration-200 active:scale-95"
          >
            →
          </button>
        </form>
      )}

            {caseClosed && !lastTurn?.ticket && (
        <div className="text-center py-10 animate-fade-up" style={{animationFillMode:"forwards"}}>
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full border border-status-ok/25 bg-status-ok/8 text-2xl mb-4 mx-auto">
            ✓
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Problema resuelto</h2>
          <p className="text-sm text-muted mb-6">
            Nos alegra que hayas podido solucionarlo. Si necesitás ayuda con otra cosa, estamos acá.
          </p>
          <button
            onClick={reset}
            className="rounded-xl border border-accent/30 bg-accent/8 px-6 py-2.5 text-sm text-accent hover:bg-accent/15 transition-all duration-200 active:scale-95"
          >
            Reportar otro problema
          </button>
        </div>
      )}
    </div>
  );
}
