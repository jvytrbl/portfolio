import { cacheLife } from "next/cache";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

// Colophon-style footer, as at the back of a printed journal.
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-serif text-3xl">{siteConfig.legalName}</p>
          <p className="mt-2 text-fg-muted">
            {siteConfig.title} · {siteConfig.location}
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="kicker">Sections</p>
          <ul className="mt-3 space-y-1">
            {[{ label: "Home", href: "/" }, ...siteConfig.nav].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-9 items-center transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="kicker">Colophon</p>
          <p className="mt-3 text-sm text-pretty text-fg-muted">
            Set in Instrument Serif and Instrument Sans. Built with Next.js, written in MDX, hosted
            on free tiers. Issue Nº {siteConfig.edition.issue}, © <CurrentYear />.
          </p>
          <p className="mt-4 flex gap-5 text-sm">
            <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-accent">
              Email
            </a>
            <a
              href={siteConfig.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
