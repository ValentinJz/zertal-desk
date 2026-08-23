import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center overflow-hidden">
      <div className="orb w-96 h-96 bg-accent/8 top-0 -left-32" />
      <div className="orb w-80 h-80 bg-priority-critical/6 bottom-0 -right-24" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 text-center px-6 opacity-0 animate-fade-up" style={{animationFillMode:"forwards"}}>
        <div className="font-mono text-8xl font-black text-border mb-4">404</div>
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-surface border border-border mb-6 mx-auto">
          <span className="font-mono text-2xl font-black text-foreground">Z</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Página no encontrada
        </h1>
        <p className="text-sm text-muted mb-8 max-w-sm mx-auto">
          La ruta que buscás no existe en Zertal Desk. Puede que haya sido movida o eliminada.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-all duration-200 active:scale-95"
        >
          ← Volver al inicio
        </Link>
        <div className="mt-6 font-mono text-xs text-muted/50">
          INC-00000 · Ruta no encontrada · Zertal Desk
        </div>
      </div>
    </div>
  );
}