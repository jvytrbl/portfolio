import type { Metadata } from "next";
import { SplitHeading } from "@/components/ui/split-heading";
import { GithubActivity } from "@/components/work/github-activity";
import { ProjectFeature } from "@/components/work/project-feature";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects: production systems, ERP integrations and applied AI.",
};

export default function WorkPage() {
  const projects = getProjects();

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-36 pb-28 sm:px-8 sm:pt-44">
        <SplitHeading
          as="h1"
          left="Selected"
          right="Work"
          middle={<p className="label">[ {projects.length} projects ]</p>}
        />
        <p className="mt-10 max-w-[56ch] text-lg text-pretty text-fg-muted">
          Production systems and the thinking behind them. Each project shows what was broken, what
          I built, and what changed for the people using it.
        </p>
        <div className="mt-20 grid gap-x-8 gap-y-24 lg:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectFeature key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>
      <GithubActivity />
    </>
  );
}
