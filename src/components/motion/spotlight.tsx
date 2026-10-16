"use client";

import { useEffect, useRef } from "react";

// A soft accent glow that follows the pointer across its parent. Updates two
// CSS variables per animation frame — no React re-renders.
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent || !window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    function onMove(event: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = parent!.getBoundingClientRect();
        el!.style.setProperty("--x", `${event.clientX - rect.left}px`);
        el!.style.setProperty("--y", `${event.clientY - rect.top}px`);
        el!.style.opacity = "1";
      });
    }
    function onLeave() {
      el!.style.opacity = "0";
    }

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklab, var(--accent) 12%, transparent), transparent 70%)",
      }}
    />
  );
}
