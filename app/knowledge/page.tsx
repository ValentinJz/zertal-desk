"use client";
import { useState } from "react";

const DOCS = [
  {
    category: "Red / Internet",
    icon: "⚡",
    symptoms: ["Wi-Fi conectado pero sin Internet", "Navegador no carga páginas", "'Sin acceso a Internet' en Windows"],
    checks: ["Verificar ícono de red", "Ping al gateway", "Ping a 8.8.8.8", "Probar IP directa vs dominio"],
    causes: ["DNS incorrecto", "DHCP no asignó IP válida", "Adaptador deshabilitado", "Problema del router/ISP"],
    solutions: ["ipconfig /flushdns", "ipconfig /release + /renew", "Cambiar DNS a 8.8.8.8 / 1.1.1.1", "Reiniciar adaptador de red"],
  },
  {
    category: "VPN",
    icon: "🔒",
    symptoms: ["Error al conectar", "Conecta pero sin acceso a recursos", "Desconexiones frecuentes"],
    checks: ["Verificar credenciales", "Confirmar Internet activo", "Revisar versión del cliente", "Buscar conflicto de IP"],
    causes: ["Credenciales vencidas", "Certificado expirado", "Conflicto de IP", "Firewall bloqueando"],
    solutions: ["Reingresar credenciales", "Reinstalar cliente OpenVPN", "Revisar excepciones de firewall", "Escalar si afecta a varios usuarios"],
  },
  {
    category: "Windows",
    icon: "🖥️",
    symptoms: ["Arranque lento", "Apps que tardan en abrir", "Ventilador al máximo"],
    checks: ["CPU/RAM/Disco en Administrador de Tareas", "Espacio libre en disco", "Programas de inicio", "Actualizaciones pendientes"],
    causes: ["Disco casi lleno", "Demasiados programas de inicio", "Malware", "HDD vs SSD"],
    solutions: ["Limpiar temporales", "Deshabilitar inicio innecesario", "Análisis de antivirus", "Verificar estado del disco"],
  },
  {
    category: "Linux",
    icon: "🐧",
    symptoms: ["Servicio caído", "Error de permisos", "Comando no encontrado", "Sin conectividad de red"],
    checks: ["systemctl status <servicio>", "Verificar permisos con ls -la", "Revisar logs en /var/log", "ip addr / ping"],
    causes: ["Servicio detenido", "Permisos incorrectos", "Paquete no instalado", "Configuración de red incorrecta"],
    solutions: ["systemctl restart <servicio>", "chmod / chown para permisos", "apt install / yum install", "Revisar /etc/network/interfaces"],
  },
  {
    category: "Impresoras",
    icon: "🖨️",
    symptoms: ["Impresora offline", "Cola atascada", "Error de comunicación"],
    checks: ["Verificar encendido y conexión", "Revisar IP de la impresora", "Cola de impresión (spooler)", "Otros usuarios afectados"],
    causes: ["Spooler trabado", "IP cambiada", "Driver desactualizado", "Papel atascado / tóner"],
    solutions: ["Reiniciar Print Spooler", "Actualizar IP en el equipo", "Reinstalar driver", "Revisar estado físico"],
  },
  {
    category: "Accesos / Cuentas",
    icon: "🔑",
    symptoms: ["Acceso denegado", "Contraseña no funciona", "Cuenta bloqueada"],
    checks: ["Contraseña expirada en AD", "Cuenta bloqueada por intentos", "Permisos sobre el recurso", "Problema general de dominio"],
    causes: ["Contraseña expirada", "Cuenta bloqueada", "Permisos no asignados", "Problema de sincronización AD"],
    solutions: ["Resetear contraseña en AD", "Desbloquear cuenta", "Asignar permisos correspondientes", "Escalar si es problema general"],
  },
  {
    category: "Hardware",
    icon: "🔧",
    symptoms: ["Componente no responde", "Pantalla con fallas", "Equipo no enciende", "Sobrecalentamiento"],
    checks: ["¿Problema intermitente o constante?", "Probar componente en otro equipo", "Revisar golpes o derrames", "¿Enciende pero no bootea?"],
    causes: ["Componente dañado", "Cable suelto", "Fuente defectuosa", "Desgaste normal"],
    solutions: ["Reemplazar periférico externo", "Escalar para reparación interna", "Documentar con fotos", "Gestionar garantía"],
  },
  {
    category: "Aplicaciones",
    icon: "📦",
    symptoms: ["App no abre", "Se cierra sola", "Error al abrir archivo"],
    checks: ["¿Afecta a todos o solo uno?", "¿Actualización reciente?", "Logs de error", "¿Falla al abrir o al usar?"],
    causes: ["Instalación corrupta", "Incompatibilidad de versión", "Falta de permisos", "Conflicto con otro software"],
    solutions: ["Reiniciar app / equipo", "Reparar o reinstalar", "Verificar licencia activa", "Escalar si afecta a todos"],
  },
];

export default function KnowledgePage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="relative min-h-[calc(100vh-65px)] overflow-hidden">
      <div className="orb w-80 h-80 bg-accent/6 top-0 left-0" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 opacity-0 animate-fade-up" style={{animationFillMode:"forwards"}}>
          <p className="font-mono text-xs text-muted uppercase tracking-widest mb-1">Base de conocimiento</p>
          <h1 className="text-2xl font-bold tracking-tight">Procedimientos de soporte</h1>
          <p className="text-sm text-muted mt-1">
            {DOCS.length} categorías — documentación que usa la IA para diagnosticar incidentes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {DOCS.map((doc, i) => (
            <div
              key={doc.category}
              className="opacity-0 animate-fade-up rounded-xl border border-border bg-surface overflow-hidden"
              style={{animationFillMode:"forwards", animationDelay:`${i*40}ms`}}
            >
              <button
                onClick={() => setSelected(selected === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-raised transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{doc.icon}</span>
                  <span className="font-medium text-sm text-foreground">{doc.category}</span>
                </div>
                <span className="font-mono text-xs text-muted">
                  {selected === i ? "▲ cerrar" : "▼ ver"}
                </span>
              </button>

              {selected === i && (
                <div className="px-5 pb-5 grid grid-cols-2 gap-4 border-t border-border pt-4 animate-fade-in">
                  {[
                    { label: "Síntomas", items: doc.symptoms, color: "text-priority-medium" },
                    { label: "Comprobaciones", items: doc.checks, color: "text-accent" },
                    { label: "Causas probables", items: doc.causes, color: "text-priority-high" },
                    { label: "Soluciones", items: doc.solutions, color: "text-status-ok" },
                  ].map(section => (
                    <div key={section.label}>
                      <p className={`font-mono text-[11px] uppercase tracking-widest mb-2 ${section.color}`}>
                        {section.label}
                      </p>
                      <ul className="space-y-1">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="text-xs text-foreground/75 flex gap-1.5">
                            <span className="text-muted shrink-0">—</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}