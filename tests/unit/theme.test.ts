import { describe, expect, it, vi } from "vitest";
import { getTheme, readStoredTheme, setTheme, subscribeTheme, toggleTheme } from "@/lib/theme";

describe("theme store", () => {
  it("defaults to dark when no attribute is set", () => {
    expect(getTheme()).toBe("dark");
  });

  it("applies and persists the chosen theme", () => {
    setTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(readStoredTheme()).toBe("light");
  });

  it("toggles between dark and light", () => {
    setTheme("dark");
    toggleTheme();
    expect(getTheme()).toBe("light");
    toggleTheme();
    expect(getTheme()).toBe("dark");
  });

  it("ignores invalid stored values", () => {
    localStorage.setItem("theme", "neon");
    expect(readStoredTheme()).toBeNull();
  });

  it("notifies subscribers on change", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeTheme(listener);
    setTheme("light");
    unsubscribe();
    setTheme("dark");
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
