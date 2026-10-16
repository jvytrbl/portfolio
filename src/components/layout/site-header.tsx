import Link from "next/link";
import { CommandMenuTrigger } from "@/components/command/command-menu-trigger";
import { getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

// Floating pill navigation (fixed), as in a gallery or studio site.
export function SiteHeader() {
  const projects = getProjects().map(({ title, url }) => ({ title, url }));

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-2 rounded-full border border-border bg-bg/90 pr-2 pl-5 shadow-sm shadow-ink/5 backdrop-blur-sm">
        <Link
          href="/"
          className="mr-auto font-display text-sm font-semibold tracking-tight uppercase"
          aria-label={`${siteConfig.name}, home`}
        >
          Hakimi<span className="text-fg-faint">.</span>
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <NavLinks className="flex items-center" />
        </nav>
        <div className="hidden sm:block">
          <CommandMenuTrigger projects={projects} />
        </div>
        <Link
          href="/contact"
          className="hidden min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-xs font-medium text-ink-fg transition-[filter] hover:brightness-125 sm:inline-flex"
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
          Available for work
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}
