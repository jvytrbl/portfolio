import { cacheLife } from "next/cache";
import { siteConfig } from "@/lib/site";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-bg-deep">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="text-fg">{siteConfig.legalName}</span> · {siteConfig.location}
        </p>
        <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-fg">
            Email
          </a>
          <a
            href={siteConfig.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg"
          >
            GitHub
          </a>
          <span>
            © <CurrentYear />
          </span>
        </p>
      </div>
    </footer>
  );
}
