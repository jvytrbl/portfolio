import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSkills } from "@/lib/content";
import { cn } from "@/lib/utils";

const levels = { expert: 3, proficient: 2, familiar: 1 } as const;

function LevelMeter({ level }: { level: keyof typeof levels }) {
  const filled = levels[level];
  return (
    <span className="flex items-center gap-0.5" aria-label={level} role="img">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={cn("h-3 w-1 rounded-sm", n <= filled ? "bg-accent" : "bg-border")}
        />
      ))}
    </span>
  );
}

export function SkillsMatrix() {
  const groups = getSkills();

  return (
    <section id="skills" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          index="03"
          path="skills"
          title="Technical skills"
          description="Grouped by where they sit in the stack."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {groups.map((group, i) => (
            <Reveal
              key={group.category}
              delay={i * 0.08}
              className="rounded-xl border border-border bg-surface/60 p-6"
            >
              <h3 className="font-mono text-sm text-highlight">{group.category}</h3>
              <ul className="mt-4 divide-y divide-border/60">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between py-2.5 text-sm">
                    <span>{item.name}</span>
                    <LevelMeter level={item.level} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 flex flex-wrap gap-4 font-mono text-xs text-fg-muted">
          {Object.keys(levels).map((level) => (
            <span key={level} className="flex items-center gap-2">
              <LevelMeter level={level as keyof typeof levels} /> {level}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
