import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Giant uppercase words pushed to the edges, e.g. "SELECTED  (All work)  WORK".
 * `middle` sits between the words for short pairs, or below them ("below")
 * when the words are long enough to need the full width.
 */
export function SplitHeading({
  left,
  right,
  middle,
  middlePlacement = "between",
  as: Tag = "h2",
  className,
}: {
  left: string;
  right: string;
  middle?: ReactNode;
  middlePlacement?: "between" | "below";
  as?: "h1" | "h2";
  className?: string;
}) {
  const words = (
    <Tag className="flex w-full flex-wrap items-baseline justify-between gap-x-[0.25em] display-xl text-[clamp(3rem,8vw,8.5rem)]">
      <span>{left}</span> <span className="ml-auto">{right}</span>
    </Tag>
  );

  if (!middle) return <div className={className}>{words}</div>;

  if (middlePlacement === "below") {
    return (
      <div className={className}>
        {words}
        <div className="mt-5 flex justify-end">{middle}</div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {words}
      {/* Centred between the words on wide screens, below them on small ones. */}
      <div className="mt-5 flex justify-center md:pointer-events-none md:absolute md:inset-0 md:mt-0 md:items-center [&>*]:pointer-events-auto">
        {middle}
      </div>
    </div>
  );
}
