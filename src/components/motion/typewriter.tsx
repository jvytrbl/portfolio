"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TerminalLine = {
  text: string;
  kind: "command" | "output" | "success" | "muted";
  /** Leading figure rendered in the accent colour, e.g. "4 departments". */
  lead?: string;
};

type TypewriterProps = {
  lines: TerminalLine[];
  /** ms per character for commands */
  speed?: number;
  startDelay?: number;
};

// Colours inherit from the container (the terminal sets ink background).
const kindClass: Record<TerminalLine["kind"], string> = {
  command: "",
  output: "opacity-80",
  success: "text-success",
  muted: "opacity-60",
};

function fullText(line: TerminalLine) {
  return line.lead ? `${line.lead} ${line.text}` : line.text;
}

// Types commands character by character and prints outputs instantly, like a
// real shell. Every line is rendered from the start (invisible until reached)
// so the block never changes height. Screen readers get the full transcript
// immediately, and a Skip control finishes the animation on demand.
export function Typewriter({ lines, speed = 28, startDelay = 250 }: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Typing starts only once the block is on screen.
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [progress, setProgress] = useState({ line: 0, char: 0 });
  const [skipped, setSkipped] = useState(false);
  const done = reduceMotion || skipped || progress.line >= lines.length;

  useEffect(() => {
    if (done || !inView) return;
    const current = lines[progress.line];
    const isCommand = current.kind === "command";
    const lineComplete = !isCommand || progress.char >= current.text.length;

    const delay =
      progress.line === 0 && progress.char === 0
        ? startDelay
        : lineComplete
          ? isCommand
            ? 200
            : 90
          : speed;

    const timer = setTimeout(() => {
      setProgress((p) =>
        lineComplete ? { line: p.line + 1, char: 0 } : { line: p.line, char: p.char + 1 },
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [done, inView, lines, progress, speed, startDelay]);

  return (
    <div ref={ref} className="relative">
      <p className="sr-only">
        {lines.map((l) => (l.kind === "command" ? `$ ${l.text}` : fullText(l))).join(". ")}
      </p>
      {!done && (
        <button
          type="button"
          onClick={() => setSkipped(true)}
          className="absolute -top-11 right-0 rounded px-2 py-1 font-mono text-xs opacity-60 transition-opacity hover:opacity-100"
        >
          skip
        </button>
      )}
      <div className="space-y-1.5">
        {lines.map((line, i) => {
          const reached = done || i < progress.line;
          const current = !done && i === progress.line;
          const visible = reached || (current && line.kind === "command");
          return (
            <p
              key={i}
              aria-hidden="true"
              className={cn(kindClass[line.kind], !visible && "invisible")}
            >
              {line.kind === "command" ? (
                <>
                  <span className="text-highlight">$ </span>
                  {reached ? line.text : current ? line.text.slice(0, progress.char) : line.text}
                  {current && <Caret />}
                </>
              ) : (
                <>
                  {line.lead && <span className="font-semibold opacity-100">{line.lead} </span>}
                  {line.text}
                </>
              )}
            </p>
          );
        })}
        <p aria-hidden="true" className={cn(!done && "invisible")}>
          <span className="text-highlight">$ </span>
          <Caret blink={done} />
        </p>
      </div>
    </div>
  );
}

function Caret({ blink = false }: { blink?: boolean }) {
  return (
    <span
      className={cn("inline-block w-2 translate-y-0.5 text-highlight", blink && "animate-blink")}
    >
      ▍
    </span>
  );
}
