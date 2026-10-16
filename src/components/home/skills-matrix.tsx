import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { getSkills } from "@/lib/content";

export function SkillsMatrix() {
  const groups = getSkills();

  return (
    <section id="skills" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          index="04"
          path="skills"
          title="Technical skills"
          description="Grouped by where they sit in the stack."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, i) => (
            <Reveal
              key={group.category}
              delay={(i % 3) * 0.08}
              className="rounded-xl border border-border bg-surface/60 p-6 transition-colors hover:border-accent/40"
            >
              <h3 className="font-mono text-sm text-highlight">{group.category}</h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <Tag className="text-fg">{item}</Tag>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
