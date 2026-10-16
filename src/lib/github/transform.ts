// Pure mapping from GitHub API payloads to the shapes the UI renders.
// Kept separate from fetching so it can be unit tested with fixtures.

export type GithubRepo = {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string | null;
  pushedAt: string;
};

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GithubOverview = {
  login: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  repos: GithubRepo[];
  /** Present only when a token is configured (GraphQL-only data). */
  contributions: { total: number; weeks: ContributionDay[][] } | null;
  source: "pinned" | "recent";
};

// Colours for common languages (subset of GitHub linguist).
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "Jupyter Notebook": "#DA5B0B",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
  SQL: "#e38c00",
  Dart: "#00B4AB",
  "C#": "#178600",
};

export const REPO_LIMIT = 6;

// ---------- REST (unauthenticated) ----------

export type RestUser = { login: string; html_url: string; public_repos: number; followers: number };

export type RestRepo = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

export function fromRest(user: RestUser, repos: RestRepo[]): GithubOverview {
  const own = repos.filter((r) => !r.fork && !r.archived);
  const top = [...own]
    .sort(
      (a, b) => b.stargazers_count - a.stargazers_count || b.pushed_at.localeCompare(a.pushed_at),
    )
    .slice(0, REPO_LIMIT);

  return {
    login: user.login,
    profileUrl: user.html_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    totalStars: own.reduce((sum, r) => sum + r.stargazers_count, 0),
    repos: top.map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      languageColor: r.language ? (LANGUAGE_COLORS[r.language] ?? null) : null,
      pushedAt: r.pushed_at,
    })),
    contributions: null,
    source: "recent",
  };
}

// ---------- GraphQL (token) ----------

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

type GqlRepo = {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string | null } | null;
  pushedAt: string;
};

export type GraphqlUser = {
  login: string;
  url: string;
  followers: { totalCount: number };
  repositories: { totalCount: number; nodes: { stargazerCount: number }[] };
  pinnedItems: { nodes: GqlRepo[] };
  topRepositories: { nodes: GqlRepo[] };
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
      weeks: {
        contributionDays: {
          date: string;
          contributionCount: number;
          contributionLevel: keyof typeof LEVELS;
        }[];
      }[];
    };
  };
};

export const GRAPHQL_QUERY = `query($login: String!) {
  user(login: $login) {
    login
    url
    followers { totalCount }
    repositories(ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, first: 100) {
      totalCount
      nodes { stargazerCount }
    }
    pinnedItems(first: ${REPO_LIMIT}, types: REPOSITORY) {
      nodes { ... on Repository { ...repo } }
    }
    topRepositories(first: ${REPO_LIMIT}, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes { ...repo }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}
fragment repo on Repository {
  name description url stargazerCount forkCount pushedAt
  primaryLanguage { name color }
}`;

export function fromGraphql(user: GraphqlUser): GithubOverview {
  const pinned = user.pinnedItems.nodes.filter(Boolean);
  const repos = pinned.length > 0 ? pinned : user.topRepositories.nodes;
  const calendar = user.contributionsCollection.contributionCalendar;

  return {
    login: user.login,
    profileUrl: user.url,
    publicRepos: user.repositories.totalCount,
    followers: user.followers.totalCount,
    totalStars: user.repositories.nodes.reduce((sum, r) => sum + r.stargazerCount, 0),
    repos: repos.slice(0, REPO_LIMIT).map((r) => ({
      name: r.name,
      description: r.description,
      url: r.url,
      stars: r.stargazerCount,
      forks: r.forkCount,
      language: r.primaryLanguage?.name ?? null,
      languageColor: r.primaryLanguage?.color ?? null,
      pushedAt: r.pushedAt,
    })),
    contributions: {
      total: calendar.totalContributions,
      weeks: calendar.weeks.map((w) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: LEVELS[d.contributionLevel] ?? 0,
        })),
      ),
    },
    source: pinned.length > 0 ? "pinned" : "recent",
  };
}
