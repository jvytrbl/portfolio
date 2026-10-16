import { ArrowUpRight, FolderGit2, GitFork, Star } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { buttonClass } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/github-icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatDate } from "@/lib/format";
import { getGithubOverview } from "@/lib/github/fetch";
import type { ContributionDay, GithubOverview, GithubRepo } from "@/lib/github/transform";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const HEATMAP_WEEKS = 53;

const levelClass: Record<ContributionDay["level"], string> = {
  0: "bg-border/50",
  1: "bg-accent/25",
  2: "bg-accent/50",
  3: "bg-accent/75",
  4: "bg-accent",
};

export async function GithubActivity() {
  const overview = await getGithubOverview();

  return (
    <section id="github" className="scroll-mt-20 border-y border-border/60 bg-bg-deep/50 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          index="05"
          path="github"
          title="Open source activity"
          description="Live from the GitHub API, refreshed hourly."
        />
        {overview ? <GithubActivityView overview={overview} /> : <Fallback />}
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
      <dl
        className={cn(
          "grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border",
          stats.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3",
        )}
      >
        {stats.map((s) => (
          <div key={s.label} className="bg-surface p-5">
            <dt className="font-mono text-xs text-fg-muted">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-accent tabular-nums">
              {s.value.toLocaleString("en-US")}
            </dd>
          </div>
        ))}
      </dl>

      {overview.contributions && <Heatmap weeks={overview.contributions.weeks} />}

      <div>
        <h3 className="mb-4 font-mono text-sm text-fg-muted">
          {overview.source === "pinned" ? "Pinned repositories" : "Repositories"}
        </h3>
        {overview.repos.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {overview.repos.map((repo, i) => (
              <Reveal as="li" key={repo.url} delay={(i % 3) * 0.06}>
                <RepoCard repo={repo} />
              </Reveal>
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

function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-border bg-surface/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50">
      <h4 className="flex items-center gap-2 font-mono text-sm font-medium">
        <FolderGit2 className="size-4 shrink-0 text-highlight" aria-hidden="true" />
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate group-hover:text-accent after:absolute after:inset-0"
        >
          {repo.name}
        </a>
        <ArrowUpRight
          aria-hidden="true"
          className="ml-auto size-4 shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100"
        />
      </h4>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-fg-muted">
        {repo.description ?? "No description."}
      </p>
      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-fg-muted">
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
        <span className="flex items-center gap-1" aria-label={`${repo.forks} forks`}>
          <GitFork className="size-3.5" aria-hidden="true" /> {repo.forks}
        </span>
        <span className="ml-auto">updated {formatDate(repo.pushedAt)}</span>
      </p>
    </article>
  );
}

function Heatmap({ weeks }: { weeks: ContributionDay[][] }) {
  const recent = weeks.slice(-HEATMAP_WEEKS);
  const total = recent.flat().reduce((sum, d) => sum + d.count, 0);

  return (
    <figure className="overflow-x-auto rounded-xl border border-border bg-surface/60 p-5">
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
    <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-surface/60 p-6">
      <p className="font-mono text-sm text-fg-muted">
        <span className="text-highlight">$</span> gh api users/{siteConfig.github.username}
        <span className="mt-1 block text-fg-muted/80">→ stats are temporarily unavailable</span>
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
