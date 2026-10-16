import type { Metadata } from "next";
import { Career } from "@/components/about/career";
import { Chapter } from "@/components/about/chapter";
import { Credentials } from "@/components/about/credentials";
import { Toolkit } from "@/components/about/toolkit";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.legalName}: software engineer in ${siteConfig.location}. Career, credentials and toolkit.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-8 sm:pt-24">
      <header className="grid gap-10 border-b border-border pb-16 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="kicker">Profile</p>
          <h1 className="mt-4 font-serif text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.88] tracking-[-0.02em]">
            {siteConfig.legalName.split(" ").slice(0, 2).join(" ")}{" "}
            <em>{siteConfig.legalName.split(" ").slice(2).join(" ")}</em>
          </h1>
        </div>
        <dl className="flex flex-col gap-4 self-end text-sm md:col-span-4">
          <div>
            <dt className="kicker">Based in</dt>
            <dd className="mt-1 text-lg">{siteConfig.location}</dd>
          </div>
          <div>
            <dt className="kicker">Looking for</dt>
            <dd className="mt-1 text-lg">{siteConfig.availability}</dd>
          </div>
        </dl>
      </header>

      <section aria-label="Introduction" className="grid gap-10 py-20 md:grid-cols-12">
        <p className="font-serif text-3xl leading-snug text-balance md:col-span-5 lg:text-4xl">
          {siteConfig.tagline}
        </p>
        <div className="space-y-6 text-lg text-pretty md:col-span-6 md:col-start-7">
          <p>
            My background is Computer Science (Software Engineering) at Universiti Tenaga Nasional.
            I build and run production systems end to end: multi-tenant dashboards and internal
            tools with Next.js and Supabase, and server-side integrations with Microsoft Dynamics
            Business Central that take manual steps out of real business workflows.
          </p>
          <p>
            On the AI side I build retrieval-augmented generation pipelines and agentic systems with
            one firm rule: the model only narrates data the application has already calculated and
            validated. It is never left in charge of the numbers.
          </p>
          <p className="text-fg-muted">
            I work test-first with Vitest, Playwright and Stryker mutation testing, and I&apos;ve
            shipped under formal security standards such as ISO 27001. I care about architecture,
            data security and real-world performance trade-offs more than trends.
          </p>
        </div>
      </section>

      <Chapter numeral="I" title="Career" id="career">
        <Career />
      </Chapter>
      <Chapter numeral="II" title="Credentials" id="credentials">
        <Credentials />
      </Chapter>
      <Chapter numeral="III" title="Toolkit" id="toolkit">
        <Toolkit />
      </Chapter>
    </div>
  );
}
