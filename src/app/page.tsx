import { ContactSection } from "@/components/home/contact-section";
import { ExperienceTimeline } from "@/components/home/experience-timeline";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { SkillsMatrix } from "@/components/home/skills-matrix";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <ExperienceTimeline />
      <SkillsMatrix />
      <ContactSection />
    </>
  );
}
