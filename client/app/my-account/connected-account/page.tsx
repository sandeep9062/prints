"use client";

import { Share2, Link2, Unlink } from "lucide-react";

export default function ConnectedAccountPage() {
  const accounts = [
    { name: "Google", icon: "G", connected: true, email: "sandeep@gmail.com" },
    { name: "Facebook", icon: "F", connected: false },
    { name: "Apple", icon: "A", connected: false },
    { name: "Twitter", icon: "X", connected: true, email: "@sandeep_dev" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900">
            Connected Accounts
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Link your social accounts for easy login
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        {accounts.map((account, index) => (
          <div
            key={account.name}
            className={`flex items-center justify-between p-5 ${
              index !== accounts.length - 1 ? "border-b border-stone-100" : ""
            } hover:bg-stone-50/50 transition-colors duration-150`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  account.connected
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                {account.icon}
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{account.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${
                      account.connected ? "text-green-600" : "text-stone-400"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        account.connected ? "bg-green-500" : "bg-stone-300"
                      }`}
                    />
                    {account.connected ? "Connected" : "Not connected"}
                  </span>
                  {account.connected && account.email && (
                    <>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs text-stone-500">
                        {account.email}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-xl transition-all duration-200 active:scale-[0.98] ${
                account.connected
                  ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  : "bg-stone-900 text-white hover:bg-stone-800 shadow-sm"
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
