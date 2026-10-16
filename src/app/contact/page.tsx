import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { buttonClass } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GithubIcon } from "@/components/ui/github-icon";
import { SplitHeading } from "@/components/ui/split-heading";
import { env, isContactConfigured } from "@/env";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Hiring for full-stack or integration work? Send a message or email directly.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-36 pb-28 sm:px-8 sm:pt-44">
      <SplitHeading
        as="h1"
        left="Say"
        right="Hello"
        middle={<p className="label">[ Reply within two working days ]</p>}
      />

      <div className="mt-20 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="mb-10 max-w-[48ch] font-display text-2xl leading-snug font-medium tracking-[-0.02em] text-pretty">
            Hiring for full-stack or integration work, or have a workflow that needs fixing?{" "}
            <em className="font-serif font-normal">Tell me about it.</em>
          </p>
          <ContactForm
            configured={isContactConfigured()}
            turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </div>
        <aside className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
          <div className="rounded-sm bg-ink p-8 text-ink-fg">
            <p className="font-serif text-lg text-ink-muted italic">[ Prefer email? ]</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-4 block font-display text-2xl font-medium tracking-[-0.02em] break-all underline-offset-4 hover:underline"
            >
              {siteConfig.email}
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-fg px-5 text-sm font-medium text-ink"
              >
                <Mail className="size-4" /> Open email app
              </a>
            </div>
          </div>
          <CopyButton value={siteConfig.email} label="Copy address" />
          <div>
            <p className="label">Elsewhere</p>
            <a
              href={siteConfig.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("outline", "mt-3")}
            >
              <GithubIcon className="size-4" /> github.com/{siteConfig.github.username}
            </a>
          </div>
          <div>
            <p className="label">Based in</p>
            <p className="mt-2 text-lg">{siteConfig.location}</p>
            <p className="text-fg-muted">{siteConfig.availability}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
