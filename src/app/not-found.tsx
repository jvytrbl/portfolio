import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-32 sm:px-6">
      <p className="font-mono text-sm text-fg-muted">Error 404</p>
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
      <p className="max-w-[55ch] text-lg text-fg-muted">
        This page doesn&apos;t exist or has moved. The case studies and contact details are all on
        the home page.
      </p>
      <ButtonLink href="/" variant="outline">
        <ArrowLeft /> Back to home
      </ButtonLink>
    </section>
  );
}
