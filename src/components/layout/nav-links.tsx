"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Primary navigation with the current section marked (aria-current). */
export function NavLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className={className}>
      {siteConfig.nav.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center rounded-full px-3.5 text-sm transition-colors",
                active ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {active && <span aria-hidden="true" className="mr-1.5 size-1 rounded-full bg-ink" />}
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
