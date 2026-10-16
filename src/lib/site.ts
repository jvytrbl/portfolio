// Single source of truth for site-wide identity and navigation.
export const siteConfig = {
  name: "Muhammad Hakimi Bin Azizi",
  title: "Software Engineer",
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
    { label: "Projects", href: "/projects" },
    { label: "Experience", href: "/#experience" },
    { label: "Skills", href: "/#skills" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
