"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Bell, BellRing, Loader2, LogIn, Mail, X } from "lucide-react";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useCreateSavedSearchMutation } from "@/services/savedSearchesApi";
import { toast } from "@/hooks/use-toast";

/* Pill styles shared with the /saved-searches page so all CTAs match. */
const primaryBtn =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-[#4161df] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#3451c7] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";
const secondaryBtn =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/40 hover:bg-[#EEF1FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

/** One alert channel row: icon + copy + switch. The whole row is clickable. */
function AlertToggle({
  icon,
  title,
  description,
  checked,
  onToggle,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/40 disabled:opacity-60 ${
        checked
          ? "border-[#4161df]/30 bg-[#EEF1FC]/60"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
          checked ? "bg-white text-[#4161df]" : "bg-slate-100 text-slate-400"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-900">
          {title}
        </span>
        <span className="block text-xs text-slate-500">{description}</span>
      </span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#4161df]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
    </button>
  );
}

export default function SaveSearchButton({
  filters,
}: {
  filters: Record<string, string>;
}) {
  const isAuth = useSelector(selectIsAuthenticated);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emailOn, setEmailOn] = useState(true);
  const [inAppOn, setInAppOn] = useState(true);
  const [create, { isLoading }] = useCreateSavedSearchMutation();

  // Escape closes the dialog, and the page behind it stops scrolling.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isLoading]);

  const handleSave = async () => {
    const clean: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v) !== "") {
        clean[k] = String(v);
      }
    });
    try {
      await create({
        name: name || "My search",
        filters: clean,
        notifyEmail: emailOn,
        notifyInApp: inAppOn,
      }).unwrap();
      toast.success("Search saved — you'll get alerts for new matches.");
      setOpen(false);
      setName("");
      router.push("/saved-searches");
    } catch {
      toast.error("Could not save this search. Please try again.");
    }
  };

  if (!isAuth) {
    return (
      <button
        type="button"
        onClick={() => router.push("/login")}
        title="Log in to save this search and get alerts"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/40 hover:bg-[#EEF1FC] hover:text-[#4161df] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2 active:translate-y-0"
      >
        <LogIn className="h-4 w-4" />
        Log in to save this search
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-2 rounded-full border border-[#4161df]/25 bg-white px-4 py-2 text-sm font-semibold text-[#4161df] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/50 hover:bg-[#EEF1FC] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2 active:translate-y-0"
      >
        <BellRing className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
        Save search{" "}
        <span className="font-medium text-[#4161df]/70">&amp; alerts</span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[2000] flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isLoading) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-search-title"
            className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-2xl ring-1 ring-slate-900/5 sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-start gap-3 border-b border-slate-100 p-5 sm:p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF1FC] text-[#4161df]">
                <BellRing className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  id="save-search-title"
                  className="text-base font-bold text-slate-900"
                >
                  Save this search
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  We&apos;ll notify you when new listings match these filters —
                  city, budget, BHK and locality.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                disabled={isLoading}
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
                  htmlFor="saved-search-name"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Name
                </label>
                <input
                  id="saved-search-name"
                  type="text"
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#4161df] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4161df]/10"
                  placeholder="e.g. 3BHK rent in Mohali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2.5">
                <AlertToggle
                  icon={<Mail className="h-4 w-4" />}
                  title="Email alerts"
                  description="Get a digest when new matches appear"
                  checked={emailOn}
                  onToggle={() => setEmailOn((v) => !v)}
                  disabled={isLoading}
                />
                <AlertToggle
                  icon={<Bell className="h-4 w-4" />}
                  title="In-app notifications"
                  description="See new matches in your notifications"
                  checked={inAppOn}
                  onToggle={() => setInAppOn((v) => !v)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2.5 border-t border-slate-100 bg-slate-50/60 p-5 sm:px-6">
              <button
                type="button"
                className={`${secondaryBtn} flex-1`}
                disabled={isLoading}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${primaryBtn} flex-1`}
                disabled={isLoading}
                onClick={handleSave}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <BellRing className="h-4 w-4" />
                    Save &amp; get alerts
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
