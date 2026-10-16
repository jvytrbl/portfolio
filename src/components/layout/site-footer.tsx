import { cacheLife } from "next/cache";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

// Ink footer: one of the deliberate dark moments.
export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-fg">
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-serif text-4xl leading-tight italic sm:text-5xl">
              Let&apos;s build something people use every day.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex min-h-11 items-center rounded-full bg-ink-fg px-6 text-sm font-medium text-ink transition-opacity hover:opacity-85"
            >
              Start a conversation
            </Link>
          </div>
          <nav aria-label="Footer" className="md:col-span-3 md:col-start-8">
            <p className="text-xs text-ink-muted">Pages</p>
            <ul className="mt-3 space-y-1">
              {siteConfig.nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-9 items-center hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-2">
            <p className="text-xs text-ink-muted">Elsewhere</p>
            <ul className="mt-3 space-y-1">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex min-h-9 items-center hover:underline"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center hover:underline"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-20 display-xl text-[clamp(3.5rem,15vw,13rem)] text-ink-fg/95">Hakimi.</p>
        <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-ink-border pt-6 text-xs text-ink-muted">
          <span>
            {siteConfig.legalName} · {siteConfig.location}
          </span>
          <span>
            © <CurrentYear />
          </span>
        </div>
      </div>
    </footer>
  );
}
