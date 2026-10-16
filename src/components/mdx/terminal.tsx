import { Typewriter, type TerminalLine } from "@/components/motion/typewriter";

/**
 * The site's single terminal artifact, used inside case-study MDX:
 * <Terminal title="impact.log" lines={[{ kind: "command", text: "cat impact.log" }, ...]} />
 */
export function Terminal({ title, lines }: { title: string; lines: TerminalLine[] }) {
  return (
    <figure className="not-prose my-12 overflow-hidden rounded-md border border-border bg-bg-deep font-mono text-sm">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <figcaption className="ml-2 text-xs text-fg-muted">{title}</figcaption>
      </div>
      <div className="p-5 pt-6 leading-relaxed">
        <Typewriter lines={lines} />
      </div>
    </figure>
  );
}
