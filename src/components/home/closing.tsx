import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getCredentials, getExperience } from "@/lib/content";
import { siteConfig } from "@/lib/site";

// Closing spread: what I'm doing now, then where to go next.
export function Closing() {
  const current = getExperience().filter((r) => !r.end);
  const { education, certifications } = getCredentials();

  const columns = [
    {
      heading: "Now",
      lines: current.map((r) => `${r.role}, ${r.company.replace(/ Sdn Bhd$/, "")}`),
    },
    {
      heading: "Studying",
      lines: [
        ...education.map((e) => e.institution),
        ...certifications.filter((c) => !c.end).map((c) => `${c.title}, ${c.issuer}`),
      ],
    },
    { heading: "Open to", lines: [siteConfig.availability ?? "New opportunities"] },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-32 sm:px-8">
      <dl className="grid gap-10 border-y border-border py-10 md:grid-cols-3">
        {columns.map((col) => (
          <div key={col.heading}>
            <dt className="kicker">{col.heading}</dt>
            {col.lines.map((line) => (
              <dd key={line} className="mt-2 text-lg text-pretty">
                {line}
              </dd>
            ))}
          </div>
        ))}
      </dl>

      <div className="grid gap-12 pt-20 md:grid-cols-2 md:items-end">
        <h2 className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.01em]">
          Got a messy <em>workflow?</em>
        </h2>
        <div className="flex flex-col items-start gap-5 md:items-end">
          <Link
            href="/contact"
            className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-accent-strong px-7 text-accent-fg transition-[filter] hover:brightness-110"
          >
            Let&apos;s talk
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
          >
            Or read about me first
          </Link>
        </div>
      </div>
    </section>
  );
}
