"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useLoginMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import SocialAuthButtons from "./SocialAuthButtons";
import AuthShell from "./auth/AuthShell";
import {
  AuthError,
  AuthField,
  AuthLabel,
  authInputClass,
} from "./auth/AuthField";

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or Phone is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage({
  onLoginSuccess,
  toggleAuthMode,
}: {
  onLoginSuccess: () => void;
  toggleAuthMode: () => void;
}) {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormValues) => {
    setError("");
    try {
      const result = await loginUser(data).unwrap();
      dispatch(loginSuccess({ user: result.user, token: result.token }));
      toast.success("Login successful!");
      onLoginSuccess();
      router.push("/");
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? ((err as { data?: { message?: string } }).data?.message ??
            "Login failed")
          : "Login failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <AuthShell
      mode="login"
      onModeChange={(next) => {
        if (next !== "login") toggleAuthMode();
      }}
      aside={{
        image: "/gallery-wedding.jpg",
        imageAlt:
          "Bespoke wedding stationery from the Ink of Memories atelier",
        eyebrow: "Member Access",
        title: (
          <>
            Welcome to your
            <br />
            <em className="font-light text-red-800 dark:text-red-600">
              private atelier.
            </em>
          </>
        ),
        description:
          "Sign in to revisit saved designs, approve digital proofs and re-order your favourite paper suites — every job pressed in-house at Samlason Printing Press.",
        stats: [
          { value: "20", label: "Years" },
          { value: "50k", label: "Clients" },
          { value: "100+", label: "Originals" },
        ],
      }}
    >
      <div className="space-y-8">
        <header className="space-y-3">
          <h2 className="font-serif text-3xl leading-tight text-stone-900 dark:text-stone-100">
            Welcome Back
          </h2>
          <p className="text-sm font-light leading-relaxed text-stone-500 dark:text-stone-400">
            Enter your credentials to continue to your account.
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

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <AuthField
            label="Email or Phone"
            error={errors.emailOrPhone?.message}
          >
            {({ id }) => (
              <input
                id={id}
                type="text"
                autoComplete="username"
                placeholder="you@example.com"
                {...register("emailOrPhone")}
                className={authInputClass}
              />
            )}
          </AuthField>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <AuthLabel>Password</AuthLabel>
              <Link
                href="/forgot-password"
                className="rounded-none text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 underline-offset-4 transition-colors hover:text-red-800 hover:underline dark:text-stone-400 dark:hover:text-red-600"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-none bg-red-900 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-xl hover:shadow-red-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:focus-visible:ring-offset-[#0f111a]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <SocialAuthButtons mode="login" onAuthSuccess={onLoginSuccess} />

        <p className="border-t border-stone-200 pt-6 text-center text-xs text-stone-500 dark:border-stone-700 dark:text-stone-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={toggleAuthMode}
            className="rounded-none font-semibold uppercase tracking-[0.15em] text-red-800 underline-offset-4 transition-colors hover:underline dark:text-red-600"
          >
            Create one
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
