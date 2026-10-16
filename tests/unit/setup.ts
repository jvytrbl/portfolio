import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  // Node-environment tests (integration) have no DOM to reset.
  if (typeof window === "undefined") return;
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});
