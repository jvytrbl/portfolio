import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedProjects } from "@/lib/content";

export function FeaturedProjects() {
  const projects = getFeaturedProjects();

  return (
    <section id="projects" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          index="01"
          path="projects"
          title="Featured work"
          description="Case studies covering the problem, the architecture, and the measurable outcome."
        />
        <ul className="grid gap-5 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal as="li" key={project.slug} delay={i * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href="/projects" variant="outline">
            All projects <ArrowRight />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
