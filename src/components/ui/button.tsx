import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-accent text-accent-fg hover:bg-accent/90 shadow-[0_0_24px_-6px_var(--accent)] hover:shadow-[0_0_32px_-4px_var(--accent)]",
  outline: "border border-border bg-surface/50 text-fg hover:border-accent/60 hover:bg-surface",
  ghost: "text-fg-muted hover:bg-surface-raised hover:text-fg",
} as const;

type Variant = keyof typeof variants;

const base =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all [&_svg]:size-4";

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
