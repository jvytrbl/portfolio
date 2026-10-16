import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/mdx/mdx-content";
import { Reveal } from "@/components/motion/reveal";
import { TableOfContents } from "@/components/projects/table-of-contents";
import { ViewCounter } from "@/components/projects/view-counter";
import { buttonClass } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/github-icon";
import { Tag } from "@/components/ui/tag";
import { getProjectBySlug, getProjects, getProjectSlugs } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

// Columns match the number of metrics so the grid never has an empty cell.
const outcomeCols: Record<number, string> = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { type: "article", publishedTime: project.publishedAt },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const all = getProjects();
  const index = all.findIndex((p) => p.slug === project.slug);
  const newer = all[index - 1];
  const older = all[index + 1];

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Link
        href="/projects"
        className="group mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        All projects
      </Link>

      <header className="hero-rise flex flex-col gap-6 border-b border-border pb-10">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-fg-muted">
          <span className="tracking-wide uppercase">{project.category}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={project.publishedAt}>{formatDate(project.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{project.metadata.readingTime} min read</span>
          {project.role && (
            <>
              <span aria-hidden="true">·</span>
              <span>{project.role}</span>
            </>
          )}
          <ViewCounter slug={project.slug} />
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          {project.title}
        </h1>
        <p className="max-w-[60ch] text-xl text-pretty text-fg">{project.summary}</p>

        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.techStack.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>

        {(project.repoUrl || project.liveUrl) && (
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("primary")}
              >
                Live demo <ExternalLink />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("outline")}
              >
                <GithubIcon /> Source code
              </a>
            )}
          </div>
        )}
      </header>

      {project.outcomes.length > 0 && (
        <dl
          className={cn(
            "my-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border",
            outcomeCols[project.outcomes.length],
          )}
        >
          {project.outcomes.map((o, i) => (
            <Reveal key={o.label} delay={i * 0.06} className="bg-surface p-5">
              <dt className="font-mono text-xs text-fg-muted">{o.label}</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-fg">{o.value}</dd>
            </Reveal>
          ))}
        </dl>
      )}

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_200px]">
        <div className="prose prose-lg prose-headings:font-display prose-headings:tracking-tight prose-a:underline-offset-4">
          <MDXContent code={project.body} />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents entries={project.toc} />
          </div>
        </aside>
      </div>

      {(newer || older) && (
        <nav
          aria-label="More projects"
          className="mt-16 grid gap-4 border-t border-border pt-10 sm:grid-cols-2"
        >
          {older ? (
            <Link
              href={older.url}
              className="group rounded-xl border border-border p-5 transition-colors hover:border-accent/50"
            >
              <span className="flex items-center gap-1 font-mono text-xs text-fg-muted">
                <ArrowLeft className="size-3" /> Previous
              </span>
              <span className="mt-1 block font-medium group-hover:text-accent">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link
              href={newer.url}
              className="group rounded-xl border border-border p-5 text-right transition-colors hover:border-accent/50"
            >
              <span className="flex items-center justify-end gap-1 font-mono text-xs text-fg-muted">
                Next <ArrowRight className="size-3" />
              </span>
              <span className="mt-1 block font-medium group-hover:text-accent">{newer.title}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
