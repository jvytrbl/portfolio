import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/50">
      <div className="mb-4 flex items-center justify-between gap-2 font-mono text-xs text-fg-muted">
        <span className="tracking-wide uppercase">{project.category}</span>
        <time dateTime={project.publishedAt}>{formatDate(project.publishedAt)}</time>
      </div>

      <h3 className="font-display text-xl font-semibold tracking-tight">
        <Link href={project.url} className="after:absolute after:inset-0">
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-pretty text-fg-muted">{project.summary}</p>

      {project.outcomes[0] && (
        <p className="mt-5 text-sm text-fg-muted">
          <span className="font-display text-2xl font-semibold text-fg">
            {project.outcomes[0].value}
          </span>{" "}
          {project.outcomes[0].label.toLowerCase()}
        </p>
      )}

      <p className="mt-4 font-mono text-xs text-fg-muted">
        {project.techStack.slice(0, 5).join(" · ")}
      </p>

      <ArrowUpRight
        aria-hidden="true"
        className="absolute top-6 right-6 size-5 text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </article>
  );
}
