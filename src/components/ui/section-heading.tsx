type SectionHeadingProps = {
  index: string;
  path: string;
  title: string;
  description?: string;
};

export function SectionHeading({ index, path, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <p className="font-mono text-sm text-accent">
        <span className="text-fg-muted">{index}.</span> ~/{path}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {description && <p className="max-w-2xl text-pretty text-fg-muted">{description}</p>}
    </div>
  );
}
