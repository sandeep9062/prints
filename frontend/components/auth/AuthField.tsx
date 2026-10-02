"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared form-field primitives for the /auth pages.
 *
 * They mirror the editorial language used across the homepage: square corners,
 * hairline stone borders, uppercase micro-labels and the deep red accent
 * (`red-800`) instead of the generic rounded/rose defaults.
 */

export const authInputClass =
  "w-full rounded-none border border-stone-300 bg-white px-4 py-3.5 text-sm text-stone-900 " +
  "placeholder-stone-400 shadow-none transition-colors duration-200 outline-none " +
  "focus:border-red-800 focus:ring-1 focus:ring-red-800 " +
  "dark:border-stone-700 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder-stone-500 " +
  "dark:focus:border-red-600 dark:focus:ring-red-600";

/** Small caps label that sits above every auth input. */
export function AuthLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400"
    >
      {children}
    </label>
  );
}

/** Inline validation message, prefixed with a hairline accent bar. */
export function AuthError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mt-2 flex items-start gap-2 text-xs text-red-700 dark:text-red-400"
    >
      <span aria-hidden="true" className="mt-1.5 h-px w-3 shrink-0 bg-current" />
      {message}
    </p>
  );
}

interface AuthFieldProps {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: (ids: { id: string; describedBy?: string }) => React.ReactNode;
}

/**
 * Thin wrapper that wires up the label / input / error trio so the login and
 * signup forms stay declarative and visually identical.
 */
export function AuthField({
  label,
  error,
  hint,
  className,
  children,
}: AuthFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <AuthLabel htmlFor={id}>{label}</AuthLabel>
      {children({ id, describedBy })}
      {hint && (
        <p id={hintId} className="text-xs text-stone-400 dark:text-stone-500">
          {hint}
        </p>
      )}
      <span id={errorId}>
        <AuthError message={error} />
      </span>
    </div>
  );
}