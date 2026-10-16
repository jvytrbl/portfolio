import { Closing } from "@/components/home/closing";
import { Cover } from "@/components/home/cover";
import { PullQuote } from "@/components/home/pull-quote";
import { StoryScroll } from "@/components/home/story-scroll";
import { WorkIndex } from "@/components/work/work-index";
import { getFeaturedProjects } from "@/lib/content";
import Link from "next/link";

export default function HomePage() {
  const featured = getFeaturedProjects();
  const coverStory = featured[0];

  return (
    <>
      <Cover />

      {coverStory && (
        <StoryScroll
          href={coverStory.url}
          caption={`Fig. 1 · ${coverStory.title}${coverStory.role ? `, ${coverStory.role.split(" · ").pop()}` : ""}`}
        />
      )}

      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="kicker">Selected work</p>
            <h2 className="mt-3 font-serif text-5xl leading-none sm:text-7xl">In this issue</h2>
          </div>
          <Link
            href="/work"
            className="inline-flex min-h-11 items-center text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
          >
            The full archive
          </Link>
        </div>
        <WorkIndex projects={featured} />
      </section>

      <PullQuote
        quote="The AI narrates the numbers. It never calculates them."
        attribution="Design principle · Vendor Performance Intelligence Platform"
      />

      <Closing />
    </>
  );
}
