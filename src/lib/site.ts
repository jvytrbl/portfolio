// Single source of truth for site-wide identity and navigation.
// Issue number and year appear in the masthead ("Nº 01 · 2026").
export const siteConfig = {
  name: "Muhammad Hakimi",
  legalName: "Muhammad Hakimi Bin Azizi",
  title: "Junior Software Engineer",
  headline: "I turn messy business workflows into production systems.",
  tagline: "Engineer of unglamorous systems that people use every day.",
  since: "2025",
  description:
    "Full-stack engineer shipping production Next.js systems, ERP integrations, and AI features grounded in validated data.",
  availability: "Open to roles in KL & Selangor", // set to null to hide the badge
  location: "Seremban, Malaysia",
  email: "hakimiazizi060@gmail.com",
  github: {
    username: "jvytrbl",
    url: "https://github.com/jvytrbl",
    sourceUrl: "https://github.com/jvytrbl/portfolio",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  edition: { issue: "01", year: "2026" },
} as const;
