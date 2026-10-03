"use client";

import { Link2, Unlink } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import type { RootState } from "@/store/store";

export default function ConnectedAccountPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  // Derive directly from redux state — no useState/useEffect sync needed.
  const googleLinked = user?.providers?.includes("google") ?? false;
  const appleLinked = user?.providers?.includes("apple") ?? false;

  const handleConnect = (name: string) => {
    // Sends the user to the login/signup page where the real
    // Google / Apple buttons live — linking happens automatically
    // on the server by matching email address.
    toast.info(
      `${name} linking happens automatically — just "Continue with ${name}" using the same email address.`,
    );
    window.location.href = "/auth";
  };

  const handleDisconnect = (name: string) => {
    toast.info(
      `To disconnect ${name}, please set a password first (My Account → Change Password), then contact support.`,
    );
  };

  const accounts = [
    {
      name: "Google",
      icon: "G",
      connected: googleLinked,
      email: googleLinked ? user?.email : undefined,
      onClick: () =>
        googleLinked ? handleDisconnect("Google") : handleConnect("Google"),
    },
    {
      name: "Apple",
      icon: "",
      connected: appleLinked,
      email: appleLinked ? user?.email : undefined,
      onClick: () =>
        appleLinked ? handleDisconnect("Apple") : handleConnect("Apple"),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h2 className="text-2xl md:text-3xl font-sans text-foreground">
            Connected Accounts
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Link your Google or Apple account for easy login. Linking is
            automatic when you sign in with the same email.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {accounts.map((account, index) => (
          <div
            key={account.name}
            className={`flex items-center justify-between p-5 ${
              index !== accounts.length - 1 ? "border-b border-border" : ""
            } hover:bg-muted/50 transition-colors duration-150`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  account.name === "Apple"
                    ? "bg-footer text-footer-foreground"
                    : account.connected
                      ? "bg-footer text-footer-foreground"
                      : "bg-muted-foreground"
                }`}
              >
                {account.name === "Apple" ? (
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M16.36 12.76c0-2.3 1.88-3.4 1.97-3.45-1.08-1.57-2.75-1.79-3.34-1.81-1.42-.14-2.77.84-3.49.84-.72 0-1.83-.82-3.01-.8-1.55.02-2.98.9-3.78 2.29-1.61 2.8-.41 6.94 1.16 9.21.76 1.1 1.67 2.34 2.87 2.29 1.15-.05 1.58-.74 2.97-.74s1.78.74 3 .72c1.24-.02 2.02-1.12 2.78-2.23.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.42-.93-2.45-3.73zM14.16 5.58c.64-.77 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.11 1.77-.97 2.82 1.03.08 2.07-.52 2.71-1.28z" />
                  </svg>
                ) : (
                  account.icon
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{account.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${
                      account.connected ? "text-success" : "text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        account.connected ? "bg-success" : "bg-muted"
                      }`}
                    />
                    {account.connected ? "Connected" : "Not connected"}
                  </span>
                  {account.connected && account.email && (
                    <>
                      <span className="text-muted-foreground/70">•</span>
                      <span className="text-xs text-muted-foreground">
                        {account.email}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={account.onClick}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-xl transition-all duration-200 active:scale-[0.98] ${
                account.connected
                  ? "bg-muted-foreground hover:bg-muted"
                  : "bg-footer text-footer-foreground hover:bg-brand-hover hover:text-primary-foreground shadow-sm"
              }`}
            >
              {account.connected ? (
                <>
                  <Unlink className="w-3.5 h-3.5" />
                  Disconnect
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  Connect
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
