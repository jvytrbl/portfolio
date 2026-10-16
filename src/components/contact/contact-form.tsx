"use client";

import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react";
import { useActionState, useEffect, useRef, type ComponentProps } from "react";
import { submitContact } from "@/app/actions/contact";
import { buttonClass } from "@/components/ui/button";
import { HONEYPOT_FIELD, initialContactState, type ContactField } from "@/lib/contact/schema";
import { cn } from "@/lib/utils";
import { Turnstile } from "./turnstile";

type ContactFormProps = {
  configured: boolean;
  turnstileSiteKey?: string;
};

export function ContactForm({ configured, turnstileSiteKey }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);
  const statusRef = useRef<HTMLDivElement>(null);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};

  // Move focus to the result so keyboard and screen-reader users hear it.
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-3 rounded-xl border border-success/40 bg-success/5 p-6 outline-none"
      >
        <CheckCircle2 className="size-6 text-success" aria-hidden="true" />
        <p className="font-mono text-sm text-success">$ message sent ✓</p>
        <p className="text-fg-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className="flex flex-col gap-4"
      aria-describedby="contact-status"
    >
      {!configured && (
        <p className="rounded-lg border border-highlight/40 bg-highlight/5 px-4 py-3 text-sm text-fg-muted">
          <span className="font-mono text-highlight">note:</span> the form is being set up — for
          now, please use the email button.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          autoComplete="name"
          error={errors.name}
          defaultValue={values.name}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          error={errors.email}
          defaultValue={values.email}
        />
      </div>
      <Field label="Subject" name="subject" error={errors.subject} defaultValue={values.subject} />
      <Field
        label="Message"
        name="message"
        multiline
        error={errors.message}
        defaultValue={values.message}
      />

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {configured && turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} resetKey={state} />}

      <div
        id="contact-status"
        ref={statusRef}
        tabIndex={-1}
        aria-live="polite"
        className="outline-none"
      >
        {state.status === "error" && (
          <p className="flex items-start gap-2 text-sm text-danger">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {state.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending || !configured}
        className={buttonClass("primary", "w-fit disabled:cursor-not-allowed disabled:opacity-50")}
      >
        {pending ? <Loader2 className="animate-spin" /> : <Send />}
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: ContactField;
  error?: string;
  multiline?: boolean;
} & Omit<ComponentProps<"input">, "name">;

function Field({ label, name, error, multiline, defaultValue, ...props }: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const className = cn(
    "w-full rounded-md border bg-bg-deep/60 px-3 py-2.5 text-sm text-fg placeholder:text-fg-muted/60 transition-colors focus:border-accent focus:outline-none",
    error ? "border-danger" : "border-border",
  );
  const shared = {
    id,
    name,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    defaultValue: defaultValue as string | undefined,
    className,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-xs text-fg-muted">
        {label.toLowerCase()}
      </label>
      {multiline ? (
        <textarea {...shared} rows={6} className={cn(className, "resize-y")} />
      ) : (
        <input {...shared} {...props} />
      )}
      {error && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
