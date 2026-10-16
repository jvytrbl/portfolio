import { Mail } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { buttonClass } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GithubIcon } from "@/components/ui/github-icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/lib/site";

// The full contact form (Server Action + Resend) arrives in Phase 4.
export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-border/60 bg-bg-deep/50 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          index="05"
          path="contact"
          title="Let's build something"
          description="Hiring, collaborating, or just want to talk architecture? My inbox is open."
        />
        <Reveal className="flex flex-col gap-6 rounded-xl border border-border bg-surface/60 p-6 sm:p-8">
          <p className="font-mono text-sm">
            <span className="text-highlight">$</span> echo $EMAIL
            <span className="mt-1 block text-lg text-accent sm:text-xl">{siteConfig.email}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${siteConfig.email}`} className={buttonClass("primary")}>
              <Mail /> Send email
            </a>
            <CopyButton value={siteConfig.email} label="Copy address" />
            <a
              href={siteConfig.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("ghost")}
            >
              <GithubIcon /> GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
