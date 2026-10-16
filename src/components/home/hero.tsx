import { ArrowRight, Download } from "lucide-react";
import { Spotlight } from "@/components/motion/spotlight";
import { Typewriter, type TerminalLine } from "@/components/motion/typewriter";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { getProjects } from "@/lib/content";
import { RESUME_PATH, hasResume } from "@/lib/resume";
import { siteConfig } from "@/lib/site";

export function Hero() {
  const projectCount = getProjects().length;
  const lines: TerminalLine[] = [
    { kind: "command", text: "whoami" },
    { kind: "output", text: `${siteConfig.name} — ${siteConfig.title}` },
    { kind: "command", text: "cat focus.txt" },
    { kind: "muted", text: "full-stack systems · API integrations · clean architecture" },
    { kind: "command", text: "ls ~/projects | wc -l" },
    { kind: "success", text: `✓ ${projectCount} case studies ready` },
  ];

  return (
    <section className="relative isolate overflow-hidden border-b border-border/60">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -z-10 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <Spotlight />

      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="flex flex-col gap-6">
          {siteConfig.availability && (
            <p className="hero-rise inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-xs text-fg-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {siteConfig.availability}
            </p>
          )}

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            {siteConfig.name}
            <span className="mt-2 block bg-gradient-to-r from-accent to-fg-muted bg-clip-text text-transparent">
              {siteConfig.title}
            </span>
          </h1>

          <p
            className="hero-rise max-w-xl text-lg text-pretty text-fg-muted"
            style={{ animationDelay: "120ms" }}
          >
            {siteConfig.description}
          </p>

          <div className="hero-rise flex flex-wrap gap-3" style={{ animationDelay: "220ms" }}>
            <ButtonLink href="/projects">
              View projects <ArrowRight />
            </ButtonLink>
            {hasResume() && (
              <a href={RESUME_PATH} download className={buttonClass("outline")}>
                <Download /> Résumé
              </a>
            )}
            <ButtonLink href="/#contact" variant="ghost">
              Get in touch
            </ButtonLink>
          </div>
        </div>

        <div
          className="hero-rise overflow-hidden rounded-xl border border-border bg-bg-deep/90 font-mono text-sm shadow-2xl shadow-black/40 backdrop-blur"
          style={{ animationDelay: "320ms" }}
        >
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span className="size-3 rounded-full bg-danger/80" />
            <span className="size-3 rounded-full bg-highlight/80" />
            <span className="size-3 rounded-full bg-success/80" />
            <span className="ml-2 text-xs text-fg-muted">~/{siteConfig.github.username} — zsh</span>
          </div>
          <div className="p-5 leading-relaxed">
            <Typewriter lines={lines} />
          </div>
        </div>
      </div>
    </section>
  );
}
