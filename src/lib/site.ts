// Single source of truth for site-wide identity and navigation.
// Placeholder values are marked TODO until real content is provided.
export const siteConfig = {
  name: "Hakimi Azizi", // TODO: confirm display name
  title: "Software Engineer", // TODO: confirm headline
  description:
    "Engineering showcase — full-stack systems, API integrations, and the architecture behind them.",
  availability: "Open to opportunities", // TODO: confirm or set to null to hide
  location: "Malaysia", // TODO: confirm
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
