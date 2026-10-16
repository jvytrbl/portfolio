import type { ReactNode } from "react";

/** A numbered section on the About page: (01) label, big title, content. */
export function Chapter({
  number,
  title,
  id,
  children,
}: {
  number: string;
  title: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 py-20">
      <div className="mb-10 grid gap-4 md:grid-cols-12">
        <p className="font-serif text-lg text-fg-muted italic md:col-span-3">({number})</p>
        <h2
          id={`${id}-title`}
          className="font-display text-5xl font-medium tracking-[-0.045em] uppercase sm:text-7xl md:col-span-9"
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
