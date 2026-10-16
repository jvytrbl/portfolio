"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

const SESSION_PREFIX = "viewed:";

/**
 * Counts one view per project per browser session, then shows the total.
 * Renders nothing until a count arrives (or if the counter is unavailable).
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
      // Storage blocked — fall through and just read the count.
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
        // Network errors or abort — the counter simply stays hidden.
      });

    return () => controller.abort();
  }, [slug]);

  if (views === null) return null;

  return (
    <>
      <span aria-hidden="true">·</span>
      <span className="flex items-center gap-1">
        <Eye className="size-3.5" aria-hidden="true" />
        {views.toLocaleString("en-US")} {views === 1 ? "view" : "views"}
      </span>
    </>
  );
}
