"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Primary navigation with the current section marked (aria-current). */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center">
      {siteConfig.nav.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-11 items-center px-2 text-sm transition-colors sm:px-4",
                active ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {link.label}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-2 bottom-2 h-px origin-left bg-accent-strong transition-transform duration-500 ease-out-expo sm:inset-x-4",
                  active ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
