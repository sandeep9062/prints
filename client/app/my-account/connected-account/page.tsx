"use client";

import { Share2 } from "lucide-react";

export default function ConnectedAccountPage() {
  const accounts = [
    { name: "Google", icon: "G", connected: true },
    { name: "Facebook", icon: "F", connected: false },
    { name: "Apple", icon: "A", connected: false },
    { name: "Twitter", icon: "X", connected: true },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
        <h2 className="text-2xl font-serif text-stone-900">
          Connected Accounts
        </h2>
      </div>

      <div className="bg-white border border-stone-100 shadow-sm">
        {accounts.map((account, index) => (
          <div
            key={account.name}
            className={`p-6 flex items-center justify-between ${index !== accounts.length - 1 ? "border-b border-stone-100" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-600">
                {account.icon}
              </div>
              <div>
                <h3 className="font-medium text-stone-900">{account.name}</h3>
                <p className="text-sm text-stone-500">
                  {account.connected ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <button
              className={`px-6 py-2 text-xs font-bold tracking-widest uppercase transition-colors ${
                account.connected
                  ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  : "bg-stone-900 text-white hover:bg-stone-800"
              }`}
            >
              {account.connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
