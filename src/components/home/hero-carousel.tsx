"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

export type Slide = { key: string; href: string; caption: string; media: ReactNode };

/**
 * Edge-to-edge strip of project images with captions, in the spirit of a
 * gallery feed. Native scroll-snap does the work (swipe, trackpad, keyboard);
 * the arrow buttons just scroll by one slide.
 */
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const track = useRef<HTMLUListElement>(null);

  function scrollBy(direction: 1 | -1) {
    const el = track.current;
    const slide = el?.querySelector("li");
    if (!el || !slide) return;
    el.scrollBy({ left: direction * (slide.clientWidth + 12), behavior: "smooth" });
  }

  return (
    <section aria-label="Selected projects" className="relative">
      <ul
        ref={track}
        className="flex snap-x snap-mandatory [scrollbar-width:none] gap-3 overflow-x-auto scroll-smooth px-3 pb-2 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <li key={slide.key} className="w-[85vw] shrink-0 snap-center sm:w-[46vw] lg:w-[40vw]">
            <Link href={slide.href} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-surface">
                <div className="size-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]">
                  {slide.media}
                </div>
              </div>
              <p className="mt-3 flex justify-between gap-4 text-xs text-fg-muted">
                <span className="text-fg">{slide.caption}</span>
                <span>{String(i + 1).padStart(2, "0")}</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="pointer-events-none absolute inset-x-3 top-[calc(50%-1.5rem)] hidden justify-between sm:inset-x-6 sm:flex">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Previous project"
          className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-bg/90 text-fg shadow-sm transition-colors hover:bg-bg"
        >
          <ArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Next project"
          className="pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-bg/90 text-fg shadow-sm transition-colors hover:bg-bg"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
