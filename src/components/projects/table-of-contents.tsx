import type { Project } from "@/lib/content";

type TocEntry = Project["toc"][number];

export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <nav aria-label="In this story" className="text-sm">
      <p className="mb-4 kicker">In this story</p>
      <ul className="space-y-2 border-l border-border">
        {entries.map((entry) => (
          <li key={entry.url}>
            <a
              href={entry.url}
              className="-ml-px block border-l border-transparent pl-3 text-fg-muted transition-colors hover:border-accent-strong hover:text-fg"
            >
              {entry.title}
            </a>
            {entry.items.length > 0 && (
              <ul className="mt-2 space-y-2">
                {entry.items.map((child) => (
                  <li key={child.url}>
                    <a
                      href={child.url}
                      className="-ml-px block border-l border-transparent pl-6 text-fg-muted/80 transition-colors hover:border-accent-strong hover:text-fg"
                    >
                      {child.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
