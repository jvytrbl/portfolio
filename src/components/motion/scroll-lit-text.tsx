"use client";

import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

type Segment = { text: string; serif?: boolean };

/**
 * Paragraph whose words brighten from faint to full as it scrolls through the
 * viewport. Segments marked `serif` render in Instrument Serif italic.
 */
export function ScrollLitText({
  segments,
  className,
}: {
  segments: Segment[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.5"] });

  const words = segments.flatMap((seg) =>
    seg.text
      .split(" ")
      .filter(Boolean)
      .map((word) => ({ word, serif: seg.serif })),
  );
  const full = segments.map((s) => s.text).join(" ");

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{full}</span>
      <span aria-hidden="true">
        {words.map(({ word, serif }, i) => {
          const cls = serif ? "font-serif italic" : undefined;
          return reduce ? (
            <span key={i} className={cls}>
              {word}{" "}
            </span>
          ) : (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
              className={cls}
            >
              {word}
            </Word>
          );
        })}
      </span>
    </p>
  );
}

function Word({
  progress,
  range,
  className,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return (
    <m.span style={{ opacity }} className={className}>
      {children}{" "}
    </m.span>
  );
}
