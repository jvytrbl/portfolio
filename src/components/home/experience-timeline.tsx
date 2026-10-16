import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { getExperience } from "@/lib/content";
import { formatPeriod } from "@/lib/format";

export function ExperienceTimeline() {
  const roles = getExperience();

  return (
    <section id="experience" className="scroll-mt-20 border-y border-border/60 bg-bg-deep/50 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          index="02"
          path="experience"
          title="Career timeline"
          description="Roles, responsibilities, and what changed because I was there."
        />
        <ol className="relative ml-2 border-l border-border">
          {roles.map((role, i) => {
            const current = !role.end;
            return (
              <Reveal
                as="li"
                key={`${role.company}-${role.start}`}
                delay={i * 0.06}
                className="relative pb-12 pl-8 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className={
                    current
                      ? "absolute top-1.5 -left-[7px] size-3.5 rounded-full border-2 border-accent bg-bg shadow-[0_0_12px_var(--accent)]"
                      : "absolute top-1.5 -left-[6px] size-3 rounded-full border-2 border-border bg-bg"
                  }
                />
                <p className="font-mono text-xs text-fg-muted">
                  {formatPeriod(role.start, role.end)}
                  {current && <span className="ml-2 text-success">● current</span>}
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  {role.role} <span className="text-fg-muted">@</span>{" "}
                  <span className="text-accent">{role.company}</span>
                </h3>
                <p className="mt-1 font-mono text-xs text-fg-muted">
                  {[role.employmentType, role.location].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-3 max-w-2xl text-pretty text-fg-muted">{role.summary}</p>
                {role.highlights.length > 0 && (
                  <ul className="mt-3 max-w-2xl space-y-1.5 text-sm">
                    {role.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <span aria-hidden="true" className="text-highlight">
                          ▹
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {role.techStack.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
                    {role.techStack.map((t) => (
                      <li key={t}>
                        <Tag>{t}</Tag>
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
