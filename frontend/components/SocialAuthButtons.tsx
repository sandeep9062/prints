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
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {mode === "login" ? "Or continue with" : "Or sign up with"}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={socialLoading === "google"}
          className="flex h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <FcGoogle className="h-5 w-5" />
          {socialLoading === "google"
            ? "Connecting to Google…"
            : mode === "login"
              ? "Continue with Google"
              : "Sign up with Google"}
        </button>
        {socialLoading === "google" && (
          <p className="text-center text-xs text-gray-500">
            Verifying with Google…
          </p>
        )}

        <button
          type="button"
          onClick={handleApple}
          disabled={socialLoading === "apple"}
          className="flex h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-black font-medium text-white shadow-sm hover:bg-gray-900 disabled:opacity-60"
        >
          <FaApple className="h-5 w-5" />
          {socialLoading === "apple"
            ? "Connecting to Apple…"
            : "Continue with Apple"}
        </button>
      </div>
    </div>
  );
}
