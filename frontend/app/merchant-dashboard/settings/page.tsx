"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  User as UserIcon,
  Mail,
  Phone,
  Camera,
  Save,
  Lock,
  Store,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  useUpdateProfileMutation,
  useGetUserByIdQuery,
} from "@/services/userApi";
import type { User as UserType } from "@/services/userApi";
import { useToast } from "@/hooks/use-toast";
import { selectUser, setUser } from "@/store/authSlice";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SettingsPage() {
  // ── All hooks MUST be declared at top, in the same order every render ──
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const {
    data: freshUserResponse,
    isLoading: isRefreshing,
    refetch,
  } = useGetUserByIdQuery(user?._id || "", {
    skip: !user?._id,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // freshUserResponse can be User or { success: boolean; user: User }
  // The server wraps it: { success: true, user: { ... } }
  const freshUser =
    freshUserResponse && (freshUserResponse as any).user
      ? ((freshUserResponse as any).user as UserType)
      : null;

  // Sync form with user data
  useEffect(() => {
    if (freshUser) {
      setForm({
        name: freshUser.name || "",
        email: freshUser.email || "",
        phone: freshUser.phone || "",
      });
      // Sync Redux store with latest server data
      dispatch(
        setUser({
          user: freshUser as any,
          token: localStorage.getItem("token") || "",
        }),
      );
    } else if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [freshUser, user, dispatch]);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email format";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\+?\d{7,15}$/.test(form.phone.replace(/[\s-]/g, "")))
      errs.phone = "Invalid phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 2MB.",
          variant: "destructive",
        });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setSaveSuccess(false);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing",
      description: "Fetching latest profile data...",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!user?._id) {
      toast({
        title: "Not authenticated",
        description: "Please log in again.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("email", form.email.trim());
    formData.append("phone", form.phone.trim());
    if (image) {
      formData.append("image", image);
    }

    try {
      const result = (await updateProfile(formData).unwrap()) as any;
      const updatedUser = result?.user || result;

      if (updatedUser) {
        dispatch(
          setUser({
            user: updatedUser as any,
            token: localStorage.getItem("token") || "",
          }),
        );
        setForm({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
        });
      }

      setSaveSuccess(true);
      setImage(null);
      setImagePreview(null);
      refetch();

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err: any) {
      const message =
        err?.data?.message ||
        (err?.data?.errors
          ? Object.values(err.data.errors).join(", ")
          : null) ||
        "Failed to update profile.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const displayImage = imagePreview || freshUser?.image || user?.image;

  // ── Early return AFTER all hooks, BEFORE JSX ──
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-[500px] bg-gray-100 dark:bg-gray-800/50 rounded-2xl" />
          <div className="h-[200px] bg-gray-100 dark:bg-gray-800/50 rounded-2xl" />
          <div className="h-[200px] bg-gray-100 dark:bg-gray-800/50 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <motion.div {...fadeInUp}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Sparkles className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account and preferences
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm shadow-xl border border-gray-100 dark:border-gray-700/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <p className="text-white/80 text-sm">
              Update your personal details and profile photo
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 ring-4 ring-white dark:ring-gray-800 shadow-lg">
                    {displayImage ? (
                      <Image
                        src={displayImage}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon className="h-10 w-10 text-blue-400" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 opacity-90 hover:opacity-100"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role || "Merchant"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG or WEBP. Max 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <UserIcon className="h-4 w-4 text-blue-500" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600 ${
                      errors.name ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    required
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-blue-500" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600 ${
                      errors.email ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4 text-blue-500" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600 ${
                      errors.phone ? "border-red-400 focus:border-red-400" : ""
                    }`}
                    required
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Store className="h-4 w-4 text-blue-500" />
                    Account Type
                  </Label>
                  <div className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm capitalize flex items-center gap-2 h-10">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    {user?.role || "Merchant"} Account
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/30">
                <div className="flex items-center gap-2">
                  {isLoading && (
                    <span className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  )}
                  {saveSuccess && !isLoading && (
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      Profile saved successfully
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Details Display */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm shadow-xl border border-gray-100 dark:border-gray-700/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <Store className="h-5 w-5" />
              Account Details
            </CardTitle>
            <p className="text-white/80 text-sm">
              Your account information and system details
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5" />
                  User ID
                </p>
                <p className="text-sm font-mono text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg truncate">
                  {user?._id || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </p>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg">
                  {form.email || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </p>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg">
                  {form.phone || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5" />
                  Role
                </p>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg capitalize">
                  {user?.role || "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Password Section */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm shadow-xl border border-gray-100 dark:border-gray-700/30 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <p className="text-white/80 text-sm">
              Manage your password and account security
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/30">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl shrink-0">
                  <Lock className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Change Password
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    You'll receive a password reset link on your registered
                    email: <strong>{user?.email || "your email"}</strong>
                  </p>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/forgot-password`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ email: user?.email }),
                          },
                        );
                        const data = await res.json();
                        if (res.ok) {
                          toast({
                            title: "Email Sent",
                            description:
                              data.message ||
                              "Check your email for password reset link.",
                          });
                        } else {
                          toast({
                            title: "Error",
                            description:
                              data.message || "Failed to send reset email.",
                            variant: "destructive",
                          });
                        }
                      } catch {
                        toast({
                          title: "Error",
                          description:
                            "Could not connect to server. Please try again later.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Send Reset Link
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
