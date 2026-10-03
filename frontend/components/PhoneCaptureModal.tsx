"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "@/hooks/use-toast";
import { PhoneCall } from "lucide-react";

// E.164: leading "+" + country code + subscriber number, e.g. "+919876543210"
const PHONE_RE = /^\+[1-9]\d{7,14}$/;

/**
 * Google OAuth phone-capture modal.
 *
 * Phone numbers are mandatory and stored WITH the country code (E.164,
 * e.g. "+919876543210"), so a Google account cannot be created without one.
 * This modal appears when the backend answers /auth/google with code
 * "PHONE_REQUIRED" (new Google signup, or a legacy Google user with no phone
 * on file). `onSubmitPhone` re-runs /auth/google with the phone and logs the
 * user in — only after it succeeds is the user allowed to continue.
 */
export default function PhoneCaptureModal({
  onSubmitPhone,
  onSave,
}: {
  onSubmitPhone: (phone: string) => Promise<void>;
  onSave: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!PHONE_RE.test(phone)) {
      toast.error(
        "Please enter a valid phone number with country code, e.g. +919876543210.",
      );
      return;
    }
    setIsSaving(true);
    try {
      await onSubmitPhone(phone);
      toast.success("Phone number saved.");
      onSave();
    } catch (err: any) {
      console.error("phone save error:", err);
      toast.error(
        err?.message || "Couldn't save your phone. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-capture-title"
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
      >
        <div className="px-5 pb-5 pt-5">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-[#4161df]">
            <PhoneCall className="h-6 w-6" aria-hidden />
          </div>
          <h2
            id="phone-capture-title"
            className="text-center text-lg font-bold text-gray-900 sm:text-xl"
          >
            What&apos;s your WhatsApp number?
          </h2>
          <p className="mt-1.5 text-center text-sm text-gray-600">
            A phone number is required to finish setting up your account. We
            use it to connect you directly with buyers and agents.
          </p>

          <div className="mt-5">
            <label className="block text-xs font-medium text-gray-700">
              Phone number (with country code)
            </label>
            <PhoneInput
              value={phone}
              onChange={(value) => setPhone(value ?? "")}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 pr-14 text-sm"
              defaultCountry="IN"
            />
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="mt-5 w-full rounded-lg bg-[#4161df] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3759dd] disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save number"}
          </button>
        </div>
      </div>
    </div>
  );
}