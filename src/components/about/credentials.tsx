import { getCredentials } from "@/lib/content";
import { formatPeriod, formatYearMonth } from "@/lib/format";

type Entry = { title: string; detail: string; date: string };

export function Credentials() {
  const { education, awards, certifications, languages } = getCredentials();

  const groups: { heading: string; entries: Entry[] }[] = [
    {
      heading: "Education",
      entries: education.map((e) => ({
        title: e.degree,
        detail: [e.institution, e.location].filter(Boolean).join(", "),
        date: e.end ? formatPeriod(e.start, e.end) : `${formatYearMonth(e.start)} – in progress`,
      })),
    },
    {
      heading: "Certification",
      entries: certifications.map((c) => ({
        title: c.title,
        detail: c.issuer,
        date: formatPeriod(c.start, c.end),
      })),
    },
    {
      heading: "Recognition",
      entries: awards.map((a) => ({
        title: a.title,
        detail: a.issuer,
        date: formatYearMonth(a.date),
      })),
    },
  ].filter((g) => g.entries.length > 0);

  return (
    <div className="grid gap-x-12 gap-y-12 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group) => (
        <div key={group.heading}>
          <h3 className="label">{group.heading}</h3>
          <ul className="mt-4 space-y-5">
            {group.entries.map((e) => (
              <li key={e.title}>
                <p className="font-display text-2xl leading-tight font-medium tracking-[-0.02em]">
                  {e.title}
                </p>
                <p className="mt-1 text-sm text-fg-muted">{e.detail}</p>
                <p className="mt-1 label tracking-normal normal-case">{e.date}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {languages.length > 0 && (
        <div>
          <h3 className="label">Languages</h3>
          <ul className="mt-4 space-y-3">
            {languages.map((l) => (
              <li
                key={l.name}
                className="flex items-baseline justify-between gap-4 border-b border-border pb-3"
              >
                <span className="font-display text-2xl font-medium tracking-[-0.02em]">
                  {l.name}
                </span>
                <span className="text-sm text-fg-muted">{l.proficiency}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
