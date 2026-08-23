"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [ticketCount, setTicketCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem("zt_role"));
    const tickets = JSON.parse(localStorage.getItem("ai-it-helpdesk-tickets") || "[]");
    const open = tickets.filter((t: any) => t.status === "Open").length;
    setTicketCount(open);
  }, []);

  const navItems = [
    { href: "/", label: "Soporte", roles: ["admin", "user"] },
    { href: "/knowledge", label: "Knowledge", roles: ["admin"] },
    { href: "/admin", label: "Panel IT", roles: ["admin"] },
  ];

  const visibleItems = navItems.filter(item => !role || item.roles.includes(role));

  function handleLogout() {
    localStorage.removeItem("zt_role");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border">
            <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23000000'/><text x='50' y='72' font-size='64' font-weight='900' font-family='Arial Black,Arial,sans-serif' fill='%23ffffff' text-anchor='middle'>Z</text></svg>" className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold tracking-[0.15em] text-foreground uppercase">
              Zertal Desk
            </span>
            <span className="font-mono text-[10px] text-muted tracking-wide animate-shimmer">
              From Incident to Resolution using AI
            </span>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {visibleItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-1.5 rounded-lg font-mono text-xs transition-all duration-200 ${
                  path === href
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted hover:text-foreground hover:bg-surface"
                }`}
              >
                {label}
                {href === "/admin" && ticketCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-priority-critical text-white text-[10px] px-1.5 py-0.5">
                    {ticketCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          {role && (
            <button
              onClick={handleLogout}
              className="ml-1 px-3 py-1.5 rounded-lg font-mono text-xs text-muted hover:text-foreground hover:bg-surface transition-all duration-200"
            >
              Salir
            </button>
          )}
        </div>

        <button
          className="sm:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block h-0.5 w-5 bg-foreground transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-border bg-surface px-6 py-4 flex flex-col gap-2 animate-fade-in">
          {visibleItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-lg font-mono text-sm transition-all duration-200 flex items-center justify-between ${
                path === href
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted hover:text-foreground hover:bg-surface-raised"
              }`}
            >
              {label}
              {href === "/admin" && ticketCount > 0 && (
                <span className="rounded-full bg-priority-critical text-white text-[10px] px-1.5 py-0.5">
                  {ticketCount}
                </span>
              )}
            </Link>
          ))}
          {role && (
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-lg font-mono text-sm text-muted hover:text-foreground hover:bg-surface-raised transition-all text-left"
            >
              Salir
            </button>
          )}
        </div>
      )}
    </header>
  );
}