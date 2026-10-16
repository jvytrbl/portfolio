import Link from "next/link";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { StoryScroll } from "@/components/home/story-scroll";
import { MediaPlaceholder, ProjectVisual } from "@/components/media/project-visual";
import { ScrollLitText } from "@/components/motion/scroll-lit-text";
import { SplitHeading } from "@/components/ui/split-heading";
import { ProjectFeature } from "@/components/work/project-feature";
import { getFeaturedProjects, getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const projects = getProjects();
  const featured = getFeaturedProjects();
  const coverStory = featured[0];

  return (
    <>
      {/* Gallery strip under the floating nav */}
      <div className="fade-in pt-20 sm:pt-24">
        <HeroCarousel
          slides={projects.map((p, i) => ({
            key: p.slug,
            href: p.url,
            caption: p.title,
            media: (
              <ProjectVisual
                project={p}
                morph={false}
                priority={i < 2}
                sizes="(min-width: 1024px) 40vw, 85vw"
              />
            ),
          }))}
        />
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-24 pb-32 sm:px-8">
        <SplitHeading
          as="h1"
          left="Muhammad"
          right="Hakimi"
          middlePlacement="below"
          middle={
            <p className="text-center label">
              [ {siteConfig.title} · {siteConfig.location} ]
            </p>
          }
        />

        <div className="mt-20 grid gap-10 md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-3">
            <p className="font-serif text-lg text-fg-muted italic">[ Who I am ]</p>
            {/* Portrait slot: replace with a real photo when available. */}
            <div className="aspect-[4/5] w-40 overflow-hidden rounded-sm">
              <MediaPlaceholder label="Portrait" hint="Photo coming soon" />
            </div>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <ScrollLitText
              className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.12] font-medium tracking-[-0.025em] text-pretty"
              segments={[
                { text: "I turn messy business workflows into production systems," },
                { text: "the unglamorous kind that people use every day.", serif: true },
                {
                  text: "Multi-tenant dashboards, ERP integrations with Microsoft Business Central, and AI that only narrates numbers the application has already checked.",
                },
              ]}
            />
            <p className="mt-8 max-w-[56ch] text-pretty text-fg-muted">{siteConfig.description}</p>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
              <Link
                href="/about"
                className="inline-flex min-h-11 items-center rounded-full bg-surface-raised px-6 text-sm font-medium transition-colors hover:bg-border"
              >
                About me
              </Link>
              <p className="flex items-center gap-3 label">
                <span aria-hidden="true" className="h-px w-8 bg-fg-faint" />
                Building since {siteConfig.since}
              </p>
            </div>
          </div>
        </div>
      </section>

      {coverStory && (
        <StoryScroll
          href={coverStory.url}
          caption={`${coverStory.title}${coverStory.role ? `, ${coverStory.role.split(" · ").pop()}` : ""}`}
        />
      )}

      <section className="mx-auto max-w-7xl px-4 pt-28 pb-32 sm:px-8">
        <SplitHeading
          left="Selected"
          right="Work"
          middle={
            <Link
              href="/work"
              className="inline-flex size-24 items-center justify-center rounded-full bg-surface-raised text-center text-[0.7rem] font-medium tracking-wide uppercase transition-[background-color,transform] duration-500 ease-out-expo hover:scale-105 hover:bg-border sm:size-28"
            >
              All work
            </Link>
          }
        />
        <div className="mt-16 flex flex-col gap-24">
          {featured.map((project, i) => (
            <ProjectFeature key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
