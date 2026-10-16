"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/use-theme";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileProps = {
  siteKey: string;
  /** Change to get a fresh token (tokens are single-use). */
  resetKey: unknown;
  /** Called with true once a token is issued, false when it expires or resets. */
  onVerifiedChange: (verified: boolean) => void;
};

/**
 * Cloudflare Turnstile human check. Writes its token into a hidden
 * `cf-turnstile-response` input inside the surrounding form.
 */
export function Turnstile({ siteKey, resetKey, onVerifiedChange }: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const callback = useRef(onVerifiedChange);
  const [ready, setReady] = useState(() => typeof window !== "undefined" && !!window.turnstile);
  const { theme } = useTheme();

  useEffect(() => {
    callback.current = onVerifiedChange;
  }, [onVerifiedChange]);

  useEffect(() => {
    if (!ready || !container.current || !window.turnstile) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      theme,
      size: "flexible",
      callback: () => callback.current(true),
      "expired-callback": () => callback.current(false),
      "error-callback": () => callback.current(false),
    });
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
      callback.current(false);
    };
  }, [ready, siteKey, theme]);

  useEffect(() => {
    if (!widgetId.current) return;
    window.turnstile?.reset(widgetId.current);
    callback.current(false);
  }, [resetKey]);

  return (
    <>
      <Script src={SCRIPT_URL} strategy="lazyOnload" onReady={() => setReady(true)} />
      {/* Fixed height reserves the widget's space, so nothing shifts. */}
      <div ref={container} className="min-h-[65px]" />
    </>
  );
}
