import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Form-field primitives shared by /contact and /business.
 *
 * Square corners, hairline stone borders and uppercase micro-labels — the same
 * editorial language introduced on /auth.
 */

export const fieldClass =
  "w-full rounded-none border border-border bg-card px-4 py-3.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground transition-colors duration-200 outline-none " +
  "focus:border-brand focus:ring-1 focus:ring-brand " +
  "" +
  "";

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
        className="block text-[10px] font-semibold text-muted-foreground"
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