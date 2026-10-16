import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { env } from "@/env";
import { siteConfig } from "@/lib/site";
import {
  GRAPHQL_QUERY,
  fromGraphql,
  fromRest,
  type GithubOverview,
  type GraphqlUser,
  type RestRepo,
  type RestUser,
} from "./transform";

// Overridable for local mocks; production always uses the real API.
const API = process.env.GITHUB_API_URL ?? "https://api.github.com";

async function github<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`GitHub ${path} responded ${res.status}`);
  return res.json() as Promise<T>;
}

async function load(login: string): Promise<GithubOverview> {
  if (env.GITHUB_TOKEN) {
    const { data, errors } = await github<{ data?: { user: GraphqlUser }; errors?: unknown }>(
      "/graphql",
      { method: "POST", body: JSON.stringify({ query: GRAPHQL_QUERY, variables: { login } }) },
    );
    if (errors || !data?.user) throw new Error("GitHub GraphQL query failed");
    return fromGraphql(data.user);
  }
  const [user, repos] = await Promise.all([
    github<RestUser>(`/users/${login}`),
    github<RestRepo[]>(`/users/${login}/repos?per_page=100&type=owner&sort=pushed`),
  ]);
  return fromRest(user, repos);
}

/**
 * GitHub stats, cached and refreshed hourly (ISR). Returns null if GitHub is
 * unreachable so the page still builds and renders a fallback.
 */
export async function getGithubOverview(): Promise<GithubOverview | null> {
  "use cache";
  cacheTag("github");
  try {
    const overview = await load(siteConfig.github.username);
    cacheLife("hours");
    return overview;
  } catch (error) {
    console.warn("[github] falling back:", error instanceof Error ? error.message : error);
    // Retry sooner after a failure.
    cacheLife("minutes");
    return null;
  }
}
