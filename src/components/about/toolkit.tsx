import { getSkills } from "@/lib/content";

export function Toolkit() {
  return (
    <dl className="border-t border-border">
      {getSkills().map((group) => (
        <div
          key={group.category}
          className="grid gap-3 border-b border-border py-6 md:grid-cols-12"
        >
          <dt className="label md:col-span-4 md:pt-1.5">{group.category}</dt>
          <dd className="font-display text-2xl leading-snug font-medium tracking-[-0.02em] text-pretty md:col-span-8">
            {group.items.join(", ")}
          </dd>
        </div>
      ))}
    </dl>
  );
}
