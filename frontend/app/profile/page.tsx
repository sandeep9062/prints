"use client";

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  Camera,
  Mail,
  Phone,
  Save,
  Upload,
  User as UserIcon,
  X,
} from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";

import PageHeader from "@/components/editorial/PageHeader";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { useUpdateProfileMutation } from "@/services/userApi";
import {
  selectIsAuthenticated,
  selectUser,
  setUser,
} from "@/store/authSlice";

/*
  /profile — the destination of the Navbar's "Profile" action.

  Replaces the old in-Navbar edit-profile modal: the dropdown now routes here,
  so profile editing has a real URL and room to breathe.

  Data
  - Reads the signed-in user from the auth slice and saves through
    `useUpdateProfileMutation` (PUT /v1/users/profile-update, multipart). On
    success the response is written back with `setUser` so the Navbar avatar
    and name refresh immediately.

  Design
  - Editorial treatment shared with /about-us and /favourites: tracked eyebrow,
    serif headline, stone palette with a red accent and hairline rules.
*/

// Hydration-safe "are we on the client yet?" flag. `useSyncExternalStore`
// returns false during SSR and true once hydrated, without a setState-in-effect.
const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const useMounted = () =>
  useSyncExternalStore(subscribeToNothing, getClientSnapshot, getServerSnapshot);

// Resolve a stored avatar value (Cloudinary URL or legacy relative path).
const resolveImage = (image?: string | null) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `/${image.replace(/\\/g, "/")}`;
};

const fieldLabel =
  "block text-[10px] font-bold text-muted-foreground mb-1 dark:text-muted-foreground";
const infoRow =
  "flex items-start gap-4 p-4 rounded-xl bg-muted/80 dark:bg-card/[0.03]";
const inputClass =
  "w-full text-foreground font-medium bg-transparent border-b-2 border-border focus:border-brand/60 outline-none pb-1 transition-colors dark:text-muted-foreground/70 dark:border-border dark:focus:border-brand";

