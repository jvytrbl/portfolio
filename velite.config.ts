import rehypeShiki from "@shikijs/rehype";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, s } from "velite";
import { PROJECT_CATEGORIES } from "./src/lib/categories";

const projects = defineCollection({
  name: "Project",
  pattern: "projects/*.mdx",
  schema: s
    .object({
      title: s.string().max(80),
      path: s.path(),
      summary: s.string().max(200),
      category: s.enum(PROJECT_CATEGORIES),
      techStack: s.array(s.string()).nonempty(),
      role: s.string().optional(),
      repoUrl: s.string().url().optional(),
      liveUrl: s.string().url().optional(),
      featured: s.boolean().default(false),
      // Lower numbers come first among featured projects (the first one leads).
      order: s.number().int().optional(),
      draft: s.boolean().default(false),
      publishedAt: s.isodate(),
      outcomes: s
        .array(s.object({ label: s.string(), value: s.string() }))
        .max(4)
        .default([]),
      cover: s.image().optional(),
      metadata: s.metadata(),
      toc: s.toc(),
      body: s.mdx(),
    })
    .transform((data) => {
      const slug = data.path.replace(/^projects\//, "");
      return { ...data, slug, url: `/work/${slug}` };
    }),
});

// "YYYY-MM" — month precision is all a career timeline needs.
const yearMonth = s.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Expected YYYY-MM");

const experience = defineCollection({
  name: "Experience",
  pattern: "experience.yml",
  schema: s.object({
    company: s.string(),
    role: s.string(),
    location: s.string().optional(),
    employmentType: s
      .enum(["Full-time", "Part-time", "Contract", "Internship", "Freelance"])
      .optional(),
    start: yearMonth,
    end: yearMonth.optional(), // omitted = current role
    summary: s.string(),
    highlights: s.array(s.string()).default([]),
    techStack: s.array(s.string()).default([]),
  }),
});

const skills = defineCollection({
  name: "SkillCategory",
  pattern: "skills.yml",
  schema: s.object({
    category: s.string(),
    items: s.array(s.string()).nonempty(),
  }),
});

const credentials = defineCollection({
  name: "Credentials",
  pattern: "credentials.yml",
  single: true,
  schema: s.object({
    education: s.array(
      s.object({
        degree: s.string(),
        institution: s.string(),
        location: s.string().optional(),
        start: yearMonth,
        end: yearMonth.optional(), // omitted = in progress
      }),
    ),
    awards: s
      .array(s.object({ title: s.string(), issuer: s.string(), date: yearMonth }))
      .default([]),
    certifications: s
      .array(
        s.object({
          title: s.string(),
          issuer: s.string(),
          start: yearMonth,
          end: yearMonth.optional(),
        }),
      )
      .default([]),
    languages: s.array(s.object({ name: s.string(), proficiency: s.string() })).default([]),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { projects, experience, skills, credentials },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["heading-anchor"] } }],
      [
        rehypeShiki,
        {
          themes: { dark: "github-dark-default", light: "github-light-default" },
          defaultColor: "dark",
        },
      ],
    ],
  },
});
