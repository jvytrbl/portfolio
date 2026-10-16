"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  getTheme,
  readStoredTheme,
  setTheme,
  subscribeTheme,
  toggleTheme,
} from "@/lib/theme";

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => DEFAULT_THEME);

  // React's dev Strict Mode remount resets <html> attributes set by the
  // inline script; re-apply the stored preference before paint.
  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (stored && stored !== getTheme()) setTheme(stored);
  }, []);

  return { theme, setTheme, toggleTheme };
}
