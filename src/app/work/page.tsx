import type { Metadata } from "next";
import { GithubActivity } from "@/components/work/github-activity";
import { WorkIndex } from "@/components/work/work-index";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Engineering case studies: the problem, the architecture, and the outcome.",
};

export default function WorkPage() {
  const projects = getProjects();

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-8 sm:pt-24">
        <header className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="kicker">The archive · {projects.length} case studies</p>
            <h1 className="mt-4 font-serif text-[clamp(4rem,12vw,10rem)] leading-[0.86] tracking-[-0.02em]">
              The <em>work</em>
            </h1>
          </div>
          <p className="text-xl text-pretty text-fg md:col-span-5">
            Production systems, written up like feature stories: what was broken, how I designed the
            fix, and what changed for the people using it.
          </p>
        </header>
        <WorkIndex projects={projects} />
      </section>
      <GithubActivity />
    </>
  );
}
