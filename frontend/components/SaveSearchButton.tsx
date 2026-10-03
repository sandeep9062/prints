"use client";

import { useEffect, useState } from "react";
import { BellRing, Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";

/**
 * "Save this print brief" control.
 *
 * Persists a brief to localStorage so a customer can park a half-finished
 * specification (quantity, GSM, finishing…) and come back to it later. Kept
 * deliberately client-side and self-contained: a saved brief is private,
 * per-device scratch state, so it doesn't belong in the Redux store or behind
 * an API round-trip.
 */
const STORAGE_KEY = "inkofmemories:saved-briefs";

function readBriefs(): Array<{ name: string; details: Record<string, string> }> {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt payload — start clean rather than breaking the page.
    return [];
  }
}

function writeBriefs(
  briefs: Array<{ name: string; details: Record<string, string> }>,
): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(briefs));
    return true;
  } catch {
    return false;
  }
}

/* Pill styles so the CTA matches the rest of the site. */
const primaryBtn =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-[#4161df] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#3451c7] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";
const secondaryBtn =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/40 hover:bg-[#EEF1FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

/** Readable label for a saved brief, e.g. "500 × Wedding Cards". */
function summarise(details: Record<string, string>): string {
  const qty = details.quantity;
  const label = details.title || details.category || "Print brief";
  return qty ? `${qty} × ${label}` : label;
}

/** Only the entries that actually carry a value. */
function filledEntries(filters: Record<string, string>) {
  return Object.entries(filters).filter(
    ([, v]) => v !== undefined && v !== null && String(v) !== "",
  );
}

export default function SaveSearchButton({
  filters,
}: {
  filters: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  // Reads localStorage, so only after mount — never during SSR render.
  useEffect(() => {
    setSavedCount(readBriefs().length);
  }, []);

  // Escape closes the dialog, and the page behind it stops scrolling.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, saving]);

  const handleSave = () => {
    // Drop empty values so a saved brief only carries what was actually set.
    const clean: Record<string, string> = {};
    filledEntries(filters).forEach(([k, v]) => {
      clean[k] = String(v);
    });

    if (Object.keys(clean).length === 0) {
      toast.error("Fill in a few details before saving.");
      return;
    }

    setSaving(true);
    const next = [
      ...readBriefs(),
      { name: name.trim() || summarise(clean), details: clean },
    ];

    if (writeBriefs(next)) {
      setSavedCount(next.length);
      toast.success("Brief saved — you can come back to it any time.");
      setOpen(false);
      setName("");
    } else {
      toast.error("Could not save this brief. Please try again.");
    }
    setSaving(false);
  };

  const previewEntries = filledEntries(filters);
  const autoName = summarise(
    Object.fromEntries(previewEntries.map(([k, v]) => [k, String(v)])),
  );
return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-2 rounded-full border border-[#4161df]/25 bg-white px-4 py-2 text-sm font-semibold text-[#4161df] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/50 hover:bg-[#EEF1FC] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2 active:translate-y-0"
      >
        <BellRing className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
        Save this brief
        {savedCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF1FC] px-1.5 py-0.5 text-[11px] font-bold text-[#4161df]">
            <Check size={11} />
            {savedCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[2000] flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !saving) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-brief-title"
            className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-2xl ring-1 ring-slate-900/5 sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-start gap-3 border-b border-slate-100 p-5 sm:p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF1FC] text-[#4161df]">
                <BellRing className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  id="save-brief-title"
                  className="text-base font-bold text-slate-900"
                >
                  Save this print brief
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  Stored on this device so you can pick the specification back
                  up later — quantity, paper and finishing.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                disabled={saving}
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-5 sm:p-6">
              <div>
                <label
                  htmlFor="saved-brief-name"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Name
                </label>
                <input
                  id="saved-brief-name"
                  type="text"
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4161df] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4161df]/10"
                  placeholder={`e.g. ${autoName}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Leave blank and we&apos;ll call it &ldquo;{autoName}&rdquo;.
                </p>
              </div>

              <ul className="space-y-1.5 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                {previewEntries.length === 0 ? (
                  <li className="text-xs text-slate-400">
                    Nothing to save yet — fill in the form first.
                  </li>
                ) : (
                  previewEntries.map(([k, v]) => (
                    <li
                      key={k}
                      className="flex items-baseline justify-between gap-3 text-xs"
                    >
                      <span className="capitalize text-slate-500">{k}</span>
                      <span className="truncate font-medium text-slate-800">
                        {String(v)}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Footer */}
            <div className="flex gap-2.5 border-t border-slate-100 bg-slate-50/60 p-5 sm:p-6">
              <button
                type="button"
                className={`${secondaryBtn} flex-1`}
                disabled={saving}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${primaryBtn} flex-1`}
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <BellRing className="h-4 w-4" />
                    Save brief
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
