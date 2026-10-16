"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TerminalLine = {
  text: string;
  kind: "command" | "output" | "success" | "muted";
};

type TypewriterProps = {
  lines: TerminalLine[];
  /** ms per character for commands */
  speed?: number;
  startDelay?: number;
};

const kindClass: Record<TerminalLine["kind"], string> = {
  command: "text-fg",
  output: "text-fg",
  success: "text-success",
  muted: "text-fg-muted",
};

// Types commands character by character and prints outputs instantly, like a
// real shell. Every line is rendered from the start (invisible until reached)
// so the block never changes height — zero layout shift. Screen readers get
// the full transcript immediately.
export function Typewriter({ lines, speed = 38, startDelay = 400 }: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState({ line: 0, char: 0 });
  const done = reduceMotion || progress.line >= lines.length;

  useEffect(() => {
    if (done) return;
    const current = lines[progress.line];
    const isCommand = current.kind === "command";
    const lineComplete = !isCommand || progress.char >= current.text.length;

    const delay =
      progress.line === 0 && progress.char === 0
        ? startDelay
        : lineComplete
          ? isCommand
            ? 280
            : 120
          : speed;

    const timer = setTimeout(() => {
      setProgress((p) =>
        lineComplete ? { line: p.line + 1, char: 0 } : { line: p.line, char: p.char + 1 },
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [done, lines, progress, speed, startDelay]);

  return (
    <div className="space-y-1">
      <p className="sr-only">
        {lines.map((l) => (l.kind === "command" ? `$ ${l.text}` : l.text)).join(". ")}
      </p>
      {lines.map((line, i) => {
        const visible =
          done || i < progress.line || (i === progress.line && line.kind === "command");
        const shown =
          done || i < progress.line
            ? line.text
            : i === progress.line
              ? line.text.slice(0, progress.char)
              : "";
        const typing = !done && i === progress.line && line.kind === "command";
        return (
          <p
            key={i}
            aria-hidden="true"
            className={cn(kindClass[line.kind], !visible && "invisible")}
          >
            {line.kind === "command" && <span className="text-highlight">$ </span>}
            <span>{visible ? shown : line.text}</span>
            {typing && <Caret />}
          </p>
        );
      })}
      <p aria-hidden="true" className={cn(!done && "invisible")}>
        <span className="text-highlight">$ </span>
        <Caret />
      </p>
    </div>
  );
}

function Caret() {
  return <span className="inline-block w-2 translate-y-0.5 animate-blink text-accent">▍</span>;
}
