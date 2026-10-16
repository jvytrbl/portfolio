import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-accent text-accent-fg hover:bg-accent/85",
  outline: "border border-border text-fg hover:border-accent/60 hover:bg-surface",
  ghost: "text-fg-muted hover:bg-surface-raised hover:text-fg",
} as const;

type Variant = keyof typeof variants;

// min-h-11 keeps every button at the 44px touch-target minimum.
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition-[color,background-color,border-color] duration-200 [&_svg]:size-4";

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
