"use client";

import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

type StoryProps = { href: string; caption: string };

const before = ["Defect reports lived in", "WhatsApp groups", "and manual logs."];
const after = ["One system.", "Four departments.", "Every day."];

/**
 * Pinned scroll chapter: the "before" state fades out as the "after" lines
 * arrive. Transform and opacity only; with reduced motion it renders as a
 * plain static spread.
 */
export function StoryScroll(props: StoryProps) {
  const reduce = useReducedMotion();
  return reduce ? <StaticStory {...props} /> : <PinnedStory {...props} />;
}

function PinnedStory({ href, caption }: StoryProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const beforeOpacity = useTransform(scrollYProgress, [0, 0.32, 0.46], [1, 1, 0]);
  const beforeY = useTransform(scrollYProgress, [0.32, 0.46], ["0%", "-12%"]);
  const rule = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const footOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);

  return (
    <section ref={ref} aria-label="Before and after" className="relative h-[280vh]">
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center overflow-hidden">
        <m.div
          aria-hidden="true"
          style={{ scaleY: rule }}
          className="absolute top-0 left-4 h-full w-px origin-top bg-accent-strong sm:left-8"
        />
        <div className="relative mx-auto grid w-full max-w-7xl px-8 sm:px-16">
          <m.div style={{ opacity: beforeOpacity, y: beforeY }} className="col-start-1 row-start-1">
            <p className="mb-6 kicker">I · Before</p>
            <p className="font-serif text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] text-balance text-fg-muted">
              {before[0]} <em className="text-fg">{before[1]}</em> {before[2]}
            </p>
          </m.div>

          <div className="col-start-1 row-start-1">
            <AfterKicker progress={scrollYProgress} />
            {after.map((line, i) => (
              <AfterLine key={line} progress={scrollYProgress} index={i}>
                {line}
              </AfterLine>
            ))}
            <m.p
              style={{ opacity: footOpacity }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-fg-muted"
            >
              <span className="kicker">{caption}</span>
              <Link
                href={href}
                className="inline-flex items-center gap-2 text-accent underline-offset-4 hover:underline"
              >
                Read the case study <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </m.p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AfterKicker({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.46, 0.54], [0, 1]);
  return (
    <m.p style={{ opacity }} className="mb-6 kicker">
      II · After
    </m.p>
  );
}

function AfterLine({
  progress,
  index,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  children: string;
}) {
  const start = 0.5 + index * 0.1;
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1]);
  const y = useTransform(progress, [start, start + 0.1], ["40%", "0%"]);
  return (
    <m.p
      style={{ opacity, y }}
      className="font-serif text-[clamp(3rem,9vw,8.5rem)] leading-[0.92] tracking-[-0.01em]"
    >
      {index === 1 ? <em>{children}</em> : children}
    </m.p>
  );
}

function StaticStory({ href, caption }: StoryProps) {
  return (
    <section aria-label="Before and after" className="mx-auto max-w-7xl px-8 py-28 sm:px-16">
      <p className="mb-6 kicker">I · Before</p>
      <p className="font-serif text-5xl leading-[0.95] text-balance text-fg-muted sm:text-7xl">
        {before[0]} <em className="text-fg">{before[1]}</em> {before[2]}
      </p>
      <p className="mt-20 mb-6 kicker">II · After</p>
      {after.map((line) => (
        <p key={line} className="font-serif text-6xl leading-[0.92] sm:text-8xl">
          {line}
        </p>
      ))}
      <p className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <span className="kicker">{caption}</span>
        <Link href={href} className="text-accent underline-offset-4 hover:underline">
          Read the case study
        </Link>
      </p>
    </section>
  );
}
