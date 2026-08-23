# Zertal Desk
### From Incident to Resolution using AI

Zertal Desk es un asistente inteligente de soporte IT que clasifica, diagnostica y escala incidentes técnicos usando IA — inspirado en procesos reales de mesa de ayuda.

Desarrollado para la **CoderCup AI** (Coderhouse) por **Valentín Juárez**.

---

## Demo

🔗 [zertal.vercel.app](https://zertal.vercel.app)

**Credenciales de demo:**
- Usuario: `soporte` / `soporte123` → Portal de soporte
- Admin: `admin` / `admin123` → Panel IT completo

---

## ¿Qué hace?

El usuario describe su problema en lenguaje natural. Zertal Desk:

1. **Clasifica** el incidente por categoría y prioridad
2. **Pregunta** lo necesario para diagnosticar (sin preguntas de más)
3. **Consulta** una Knowledge Base con procedimientos reales de troubleshooting
4. **Propone** pasos de solución concretos
5. Si no se resuelve, **genera un ticket** con ID, escalamiento (N1/N2/N3) y resumen técnico

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend + Backend | Next.js 16 (App Router) + TypeScript |
| Estilos | Tailwind CSS |
| IA | Groq API (openai/gpt-oss-20b) |
| Persistencia | localStorage (MVP) |
| Deploy | Vercel |

---

## Estructura

```
app/
  page.tsx              → Portal de usuario (diagnóstico con IA)
  login/page.tsx        → Login con roles (admin / usuario)
  admin/page.tsx        → Panel IT (tickets, stats)
  knowledge/page.tsx    → Base de conocimiento
  api/diagnose/route.ts → Endpoint que habla con la IA
lib/
  knowledge-base.ts     → Procedimientos de troubleshooting por categoría
  prompt.ts             → System prompt con las 5 fases del flujo
  types.ts              → Tipos del dominio (Ticket, Prioridad, etc.)
  tickets.ts            → Persistencia de tickets
components/             → UI (badges, ticket card, header, guards)
```

---

## Correrlo localmente

```bash
npm install
```

Crear `.env.local`:
```
GROQ_API_KEY=gsk_...
```

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Categorías soportadas

Red / Internet · VPN · Windows · Linux · Impresoras · Accesos / Cuentas · Hardware · Aplicaciones · Otros

---

## Roadmap

- [ ] Base de datos real (Supabase)
- [ ] RAG sobre la Knowledge Base
- [ ] Notificaciones por email al escalar
- [ ] Historial por usuario
- [ ] Dashboard con métricas
