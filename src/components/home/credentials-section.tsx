import { SectionHeading } from "@/components/ui/section-heading";
import { getCredentials } from "@/lib/content";
import { formatPeriod, formatYearMonth } from "@/lib/format";

type Entry = { title: string; detail: string; date: string };

export function CredentialsSection() {
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
      heading: "Certifications",
      entries: certifications.map((c) => ({
        title: c.title,
        detail: c.issuer,
        date: formatPeriod(c.start, c.end),
      })),
    },
    {
      heading: "Awards",
      entries: awards.map((a) => ({
        title: a.title,
        detail: a.issuer,
        date: formatYearMonth(a.date),
      })),
    },
  ].filter((g) => g.entries.length > 0);

  return (
    <section id="credentials" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="03"
          label="Credentials"
          title="Education & credentials"
          size="secondary"
        />
        <div className="grid gap-x-12 gap-y-10 border-t border-border pt-8 md:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div key={group.heading}>
              <h3 className="font-mono text-xs tracking-wide text-fg-muted uppercase">
                {group.heading}
              </h3>
              <ul className="mt-3 space-y-4">
                {group.entries.map((e) => (
                  <li key={e.title}>
                    <p className="font-medium text-fg">{e.title}</p>
                    <p className="text-sm text-fg-muted">{e.detail}</p>
                    <p className="mt-0.5 font-mono text-xs text-fg-muted">{e.date}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {languages.length > 0 && (
            <div>
              <h3 className="font-mono text-xs tracking-wide text-fg-muted uppercase">Languages</h3>
              <ul className="mt-3 space-y-2">
                {languages.map((l) => (
                  <li key={l.name}>
                    <span className="font-medium text-fg">{l.name}</span>{" "}
                    <span className="text-sm text-fg-muted">({l.proficiency.toLowerCase()})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
