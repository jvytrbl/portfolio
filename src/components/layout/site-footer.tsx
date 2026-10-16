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
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 font-mono text-xs text-fg-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © <CurrentYear /> {siteConfig.name}
        </p>
        <p className="flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-success" />
          built with Next.js · deployed on Vercel
        </p>
      </div>
    </footer>
  );
}
