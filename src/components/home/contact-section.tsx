import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { buttonClass } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GithubIcon } from "@/components/ui/github-icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { env, isContactConfigured } from "@/env";
import { siteConfig } from "@/lib/site";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-20 py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="06"
          label="Contact"
          title="Hiring for full-stack or integration work?"
          description="Tell me about the role or the system you need built. Messages land in my inbox, and I aim to reply within two working days."
        />
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <ContactForm
            configured={isContactConfigured()}
            turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
          <aside className="flex flex-col gap-5 border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <div>
              <h3 className="font-display text-xl font-semibold">Prefer email?</h3>
              <p className="mt-2 text-fg-muted">Write to me directly, any time.</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-3 block font-mono text-base break-all text-accent underline-offset-4 hover:underline"
              >
                {siteConfig.email}
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${siteConfig.email}`} className={buttonClass("outline")}>
                <Mail /> Open email app
              </a>
              <CopyButton value={siteConfig.email} label="Copy address" />
            </div>
            <a
              href={siteConfig.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("ghost", "-ml-5 w-fit")}
            >
              <GithubIcon /> github.com/{siteConfig.github.username}
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
