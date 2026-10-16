import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { buttonClass } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GithubIcon } from "@/components/ui/github-icon";
import { env, isContactConfigured } from "@/env";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Hiring for full-stack or integration work? Send a message or email directly.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-16 pb-28 sm:px-8 sm:pt-24">
      <header className="grid gap-8 border-b border-border pb-14 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="kicker">Correspondence</p>
          <h1 className="mt-4 font-serif text-[clamp(4rem,12vw,10rem)] leading-[0.86] tracking-[-0.02em]">
            Write <em>to me.</em>
          </h1>
        </div>
        <p className="text-xl text-pretty md:col-span-5">
          Hiring for full-stack or integration work, or have a workflow that needs fixing? Tell me
          about it. I aim to reply within two working days.
        </p>
      </header>

      <div className="grid gap-16 pt-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm
            configured={isContactConfigured()}
            turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </div>
        <aside className="flex flex-col gap-8 border-t border-border pt-10 lg:col-span-4 lg:col-start-9 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <div>
            <p className="kicker">Prefer email?</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-3 block font-serif text-3xl leading-tight break-all text-fg underline decoration-accent-strong decoration-1 underline-offset-8 transition-colors hover:text-accent"
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
          <div>
            <p className="kicker">Elsewhere</p>
            <a
              href={siteConfig.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-fg-muted transition-colors hover:text-fg"
            >
              <GithubIcon className="size-4" /> github.com/{siteConfig.github.username}
            </a>
          </div>
          <div>
            <p className="kicker">Based in</p>
            <p className="mt-2 text-lg">{siteConfig.location}</p>
            <p className="text-fg-muted">{siteConfig.availability}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
