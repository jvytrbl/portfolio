"use client";

import { Command } from "cmdk";
import { ArrowRight, Code2, Copy, ExternalLink, FolderGit2, Home, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { GithubIcon } from "@/components/ui/github-icon";
import { siteConfig } from "@/lib/site";

export type CommandProject = { title: string; url: string };

type CommandMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: CommandProject[];
};

export function CommandMenu({ open, onOpenChange, projects }: CommandMenuProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  function run(action: () => void) {
    onOpenChange(false);
    action();
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onOpenChange(false);
      }, 900);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command menu"
      overlayClassName="fixed inset-0 z-50 bg-ink/40"
      contentClassName="fixed left-1/2 top-[15vh] z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-bg shadow-2xl shadow-ink/20"
    >
      <div className="flex items-center gap-2 border-b border-border px-4">
        <Search aria-hidden="true" className="size-4 text-fg-muted" />
        <Command.Input
          placeholder="Search pages, projects and actions"
          className="h-14 w-full bg-transparent text-base text-fg outline-none placeholder:text-fg-muted"
        />
      </div>
      <Command.List className="max-h-80 overflow-y-auto p-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-fg-muted [&_[cmdk-group-heading]]:uppercase">
        <Command.Empty className="py-8 text-center text-sm text-fg-muted">No results</Command.Empty>

        <Command.Group heading="Navigate">
          <Item icon={<Home />} onSelect={() => run(() => router.push("/"))}>
            Home
          </Item>
          {siteConfig.nav.map((link) => (
            <Item
              key={link.href}
              icon={<ArrowRight />}
              onSelect={() => run(() => router.push(link.href))}
            >
              {link.label}
            </Item>
          ))}
        </Command.Group>

        {projects.length > 0 && (
          <Command.Group heading="Projects">
            {projects.map((project) => (
              <Item
                key={project.url}
                icon={<FolderGit2 />}
                onSelect={() => run(() => router.push(project.url))}
                keywords={["project", "case study"]}
              >
                {project.title}
              </Item>
            ))}
          </Command.Group>
        )}

        <Command.Group heading="Actions">
          <Item icon={<Copy />} onSelect={copyEmail} keywords={["contact", "mail"]}>
            {copied ? "Copied to clipboard ✓" : "Copy email address"}
          </Item>
        </Command.Group>

        <Command.Group heading="Links">
          <Item
            icon={<GithubIcon />}
            onSelect={() => run(() => window.open(siteConfig.github.url, "_blank", "noopener"))}
            trailing={<ExternalLink />}
          >
            GitHub profile
          </Item>
          <Item
            icon={<Code2 />}
            onSelect={() =>
              run(() => window.open(siteConfig.github.sourceUrl, "_blank", "noopener"))
            }
            keywords={["repo", "code"]}
            trailing={<ExternalLink />}
          >
            View source code
          </Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}

type ItemProps = {
  children: ReactNode;
  icon: ReactNode;
  trailing?: ReactNode;
  keywords?: string[];
  onSelect: () => void;
};

function Item({ children, icon, trailing, keywords, onSelect }: ItemProps) {
  return (
    <Command.Item
      onSelect={onSelect}
      keywords={keywords}
      className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-fg-muted data-[selected=true]:bg-surface-raised data-[selected=true]:text-fg [&_svg]:size-4 [&_svg]:shrink-0"
    >
      {icon}
      <span className="flex-1">{children}</span>
      {trailing && <span className="text-fg-muted">{trailing}</span>}
    </Command.Item>
  );
}
