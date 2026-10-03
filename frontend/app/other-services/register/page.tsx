"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Languages,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Sparkles,
  MapPinned,
  Home,
  Hash,
  ShieldCheck,
} from "lucide-react";
import { useRegisterLandlordMutation } from "@/services/landlordApi";

/* ══════════════════════════════════════
   STATIC OPTIONS
══════════════════════════════════════ */
const CITIES = [
  "Chandigarh",
  "Panchkula",
  "Mohali",
  "Zirakpur",
  "New Chandigarh",
  "Manimajra",
  "Derabassi",
];

const SERVICE_CATEGORIES = [
  "Wedding Cards",
  "Invitation Cards",
  "Visiting Cards",
  "Shagun Envelopes",
  "Letter Pads",
  "Brochures & Catalogs",
  "Banners & Flex",
  "Books & Bindings",
  "Stickers",
  "Rubber Stamps",
];

const LANGUAGES = ["Hindi", "English", "Punjabi"];

/* ══════════════════════════════════════
   FORM STATE TYPE
══════════════════════════════════════ */
interface FormState {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bio: string;
  locations: string[];
  services: string[];
  languages: string[];
  isCompany: boolean;
  companyName: string;
  gstin: string;
  pan: string;
  agreeTerms: boolean;
}

const initialState: FormState = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  city: "",
  state: "Chandigarh",
  pincode: "",
  bio: "",
  locations: [],
  services: [],
  languages: [],
  isCompany: false,
  companyName: "",
  gstin: "",
  pan: "",
  agreeTerms: false,
};

