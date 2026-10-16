import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProjectVisual } from "@/components/media/project-visual";
import type { Project } from "@/lib/content";

/** Large project card: full-width image with a caption block underneath. */
export function ProjectFeature({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group @container">
      <Link href={project.url} className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-surface sm:aspect-[16/9]">
          <div className="size-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.015]">
            <ProjectVisual project={project} />
          </div>
          <span className="absolute top-4 right-4 inline-flex min-h-10 items-center gap-1.5 rounded-full bg-bg px-4 text-xs font-medium text-fg shadow-sm transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5">
            View project <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </span>
        </div>
        {/* Caption adapts to the card's own width: stacked in grids, spread out when wide. */}
        <div className="mt-5 grid gap-3 @3xl:grid-cols-12 @3xl:gap-6">
          <p className="flex flex-wrap gap-x-3 label @3xl:col-span-2 @3xl:block @3xl:pt-2">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span className="@3xl:hidden">
              {project.category} · {new Date(project.publishedAt).getUTCFullYear()}
            </span>
          </p>
          <div className="@3xl:col-span-6">
            <h3 className="font-display text-3xl font-medium tracking-[-0.03em] text-balance @3xl:text-4xl">
              {project.title}
            </h3>
            <p className="mt-2 max-w-[52ch] text-pretty text-fg-muted">{project.summary}</p>
          </div>
          <div className="@3xl:col-span-4 @3xl:pt-2 @3xl:text-right">
            <p className="hidden label @3xl:block">
              {project.category} · {new Date(project.publishedAt).getUTCFullYear()}
            </p>
            {project.outcomes[0] && (
              <p className="font-serif text-lg italic @3xl:mt-1">
                {project.outcomes[0].value} {project.outcomes[0].label.toLowerCase()}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
