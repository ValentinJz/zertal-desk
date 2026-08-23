import { Category } from "@/lib/types";

export default function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-raised px-2.5 py-0.5 text-xs font-mono text-muted">
      {category}
    </span>
  );
}