/* ══════════════════════════════════════
   SMALL UI HELPERS
══════════════════════════════════════ */
function SectionLabel({
  icon,
  title,
  step,
}: {
  icon: React.ReactNode;
  title: string;
  step: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(65,97,223,.10)", color: "#4161df" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10.5px] tracking-[0.14em] uppercase font-semibold text-slate-400">
          {step}
        </p>
        <h3 className="text-[18px] text-slate-900 leading-tight font-medium">
          {title}
        </h3>
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
      {children}
      {required && <span style={{ color: "#4161df" }}> *</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-[#4161df] focus:ring-2 focus:ring-[#4161df]/15";

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-full transition-all duration-150 border"
      style={
        active
          ? {
              background: "#4161df",
              color: "#fff",
              borderColor: "#4161df",
            }
          : {
              background: "#fff",
              color: "#64748b",
              borderColor: "#e2e8f0",
            }
      }
    >
      {label}
    </button>
  );
}

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function ServiceProviderRegisterPage() {
  const router = useRouter();
  const loggedInUser = useSelector(selectUser);

  // Pre-fill name, phone, email from the logged-in user if available
  const [form, setForm] = useState<FormState>(() => ({
    ...initialState,
    ...(loggedInUser
      ? {
          name: loggedInUser.name || "",
          phone: loggedInUser.phone || "",
          email: loggedInUser.email || "",
        }
      : {}),
  }));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [registerProvider] = useRegisterLandlordMutation();

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleArrayValue = (
    key: "locations" | "services" | "languages",
    value: string,
  ) => {
    setForm((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!form.phone.trim()) return "Please enter a phone number.";
    if (form.locations.length === 0)
      return "Select at least one area you serve.";
    if (form.services.length === 0)
      return "Select at least one service you offer.";
    if (form.isCompany && !form.companyName.trim())
      return "Please enter your company name.";
    if (!form.agreeTerms) return "Please accept the terms to continue.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      // Build FormData for the API (supports file upload)
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("phone", form.phone.trim());
      formData.append("whatsapp", form.whatsapp.trim());
      formData.append("email", form.email.trim());
      formData.append("address", form.address.trim());
      formData.append("city", form.city.trim());
      formData.append("state", form.state.trim());
      formData.append("pincode", form.pincode.trim());
      formData.append("bio", form.bio.trim());
      formData.append("isCompany", String(form.isCompany));
      formData.append("companyName", form.companyName.trim());
      formData.append("gstin", form.gstin.trim());
      formData.append("pan", form.pan.trim());

      // Attach userId if the user is logged in
      if (loggedInUser?._id) {
        formData.append("userId", loggedInUser._id);
      }

      // Arrays — send as JSON strings; backend parses them.
      // Service categories are sent in the `propertyTypes` field, which is
      // the field the registration API expects for the professional's offerings.
      formData.append("locations", JSON.stringify(form.locations));
      formData.append("propertyTypes", JSON.stringify(form.services));
      formData.append("languages", JSON.stringify(form.languages));

      // Attach photo if selected
      if (photo) {
        formData.append("photo", photo);
      }

      await registerProvider(formData).unwrap();
      setSubmitted(true);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const errorData = (err as { data: { message?: string } }).data;
        setError(
          errorData?.message || "Something went wrong. Please try again.",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ── SUCCESS STATE ── */
  if (submitted) {
    return (
      <>
        <main className="min-h-screen flex items-center justify-center px-4 bg-background">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(22,163,74,.10)" }}
            >
              <CheckCircle2 size={28} style={{ color: "#16a34a" }} />
            </div>
            <h1 className="text-[26px] text-slate-900 mb-2 font-semibold">
              Profile created
            </h1>
            <p className="text-[13.5px] text-slate-500 leading-relaxed mb-6">
              Thanks {form.name.split(" ")[0] || "there"} — your service
              provider profile has been created successfully. You can now
              receive customer enquiries and manage your profile from your
              dashboard.
            </p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#0f172a" }}
            >
              Back to home
              <ArrowRight size={14} />
            </button>
          </div>
        </main>
      </>
    );
  }

  /* ── FORM STATE ── */
  return (
    <>
      <main className="min-h-screen relative overflow-hidden bg-background">
        {/* subtle grid bg */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(65,97,223,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(65,97,223,.045) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* decorative circle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full"
          style={{
            background:
              "linear-gradient(135deg,rgba(65,97,223,.10),rgba(129,140,248,.18))",
            border: "1px solid rgba(65,97,223,.10)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* ── HEADER ── */}
          <div className="text-center mb-10">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11.5px] font-medium mb-5"
              style={{
                background: "rgba(65,97,223,.09)",
                border: "1px solid rgba(65,97,223,.22)",
                color: "#2a3ebf",
              }}
            >
              <Sparkles size={12} />
              For print orders & business enquiries
            </span>
            <h1 className="text-[34px] sm:text-[46px] leading-[1.08] text-slate-900 mb-3 font-semibold">
              Start your{" "}
              <em style={{ color: "#4161df", fontStyle: "italic" }}>
                custom print
              </em>
            </h1>
            <p className="text-[14px] text-slate-500 max-w-md mx-auto leading-relaxed font-light">
              Tell us what you need printed — wedding cards, visiting cards,
              shagun envelopes, brochures or packaging — and our design team will
              get back with paper, finish and pricing options.
            </p>
          </div>

          {/* ── trust strip ── */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {[
              "Free consultation",
              "Proof before print",
              "In-house production",
              "Bulk & corporate orders",
            ].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600 bg-white border border-slate-100 rounded-full px-3 py-1.5 shadow-sm"
              >
                <CheckCircle2 size={12} style={{ color: "#16a34a" }} />
                {t}
              </span>
            ))}
          </div>

          {/* ── FORM CARD ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-9 flex flex-col gap-9"
          >
            {/* ════ STEP 1 — Personal info ════ */}
            <section>
              <SectionLabel
                icon={<User size={17} />}
                step="Step 1"
                title="Personal information"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Full name</FieldLabel>
                  <input
                    className={inputClass}
                    placeholder="e.g. Amanpreet Singh"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel required>Phone number</FieldLabel>
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={`${inputClass} pl-9`}
                      placeholder="98xxxxxx10"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>WhatsApp number</FieldLabel>
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={`${inputClass} pl-9`}
                      placeholder="Same as phone, if applicable"
                      value={form.whatsapp}
                      onChange={(e) => update("whatsapp", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>Email address</FieldLabel>
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      className={`${inputClass} pl-9`}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* ════ STEP 2 — Address ════ */}
            <section>
              <SectionLabel
                icon={<MapPinned size={17} />}
                step="Step 2"
                title="Your address"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FieldLabel>Address</FieldLabel>
                  <input
                    className={inputClass}
                    placeholder="Street, locality, landmark"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>City</FieldLabel>
                  <div className="relative">
                    <MapPin
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={`${inputClass} pl-9`}
                      placeholder="e.g. Chandigarh"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>State</FieldLabel>
                  <input
                    className={inputClass}
                    placeholder="e.g. Chandigarh"
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>Pincode</FieldLabel>
                  <div className="relative">
                    <Hash
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={`${inputClass} pl-9`}
                      placeholder="160xxx"
                      value={form.pincode}
                      onChange={(e) => update("pincode", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* ════ STEP 3 — Services & coverage ════ */}
            <section>
              <SectionLabel
                icon={<Home size={17} />}
                step="Step 3"
                title="Services & coverage"
              />

              <div className="mb-5">
                <FieldLabel required>Areas you serve</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((loc) => (
                    <Toggle
                      key={loc}
                      label={loc}
                      active={form.locations.includes(loc)}
                      onClick={() => toggleArrayValue("locations", loc)}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <FieldLabel required>Services you offer</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_CATEGORIES.map((svc) => (
                    <Toggle
                      key={svc}
                      label={svc}
                      active={form.services.includes(svc)}
                      onClick={() => toggleArrayValue("services", svc)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>
                  <span className="inline-flex items-center gap-1.5">
                    <Languages size={12} /> Languages you speak
                  </span>
                </FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <Toggle
                      key={lang}
                      label={lang}
                      active={form.languages.includes(lang)}
                      onClick={() => toggleArrayValue("languages", lang)}
                    />
                  ))}
                </div>
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* ════ STEP 4 — Company / Business details ════ */}
            <section>
              <SectionLabel
                icon={<Building2 size={17} />}
                step="Step 4"
                title="Company details (optional)"
              />

              <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isCompany}
                  onChange={(e) => update("isCompany", e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-[#4161df]"
                />
                <span className="text-[12.5px] text-slate-600 font-medium">
                  I am registering as a company / firm
                </span>
              </label>

              {form.isCompany && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Company name</FieldLabel>
                    <div className="relative">
                      <Building2
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        className={`${inputClass} pl-9`}
                        placeholder="e.g. Singh Properties Pvt. Ltd."
                        value={form.companyName}
                        onChange={(e) => update("companyName", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>GSTIN</FieldLabel>
                    <input
                      className={inputClass}
                      placeholder="22AAAAA0000A1Z5"
                      value={form.gstin}
                      onChange={(e) => update("gstin", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>PAN number</FieldLabel>
                    <input
                      className={inputClass}
                      placeholder="AAAAA1234Z"
                      value={form.pan}
                      onChange={(e) => update("pan", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </section>

            <div className="h-px bg-slate-100" />

            {/* ════ STEP 5 — Profile photo ════ */}
            <section>
              <SectionLabel
                icon={<Upload size={17} />}
                step="Step 5"
                title="Profile photo (optional)"
              />
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 cursor-pointer transition-colors hover:border-[#4161df]/40 hover:bg-[#4161df]/[0.03]"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(65,97,223,.08)" }}
                >
                  <Upload size={16} style={{ color: "#4161df" }} />
                </div>
                {photo ? (
                  <p className="text-[13px] font-medium text-slate-700">
                    {photo.name}
                  </p>
                ) : (
                  <p className="text-[13px] font-medium text-slate-600">
                    Click to upload your photo
                  </p>
                )}
                <p className="text-[11px] text-slate-400">
                  PNG or JPG, up to 5MB
                </p>
                <input
                  id="photo-upload"
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setPhoto(file);
                  }}
                />
              </label>
            </section>

            {/* ── short bio ── */}
            <section>
              <FieldLabel>Short bio</FieldLabel>
              <textarea
                className={`${inputClass} min-h-[96px] resize-none`}
                placeholder="Tell customers a little about your services, experience and past work..."
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                maxLength={400}
              />
              <p className="text-[11px] text-slate-400 mt-1 text-right">
                {form.bio.length}/400
              </p>
            </section>

            {/* ── error message ── */}
            {error && (
              <div
                className="text-[12.5px] font-medium rounded-xl px-4 py-3"
                style={{
                  background: "rgba(239,68,68,.08)",
                  color: "#dc2626",
                  border: "1px solid rgba(239,68,68,.18)",
                }}
              >
                {error}
              </div>
            )}

            {/* ── terms ── */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={(e) => update("agreeTerms", e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#4161df]"
              />
              <span className="text-[12.5px] text-slate-500 leading-relaxed">
                I confirm the information above is accurate and agree to
                Ink of Memories'{" "}
                <span style={{ color: "#4161df" }} className="font-medium">
                  Terms of Service & Privacy Policy
                </span>
                .
              </span>
            </label>

            {/* ── submit ── */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-between pt-1">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-slate-700 transition-colors order-2 sm:order-1"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-[13.5px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[.98] disabled:opacity-60 order-1 sm:order-2"
                style={{
                  background: "#0f172a",
                  boxShadow: "0 4px 16px rgba(15,23,42,.18)",
                }}
              >
                {submitting ? "Submitting…" : "Create service profile"}
                {!submitting && <ArrowRight size={14} />}
              </button>
            </div>
          </form>

          {/* footer note */}
          <p className="text-center text-[12px] text-slate-400 mt-6">
            Already have a profile?{" "}
            <span style={{ color: "#4161df" }} className="font-medium">
              Log in to your dashboard
            </span>
          </p>
        </div>
      </main>
    </>
  );
}
