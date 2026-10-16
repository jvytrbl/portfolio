import type { Metadata } from "next";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilter } from "@/components/projects/project-filter";
import { getProjects } from "@/lib/content";
import { PROJECT_CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering case studies — problem, architecture, and outcomes.",
};

export default function ProjectsPage() {
  const projects = getProjects();
  const categories = PROJECT_CATEGORIES.filter((c) => projects.some((p) => p.category === c));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-12 flex flex-col gap-3">
        <p className="font-mono text-sm text-accent">~/projects</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Projects</h1>
        <p className="max-w-2xl text-pretty text-fg-muted">
          Each case study covers the problem, the system design behind it, and what it changed.
        </p>
      </header>
      <ProjectFilter
        categories={categories}
        items={projects.map((project) => ({
          key: project.slug,
          category: project.category,
          card: <ProjectCard project={project} />,
        }))}
      />
    </div>
  );
}
