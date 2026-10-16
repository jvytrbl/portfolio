"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FilterItem = { key: string; category: string; card: ReactNode };

const ALL = "All";

// Cards are rendered on the server and passed in; this leaf only decides
// which ones are visible.
export function ProjectFilter({
  items,
  categories,
}: {
  items: FilterItem[];
  categories: string[];
}) {
  const [active, setActive] = useState(ALL);
  const visible = active === ALL ? items : items.filter((i) => i.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2">
        {[ALL, ...categories].map((category) => {
          const count =
            category === ALL ? items.length : items.filter((i) => i.category === category).length;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={active === category}
              onClick={() => setActive(category)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
                active === category
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-fg-muted hover:border-accent/50 hover:text-fg",
              )}
            >
              {category} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} project{visible.length === 1 ? "" : "s"}
      </p>
      <ul className="grid gap-5 md:grid-cols-2">
        {visible.map((item) => (
          <li key={item.key}>{item.card}</li>
        ))}
      </ul>
    </div>
  );
}
