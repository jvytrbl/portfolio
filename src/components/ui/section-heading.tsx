import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  index: string;
  label: string;
  title: string;
  description?: string;
  /** Primary sections get the larger scale; supporting ones step down. */
  size?: "primary" | "secondary";
};

export function SectionHeading({
  index,
  label,
  title,
  description,
  size = "primary",
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3", size === "primary" ? "mb-12" : "mb-8")}>
      <p className="font-mono text-xs tracking-wide text-fg-muted uppercase">
        {index} · {label}
      </p>
      <h2
        className={cn(
          "font-display font-semibold tracking-tight text-balance",
          size === "primary" ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
        )}
      >
        {title}
      </h2>
      {description && <p className="max-w-[60ch] text-lg text-pretty text-fg">{description}</p>}
    </div>
  );
}
