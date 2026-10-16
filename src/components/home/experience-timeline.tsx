import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getExperience } from "@/lib/content";
import { formatPeriod } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ExperienceTimeline() {
  const roles = getExperience();

  return (
    <section id="experience" className="scroll-mt-20 border-y border-border/60 bg-bg-deep/60 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="02"
          label="Experience"
          title="Where I've shipped"
          description="Roles, responsibilities, and what changed because I was there."
        />
        <ol className="relative ml-1.5 border-l border-border">
          {roles.map((role, i) => {
            const current = !role.end;
            return (
              <Reveal
                as="li"
                key={`${role.company}-${role.start}`}
                delay={i * 0.05}
                className="relative pb-14 pl-8 last:pb-0 sm:pl-10"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-2 -left-[6px] size-3 rounded-full border-2",
                    current ? "border-accent bg-accent" : "border-border bg-bg",
                  )}
                />
                <p className="font-mono text-xs text-fg-muted">
                  {formatPeriod(role.start, role.end)}
                  {current && <span className="ml-2 text-success">Current</span>}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold sm:text-2xl">{role.role}</h3>
                <p className="mt-1 text-fg-muted">
                  {[role.company, role.location, role.employmentType].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-4 max-w-[70ch] text-pretty text-fg">{role.summary}</p>
                {role.highlights.length > 0 && (
                  <ul className="mt-4 max-w-[70ch] list-disc space-y-2 pl-5 text-fg marker:text-fg-muted">
                    {role.highlights.map((h) => (
                      <li key={h} className="pl-1 text-pretty">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {role.techStack.length > 0 && (
                  <p className="mt-4 font-mono text-xs text-fg-muted">
                    {role.techStack.join(" · ")}
                  </p>
                )}
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
