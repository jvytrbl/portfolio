import { describe, expect, it } from "vitest";
import { fromGraphql, fromRest, type GraphqlUser, type RestRepo } from "@/lib/github/transform";

const restRepo = (overrides: Partial<RestRepo>): RestRepo => ({
  name: "repo",
  description: null,
  html_url: "https://github.com/u/repo",
  stargazers_count: 0,
  forks_count: 0,
  language: "TypeScript",
  pushed_at: "2026-01-01T00:00:00Z",
  fork: false,
  archived: false,
  ...overrides,
});

describe("fromRest", () => {
  it("ranks own repos by stars then recency, ignoring forks and archives", () => {
    const overview = fromRest(
      { login: "u", html_url: "https://github.com/u", public_repos: 5, followers: 2 },
      [
        restRepo({ name: "old-star", stargazers_count: 5, pushed_at: "2025-01-01T00:00:00Z" }),
        restRepo({ name: "fresh", stargazers_count: 1, pushed_at: "2026-06-01T00:00:00Z" }),
        restRepo({ name: "stale", stargazers_count: 1, pushed_at: "2024-01-01T00:00:00Z" }),
        restRepo({ name: "forked", stargazers_count: 99, fork: true }),
        restRepo({ name: "archived", stargazers_count: 50, archived: true }),
      ],
    );

    expect(overview.repos.map((r) => r.name)).toEqual(["old-star", "fresh", "stale"]);
    expect(overview.totalStars).toBe(7);
    expect(overview.repos[0].languageColor).toBe("#3178c6");
    expect(overview.contributions).toBeNull();
    expect(overview.source).toBe("recent");
  });

  it("caps the list at six repositories", () => {
    const repos = Array.from({ length: 10 }, (_, i) => restRepo({ name: `r${i}` }));
    const overview = fromRest({ login: "u", html_url: "", public_repos: 10, followers: 0 }, repos);
    expect(overview.repos).toHaveLength(6);
  });
});

describe("fromGraphql", () => {
  const repo = {
    name: "pinned",
    description: "d",
    url: "https://github.com/u/pinned",
    stargazerCount: 3,
    forkCount: 1,
    primaryLanguage: { name: "Python", color: "#3572A5" },
    pushedAt: "2026-05-01T00:00:00Z",
  };
  const user: GraphqlUser = {
    login: "u",
    url: "https://github.com/u",
    followers: { totalCount: 4 },
    repositories: { totalCount: 2, nodes: [{ stargazerCount: 3 }, { stargazerCount: 2 }] },
    pinnedItems: { nodes: [repo] },
    topRepositories: { nodes: [{ ...repo, name: "recent" }] },
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: 12,
        weeks: [
          {
            contributionDays: [
              { date: "2026-10-11", contributionCount: 0, contributionLevel: "NONE" },
              { date: "2026-10-12", contributionCount: 9, contributionLevel: "FOURTH_QUARTILE" },
            ],
          },
        ],
      },
    },
  };

  it("prefers pinned repos and maps the contribution calendar", () => {
    const overview = fromGraphql(user);
    expect(overview.source).toBe("pinned");
    expect(overview.repos[0].name).toBe("pinned");
    expect(overview.totalStars).toBe(5);
    expect(overview.contributions?.total).toBe(12);
    expect(overview.contributions?.weeks[0].map((d) => d.level)).toEqual([0, 4]);
  });

  it("falls back to recently pushed repos when nothing is pinned", () => {
    const overview = fromGraphql({ ...user, pinnedItems: { nodes: [] } });
    expect(overview.source).toBe("recent");
    expect(overview.repos[0].name).toBe("recent");
  });
});
