import { Award, BadgeCheck, GraduationCap, Languages } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCredentials } from "@/lib/content";
import { formatPeriod, formatYearMonth } from "@/lib/format";

function Card({
  icon,
  title,
  children,
  delay,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  delay: number;
}) {
  return (
    <Reveal
      delay={delay}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface/60 p-6"
    >
      <h3 className="flex items-center gap-2 font-mono text-sm text-highlight [&_svg]:size-4">
        {icon}
        {title}
      </h3>
      {children}
    </Reveal>
  );
}

export function CredentialsSection() {
  const { education, awards, certifications, languages } = getCredentials();

  return (
    <section id="credentials" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading index="03" path="credentials" title="Education & credentials" />
        <div className="grid gap-5 md:grid-cols-2">
          <Card icon={<GraduationCap />} title="Education" delay={0}>
            <ul className="space-y-4">
              {education.map((e) => (
                <li key={e.degree}>
                  <p className="font-medium">{e.degree}</p>
                  <p className="text-sm text-fg-muted">
                    {e.institution}
                    {e.location && ` · ${e.location}`}
                  </p>
                  <p className="mt-1 font-mono text-xs text-fg-muted">
                    {e.end
                      ? formatPeriod(e.start, e.end)
                      : `${formatYearMonth(e.start)} — in progress`}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          {certifications.length > 0 && (
            <Card icon={<BadgeCheck />} title="Certifications" delay={0.08}>
              <ul className="space-y-4">
                {certifications.map((c) => (
                  <li key={c.title}>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-sm text-fg-muted">{c.issuer}</p>
                    <p className="mt-1 font-mono text-xs text-fg-muted">
                      {formatPeriod(c.start, c.end)}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {awards.length > 0 && (
            <Card icon={<Award />} title="Awards" delay={0.12}>
              <ul className="space-y-4">
                {awards.map((a) => (
                  <li key={a.title}>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-fg-muted">{a.issuer}</p>
                    <p className="mt-1 font-mono text-xs text-fg-muted">
                      {formatYearMonth(a.date)}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {languages.length > 0 && (
            <Card icon={<Languages />} title="Languages" delay={0.16}>
              <ul className="divide-y divide-border/60">
                {languages.map((l) => (
                  <li key={l.name} className="flex justify-between py-2 text-sm first:pt-0">
                    <span>{l.name}</span>
                    <span className="font-mono text-xs text-fg-muted">{l.proficiency}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
