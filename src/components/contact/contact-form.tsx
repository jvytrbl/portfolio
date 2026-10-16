"use client";

import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
} from "react";
import { submitContact } from "@/app/actions/contact";
import { buttonClass } from "@/components/ui/button";
import {
  HONEYPOT_FIELD,
  MESSAGE_MAX,
  initialContactState,
  type ContactField,
} from "@/lib/contact/schema";
import { cn } from "@/lib/utils";
import { Turnstile } from "./turnstile";

type ContactFormProps = {
  configured: boolean;
  turnstileSiteKey?: string;
};

const FIELD_ORDER: ContactField[] = ["name", "email", "subject", "message"];

export function ContactForm({ configured, turnstileSiteKey }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);
  const [verified, setVerified] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};

  const needsHumanCheck = configured && Boolean(turnstileSiteKey);
  const blockedReason = !configured
    ? "The form is being set up. Please use the email address instead."
    : needsHumanCheck && !verified
      ? "Waiting for the human check to finish."
      : null;

  // After a result, focus the first invalid field (so its error is read out),
  // otherwise the status message.
  useEffect(() => {
    if (state.status === "idle") return;
    const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
    } else {
      statusRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per result
  }, [state]);

  function guardSubmit(event: FormEvent<HTMLFormElement>) {
    if (blockedReason) event.preventDefault();
  }

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-4 border-y border-border py-10 outline-none"
      >
        <CheckCircle2 className="size-6 text-success" aria-hidden="true" />
        <p className="font-serif text-5xl leading-none">Message sent.</p>
        <p className="max-w-[50ch] text-lg text-fg-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={guardSubmit}
      noValidate
      className="flex flex-col gap-5"
    >
      {!configured && (
        <p id="contact-blocked" className="border-y border-border py-3 text-sm text-fg-muted">
          The form is being set up. Until then, please use the email address.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
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
          inputMode="email"
          error={errors.email}
          defaultValue={values.email}
        />
      </div>
      <Field
        label="Subject"
        name="subject"
        optional
        error={errors.subject}
        defaultValue={values.subject}
      />
      <Field
        label="Message"
        name="message"
        multiline
        error={errors.message}
        defaultValue={values.message}
        maxLength={MESSAGE_MAX}
        onLengthChange={setMessageLength}
        hint={`${messageLength.toLocaleString("en-US")} / ${MESSAGE_MAX.toLocaleString("en-US")}`}
      />

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {needsHumanCheck && turnstileSiteKey && (
        <Turnstile siteKey={turnstileSiteKey} resetKey={state} onVerifiedChange={setVerified} />
      )}

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {state.status === "error" && (
          <p className="flex items-start gap-2 text-sm text-danger">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {state.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* aria-disabled (not disabled) keeps the button focusable so keyboard
            users can reach it and hear why it's unavailable. */}
        <button
          type="submit"
          aria-disabled={pending || Boolean(blockedReason)}
          aria-describedby={blockedReason ? "contact-blocked-reason" : undefined}
          className={buttonClass(
            "primary",
            "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
          )}
        >
          {pending ? <Loader2 className="animate-spin" /> : <Send />}
          {pending ? "Sending…" : "Send message"}
        </button>
        {blockedReason && (
          <p id="contact-blocked-reason" className="text-sm text-fg-muted">
            {blockedReason}
          </p>
        )}
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: ContactField;
  error?: string;
  multiline?: boolean;
  optional?: boolean;
  hint?: string;
  onLengthChange?: (length: number) => void;
} & Omit<ComponentProps<"input">, "name">;

function Field({
  label,
  name,
  error,
  multiline,
  optional,
  hint,
  onLengthChange,
  defaultValue,
  maxLength,
  ...props
}: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;
  const className = cn(
    "min-h-12 w-full rounded-sm border bg-bg-deep px-4 py-3 text-base text-fg transition-colors placeholder:text-fg-muted focus:border-fg focus:outline-none",
    error ? "border-danger" : "border-border",
  );
  const shared = {
    id,
    name,
    required: !optional,
    maxLength,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    defaultValue: defaultValue as string | undefined,
    onChange: onLengthChange
      ? (e: { currentTarget: { value: string } }) => onLengthChange(e.currentTarget.value.length)
      : undefined,
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}{" "}
          <span className="font-normal text-fg-muted">
            {optional ? "(optional)" : "(required)"}
          </span>
        </label>
        {hint && (
          <span id={hintId} className="font-mono text-xs text-fg-muted tabular-nums">
            {hint}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea {...shared} rows={6} className={cn(className, "resize-y")} />
      ) : (
        <input {...shared} {...props} className={className} />
      )}
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
