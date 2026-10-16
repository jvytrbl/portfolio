import type { Metadata } from "next";
import { Career } from "@/components/about/career";
import { Chapter } from "@/components/about/chapter";
import { Credentials } from "@/components/about/credentials";
import { Toolkit } from "@/components/about/toolkit";
import { MediaPlaceholder } from "@/components/media/project-visual";
import { SplitHeading } from "@/components/ui/split-heading";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.legalName}: software engineer in ${siteConfig.location}. Career, credentials and toolkit.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-36 pb-24 sm:px-8 sm:pt-44">
      <SplitHeading
        as="h1"
        left="About"
        right="Hakimi"
        middlePlacement="below"
        middle={<p className="label">[ {siteConfig.legalName} ]</p>}
      />

      <section aria-label="Introduction" className="mt-20 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          {/* Portrait slot: replace with a real photo when available. */}
          <div className="aspect-[4/5] overflow-hidden rounded-sm">
            <MediaPlaceholder label="Portrait" hint="Photo coming soon" />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="label">Based in</dt>
              <dd className="mt-1">{siteConfig.location}</dd>
            </div>
            <div>
              <dt className="label">Looking for</dt>
              <dd className="mt-1">{siteConfig.availability}</dd>
            </div>
          </dl>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.12] font-medium tracking-[-0.025em] text-pretty">
            I build the unglamorous systems{" "}
            <em className="font-serif font-normal">that people use every day,</em> and I like them
            most when they quietly replace a mess.
          </p>
          <div className="mt-10 space-y-6 text-lg text-pretty text-fg-muted">
            <p>
              My background is Computer Science (Software Engineering) at Universiti Tenaga
              Nasional. I build and run production systems end to end: multi-tenant dashboards and
              internal tools with Next.js and Supabase, and server-side integrations with Microsoft
              Dynamics Business Central that take manual steps out of real business workflows.
            </p>
            <p>
              On the AI side I build retrieval-augmented generation pipelines and agentic systems
              with one firm rule: the model only narrates data the application has already
              calculated and validated. It is never left in charge of the numbers.
            </p>
            <p>
              I work test-first with Vitest, Playwright and Stryker mutation testing, and I&apos;ve
              shipped under formal security standards such as ISO 27001. I care about architecture,
              data security and real-world performance trade-offs more than trends.
            </p>
          </div>
        </div>
      </section>

      <Chapter number="01" title="Career" id="career">
        <Career />
      </Chapter>
      <Chapter number="02" title="Credentials" id="credentials">
        <Credentials />
      </Chapter>
      <Chapter number="03" title="Toolkit" id="toolkit">
        <Toolkit />
      </Chapter>
    </div>
  );
}
