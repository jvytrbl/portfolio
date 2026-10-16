import { ContactSection } from "@/components/home/contact-section";
import { CredentialsSection } from "@/components/home/credentials-section";
import { ExperienceTimeline } from "@/components/home/experience-timeline";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { GithubActivity } from "@/components/home/github-activity";
import { Hero } from "@/components/home/hero";
import { SkillsMatrix } from "@/components/home/skills-matrix";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <ExperienceTimeline />
      <CredentialsSection />
      <SkillsMatrix />
      <GithubActivity />
      <ContactSection />
    </>
  );
}
