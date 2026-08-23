import { Category } from "./types";

// KB simple: un doc de texto por categoría. Se inyecta en el system prompt
// una vez que la IA clasificó el incidente, así el modelo no "inventa" la
// solución sino que la basa en este contenido (esto es lo que en la V0.3
// del roadmap se reemplazaría por RAG con embeddings).

export const knowledgeBase: Record<Category, string> = {
  "Red / Internet": `
PROBLEMA: Sin conexión a Internet
SÍNTOMAS: Wi-Fi conectado pero no hay Internet / navegador no carga páginas / "sin acceso a Internet" en Windows.
COMPROBACIONES:
1. Verificar si el ícono de red muestra conectado sin acceso a Internet (posible problema DNS o de gateway).
2. Verificar si otros dispositivos en la misma red tienen Internet (si ninguno tiene: problema de router/ISP; si solo uno: problema local).
3. Ping al gateway (ipconfig para ver la IP del gateway, luego ping <ip>).
4. Ping a 8.8.8.8 (si responde, hay conectividad IP; el problema es DNS).
5. Intentar acceder a una IP directa vs. un dominio (confirma si es DNS).
CAUSAS PROBABLES: configuración DNS incorrecta, DHCP no asignó IP válida, adaptador de red deshabilitado, problema del router/ISP.
SOLUCIONES:
- ipconfig /flushdns
- ipconfig /release seguido de ipconfig /renew
- Cambiar DNS a 8.8.8.8 / 1.1.1.1 manualmente
- Reiniciar adaptador de red (deshabilitar/habilitar)
- Reiniciar router si el problema afecta a todos
`,
  "VPN": `
PROBLEMA: VPN no conecta o se desconecta
SÍNTOMAS: Error al conectar, conecta pero sin acceso a recursos internos, desconexiones frecuentes.
COMPROBACIONES:
1. Verificar credenciales (usuario/contraseña o certificado vigente).
2. Verificar conexión a Internet del equipo (la VPN depende de tener Internet primero).
3. Verificar si el cliente VPN (OpenVPN u otro) está actualizado.
4. Revisar si hay conflicto de rango de IP entre la red local y la red VPN.
5. Verificar si el firewall/antivirus está bloqueando el puerto de la VPN.
CAUSAS PROBABLES: credenciales vencidas, certificado expirado, conflicto de IP, firewall bloqueando, servidor VPN caído.
SOLUCIONES:
- Reingresar credenciales
- Reinstalar/actualizar cliente OpenVPN
- Revisar excepciones de firewall para el cliente VPN
- Si afecta a varios usuarios a la vez: escalar, probable caída del servidor VPN
`,
  "Windows": `
PROBLEMA: PC lenta / Windows no responde bien
SÍNTOMAS: Arranque lento, aplicaciones que tardan en abrir, ventilador al máximo constantemente.
COMPROBACIONES:
1. Revisar uso de CPU/RAM/Disco en el Administrador de Tareas.
2. Verificar espacio libre en disco (menos de 10-15% libre genera lentitud notable).
3. Revisar programas de inicio (muchos programas iniciando con Windows).
4. Verificar si hay actualizaciones de Windows pendientes o corriendo en segundo plano.
5. Buscar procesos anómalos con uso alto de CPU sostenido.
CAUSAS PROBABLES: disco casi lleno, demasiados programas de inicio, malware, actualización de Windows en curso, hardware envejecido (HDD vs SSD).
SOLUCIONES:
- Liberar espacio en disco (limpieza de temporales)
- Deshabilitar programas de inicio innecesarios (Administrador de Tareas > Inicio)
- Ejecutar análisis de antivirus
- Verificar estado de disco (si es HDD, considerar upgrade a SSD)
`,
  "Linux": `
PROBLEMA: Problemas en Linux (servicios, permisos, red, terminal)
SÍNTOMAS: Servicio caído, error de permisos, comando no encontrado, sin conectividad.
COMPROBACIONES:
1. Verificar estado del servicio: systemctl status <nombre-servicio>
2. Revisar permisos del archivo o directorio: ls -la
3. Revisar logs del sistema: journalctl -xe o /var/log/syslog
4. Verificar conectividad: ip addr, ping 8.8.8.8
5. Verificar si el paquete está instalado: dpkg -l | grep <paquete>
CAUSAS PROBABLES: servicio detenido o caído, permisos incorrectos, paquete no instalado, configuración de red incorrecta, disco lleno.
SOLUCIONES:
- Reiniciar servicio: systemctl restart <nombre-servicio>
- Corregir permisos: chmod 755 <archivo> o chown usuario:grupo <archivo>
- Instalar paquete faltante: apt install <paquete> (Debian/Ubuntu) o yum install <paquete> (RHEL/CentOS)
- Revisar espacio en disco: df -h
- Revisar configuración de red: /etc/network/interfaces o nmtui
`,
 "Impresoras": `
PROBLEMA: Impresora no imprime / aparece offline
SÍNTOMAS: Trabajo de impresión atascado en cola, impresora marca offline, error de comunicación.
COMPROBACIONES:
1. Verificar que la impresora esté encendida y conectada a la red (o USB).
2. Verificar que la IP de la impresora no haya cambiado (común en impresoras de red con DHCP).
3. Revisar la cola de impresión (spooler) por trabajos atascados.
4. Verificar si otros usuarios tienen el mismo problema (indica problema de red/impresora, no del equipo local).
CAUSAS PROBABLES: cola de impresión (spooler) trabada, IP de impresora cambiada, drivers desactualizados, papel atascado/falta de tóner.
SOLUCIONES:
- Reiniciar el servicio de cola de impresión (Print Spooler)
- Verificar/actualizar la IP de la impresora en el equipo
- Reinstalar el driver de la impresora
- Revisar estado físico (papel, tóner, atascos)
`,
  "Accesos / Cuentas": `
PROBLEMA: No puede acceder a una cuenta, carpeta compartida o aplicación
SÍNTOMAS: "Acceso denegado", contraseña no funciona, cuenta bloqueada.
COMPROBACIONES:
1. Confirmar si la contraseña expiró o la cuenta está bloqueada en Active Directory.
2. Verificar si el usuario tiene los permisos correctos asignados al recurso.
3. Confirmar si el problema es de autenticación (login) o de autorización (permisos sobre el recurso).
4. Verificar si el problema es general (afecta a todo el dominio) o puntual.
CAUSAS PROBABLES: contraseña expirada, cuenta bloqueada por intentos fallidos, permisos no asignados o removidos, problema de sincronización con AD.
SOLUCIONES:
- Resetear contraseña desde Active Directory
- Desbloquear cuenta
- Verificar y asignar permisos correspondientes al grupo/recurso
- Si es un problema general de dominio: escalar a N2/N3
`,
  "Hardware": `
PROBLEMA: Falla de hardware (pantalla, teclado, mouse, batería, etc.)
SÍNTOMAS: Componente no responde, pantalla con fallas visuales, equipo no enciende, sobrecalentamiento.
COMPROBACIONES:
1. Confirmar si el problema es intermitente o constante.
2. Probar el componente en otro equipo si es posible (periférico) para descartar el equipo.
3. Revisar si hubo un golpe, derrame de líquido o exposición a calor reciente.
4. Verificar si el equipo enciende pero no bootea, o no enciende directamente (ayuda a aislar fuente/placa vs. otro componente).
CAUSAS PROBABLES: componente dañado físicamente, cable/conector suelto, fuente de alimentación defectuosa, desgaste normal (batería).
SOLUCIONES:
- Reemplazo del periférico si es un accesorio externo
- Para daño de componente interno: escalar para reparación o gestión de garantía
- Documentar el daño con fotos para el ticket
`,
  "Aplicaciones": `
PROBLEMA: Una aplicación no abre, se cuelga o da error
SÍNTOMAS: La app no responde, se cierra sola, error al abrir un archivo.
COMPROBACIONES:
1. Verificar si el error ocurre para todos los usuarios de esa app o solo uno.
2. Revisar si la aplicación fue actualizada recientemente.
3. Verificar logs de error de la aplicación si están disponibles.
4. Confirmar si el problema es al abrir la app, al usar una función específica, o al guardar/exportar.
CAUSAS PROBABLES: instalación corrupta, incompatibilidad de versión, falta de permisos, conflicto con otro software.
SOLUCIONES:
- Reiniciar la aplicación / el equipo
- Reparar o reinstalar la aplicación
- Verificar que la licencia esté activa
- Si afecta a todos los usuarios: escalar, podría ser un problema del servidor de licencias o del proveedor
`,
  "Otros": `
PROBLEMA: Incidente que no encaja claramente en las categorías anteriores.
COMPROBACIONES GENERALES:
1. Pedir al usuario que describa el problema con el mayor detalle posible.
2. Identificar si es un problema de software, hardware, red o proceso.
3. Determinar el impacto (cuántos usuarios, qué tan crítico es para su trabajo).
SOLUCIONES:
- Documentar el caso en detalle
- Escalar a N2 para triage manual si no hay un procedimiento claro
`,
  "Seguridad": `
PROBLEMA: Incidente de seguridad (ransomware, phishing, robo, acceso no autorizado)
SÍNTOMAS: Archivos encriptados, mensajes de rescate, usuario hizo click en link sospechoso, equipo o componente robado, acceso no autorizado detectado.
COMPROBACIONES:
1. ¿El equipo muestra mensajes de rescate o archivos con extensiones raras? → Ransomware.
2. ¿El usuario recibió un email sospechoso e ingresó credenciales? → Phishing.
3. ¿Falta un equipo o componente físico? → Robo de hardware.
4. ¿Se detectó acceso a un sistema fuera del horario habitual o desde IP desconocida? → Acceso no autorizado.
CAUSAS PROBABLES: ransomware, phishing, robo físico, credenciales comprometidas, acceso no autorizado.
SOLUCIONES:
- Ransomware: aislar el equipo de la red inmediatamente, NO apagar, escalar a N3 urgente.
- Phishing: cambiar contraseña inmediatamente, reportar el email, escalar a N2.
- Robo: documentar qué fue robado, notificar a RRHH y dirección, escalar a N3.
- Acceso no autorizado: bloquear la cuenta afectada, escalar a N2/N3 según impacto.
NUNCA: pagar el rescate de ransomware, ignorar un incidente de seguridad.
`,
  "Infraestructura": `
PROBLEMA: Servicios críticos caídos (AD, servidor de archivos, ERP, correo)
SÍNTOMAS: Nadie puede iniciar sesión en el dominio, sin acceso a carpetas compartidas, sistema de gestión no responde, correo no llega.
COMPROBACIONES:
1. ¿Afecta a todos los usuarios o solo a algunos?
2. ¿El servidor físico está encendido y accesible?
3. ¿Hubo cambios recientes en la infraestructura?
4. ¿Los logs del servidor muestran errores?
CAUSAS PROBABLES: servicio detenido, disco lleno en servidor, falla de hardware, actualización fallida.
SOLUCIONES:
- Verificar estado del servicio: services.msc o systemctl.
- Revisar espacio en disco del servidor.
- Reiniciar el servicio afectado si es seguro hacerlo.
- Si no se resuelve en 15 minutos: escalar a N3 inmediatamente.
`,
  "PC no bootea": `
PROBLEMA: El equipo no inicia o muestra pantalla azul (BSOD)
SÍNTOMAS: Pantalla negra al encender, mensaje de error al bootear, pantalla azul con código de error.
COMPROBACIONES:
1. ¿El equipo enciende pero no llega a Windows?
2. ¿Muestra un código de error en pantalla azul?
3. ¿El problema ocurrió después de una actualización de Windows?
4. ¿El equipo hace pitidos al encender?
CAUSAS PROBABLES: disco con sectores dañados, actualización fallida, archivo de arranque corrupto, falla de RAM.
SOLUCIONES:
- Intentar arrancar en Modo Seguro (F8 al iniciar).
- Si fue por actualización: desinstalar la última actualización desde Modo Seguro.
- Ejecutar reparación de inicio desde el instalador de Windows.
- Si no arranca en ningún modo: escalar a N2.
`,
};

export function getKnowledgeForCategory(category: Category | null): string {
  if (!category || !(category in knowledgeBase)) return "";
  return knowledgeBase[category];
}
