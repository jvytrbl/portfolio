"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { buttonClass } from "./button";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${value}`;
    }
  }

  return (
    <button type="button" onClick={copy} className={buttonClass("outline")}>
      {copied ? <Check className="text-success" /> : <Copy />}
      <span aria-live="polite">{copied ? "Copied!" : label}</span>
    </button>
  );
}
