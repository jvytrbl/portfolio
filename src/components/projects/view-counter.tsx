"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

const SESSION_PREFIX = "viewed:";
/** Counts below this stay private: a tiny number reads as a liability. */
export const PUBLIC_VIEW_THRESHOLD = 50;

/**
 * Counts one view per project per browser session. The total is shown only
 * once it reaches PUBLIC_VIEW_THRESHOLD; until then (and while loading) the
 * slot stays reserved but invisible, so the meta row never shifts.
 */
export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const key = SESSION_PREFIX + slug;
    let seen = false;
    try {
      seen = sessionStorage.getItem(key) === "1";
    } catch {
      // Storage blocked: fall through and just read the count.
    }
    // Automated browsers (tests, crawlers that execute JS) read but don't count.
    const count = !seen && !navigator.webdriver;

    fetch(`/api/views/${encodeURIComponent(slug)}`, {
      method: count ? "POST" : "GET",
      signal: controller.signal,
    })
      .then((res) => (res.ok ? (res.json() as Promise<{ views: number }>) : null))
      .then((data) => {
        if (!data) return;
        setViews(data.views);
        if (count) {
          try {
            sessionStorage.setItem(key, "1");
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // Network errors or abort: the counter simply stays hidden.
      });

    return () => controller.abort();
  }, [slug]);

  const show = views !== null && views >= PUBLIC_VIEW_THRESHOLD;

  return (
    <span
      className={show ? "contents" : "invisible contents"}
      aria-hidden={show ? undefined : true}
      data-testid="view-counter"
    >
      <span aria-hidden="true">·</span>
      <span className="inline-flex min-w-[6.5rem] items-center gap-1">
        <Eye className="size-3.5" aria-hidden="true" />
        {show ? `${views.toLocaleString("en-US")} views` : "views"}
      </span>
    </span>
  );
}
