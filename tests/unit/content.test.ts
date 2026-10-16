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
