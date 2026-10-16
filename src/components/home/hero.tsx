import { ArrowRight, Download } from "lucide-react";
import { Spotlight } from "@/components/motion/spotlight";
import { Typewriter, type TerminalLine } from "@/components/motion/typewriter";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { RESUME_PATH, hasResume } from "@/lib/resume";
import { siteConfig } from "@/lib/site";

// Proof comes from the Jotex case study; keep these in sync with
// content/projects/unified-defect-ticketing.mdx.
const lines: TerminalLine[] = [
  { kind: "command", text: "cat impact.log" },
  { kind: "output", lead: "4 departments", text: "use my defect-ticketing system every day" },
  {
    kind: "output",
    lead: "90,000+ records",
    text: "stay fast after moving pagination server-side",
  },
  {
    kind: "output",
    lead: "2 production apps",
    text: "built, shipped and run as the sole engineer",
  },
  { kind: "command", text: "whereami" },
  { kind: "muted", text: `${siteConfig.location} · open to KL & Selangor` },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/60">
      <Spotlight />

      <div className="mx-auto grid max-w-6xl gap-14 px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div className="flex flex-col gap-7">
          <p className="hero-rise flex flex-col gap-1 font-mono text-sm text-fg-muted sm:flex-row sm:items-center sm:gap-3">
            <span className="text-fg">{siteConfig.name}</span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>{siteConfig.title}</span>
          </p>

          <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
            {siteConfig.headline}
          </h1>

          <p
            className="hero-rise max-w-[52ch] text-lg text-pretty text-fg"
            style={{ animationDelay: "120ms" }}
          >
            {siteConfig.description}
          </p>

          <div
            className="hero-rise flex flex-wrap items-center gap-3"
            style={{ animationDelay: "200ms" }}
          >
            <ButtonLink href="/projects">
              See the case studies <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/#contact" variant="outline">
              Contact me
            </ButtonLink>
            {hasResume() && (
              <a href={RESUME_PATH} download className={buttonClass("ghost")}>
                <Download /> Résumé (PDF)
              </a>
            )}
          </div>

          {siteConfig.availability && (
            <p className="flex items-center gap-2 text-sm text-fg-muted">
              <span aria-hidden="true" className="size-2 rounded-full bg-success" />
              {siteConfig.availability}
            </p>
          )}
        </div>

        <div
          className="hero-rise overflow-hidden rounded-xl border border-border bg-bg-deep font-mono text-sm"
          style={{ animationDelay: "280ms" }}
        >
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="ml-2 text-xs text-fg-muted">impact.log</span>
          </div>
          <div className="p-5 pt-6 leading-relaxed">
            <Typewriter lines={lines} />
          </div>
        </div>
      </div>
    </section>
  );
}
