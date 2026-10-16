"use client";

import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Kbd } from "@/components/ui/kbd";
import type { CommandProject } from "./command-menu";

// The palette (cmdk + Radix Dialog) is only downloaded on first open,
// keeping it out of the initial JS bundle.
const CommandMenu = dynamic(() => import("./command-menu").then((m) => m.CommandMenu), {
  ssr: false,
});

const subscribeNoop = () => () => {};
const detectMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

export function CommandMenuTrigger({ projects }: { projects: CommandProject[] }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isMac = useSyncExternalStore(subscribeNoop, detectMac, () => false);

  function show(next: boolean) {
    if (next) setLoaded(true);
    setOpen(next);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setLoaded(true);
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => show(true)}
        aria-label="Open command menu"
        aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
        className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-sm px-2 text-sm text-fg-muted transition-colors hover:text-fg"
      >
        <Search className="size-4" />
        <span className="hidden items-center gap-0.5 lg:inline-flex">
          <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      {loaded && <CommandMenu open={open} onOpenChange={show} projects={projects} />}
    </>
  );
}
