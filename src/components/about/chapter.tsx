import type { ReactNode } from "react";

/** A numbered chapter on the About page: roman numeral, title, then content. */
export function Chapter({
  numeral,
  title,
  id,
  children,
}: {
  numeral: string;
  title: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 py-20">
      <div className="mb-10 flex items-baseline gap-6">
        <span className="font-serif text-2xl text-accent italic">{numeral}.</span>
        <h2 id={`${id}-title`} className="font-serif text-5xl leading-none sm:text-6xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
