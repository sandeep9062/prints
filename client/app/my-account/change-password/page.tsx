"use client";

import { Key } from "lucide-react";
import { useState } from "react";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
        <h2 className="text-2xl font-serif text-stone-900">Change Password</h2>
      </div>

      <div className="bg-white border border-stone-100 shadow-sm p-8 max-w-xl">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              className="w-full px-4 py-3 border border-stone-200 rounded-sm focus:outline-none focus:border-stone-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-2">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="w-full px-4 py-3 border border-stone-200 rounded-sm focus:outline-none focus:border-stone-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 border border-stone-200 rounded-sm focus:outline-none focus:border-stone-400 transition-colors"
            />
          </div>

          <button className="w-full px-8 py-3 border border-stone-900 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
