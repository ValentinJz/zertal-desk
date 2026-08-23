const PHASES = [
  { key: "classification", label: "Clasificando" },
  { key: "question", label: "Diagnosticando" },
  { key: "diagnosis", label: "Analizando" },
  { key: "resolved_check", label: "Verificando" },
  { key: "ticket", label: "Escalando" },
] as const;

export default function PhaseTracker({ current }: { current: string | null }) {
  const currentIndex = PHASES.findIndex((p) => p.key === current);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-[11px] uppercase tracking-wide">
      <span className="flex items-center gap-1.5 text-status-ok">
        <span className="status-dot h-1.5 w-1.5 rounded-full bg-status-ok" />
        Sistema activo
      </span>
      <span className="text-border">|</span>
      {PHASES.map((p, i) => {
        const isActive = i === currentIndex;
        const isPast = currentIndex >= 0 && i < currentIndex;
        return (
          <span
            key={p.key}
            className={
              isActive
                ? "text-accent"
                : isPast
                ? "text-muted"
                : "text-muted/40"
            }
          >
            {p.label}
            {i < PHASES.length - 1 && <span className="mx-1.5 text-border">→</span>}
          </span>
        );
      })}
    </div>
  );
}
