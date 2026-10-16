import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Tag({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-border bg-bg-deep/60 px-2 py-0.5 font-mono text-xs text-fg-muted",
        className,
      )}
      {...props}
    />
  );
}
