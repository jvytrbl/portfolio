// Stand-in for the Velite output (#site/content) so unit tests don't depend
// on a content build. Shapes mirror the real generated types.
import type { Credentials, Experience, Project, SkillCategory } from "../../.velite";

function project(
  fields: Pick<Project, "title" | "slug" | "featured" | "draft" | "publishedAt">,
): Project {
  return {
    ...fields,
    path: `projects/${fields.slug}`,
    url: `/projects/${fields.slug}`,
    summary: "summary",
    category: "Full-Stack",
    techStack: ["Next.js"],
    outcomes: [],
    metadata: { readingTime: 1, wordCount: 10 },
    toc: [],
    body: "",
  };
}

export const projects: Project[] = [
  project({
    title: "Old featured",
    slug: "old",
    featured: true,
    draft: false,
    publishedAt: "2025-01-01T00:00:00.000Z",
  }),
  project({
    title: "New regular",
    slug: "new",
    featured: false,
    draft: false,
    publishedAt: "2026-05-01T00:00:00.000Z",
  }),
  project({
    title: "Draft",
    slug: "draft",
    featured: true,
    draft: true,
    publishedAt: "2026-09-01T00:00:00.000Z",
  }),
];

export const experience: Experience[] = [
  {
    company: "Past",
    role: "Dev",
    employmentType: "Contract",
    start: "2020-01",
    end: "2022-01",
    summary: "",
    highlights: [],
    techStack: [],
  },
  {
    company: "Current",
    role: "Engineer",
    employmentType: "Full-time",
    start: "2023-06",
    summary: "",
    highlights: [],
    techStack: [],
  },
  {
    company: "Middle",
    role: "Dev",
    employmentType: "Full-time",
    start: "2022-02",
    end: "2023-05",
    summary: "",
    highlights: [],
    techStack: [],
  },
];

export const skills: SkillCategory[] = [{ category: "Frontend", items: ["React"] }];

export const credentials: Credentials = {
  education: [{ degree: "BSc", institution: "Uni", start: "2023-06" }],
  awards: [],
  certifications: [],
  languages: [{ name: "English", proficiency: "Expert" }],
};

export type { Credentials, Experience, Project, SkillCategory };
