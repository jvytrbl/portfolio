import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedProjects, type Project } from "@/lib/content";

export function FeaturedProjects() {
  const [lead, ...rest] = getFeaturedProjects();
  if (!lead) return null;

  return (
    <section id="projects" className="scroll-mt-20 py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="01"
          label="Selected work"
          title="Systems people rely on every day"
          description="Each case study covers the problem, the architecture, and what changed."
        />

        <Reveal>
          <LeadProject project={lead} />
        </Reveal>

        {rest.length > 0 && (
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {rest.map((project) => (
              <Reveal as="li" key={project.slug}>
                <CompactProject project={project} />
              </Reveal>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <ButtonLink href="/projects" variant="outline">
            All projects <ArrowRight />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function LeadProject({ project }: { project: Project }) {
  return (
    <article className="group relative grid gap-10 rounded-2xl border border-border bg-surface p-8 transition-colors duration-300 hover:border-accent/50 sm:p-10 lg:grid-cols-[1.3fr_1fr]">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">
          {project.category}
          {project.role && ` · ${project.role}`}
        </p>
        <h3 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          <Link href={project.url} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="max-w-[60ch] text-lg text-pretty text-fg">{project.summary}</p>
        <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-fg-muted">
          {project.techStack.join(" · ")}
        </p>
        <span className="flex items-center gap-1 text-sm font-medium text-accent">
          Read the case study
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>

      {project.outcomes.length > 0 && (
        <dl className="flex flex-col justify-center divide-y divide-border lg:border-l lg:border-border lg:pl-10">
          {project.outcomes.map((o) => (
            <div key={o.label} className="py-4 first:pt-0 last:pb-0">
              <dt className="text-sm text-fg-muted">{o.label}</dt>
              <dd className="font-display text-3xl font-semibold text-fg tabular-nums">
                {o.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

function CompactProject({ project }: { project: Project }) {
  const outcome = project.outcomes[0];
  return (
    <article className="group relative grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
      <div>
        <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">
          {project.category}
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
          <Link
            href={project.url}
            className="transition-colors group-hover:text-accent after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-1 max-w-[70ch] text-pretty text-fg-muted">{project.summary}</p>
      </div>
      {outcome && (
        <p className="text-sm text-fg-muted sm:text-right">
          <span className="block font-display text-2xl font-semibold text-fg">{outcome.value}</span>
          {outcome.label}
        </p>
      )}
    </article>
  );
}
