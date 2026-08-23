import { Priority } from "@/lib/types";

const styles: Record<Priority, string> = {
  "Baja": "bg-priority-low/15 text-priority-low border-priority-low/30",
  "Media": "bg-priority-medium/15 text-priority-medium border-priority-medium/30",
  "Alta": "bg-priority-high/15 text-priority-high border-priority-high/30",
  "Crítica": "bg-priority-critical/15 text-priority-critical border-priority-critical/30",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-mono uppercase tracking-wide ${styles[priority]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {priority}
    </span>
  );
}
