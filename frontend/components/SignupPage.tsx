"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRegisterMutation } from "../services/authApi";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import SocialAuthButtons from "./SocialAuthButtons";
import AuthShell from "./auth/AuthShell";
import {
  AuthError,
  AuthField,
  AuthLabel,
  authInputClass,
} from "./auth/AuthField";

const signupSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Phone number is required"),
  role: z.enum(["client", "merchant"]),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage({
  toggleAuthMode,
}: {
  toggleAuthMode: () => void;
}) {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "client",
    },
  });

  const phoneValue = watch("phone");

  const handleSignup = async (data: SignupFormValues) => {
    setError("");
    try {
      await registerUser(data).unwrap();
      toast.success("Signup successful! Please login.");
      toggleAuthMode();
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? ((err as { data?: { message?: string } }).data?.message ??
            "Signup failed")
          : "Signup failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <AuthShell
      mode="signup"
      onModeChange={(next) => {
        if (next !== "signup") toggleAuthMode();
      }}
      aside={{
        image: "/gallery-cards.jpg",
        imageAlt:
          "Letterpress business card suites pressed at Samlason Printing Press",
        eyebrow: "Join the Studio",
        title: (
          <>
            Begin your
            <br />
            <em className="font-light text-red-800 dark:text-red-600">
              first commission.
            </em>
          </>
        ),
        description:
          "Create an account to save bespoke designs, approve 3D proofs and unlock member pricing across wedding stationery, corporate suites and packaging.",
        stats: [
          { value: "48h", label: "Proofs" },
          { value: "24k", label: "Gold Foil" },
          { value: "100%", label: "In-House" },
        ],
      }}
    >
      <div className="space-y-8">
        <header className="space-y-3">
          <h2 className="font-serif text-3xl leading-tight text-stone-900 dark:text-stone-100">
            Create an Account
          </h2>
          <p className="text-sm font-light leading-relaxed text-stone-500 dark:text-stone-400">
            A few details and your studio portfolio is ready.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="border-l-2 border-red-700 bg-red-50/70 px-4 py-3 text-sm text-red-800 dark:border-red-600 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(handleSignup)} className="space-y-6">
          <AuthField label="Full Name" error={errors.name?.message}>
            {({ id }) => (
              <input
                id={id}
                type="text"
                autoComplete="name"
                placeholder="Ananya Sharma"
                {...register("name")}
                className={authInputClass}
              />
            )}
          </AuthField>

          <AuthField label="Email" error={errors.email?.message}>
            {({ id }) => (
              <input
                id={id}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                className={authInputClass}
              />
            )}
          </AuthField>

          <AuthField
            label="Phone Number"
            error={errors.phone?.message}
            hint="We'll only use this for order updates."
          >
            {({ id }) => (
              <PhoneInput
                id={id}
                placeholder="Enter phone number"
                value={phoneValue}
                onChange={(value) => setValue("phone", value || "")}
                defaultCountry="IN"
                international
                className={authInputClass}
              />
            )}
          </AuthField>
          <div className="space-y-2">
            <AuthLabel>Password</AuthLabel>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                {...register("password")}
                className={`${authInputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-stone-400 transition-colors hover:text-red-800 focus-visible:outline-none focus-visible:text-red-800 dark:hover:text-red-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <AuthError message={errors.password?.message} />
          </div>

          <fieldset className="space-y-2">
            <legend className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
              I am a
            </legend>
            <div className="grid grid-cols-2 gap-px bg-stone-200 dark:bg-stone-700">
              {(["client", "merchant"] as const).map((value) => (
                <label
                  key={value}
                  className="group relative cursor-pointer bg-white px-4 py-4 text-center transition-colors hover:bg-stone-50 dark:bg-stone-900/40 dark:hover:bg-stone-900"
                >
                  <input
                    type="radio"
                    value={value}
                    {...register("role")}
                    className="peer sr-only"
                  />
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500 transition-colors peer-checked:text-stone-900 peer-focus-visible:text-stone-900 group-hover:text-stone-900 dark:text-stone-400 dark:peer-checked:text-stone-50 dark:peer-focus-visible:text-stone-50 dark:group-hover:text-stone-50">
                    {value === "client" ? "Client" : "Merchant"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-red-800 transition-transform duration-300 peer-checked:scale-x-100 dark:bg-red-600 motion-reduce:transition-none"
                  />
                </label>
              ))}
            </div>
            <AuthError message={errors.role?.message} />
          </fieldset>

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-none bg-red-900 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-xl hover:shadow-red-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:focus-visible:ring-offset-[#0f111a]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <SocialAuthButtons mode="signup" />

        <p className="border-t border-stone-200 pt-6 text-center text-xs text-stone-500 dark:border-stone-700 dark:text-stone-400">
          Already have an account?{" "}
          <button
            onClick={toggleAuthMode}
            className="rounded-none font-semibold uppercase tracking-[0.15em] text-red-800 underline-offset-4 transition-colors hover:underline dark:text-red-600"
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
