import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { MDXContent } from "@/components/mdx/mdx-content";
import { TableOfContents } from "@/components/projects/table-of-contents";
import { ViewCounter } from "@/components/projects/view-counter";
import { GithubIcon } from "@/components/ui/github-icon";
import { getProjectBySlug, getProjects, getProjectSlugs } from "@/lib/content";
import { formatDate } from "@/lib/format";

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

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const all = getProjects();
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all[(index + 1) % all.length];
  const number = String(index + 1).padStart(2, "0");

  return (
    <article>
      <header className="mx-auto max-w-7xl px-4 pt-10 sm:px-8 sm:pt-14">
        <Link
          href="/work"
          className="group inline-flex min-h-11 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1"
          />
          The work
        </Link>

        <p className="mt-10 flex flex-wrap gap-x-4 gap-y-1 border-b border-border pb-3 kicker">
          <span>Case study Nº {number}</span>
          <span aria-hidden="true">·</span>
          <span>{project.category}</span>
        </p>

        <h1 className="mt-10 font-serif text-[clamp(3.25rem,9vw,8.5rem)] leading-[0.92] tracking-[-0.015em] text-balance">
          <ViewTransition name={`title-${project.slug}`} share="title-morph" default="none">
            <span className="inline-block">{project.title}</span>
          </ViewTransition>
        </h1>

        <div className="mt-10 grid gap-10 border-t border-border pt-8 lg:grid-cols-12">
          <p className="fade-in font-serif text-2xl leading-snug text-pretty italic sm:text-3xl lg:col-span-7">
            {project.summary}
          </p>
          <dl className="fade-in grid grid-cols-2 gap-x-6 gap-y-4 text-sm lg:col-span-4 lg:col-start-9">
            {project.role && (
              <div className="col-span-2">
                <dt className="kicker">Role</dt>
                <dd className="mt-1">{project.role}</dd>
              </div>
            )}
            <div>
              <dt className="kicker">Published</dt>
              <dd className="mt-1">
                <time dateTime={project.publishedAt}>{formatDate(project.publishedAt)}</time>
              </dd>
            </div>
            <div>
              <dt className="kicker">Reading</dt>
              <dd className="mt-1 flex flex-wrap gap-x-2">
                {project.metadata.readingTime} min
                <ViewCounter slug={project.slug} />
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="kicker">Stack</dt>
              <dd className="mt-1 text-fg-muted">{project.techStack.join(", ")}</dd>
            </div>
            {(project.liveUrl || project.repoUrl) && (
              <div className="col-span-2 flex flex-wrap gap-x-6 gap-y-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 text-accent underline-offset-4 hover:underline"
                  >
                    Live demo <ExternalLink aria-hidden="true" className="size-4" />
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 text-accent underline-offset-4 hover:underline"
                  >
                    <GithubIcon className="size-4" /> Source code
                  </a>
                )}
              </div>
            )}
          </dl>
        </div>
      </header>

      {project.outcomes.length > 0 && (
        <section aria-label="By the numbers" className="mx-auto mt-16 max-w-7xl px-4 sm:px-8">
          <p className="mb-4 kicker">By the numbers</p>
          <dl className="grid divide-border border-y border-border sm:auto-cols-fr sm:grid-flow-col sm:divide-x">
            {project.outcomes.map((o) => (
              <div key={o.label} className="py-6 sm:px-6 sm:first:pl-0">
                <dd className="font-serif text-6xl leading-none text-fg">{o.value}</dd>
                <dt className="mt-3 text-sm text-fg-muted">{o.label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="mx-auto mt-20 grid max-w-7xl gap-16 px-4 sm:px-8 lg:grid-cols-12">
        <div className="prose prose-lg min-w-0 lg:col-span-8 lg:col-start-2 prose-a:underline-offset-4">
          <MDXContent code={project.body} />
        </div>
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28">
            <TableOfContents entries={project.toc} />
          </div>
        </aside>
      </div>

      {next && next.slug !== project.slug && (
        <nav aria-label="Next story" className="mx-auto mt-32 max-w-7xl px-4 pb-24 sm:px-8">
          <Link href={next.url} className="group block border-t border-border pt-10">
            <span className="kicker">Next story</span>
            <span className="mt-4 flex items-end justify-between gap-6">
              <span className="font-serif text-4xl leading-[1.02] text-balance sm:text-7xl">
                {next.title}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="mb-2 size-8 shrink-0 text-fg-muted transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-2 group-hover:text-accent"
              />
            </span>
          </Link>
        </nav>
      )}
    </article>
  );
}
