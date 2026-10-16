import Link from "next/link";
import { CommandMenuTrigger } from "@/components/command/command-menu-trigger";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { GithubIcon } from "@/components/ui/github-icon";
import { getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const projects = getProjects().map(({ title, url }) => ({ title, url }));

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-1 font-mono text-sm text-fg"
          aria-label={`${siteConfig.name} — home`}
        >
          <span className="text-highlight">~/</span>
          <span>{siteConfig.github.username}</span>
          <span aria-hidden="true" className="animate-blink text-accent">
            _
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {siteConfig.nav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <CommandMenuTrigger projects={projects} />
          <a
            href={siteConfig.github.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="inline-flex size-9 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-raised hover:text-fg"
          >
            <GithubIcon className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
