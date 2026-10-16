import Link from "next/link";
import { SplitHeading } from "@/components/ui/split-heading";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[75svh] max-w-7xl flex-col justify-center px-4 pt-36 pb-24 sm:px-8">
      <SplitHeading
        as="h1"
        left="Not"
        right="Found"
        middle={<p className="label">[ Error 404 ]</p>}
      />
      <p className="mt-10 max-w-[48ch] text-lg text-pretty text-fg-muted">
        This page doesn&apos;t exist or has moved.{" "}
        <em className="font-serif text-fg">Everything else is still here.</em>
      </p>
      <p className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-ink-fg"
        >
          Back home
        </Link>
        <Link
          href="/work"
          className="inline-flex min-h-11 items-center rounded-full border border-border px-6 text-sm font-medium"
        >
          See the work
        </Link>
      </p>
    </section>
  );
}
