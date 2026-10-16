import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-8">
      <p className="kicker">Error 404 · Page not found</p>
      <h1 className="mt-6 font-serif text-[clamp(3.5rem,11vw,9rem)] leading-[0.88] tracking-[-0.02em]">
        This page is <em>out of print.</em>
      </h1>
      <p className="mt-8 max-w-[50ch] text-lg text-pretty text-fg-muted">
        It doesn&apos;t exist or has moved. Everything else is still on the shelf.
      </p>
      <p className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline"
        >
          Back to the cover
        </Link>
        <Link
          href="/work"
          className="inline-flex min-h-11 items-center text-fg-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Browse the work
        </Link>
      </p>
    </section>
  );
}
