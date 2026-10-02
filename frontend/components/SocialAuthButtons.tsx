"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { toast } from "sonner";
import { useAppleAuthMutation, useGoogleAuthMutation } from "../services/authApi";
import { loginSuccess } from "../store/authSlice";
import type { UserData } from "../store/authSlice";

interface SocialAuthResponse {
  user: UserData;
  token: string;
  role?: string;
  isNewUser?: boolean;
  message?: string;
}

interface AppleSignInResponse {
  authorization?: { id_token?: string };
  user?: {
    name?: { firstName?: string; lastName?: string };
    email?: string;
  };
  error?: string;
}

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
}

interface GoogleTokenClient {
  requestAccessToken(options?: { prompt?: string }): void;
}

interface GoogleInstance {
  accounts: {
    oauth2: {
      initTokenClient(options: {
        client_id: string;
        scope: string;
        callback: (resp: GoogleTokenResponse) => void;
        error_callback?: (err: { type?: string; message?: string }) => void;
      }): GoogleTokenClient;
    };
  };
}

interface AppleIDInstance {
  auth: {
    init(options: {
      clientId: string;
      scope: string;
      redirectURI: string;
      usePopup: boolean;
    }): void;
    signIn(): Promise<AppleSignInResponse>;
  };
}

declare global {
  interface Window {
    AppleID?: AppleIDInstance;
    google?: GoogleInstance;
  }
}

let appleScriptPromise: Promise<AppleIDInstance> | null = null;
let googleScriptPromise: Promise<GoogleInstance> | null = null;

function loadGoogleScript(): Promise<GoogleInstance> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in needs a browser"));
  }
  if (window.google?.accounts?.oauth2) return Promise.resolve(window.google);
  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        const instance = window.google;
        if (instance?.accounts?.oauth2) resolve(instance);
        else reject(new Error("Google SDK failed to load"));
      };
      script.onerror = () => reject(new Error("Google SDK failed to load"));
      document.head.appendChild(script);
    });
  }
  return googleScriptPromise;
}

function loadAppleScript(): Promise<AppleIDInstance> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Apple sign-in needs a browser"));
  }
  if (window.AppleID) return Promise.resolve(window.AppleID);
  if (!appleScriptPromise) {
    appleScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
      script.async = true;
      script.onload = () => {
        const instance = window.AppleID;
        if (instance) resolve(instance);
        else reject(new Error("Apple SDK failed to load"));
      };
      script.onerror = () => reject(new Error("Apple SDK failed to load"));
      document.head.appendChild(script);
    });
  }
  return appleScriptPromise;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null && "data" in err) {
    const data = (err as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

interface SocialAuthButtonsProps {
  mode: "login" | "signup";
  onAuthSuccess?: () => void;
}

/**
 * Shared Google + Apple buttons, used on BOTH login and signup pages.
 * Both buttons ALWAYS render. If a provider isn't configured yet,
 * clicking its button shows a setup hint instead of failing silently.
 */
export default function SocialAuthButtons({
  mode,
  onAuthSuccess,
}: SocialAuthButtonsProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [googleAuth] = useGoogleAuthMutation();
  const [appleAuth] = useAppleAuthMutation();
  const [socialLoading, setSocialLoading] = useState<
    null | "google" | "apple"
  >(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const appleClientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? "";
  const action = mode === "login" ? "login" : "sign-up";

  const handleSocialSuccess = (
    result: SocialAuthResponse,
    provider: "Google" | "Apple",
  ) => {
    dispatch(loginSuccess({ user: result.user, token: result.token }));
    toast.success(
      result.message ??
        (result.isNewUser
          ? `Account created with ${provider}!`
          : `Logged in with ${provider}!`),
    );
    onAuthSuccess?.();
    router.push("/");
  };

  const handleGoogle = async () => {
    if (!googleClientId) {
      toast.info(
        "Google sign-in isn't configured yet. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID and rebuild the app.",
      );
      return;
    }
    setSocialLoading("google");
    let google;
    try {
      google = await loadGoogleScript();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, `Google ${action} failed`));
      setSocialLoading(null);
      return;
    }
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "openid email profile",
        callback: async (resp: GoogleTokenResponse) => {
          if (!resp.access_token) {
            setSocialLoading(null);
            toast.error(`Google ${action} failed — no token returned`);
            return;
          }
          try {
            const result = (await googleAuth({
              accessToken: resp.access_token,
            }).unwrap()) as SocialAuthResponse;
            handleSocialSuccess(result, "Google");
          } catch (err: unknown) {
            toast.error(getErrorMessage(err, `Google ${action} failed`));
          } finally {
            setSocialLoading(null);
          }
        },
        error_callback: () => {
          // User closed the popup — not an error worth a toast.
          setSocialLoading(null);
        },
      });
      client.requestAccessToken({ prompt: "" });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, `Google ${action} failed`));
      setSocialLoading(null);
    }
  };

  const handleApple = async () => {
    if (!appleClientId) {
      toast.info(
        "Apple sign-in isn't configured yet. Add NEXT_PUBLIC_APPLE_CLIENT_ID and rebuild the app.",
      );
      return;
    }
    const redirectURI =
      process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI ??
      (typeof window !== "undefined" ? `${window.location.origin}/auth` : "");
    setSocialLoading("apple");
    try {
      const AppleID = await loadAppleScript();
      AppleID.auth.init({
        clientId: appleClientId,
        scope: "name email",
        redirectURI,
        usePopup: true,
      });
      const response = await AppleID.auth.signIn();
      const identityToken = response.authorization?.id_token;
      if (!identityToken) {
        throw new Error("No identity token returned from Apple");
      }
      const result = (await appleAuth({
        identityToken,
        user: response.user
          ? {
              firstName: response.user.name?.firstName,
              lastName: response.user.name?.lastName,
              email: response.user.email,
            }
          : undefined,
      }).unwrap()) as SocialAuthResponse;
      handleSocialSuccess(result, "Apple");
    } catch (err: unknown) {
      const appleErr = err as { error?: string };
      // User closing the popup is not an error worth a toast.
      if (appleErr?.error !== "popup_closed_by_user") {
        toast.error(getErrorMessage(err, `Apple ${action} failed`));
      }
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200 dark:border-stone-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#FCFBF9] px-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 dark:bg-[#0f111a] dark:text-stone-500">
            {mode === "login" ? "Or continue with" : "Or sign up with"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={socialLoading === "google"}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-none border border-stone-300 bg-white text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700 transition-colors duration-300 hover:border-stone-900 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 disabled:opacity-60 dark:border-stone-700 dark:bg-stone-900/40 dark:text-stone-200 dark:hover:border-stone-500 dark:hover:bg-stone-900"
        >
          <FcGoogle className="h-4 w-4" />
          {socialLoading === "google"
            ? "Connecting…"
            : mode === "login"
              ? "Continue with Google"
              : "Sign up with Google"}
        </button>

        <button
          type="button"
          onClick={handleApple}
          disabled={socialLoading === "apple"}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-none bg-stone-900 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white dark:focus-visible:ring-offset-[#0f111a]"
        >
          <FaApple className="h-4 w-4" />
          {socialLoading === "apple" ? "Connecting…" : "Continue with Apple"}
        </button>
      </div>
    </div>
  );
}
