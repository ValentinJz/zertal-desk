import type { Metadata } from "next";
import HeaderWrapper from "@/components/HeaderWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zertal Desk",
  description: "Zertal Desk — From Incident to Resolution using AI",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23000000'/><text x='50' y='72' font-size='64' font-weight='900' font-family='Arial Black,Arial,sans-serif' fill='%23ffffff' text-anchor='middle'>Z</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <HeaderWrapper />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/50 py-4 text-center font-mono text-[11px] text-muted/50">
          © 2026 Zertal Desk —{" "}
          <a href="https://github.com/ValentinJz" target="_blank" rel="noopener noreferrer" className="hover:text-muted transition-colors">
            ValentinJz
          </a>
        </footer>
      </body>
    </html>
  );
}
