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

/* ══════════════════════════════════════
   SUBMISSION
   ------------------------------------------------------------
   Posts the print enquiry to the backend's enquiry endpoint
   (`POST {NEXT_PUBLIC_API_URL}/v1/enquiry`), which stores
   name / email / phone / message. That is the only public
   "someone wants to print something" endpoint the API exposes,
   so it is what this form targets.

   The richer fields (categories, city, budget-ish detail,
   languages, company/GSTIN) are folded into `message` so the
   enquiry team still receives the full brief in one place.

   A plain `fetch` rather than an RTK Query slice: this route is
   a standalone public form, and the enquiry endpoint is not
   part of the shared cached store (no reads, no invalidation).
   ══════════════════════════════════════ */
const ENQUIRY_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/v1/enquiry`;

function buildEnquiryMessage(fields: {
  categories: string[];
  city: string;
  quantity: string;
  languages: string[];
  companyName: string;
  gstin: string;
  pan: string;
  bio: string;
  hasPhoto: boolean;
}): string {
  const lines: string[] = ["Print enquiry from the website:", ""];

  if (fields.categories.length) {
    lines.push(`Services needed: ${fields.categories.join(", ")}`);
  }
  if (fields.city) lines.push(`City: ${fields.city}`);
  if (fields.quantity) lines.push(`Approx. quantity: ${fields.quantity}`);
  if (fields.languages.length) {
    lines.push(`Languages: ${fields.languages.join(", ")}`);
  }
  if (fields.companyName) lines.push(`Company: ${fields.companyName}`);
  if (fields.gstin) lines.push(`GSTIN: ${fields.gstin}`);
  if (fields.pan) lines.push(`PAN: ${fields.pan}`);
  if (fields.bio) lines.push(`Notes: ${fields.bio}`);
  if (fields.hasPhoto) {
    lines.push(
      "(Reference photo selected on the form — please contact the customer directly for the file.)",
    );
  }

  return lines.join("\n");
}

async function submitEnquiry(body: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<void> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(ENQUIRY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    // Surface the server's message when it sends one, otherwise a generic line.
    let detail = "Something went wrong. Please try again.";
    try {
      const data = await response.json();
      if (data && typeof data.message === "string") detail = data.message;
      else if (data && typeof data.error === "string") detail = data.error;
    } catch {
      // Non-JSON error body — keep the generic message.
    }
    throw new Error(detail);
  }
}

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
        style={{
          background: "hsl(var(--brand) / 0.10)",
          color: "hsl(var(--brand))",
        }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10.5px] font-semibold text-muted-foreground">
          {step}
        </p>
        <h3 className="text-[18px] text-foreground leading-tight font-medium">
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
    <label className="block text-[12.5px] font-medium text-muted-foreground mb-1.5">
      {children}
      {required && <span style={{ color: "hsl(var(--brand))" }}> *</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15";

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
              background: "hsl(var(--brand))",
              color: "hsl(var(--card))",
              borderColor: "hsl(var(--brand))",
            }
          : {
              background: "hsl(var(--card))",
              color: "hsl(var(--muted-foreground))",
              borderColor: "hsl(var(--border))",
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
      await submitEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: buildEnquiryMessage({
          categories: form.services,
          city: form.city.trim(),
          quantity: form.whatsapp.trim(),
          languages: form.languages,
          companyName: form.companyName.trim(),
          gstin: form.gstin.trim(),
          pan: form.pan.trim(),
          bio: form.bio.trim(),
          hasPhoto: Boolean(photo),
        }),
      });
      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ── SUCCESS STATE ── */
  if (submitted) {
    return (
      <>
        <main className="min-h-screen flex items-center justify-center px-4 mt-24 bg-background">
          <div className="max-w-md w-full bg-card rounded-2xl border border-border shadow-sm p-8 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "hsl(var(--success) / 0.10)" }}
            >
              <CheckCircle2
                size={28}
                style={{ color: "hsl(var(--success))" }}
              />
            </div>
            <h1 className="text-[26px] text-foreground mb-2 font-semibold">
              Enquiry received
            </h1>
            <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-6">
              Thanks {form.name.split(" ")[0] || "there"} — your print enquiry
              is with our team. We&apos;ll get back to you with paper, finish
              and pricing options shortly.
            </p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              style={{ background: "hsl(var(--footer))" }}
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
              "linear-gradient(hsl(var(--brand) / 0.045) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--brand) / 0.045) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* decorative circle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full"
          style={{
            background:
              "linear-gradient(135deg,hsl(var(--brand) / 0.10),hsl(var(--brand) / 0.18))",
            border: "1px solid hsl(var(--brand) / 0.10)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* ── HEADER ── */}
          <div className="text-center mb-10">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11.5px] font-medium mb-5"
              style={{
                background: "hsl(var(--brand) / 0.09)",
                border: "1px solid hsl(var(--brand) / 0.22)",
                color: "hsl(var(--brand-hover))",
              }}
            >
              <Sparkles size={12} />
              For print orders & business enquiries
            </span>
            <h1 className="text-[34px] sm:text-[46px] leading-[1.08] text-foreground mb-3 font-semibold">
              Start your{" "}
              <em style={{ color: "hsl(var(--brand))", fontStyle: "italic" }}>
                custom print
              </em>
            </h1>
            <p className="text-[14px] text-muted-foreground max-w-md mx-auto leading-relaxed font-normal">
              Tell us what you need printed — wedding cards, visiting cards,
              shagun envelopes, brochures or packaging — and our design team
              will get back with paper, finish and pricing options.
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
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground bg-card border border-border rounded-full px-3 py-1.5 shadow-sm"
              >
                <CheckCircle2
                  size={12}
                  style={{ color: "hsl(var(--success))" }}
                />
                {t}
              </span>
            ))}
          </div>

          {/* ── FORM CARD ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-9 flex flex-col gap-9"
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
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
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
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
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
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
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

            <div className="h-px bg-border" />

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
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
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
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
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

            <div className="h-px bg-border" />

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

            <div className="h-px bg-border" />

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
                  className="w-4 h-4 rounded border-border accent-brand"
                />
                <span className="text-[12.5px] text-muted-foreground font-medium">
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
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
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

            <div className="h-px bg-border" />

            {/* ════ STEP 5 — Profile photo ════ */}
            <section>
              <SectionLabel
                icon={<Upload size={17} />}
                step="Step 5"
                title="Profile photo (optional)"
              />
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 cursor-pointer transition-colors hover:border-brand/40 hover:bg-brand/[0.03]"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(var(--brand) / 0.08)" }}
                >
                  <Upload size={16} style={{ color: "hsl(var(--brand))" }} />
                </div>
                {photo ? (
                  <p className="text-[13px] font-medium text-foreground/85">
                    {photo.name}
                  </p>
                ) : (
                  <p className="text-[13px] font-medium text-muted-foreground">
                    Click to upload your photo
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
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
              <p className="text-[11px] text-muted-foreground mt-1 text-right">
                {form.bio.length}/400
              </p>
            </section>

            {/* ── error message ── */}
            {error && (
              <div
                className="text-[12.5px] font-medium rounded-xl px-4 py-3"
                style={{
                  background: "hsl(var(--destructive) / 0.08)",
                  color: "hsl(var(--destructive))",
                  border: "1px solid hsl(var(--destructive) / 0.18)",
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
                className="mt-0.5 w-4 h-4 rounded border-border accent-brand"
              />
              <span className="text-[12.5px] text-muted-foreground leading-relaxed">
                I confirm the information above is accurate and agree to Ink of
                Memories'{" "}
                <span
                  style={{ color: "hsl(var(--brand))" }}
                  className="font-medium"
                >
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
                className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground/85 transition-colors order-2 sm:order-1"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-[13.5px] font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[.98] disabled:opacity-60 order-1 sm:order-2"
                style={{
                  background: "hsl(var(--footer))",
                  boxShadow: "0 4px 16px hsl(var(--foreground) / 0.18)",
                }}
              >
                {submitting ? "Submitting…" : "Create service profile"}
                {!submitting && <ArrowRight size={14} />}
              </button>
            </div>
          </form>

          {/* footer note */}
          <p className="text-center text-[12px] text-muted-foreground mt-6">
            Already have a profile?{" "}
            <span
              style={{ color: "hsl(var(--brand))" }}
              className="font-medium"
            >
              Log in to your dashboard
            </span>
          </p>
        </div>
      </main>
    </>
  );
}
