import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Form-field primitives shared by /contact and /business.
 *
 * Square corners, hairline stone borders and uppercase micro-labels — the same
 * editorial language introduced on /auth.
 */

export const fieldClass =
  "w-full rounded-none border border-stone-300 bg-white px-4 py-3.5 text-sm text-stone-900 " +
  "placeholder-stone-400 transition-colors duration-200 outline-none " +
  "focus:border-red-800 focus:ring-1 focus:ring-red-800 " +
  "dark:border-stone-700 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder-stone-500 " +
  "dark:focus:border-red-600 dark:focus:ring-red-600";

export function Field({
  label,
  id,
  className,
  children,
}: {
  label: string;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/** Text input wired to a Field's label. */
export function TextField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const id = props.id ?? autoId;
  return (
    <Field label={label} id={id}>
      <input id={id} {...props} className={cn(fieldClass, props.className)} />
    </Field>
  );
}

/** Multi-line input wired to a Field's label. */
export function TextAreaField({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const autoId = useId();
  const id = props.id ?? autoId;
  return (
    <Field label={label} id={id}>
      <textarea
        id={id}
        rows={props.rows ?? 5}
        {...props}
        className={cn(fieldClass, "resize-y", props.className)}
      />
    </Field>
  );
}