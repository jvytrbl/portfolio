"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLinks } from "./nav-links";

/** Small-screen navigation: an inline disclosure under the pill, not a modal. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 items-center justify-center rounded-full text-fg"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full mt-2 rounded-3xl border border-border bg-bg p-3 shadow-lg shadow-ink/5"
        >
          <NavLinks className="flex flex-col" onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </div>
  );
}
