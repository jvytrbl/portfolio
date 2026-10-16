import { Typewriter, type TerminalLine } from "@/components/motion/typewriter";

/**
 * The site's single terminal artifact, used inside case-study MDX:
 * <Terminal title="impact.log" lines={[{ kind: "command", text: "cat impact.log" }, ...]} />
 */
export function Terminal({ title, lines }: { title: string; lines: TerminalLine[] }) {
  return (
    <figure className="not-prose my-12 overflow-hidden rounded-sm bg-ink font-mono text-sm text-ink-fg">
      <div className="flex items-center gap-1.5 border-b border-ink-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-ink-border" />
        <span className="size-2.5 rounded-full bg-ink-border" />
        <span className="size-2.5 rounded-full bg-ink-border" />
        <figcaption className="ml-2 text-xs text-ink-muted">{title}</figcaption>
      </div>
      <div className="p-5 pt-6 leading-relaxed">
        <Typewriter lines={lines} />
      </div>
    </figure>
  );
}
