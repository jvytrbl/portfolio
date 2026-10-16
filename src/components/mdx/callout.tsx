import { Info } from "lucide-react";
import type { ReactNode } from "react";

export function Callout({ children }: { children: ReactNode }) {
  return (
    <aside className="not-prose my-6 flex gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm text-fg-muted [&_p]:m-0">
      <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
      <div>{children}</div>
    </aside>
  );
}
