"use client";

import { ArrowRight } from "lucide-react";
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

type StoryProps = { href: string; caption: string };

const before = ["Defect reports lived in", "WhatsApp groups", "and manual logs."];
const after = ["One system.", "Four departments.", "Every day."];

/**
 * Pinned ink chapter: the "before" state fades out as the "after" lines
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
    <section
      ref={ref}
      aria-label="Before and after"
      className="relative h-[280vh] bg-ink text-ink-fg"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <m.div
          aria-hidden="true"
          style={{ scaleY: rule }}
          className="absolute top-0 left-4 h-full w-px origin-top bg-ink-fg/40 sm:left-8"
        />
        <div className="relative mx-auto grid w-full max-w-7xl px-8 sm:px-16">
          <m.div style={{ opacity: beforeOpacity, y: beforeY }} className="col-start-1 row-start-1">
            <p className="mb-6 text-xs text-ink-muted">[ Before ]</p>
            <BeforeText />
          </m.div>

          <div className="col-start-1 row-start-1">
            <AfterLabel progress={scrollYProgress} />
            {after.map((line, i) => (
              <AfterLine key={line} progress={scrollYProgress} index={i}>
                {line}
              </AfterLine>
            ))}
            <m.p
              style={{ opacity: footOpacity }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
            >
              <span className="text-ink-muted">{caption}</span>
              <Link
                href={href}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-fg px-5 text-ink transition-opacity hover:opacity-85"
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

function BeforeText({ className = "" }: { className?: string }) {
  return (
    <p
      className={`font-display text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.95] font-medium tracking-[-0.04em] text-balance text-ink-muted ${className}`}
    >
      {before[0]} <em className="font-serif font-normal text-ink-fg">{before[1]}</em> {before[2]}
    </p>
  );
}

function AfterLabel({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.46, 0.54], [0, 1]);
  return (
    <m.p style={{ opacity }} className="mb-6 text-xs text-ink-muted">
      [ After ]
    </m.p>
  );
}

function AfterText({ index, children }: { index: number; children: string }) {
  return index === 1 ? (
    <em className="font-serif font-normal tracking-normal normal-case">{children}</em>
  ) : (
    <>{children}</>
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
    <m.p style={{ opacity, y }} className="display-xl text-[clamp(3rem,10vw,9.5rem)]">
      <AfterText index={index}>{children}</AfterText>
    </m.p>
  );
}

function StaticStory({ href, caption }: StoryProps) {
  return (
    <section aria-label="Before and after" className="bg-ink px-8 py-28 text-ink-fg sm:px-16">
      <p className="mb-6 text-xs text-ink-muted">[ Before ]</p>
      <BeforeText />
      <p className="mt-20 mb-6 text-xs text-ink-muted">[ After ]</p>
      {after.map((line, i) => (
        <p key={line} className="display-xl text-6xl sm:text-8xl">
          <AfterText index={i}>{line}</AfterText>
        </p>
      ))}
      <p className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <span className="text-ink-muted">{caption}</span>
        <Link href={href} className="underline underline-offset-4">
          Read the case study
        </Link>
      </p>
    </section>
  );
}
