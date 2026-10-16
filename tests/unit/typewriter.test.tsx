import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Typewriter, type TerminalLine } from "@/components/motion/typewriter";

const lines: TerminalLine[] = [
  { kind: "command", text: "whoami" },
  { kind: "output", text: "Jane" },
];

describe("<Typewriter />", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("exposes the full transcript to screen readers immediately", () => {
    render(<Typewriter lines={lines} />);
    expect(screen.getByText("$ whoami. Jane")).toHaveClass("sr-only");
  });

  it("types commands out and then prints output", () => {
    const { container } = render(<Typewriter lines={lines} speed={10} startDelay={0} />);
    const [command, output] = container.querySelectorAll("p[aria-hidden='true']");

    // Output line reserves its space but stays invisible until reached.
    expect(output).toHaveClass("invisible");

    // Each tick schedules the next after a render, so advance step by step.
    for (let i = 0; i < 40; i++) act(() => vi.advanceTimersByTime(50));
    expect(command).toHaveTextContent("$ whoami");
    expect(output).not.toHaveClass("invisible");
    expect(output).toHaveTextContent("Jane");
  });
});
