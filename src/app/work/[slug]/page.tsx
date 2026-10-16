import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/mdx/mdx-content";
import { MediaPlaceholder, ProjectVisual } from "@/components/media/project-visual";
import { ViewCounter } from "@/components/projects/view-counter";
import { GithubIcon } from "@/components/ui/github-icon";
import { getProjectBySlug, getProjects, getProjectSlugs, type Project } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { type: "article", publishedTime: project.publishedAt },
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const all = getProjects();
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all[(index + 1) % all.length];

  return (
    <article>
      <header className="mx-auto max-w-7xl px-4 pt-32 sm:px-8 sm:pt-40">
        <Link
          href="/work"
          className="group inline-flex min-h-11 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1"
          />
          All work
        </Link>
        <p className="mt-8 label">
          [ {String(index + 1).padStart(2, "0")} · {project.category} ]
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.92] font-medium tracking-[-0.045em] text-balance">
          {project.title}
        </h1>
      </header>

      <div className="mx-auto mt-12 max-w-[96rem] px-3 sm:px-6">
        <div className="aspect-[16/10] overflow-hidden rounded-sm bg-surface sm:aspect-[16/8]">
          <ProjectVisual project={project} priority sizes="100vw" />
        </div>
      </div>

      <section className="mx-auto mt-14 grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-12">
        <p className="font-serif text-3xl leading-snug text-pretty italic lg:col-span-7">
          {project.summary}
        </p>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm lg:col-span-4 lg:col-start-9">
          {project.role && (
            <div className="col-span-2">
              <dt className="label">Role</dt>
              <dd className="mt-1">{project.role}</dd>
            </div>
          )}
          <div>
            <dt className="label">Year</dt>
            <dd className="mt-1">
              <time dateTime={project.publishedAt}>{formatDate(project.publishedAt)}</time>
            </dd>
          </div>
          <div>
            <dt className="label">Read</dt>
            <dd className="mt-1 flex flex-wrap gap-x-2">
              {project.metadata.readingTime} min
              <ViewCounter slug={project.slug} />
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="label">Stack</dt>
            <dd className="mt-1 text-fg-muted">{project.techStack.join(", ")}</dd>
          </div>
          <ProjectLinks project={project} />
        </dl>
      </section>

      {project.outcomes.length > 0 && (
        <section aria-label="Key numbers" className="mx-auto mt-20 max-w-7xl px-4 sm:px-8">
          <dl className="grid gap-px overflow-hidden rounded-sm bg-border sm:auto-cols-fr sm:grid-flow-col">
            {project.outcomes.map((o) => (
              <div key={o.label} className="bg-bg p-6 sm:p-8">
                {/* Figures get the giant size; worded outcomes step down to stay elegant. */}
                <dd
                  className={cn(
                    "font-display leading-none font-medium",
                    o.value.length <= 7
                      ? "text-6xl tracking-[-0.05em]"
                      : "text-3xl tracking-[-0.03em] sm:text-4xl",
                  )}
                >
                  {o.value}
                </dd>
                <dt className="mt-3 font-serif text-lg text-fg-muted italic">{o.label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      <Gallery project={project} />

      <section aria-label="The story" className="mx-auto mt-24 max-w-7xl px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="font-serif text-lg text-fg-muted italic lg:col-span-3">[ The story ]</p>
          <div className="prose prose-lg min-w-0 lg:col-span-8">
            <MDXContent code={project.body} />
          </div>
        </div>
      </section>

      {next && next.slug !== project.slug && (
        <nav aria-label="Next project" className="mx-auto mt-32 max-w-7xl px-4 pb-28 sm:px-8">
          <Link
            href={next.url}
            className="group grid gap-6 border-t border-border pt-10 md:grid-cols-2 md:items-end"
          >
            <span>
              <span className="label">Next project</span>
              <span className="mt-3 block font-display text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
                {next.title}
              </span>
            </span>
            <span className="flex items-center justify-between gap-6 md:justify-end">
              <span className="aspect-[16/10] w-48 overflow-hidden rounded-sm bg-surface sm:w-64">
                <ProjectVisual project={next} morph={false} sizes="16rem" />
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-8 shrink-0 text-fg-muted transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-2 group-hover:text-fg"
              />
            </span>
          </Link>
        </nav>
      )}
    </article>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  if (!project.liveUrl && !project.repoUrl) return null;
  return (
    <div className="col-span-2 flex flex-wrap gap-3">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-ink-fg"
        >
          Live site <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      )}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5"
        >
          <GithubIcon className="size-4" /> Source code
        </a>
      )}
    </div>
  );
}

/** Screenshots. Typographic projects skip the gallery; image projects show
 *  placeholders until real screenshots are added to the frontmatter. */
function Gallery({ project }: { project: Project }) {
  if (project.visual === "typographic") return null;

  const shots = project.gallery;
  return (
    <section aria-label="Screens" className="mx-auto mt-24 max-w-[96rem] px-3 sm:px-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
        {shots.length > 0 ? (
          shots.map((shot) => (
            <figure
              key={shot.src.src}
              className={cn(
                shot.device === "mobile" ? "md:col-span-2" : "md:col-span-4",
                "min-w-0",
              )}
            >
              <div className="overflow-hidden rounded-sm bg-surface">
                <Image
                  src={shot.src.src}
                  width={shot.src.width}
                  height={shot.src.height}
                  placeholder="blur"
                  blurDataURL={shot.src.blurDataURL}
                  alt={shot.alt}
                  sizes={
                    shot.device === "mobile"
                      ? "(min-width: 768px) 33vw, 100vw"
                      : "(min-width: 768px) 66vw, 100vw"
                  }
                  className="h-auto w-full"
                />
              </div>
              {shot.caption && <figcaption className="mt-3 label">{shot.caption}</figcaption>}
            </figure>
          ))
        ) : (
          <>
            <div className="aspect-[16/10] overflow-hidden rounded-sm md:col-span-4">
              <MediaPlaceholder label="Desktop screen" hint="Screenshot coming soon" />
            </div>
            <div className="aspect-[16/10] overflow-hidden rounded-sm md:col-span-2 md:aspect-auto">
              <MediaPlaceholder label="Mobile screen" hint="Screenshot coming soon" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
