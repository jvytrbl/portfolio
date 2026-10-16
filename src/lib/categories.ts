// Shared by the Velite schema and the UI (kept free of build-tool imports).
export const PROJECT_CATEGORIES = [
  "Full-Stack",
  "AI/ML",
  "Enterprise ERP/API",
  "Open Source",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
