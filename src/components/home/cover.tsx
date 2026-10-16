import { ArrowDownRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getFeaturedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

// The landing "cover": masthead, name, standfirst and the cover story.
export function Cover() {
  const coverStory = getFeaturedProjects()[0];
  const { issue, year } = siteConfig.edition;

  return (
    <section className="mx-auto flex max-w-7xl flex-col px-4 pt-8 pb-10 sm:min-h-[calc(100svh-4rem)] sm:px-8">
      <div className="fade-in flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border pb-3 kicker">
        <span>
          Nº {issue} · {year}
        </span>
        <span className="hidden sm:inline">{siteConfig.location}</span>
        <span>{siteConfig.title}</span>
      </div>

      <h1 className="py-12 font-serif text-[clamp(4.5rem,21vw,14rem)] leading-[0.86] tracking-[-0.02em] sm:flex-1 sm:py-14">
        <span className="reveal-line">
          <span>Muhammad</span>
        </span>
        <span className="reveal-line">
          <span className="italic" style={{ ["--delay" as string]: "120ms" }}>
            Hakimi<span className="text-accent-strong not-italic">.</span>
          </span>
        </span>
      </h1>

      <div
        className="fade-in grid gap-10 border-t border-border pt-8 md:grid-cols-12"
        style={{ ["--delay" as string]: "450ms" }}
      >
        <p className="font-serif text-3xl leading-tight text-balance md:col-span-6 lg:text-4xl">
          {siteConfig.tagline}
        </p>

        {coverStory && (
          <Link
            href={coverStory.url}
            className="group flex flex-col gap-3 md:col-span-5 md:col-start-8 md:border-l md:border-border md:pl-8"
          >
            <span className="kicker text-accent">The cover story</span>
            <span className="text-xl leading-snug text-pretty text-fg">
              WhatsApp groups became one ticketing system that four departments use every day.
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors group-hover:text-fg">
              Read the story
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
              />
            </span>
          </Link>
        )}
      </div>

      <p className="mt-10 flex items-center gap-2 kicker">
        <ArrowDownRight aria-hidden="true" className="size-3.5" /> Scroll for the story
      </p>
    </section>
  );
}
