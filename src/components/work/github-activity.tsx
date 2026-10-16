import { Star } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/github-icon";
import { formatDate } from "@/lib/format";
import { getGithubOverview } from "@/lib/github/fetch";
import type { ContributionDay, GithubOverview, GithubRepo } from "@/lib/github/transform";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const HEATMAP_WEEKS = 53;

const levelClass: Record<ContributionDay["level"], string> = {
  0: "bg-border/50",
  1: "bg-ink/25",
  2: "bg-ink/50",
  3: "bg-ink/75",
  4: "bg-ink",
};

export async function GithubActivity() {
  const overview = await getGithubOverview();

  return (
    <section id="github" className="mx-auto max-w-7xl px-4 py-28 sm:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr]">
        <div className="min-w-0">
          <p className="font-serif text-lg text-fg-muted italic">[ From the workshop ]</p>
          <h2 className="mt-3 font-display text-5xl font-medium tracking-[-0.045em] uppercase sm:text-6xl">
            On GitHub
          </h2>
          <p className="mt-5 max-w-[40ch] text-pretty text-fg-muted">
            Live from the GitHub API, refreshed every hour.
          </p>
        </div>
        <div>{overview ? <GithubActivityView overview={overview} /> : <Fallback />}</div>
      </div>
    </section>
  );
}

export function GithubActivityView({ overview }: { overview: GithubOverview }) {
  const stats = [
    { label: "Public repos", value: overview.publicRepos },
    { label: "Stars earned", value: overview.totalStars },
    { label: "Followers", value: overview.followers },
    ...(overview.contributions
      ? [{ label: "Contributions (1y)", value: overview.contributions.total }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-8">
      <dl className="flex flex-wrap gap-x-12 gap-y-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dd className="font-display text-5xl font-medium tracking-[-0.04em] text-fg tabular-nums">
              {s.value.toLocaleString("en-US")}
            </dd>
            <dt className="text-sm text-fg-muted">{s.label}</dt>
          </div>
        ))}
      </dl>

      {overview.contributions && <Heatmap weeks={overview.contributions.weeks} />}

      <div>
        <h3 className="mb-3 label">
          {overview.source === "pinned" ? "Pinned repositories" : "Recently active repositories"}
        </h3>
        {overview.repos.length > 0 ? (
          <ul className="divide-y divide-border border-y border-border">
            {overview.repos.map((repo) => (
              <li key={repo.url}>
                <RepoRow repo={repo} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-fg-muted">No public repositories yet.</p>
        )}
      </div>

      <a
        href={overview.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass("outline", "w-fit")}
      >
        <GithubIcon /> @{overview.login} on GitHub
      </a>
    </div>
  );
}

function RepoRow({ repo }: { repo: GithubRepo }) {
  return (
    <article className="group relative grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8">
      <div className="min-w-0">
        <h4 className="font-mono text-sm font-medium">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors group-hover:underline after:absolute after:inset-0"
          >
            {repo.name}
          </a>
        </h4>
        <p className="mt-0.5 truncate text-sm text-fg-muted">
          {repo.description ?? "No description."}
        </p>
      </div>
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-fg-muted">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full"
              style={{ backgroundColor: repo.languageColor ?? "var(--fg-muted)" }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1" aria-label={`${repo.stars} stars`}>
          <Star className="size-3.5" aria-hidden="true" /> {repo.stars}
        </span>
        <span>Updated {formatDate(repo.pushedAt)}</span>
      </p>
    </article>
  );
}

function Heatmap({ weeks }: { weeks: ContributionDay[][] }) {
  const recent = weeks.slice(-HEATMAP_WEEKS);
  const total = recent.flat().reduce((sum, d) => sum + d.count, 0);

  return (
    <figure className="overflow-x-auto">
      <div
        role="img"
        aria-label={`${total} contributions in the last year`}
        className="mx-auto flex w-max gap-[3px]"
      >
        {recent.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <span
                key={day.date}
                title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                className={cn("size-2.5 rounded-[2px] sm:size-3", levelClass[day.level])}
              />
            ))}
          </div>
        ))}
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-xs text-fg-muted">
        <span>{total.toLocaleString("en-US")} contributions · last 12 months</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          less
          {([0, 1, 2, 3, 4] as const).map((l) => (
            <span key={l} className={cn("size-2.5 rounded-[2px]", levelClass[l])} />
          ))}
          more
        </span>
      </figcaption>
    </figure>
  );
}

function Fallback() {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-fg-muted">
        Live GitHub stats are temporarily unavailable. My repositories are one click away.
      </p>
      <a
        href={siteConfig.github.url}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass("outline")}
      >
        <GithubIcon /> View my GitHub
      </a>
    </div>
  );
}
