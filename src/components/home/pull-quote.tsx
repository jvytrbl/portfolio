"use client";

import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

type PullQuoteProps = { quote: string; attribution: string };

/** Words light up one by one as the quote scrolls through the viewport. */
export function PullQuote({ quote, attribution }: PullQuoteProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = quote.split(" ");

  return (
    <figure ref={ref} className="mx-auto max-w-6xl px-4 py-32 sm:px-8 sm:py-44">
      <blockquote className="font-serif text-[clamp(2.5rem,6.5vw,6rem)] leading-[1.02] text-balance">
        <span className="sr-only">{quote}</span>
        <span aria-hidden="true">
          <span className="text-accent-strong">“</span>
          {words.map((word, i) =>
            reduce ? (
              <span key={i}>{word} </span>
            ) : (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[i / words.length, (i + 1) / words.length]}
              >
                {word}
              </Word>
            ),
          )}
          <span className="text-accent-strong">”</span>
        </span>
      </blockquote>
      <figcaption className="mt-10 kicker">{attribution}</figcaption>
    </figure>
  );
}

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <m.span style={{ opacity }}>{children} </m.span>;
}
