"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (user === "admin" && pass === "admin123") {
        localStorage.setItem("zt_role", "admin");
        router.push("/admin");
      } else if (user === "soporte" && pass === "soporte123") {
        localStorage.setItem("zt_role", "user");
        router.push("/");
      } else {
        setError("Usuario o contraseña incorrectos.");
        setLoading(false);
      }
    }, 800);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="orb w-96 h-96 bg-accent/8 top-0 -left-32" />
      <div className="orb w-80 h-80 bg-status-ok/6 bottom-0 -right-24" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 w-full max-w-sm px-6 opacity-0 animate-fade-up" style={{animationFillMode:"forwards"}}>
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-surface border border-border mb-4">
            <span className="font-mono text-2xl font-black text-foreground">Z</span>
          </div>
          <h1 className="font-mono text-sm font-bold tracking-[0.15em] uppercase text-foreground">Zertal Desk</h1>
          <p className="font-mono text-xs mt-1 animate-shimmer">From Incident to Resolution using AI</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="rounded-2xl border border-border bg-surface p-6 space-y-4">
          <div>
            <label className="font-mono text-xs text-muted uppercase tracking-wide block mb-1.5">
              Usuario
            </label>
            <input
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="Ingresá tu usuario"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none input-glow transition-all duration-300"
              autoFocus
            />
          </div>
          <div>
            <label className="font-mono text-xs text-muted uppercase tracking-wide block mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none input-glow transition-all duration-300"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-priority-critical/25 bg-priority-critical/8 px-4 py-2.5 text-xs text-priority-critical">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !user || !pass}
            className="w-full rounded-xl bg-accent py-2.5 text-sm font-medium text-white disabled:opacity-30 hover:bg-accent/90 transition-all duration-200 active:scale-95"
          >
            {loading ? "Verificando..." : "Ingresar →"}
          </button>
        </form>

        {/* Credenciales de demo */}
        <div className="mt-4 rounded-xl border border-dashed border-border p-4 space-y-1">
          <p className="font-mono text-[11px] text-muted uppercase tracking-wide mb-2">Demo</p>
          <p className="font-mono text-xs text-muted">👤 <span className="text-foreground/60">admin</span> / admin123 → Panel IT</p>
          <p className="font-mono text-xs text-muted">👤 <span className="text-foreground/60">soporte</span> / soporte123 → Portal usuario</p>
        </div>
      </div>
    </div>
  );
}