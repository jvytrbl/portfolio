import { SectionHeading } from "@/components/ui/section-heading";
import { getSkills } from "@/lib/content";

export function SkillsMatrix() {
  const groups = getSkills();

  return (
    <section id="skills" className="scroll-mt-20 pt-4 pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading index="04" label="Skills" title="Technical toolkit" size="secondary" />
        <dl className="divide-y divide-border border-y border-border">
          {groups.map((group) => (
            <div key={group.category} className="grid gap-2 py-5 sm:grid-cols-[14rem_1fr] sm:gap-8">
              <dt className="font-mono text-xs tracking-wide text-fg-muted uppercase sm:pt-1">
                {group.category}
              </dt>
              <dd className="max-w-[70ch] text-pretty text-fg">{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
