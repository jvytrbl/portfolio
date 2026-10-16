import Image from "next/image";
import { ViewTransition } from "react";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

type ProjectVisualProps = {
  project: Pick<Project, "slug" | "title" | "cover" | "visual" | "outcomes" | "category">;
  /** Used for the shared-element morph between pages. */
  morph?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * The image for a project: its screenshot, a type-only tile (for work that
 * can't be shown, like internal systems), or a neutral placeholder until a
 * screenshot is added. Always fills its container; give the parent an aspect.
 */
export function ProjectVisual({
  project,
  morph = true,
  priority,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className,
}: ProjectVisualProps) {
  const body = (
    <div className={cn("@container relative size-full overflow-hidden", className)}>
      {project.visual === "typographic" ? (
        <TypographicTile project={project} />
      ) : project.cover ? (
        <Image
          src={project.cover.src}
          width={project.cover.width}
          height={project.cover.height}
          placeholder="blur"
          blurDataURL={project.cover.blurDataURL}
          alt={`${project.title} screenshot`}
          sizes={sizes}
          priority={priority}
          className="size-full object-cover"
        />
      ) : (
        <MediaPlaceholder label={project.title} hint="Screenshot coming soon" />
      )}
    </div>
  );

  return morph ? (
    <ViewTransition name={`media-${project.slug}`} share="media-morph" default="none">
      {body}
    </ViewTransition>
  ) : (
    body
  );
}

function TypographicTile({ project }: { project: ProjectVisualProps["project"] }) {
  const lead = project.outcomes[0];
  return (
    <div className="flex size-full flex-col justify-between bg-ink p-[6%] text-ink-fg">
      <span className="text-xs text-ink-muted">{project.category}</span>
      {lead && (
        <span>
          <span className="block font-display text-[clamp(5rem,40cqi,18rem)] leading-[0.78] font-medium tracking-[-0.06em]">
            {lead.value}
          </span>
          <span className="mt-3 block font-serif text-[clamp(1.25rem,5.5cqi,3.25rem)] leading-tight italic">
            {lead.label.toLowerCase()}
          </span>
        </span>
      )}
      <span className="text-xs text-ink-muted">
        Internal system · shown as type, not screenshots
      </span>
    </div>
  );
}

export function MediaPlaceholder({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-2 bg-surface p-6 text-center">
      <span className="font-display text-lg font-medium tracking-tight text-fg-muted">{label}</span>
      <span className="label">{hint}</span>
    </div>
  );
}
