import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Project } from "@/lib/content";

/**
 * Editorial table of contents. Each title shares a view-transition name with
 * the case-study headline, so it morphs into place on navigation.
 */
export function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <ol className="border-t border-border">
      {projects.map((project, i) => (
        <li key={project.slug} className="border-b border-border">
          <Link
            href={project.url}
            className="group grid gap-x-8 gap-y-3 py-8 sm:grid-cols-[4rem_1fr_auto] sm:py-10"
          >
            <span className="font-mono text-sm text-fg-muted transition-colors group-hover:text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex flex-col gap-3">
              <ViewTransition name={`title-${project.slug}`} share="title-morph" default="none">
                <span className="w-fit font-serif text-4xl leading-[1.02] text-balance sm:text-6xl">
                  {project.title}
                </span>
              </ViewTransition>
              <span className="max-w-[62ch] text-pretty text-fg-muted">{project.summary}</span>
              {project.outcomes[0] && (
                <span className="kicker">
                  {project.outcomes[0].value} · {project.outcomes[0].label}
                </span>
              )}
            </span>
            <span className="flex items-start gap-6 sm:flex-col sm:items-end sm:text-right">
              <span className="kicker">{project.category}</span>
              <span className="kicker">{new Date(project.publishedAt).getUTCFullYear()}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-6 text-fg-muted transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
              />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
