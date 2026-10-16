import {
  credentials,
  experience,
  projects,
  skills,
  type Experience,
  type Project,
} from "#site/content";

// Typed read layer over the Velite output. Pages import from here, never
// from #site/content directly, so sorting/filtering rules live in one place.

const isProduction = process.env.NODE_ENV === "production";

function byNewest(a: Project, b: Project) {
  return b.publishedAt.localeCompare(a.publishedAt);
}

export function getProjects(): Project[] {
  return projects.filter((p) => !(isProduction && p.draft)).sort(byNewest);
}

export function getFeaturedProjects(): Project[] {
  // Explicit `order` wins; unordered projects follow, newest first.
  return getProjects()
    .filter((p) => p.featured)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return getProjects().map((p) => p.slug);
}

export function getExperience(): Experience[] {
  // YYYY-MM strings sort lexicographically; current roles (no end) first.
  return [...experience].sort(
    (a, b) =>
      (b.end ?? "9999-99").localeCompare(a.end ?? "9999-99") || b.start.localeCompare(a.start),
  );
}

export function getSkills() {
  return skills;
}

export function getCredentials() {
  return credentials;
}

export type { Experience, Project };
export type { Credentials, SkillCategory } from "#site/content";
