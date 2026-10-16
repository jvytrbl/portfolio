import { afterEach, describe, expect, it, vi } from "vitest";

async function loadContent() {
  vi.resetModules();
  return import("@/lib/content");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("content layer", () => {
  it("sorts projects newest first and keeps drafts outside production", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { getProjects } = await loadContent();
    expect(getProjects().map((p) => p.slug)).toEqual(["draft", "new", "old"]);
  });

  it("hides drafts in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { getProjects, getProjectBySlug, getFeaturedProjects } = await loadContent();
    expect(getProjects().map((p) => p.slug)).toEqual(["new", "old"]);
    expect(getProjectBySlug("draft")).toBeUndefined();
    expect(getFeaturedProjects().map((p) => p.slug)).toEqual(["old"]);
  });

  it("looks up projects by slug", async () => {
    const { getProjectBySlug, getProjectSlugs } = await loadContent();
    expect(getProjectBySlug("new")?.title).toBe("New regular");
    expect(getProjectBySlug("missing")).toBeUndefined();
    expect(getProjectSlugs()).toContain("old");
  });

  it("orders experience with the current role first, then by recency", async () => {
    const { getExperience } = await loadContent();
    expect(getExperience().map((e) => e.company)).toEqual(["Current", "Middle", "Past"]);
  });
});

describe("credentials", () => {
  it("exposes the credentials document", async () => {
    const { getCredentials } = await loadContent();
    expect(getCredentials().education[0].institution).toBe("Uni");
  });
});

describe("ordering", () => {
  it("puts explicitly ordered projects first, then newest", async () => {
    vi.doMock("#site/content", async () => {
      const real =
        await vi.importActual<typeof import("../fixtures/content")>("../fixtures/content");
      return {
        ...real,
        projects: real.projects.map((p) => (p.slug === "old" ? { ...p, order: 1 } : p)),
      };
    });
    vi.stubEnv("NODE_ENV", "development");
    const { getProjects, getFeaturedProjects } = await loadContent();
    expect(getProjects().map((p) => p.slug)).toEqual(["old", "draft", "new"]);
    expect(getFeaturedProjects()[0].slug).toBe("old");
    vi.doUnmock("#site/content");
  });
});
