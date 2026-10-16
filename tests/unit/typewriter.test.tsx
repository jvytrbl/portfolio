import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Typewriter, type TerminalLine } from "@/components/motion/typewriter";

const lines: TerminalLine[] = [
  { kind: "command", text: "whoami" },
  { kind: "output", lead: "4 departments", text: "use it daily" },
];

// jsdom has no IntersectionObserver; this stand-in lets each test decide
// when the terminal scrolls into view.
let observers: { cb: IntersectionObserverCallback; el?: Element }[] = [];
class MockIntersectionObserver {
  constructor(public cb: IntersectionObserverCallback) {
    observers.push({ cb });
  }
  observe(el: Element) {
    observers[observers.length - 1].el = el;
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

function scrollIntoView() {
  act(() => {
    for (const o of observers) {
      o.cb(
        [{ isIntersecting: true, target: o.el } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    }
  });
}

function advance(ms: number) {
  // Each tick schedules the next after a render, so advance step by step.
  for (let t = 0; t < ms; t += 50) act(() => vi.advanceTimersByTime(50));
}

describe("<Typewriter />", () => {
  beforeEach(() => {
    observers = [];
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("exposes the full transcript to screen readers immediately", () => {
    render(<Typewriter lines={lines} />);
    expect(screen.getByText("$ whoami. 4 departments use it daily")).toHaveClass("sr-only");
  });

  it("waits until visible, then types commands and prints output", () => {
    const { container } = render(<Typewriter lines={lines} speed={10} startDelay={0} />);
    const [command, output] = container.querySelectorAll("p[aria-hidden='true']");

    advance(1000);
    expect(command).toHaveTextContent(/^\$\s*▍?$/); // nothing typed off-screen
    expect(output).toHaveClass("invisible");

    scrollIntoView();
    advance(2000);
    expect(command).toHaveTextContent("$ whoami");
    expect(output).not.toHaveClass("invisible");
    expect(output).toHaveTextContent("4 departments use it daily");
  });

  it("finishes instantly when skipped", () => {
    const { container } = render(<Typewriter lines={lines} />);
    fireEvent.click(screen.getByRole("button", { name: "skip" }));

    const [, output] = container.querySelectorAll("p[aria-hidden='true']");
    expect(output).not.toHaveClass("invisible");
    expect(screen.queryByRole("button", { name: "skip" })).not.toBeInTheDocument();
  });
});
