import { getExperience } from "@/lib/content";
import { formatPeriod } from "@/lib/format";

export function Career() {
  const roles = getExperience();

  return (
    <ol className="border-t border-border">
      {roles.map((role) => (
        <li
          key={`${role.company}-${role.start}`}
          className="grid gap-x-12 gap-y-4 border-b border-border py-10 md:grid-cols-12"
        >
          <div className="md:col-span-4">
            <p className="label">
              {formatPeriod(role.start, role.end)}
              {!role.end && <span className="ml-2 text-success">Current</span>}
            </p>
            <h3 className="mt-3 font-display text-3xl leading-tight font-medium tracking-[-0.03em]">
              {role.role}
            </h3>
            <p className="mt-1 text-fg-muted">
              {[role.company, role.location].filter(Boolean).join(", ")}
            </p>
          </div>
          <div className="md:col-span-8">
            <p className="max-w-[65ch] text-lg text-pretty">{role.summary}</p>
            {role.highlights.length > 0 && (
              <ul className="mt-5 max-w-[65ch] space-y-3 text-fg-muted">
                {role.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-pretty">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-fg-faint" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
            {role.techStack.length > 0 && (
              <p className="mt-5 label tracking-normal normal-case">{role.techStack.join(" · ")}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
