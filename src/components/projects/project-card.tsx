import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import type { Project } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-surface hover:shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--accent)_35%,transparent)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="mb-4 flex items-center justify-between gap-2 font-mono text-xs text-fg-muted">
        <span className="text-highlight">{project.category}</span>
        <time dateTime={project.publishedAt}>{formatDate(project.publishedAt)}</time>
      </div>

      <h3 className="text-xl font-semibold tracking-tight">
        <Link href={project.url} className="after:absolute after:inset-0">
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-pretty text-fg-muted">{project.summary}</p>

      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
        {project.techStack.slice(0, 5).map((tech) => (
          <li key={tech}>
            <Tag>{tech}</Tag>
          </li>
        ))}
      </ul>

      <ArrowUpRight
        aria-hidden="true"
        className="absolute top-6 right-6 size-5 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
      />
    </article>
  );
}
