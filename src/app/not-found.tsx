import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-32 font-mono sm:px-6">
      <p className="text-sm text-danger">error: 404</p>
      <h1 className="text-3xl font-semibold text-fg">cd: no such file or directory</h1>
      <p className="text-fg-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="text-accent underline-offset-4 hover:underline">
        cd ~
      </Link>
    </section>
  );
}
