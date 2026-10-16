import Link from "next/link";
import { CommandMenuTrigger } from "@/components/command/command-menu-trigger";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { NavLinks } from "./nav-links";

export function SiteHeader() {
  const projects = getProjects().map(({ title, url }) => ({ title, url }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-1 px-4 sm:gap-2 sm:px-8">
        <Link
          href="/"
          className="mr-auto font-serif text-xl leading-none whitespace-nowrap text-fg sm:text-2xl"
          aria-label={`${siteConfig.name}, home`}
        >
          M. Hakimi
        </Link>
        <nav aria-label="Primary">
          <NavLinks />
        </nav>
        <div className="flex items-center border-l border-border pl-1 sm:pl-2">
          {/* Keyboard palette: hidden on small touch screens, where the nav suffices. */}
          <div className="hidden sm:block">
            <CommandMenuTrigger projects={projects} />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
