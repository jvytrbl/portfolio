import { getExperience, getProjects, getSkills } from "@/lib/content";
import { siteConfig } from "@/lib/site";

// Placeholder — the full hero and sections land in Phase 3.
export default function HomePage() {
  const stats = [
    `${getProjects().length} projects`,
    `${getExperience().length} roles`,
    `${getSkills().length} skill groups`,
  ].join(" · ");

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 py-24 sm:px-6 sm:py-32">
        <p className="font-mono text-sm text-accent">$ whoami</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {siteConfig.name}
          <span className="block text-fg-muted">{siteConfig.title}</span>
        </h1>
        <p className="max-w-xl text-lg text-pretty text-fg-muted">{siteConfig.description}</p>

        <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-bg-deep font-mono text-sm shadow-2xl shadow-black/30">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span className="size-3 rounded-full bg-danger/80" />
            <span className="size-3 rounded-full bg-highlight/80" />
            <span className="size-3 rounded-full bg-success/80" />
            <span className="ml-2 text-xs text-fg-muted">~/portfolio — zsh</span>
          </div>
          <div className="space-y-1 p-4">
            <p>
              <span className="text-highlight">$</span> velite build
            </p>
            <p className="text-success">✓ content loaded: {stats}</p>
            <p className="text-fg-muted">→ pages and case studies coming next</p>
            <p>
              <span className="text-highlight">$</span>{" "}
              <span aria-hidden="true" className="animate-blink text-accent">
                ▍
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
