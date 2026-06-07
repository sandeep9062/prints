"use client";

import {
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ChangePasswordPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleShow = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    setError("");

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900">
            Change Password
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Update your account password
          </p>
        </div>
      </div>

      <div className="max-w-xl">
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {/* Info Banner */}
          <div className="flex items-start gap-3 px-6 py-4 bg-amber-50/80 border-b border-amber-100">
            <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Password Security
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Use at least 8 characters with a mix of letters, numbers &
                symbols
              </p>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 text-sm rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3.5 pr-12 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-stone-900 placeholder:text-stone-400"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => toggleShow("current")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-3.5 pr-12 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-stone-900 placeholder:text-stone-400"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => toggleShow("new")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3.5 pr-12 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-stone-900 placeholder:text-stone-400"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => toggleShow("confirm")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            <div className="space-y-2">
              <div className="flex gap-1.5">
                <div
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    formData.newPassword.length >= 8
                      ? "bg-green-500"
                      : "bg-stone-200"
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    formData.newPassword.length >= 12
                      ? "bg-green-500"
                      : "bg-stone-200"
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    /[A-Z]/.test(formData.newPassword) &&
                    /[0-9]/.test(formData.newPassword)
                      ? "bg-green-500"
                      : "bg-stone-200"
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    /[^A-Za-z0-9]/.test(formData.newPassword)
                      ? "bg-green-500"
                      : "bg-stone-200"
                  }`}
                />
              </div>
              <p className="text-[10px] text-stone-400 font-medium">
                {formData.newPassword.length === 0
                  ? "Enter a password to see strength"
                  : formData.newPassword.length < 8
                    ? "Too short — at least 8 characters"
                    : "Password strength looks good"}
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full px-8 py-3.5 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-stone-800 transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