export default function ProfilePage() {
  const mounted = useMounted();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep the form in sync with the store whenever the user refreshes (e.g.
  // after a save) and the user is not mid-edit.
  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, isEditing]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleSave = async () => {
    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("email", formData.email.trim());
    // Only send phone when set — sending "" collides with the unique index
    // on the currently deployed backend and returns 500. The backend
    // ignores a missing phone field.
    if (formData.phone.trim()) {
      payload.append("phone", formData.phone.trim());
    }
    if (imageFile) payload.append("image", imageFile);

    try {
      const updatedUser = await updateProfile(payload).unwrap();
      dispatch(
        setUser({
          user: { ...(user as any), ...updatedUser },
          token: localStorage.getItem("token") || "",
        }),
      );
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.error || "Failed to update profile",
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  const displayImage = imagePreview || resolveImage(user?.image);

  // ── Loading shell (avoids an SSR/client hydration mismatch) ──
  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  // ── Guests ──
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-[calc(var(--navbar-height)+3rem)]">
          <div className="container mx-auto px-6">
            <PageHeader
              eyebrow="Your Account"
              title="Sign in to view"
              accent="your profile"
              description="Access your Ink of Memories profile to update your details and keep your account information current."
            />
            <div className="py-16">
              <Link
                href="/auth"
                className="inline-flex items-center gap-3 border border-brand/50 px-8 py-4 text-[11px] font-semibold text-brand transition-colors duration-300 hover:bg-brand-hover hover:text-primary-foreground dark:border-brand/50 dark:text-brand dark:hover:bg-brand-hover"
              >
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <SEOHelper
        title="My Profile"
        description="View and update your Ink of Memories profile — manage your name, email, phone number and profile photo."
        path="/profile"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="my profile, ink of memories account, update profile, printing account"
        noIndex
        jsonLd={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Profile", url: "/profile" },
        ])}
      />

      <main className="pt-[calc(var(--navbar-height)+3rem)]">
        <div className="container mx-auto px-6">
          <PageHeader
            eyebrow="Your Account"
            title="Your Profile,"
            accent="Perfectly Personal"
            description="Keep your details up to date so every order, proof and delivery reaches you without a hitch."
          />

          <div className="mt-16 grid gap-10 lg:grid-cols-[300px_1fr]">
            {/* ───────── Identity card ───────── */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm dark:border-border dark:bg-card/[0.03]">
                <div
                  onDrop={isEditing ? handleDrop : undefined}
                  onDragOver={isEditing ? handleDragOver : undefined}
                  onDragLeave={isEditing ? handleDragLeave : undefined}
                  onClick={handleImageClick}
                  className={cn(
                    "relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-border shadow-lg transition-all duration-200 dark:border-border",
                    isEditing && "cursor-pointer hover:border-brand/50",
                    isDragOver && "scale-105 border-brand/50 shadow-xl",
                  )}
                >
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={user.name || "Avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-12 w-12 text-muted-foreground" />
                  )}

                  {isEditing && !isDragOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                      <Camera className="h-7 w-7 text-primary-foreground" />
                    </div>
                  )}

                  {isDragOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/70">
                      <Upload className="h-6 w-6 text-primary-foreground" />
                      <span className="text-[10px] font-medium text-primary-foreground">
                        Drop image
                      </span>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />

                {isEditing && (
                  <p className="mt-3 text-[11px] text-muted-foreground dark:text-muted-foreground">
                    Drag &amp; drop or click to change photo
                  </p>
                )}

                <h3 className="mt-5 font-sans text-2xl text-foreground dark:text-muted-foreground/70">
                  {user.name || "User"}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm font-medium text-success dark:text-success">
                    Active
                  </span>
                </div>

                <span className="mt-6 inline-block rounded-full border border-border px-4 py-1 text-[10px] font-bold text-muted-foreground dark:border-border dark:text-muted-foreground">
                  {user.role || "Client"}
                </span>
              </div>
            </div>

            {/* ───────── Details card ───────── */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm dark:border-border dark:bg-card/[0.03]">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 dark:border-border">
                <div>
                  <h2 className="font-sans text-xl text-foreground dark:text-muted-foreground/70">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
                    Manage your personal details
                  </p>
                </div>

                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded bg-footer px-5 py-2.5 text-[11px] font-bold text-footer-foreground transition-colors hover:bg-brand-hover hover:text-primary-foreground dark:bg-card dark:text-foreground dark:hover:bg-muted"
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 rounded border border-border px-4 py-2.5 text-[11px] font-bold text-muted-foreground transition-colors hover:bg-muted dark:border-border dark:text-muted-foreground/70"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded bg-footer px-5 py-2.5 text-[11px] font-bold text-footer-foreground transition-colors hover:bg-brand-hover hover:text-primary-foreground disabled:opacity-50 dark:bg-card dark:text-foreground dark:hover:bg-muted"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Name */}
                <div className={infoRow}>
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-card shadow-sm">
                    <UserIcon className="h-5 w-5 text-muted-foreground dark:text-muted-foreground/70" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label className={fieldLabel}>Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={inputClass}
                        placeholder="Your name"
                      />
                    ) : (
                      <p className="truncate font-medium text-foreground dark:text-muted-foreground/70">
                        {user.name || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className={infoRow}>
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-card shadow-sm">
                    <Mail className="h-5 w-5 text-muted-foreground dark:text-muted-foreground/70" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label className={fieldLabel}>Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={inputClass}
                        placeholder="your@email.com"
                      />
                    ) : (
                      <p className="truncate font-medium text-foreground dark:text-muted-foreground/70">
                        {user.email || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className={infoRow}>
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-card shadow-sm">
                    <Phone className="h-5 w-5 text-muted-foreground dark:text-muted-foreground/70" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label className={fieldLabel}>Phone Number</label>
                    {isEditing ? (
                      <PhoneInput
                        value={formData.phone}
                        onChange={(val) =>
                          setFormData({ ...formData, phone: val || "" })
                        }
                        defaultCountry="IN"
                        className="phone-input mt-1 text-sm"
                      />
                    ) : (
                      <p className="truncate font-medium text-foreground dark:text-muted-foreground/70">
                        {user.phone || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Member since */}
                <div className={infoRow}>
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-card shadow-sm">
                    <Save className="h-5 w-5 text-muted-foreground dark:text-muted-foreground/70" />
                  </div>
                  <div>
                    <label className={fieldLabel}>Member Since</label>
                    <p className="font-medium text-foreground dark:text-muted-foreground/70">
                      {memberSince}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}