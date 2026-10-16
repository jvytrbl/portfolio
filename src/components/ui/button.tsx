import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-accent-strong text-accent-fg hover:brightness-110",
  outline: "border border-border text-fg hover:border-fg",
  ghost: "text-fg-muted hover:text-fg",
} as const;

type Variant = keyof typeof variants;

// min-h-11 keeps every button at the 44px touch-target minimum.
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-[color,border-color,filter] duration-300 [&_svg]:size-4";

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
