import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { buttonClass } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GithubIcon } from "@/components/ui/github-icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { env, isContactConfigured } from "@/env";
import { siteConfig } from "@/lib/site";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          index="06"
          path="contact"
          title="Let's build something"
          description="Hiring, collaborating, or just want to talk architecture? Send a message or email me directly."
        />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="rounded-xl border border-border bg-surface/60 p-6 sm:p-8">
            <ContactForm
              configured={isContactConfigured()}
              turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            />
          </Reveal>
          <Reveal
            delay={0.08}
            className="flex flex-col gap-6 rounded-xl border border-border bg-surface/60 p-6 sm:p-8"
          >
            <p className="font-mono text-sm">
              <span className="text-highlight">$</span> echo $EMAIL
              <span className="mt-1 block text-lg break-all text-accent">{siteConfig.email}</span>
            </p>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${siteConfig.email}`} className={buttonClass("outline")}>
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
      </div>
    </section>
  );
}
