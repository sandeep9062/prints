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
            <em className="font-medium text-brand">
              private atelier.
            </em>
          </>
        ),
        description:
          "Sign in to revisit saved designs, approve digital proofs and re-order your favourite paper suites — every job pressed in-house at Ink of Memories.",
        stats: [
          { value: "20", label: "Years" },
          { value: "50k", label: "Clients" },
          { value: "100+", label: "Originals" },
        ],
      }}
    >
      <div className="space-y-8">
        <header className="space-y-3">
          <h2 className="font-serif text-3xl leading-tight text-foreground">
            Welcome Back
          </h2>
          <p className="text-sm font-normal leading-relaxed text-muted-foreground">
            Enter your credentials to continue to your account.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="border-l-2 border-destructive/10 px-4 py-3 text-sm text-destructive"
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
                className="rounded-none text-[10px] font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-brand hover:underline dark:text-muted-foreground dark:hover:text-brand"
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
                className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:text-brand dark:hover:text-brand"
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
            className="flex h-14 w-full items-center justify-center gap-3 rounded-none bg-primary px-8 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:focus-visible:ring-offset-footer"
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

        <p className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            onClick={toggleAuthMode}
            className="rounded-none font-semibold text-brand underline-offset-4 transition-colors hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
