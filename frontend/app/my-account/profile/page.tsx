"use client";

import {
  User,
  Edit2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  X,
  Save,
  Upload,
  Camera,
} from "lucide-react";
import { useState, useRef, DragEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useUpdateProfileMutation } from "@/services/userApi";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSave = async () => {
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("email", formData.email);
    formPayload.append("phone", formData.phone);
    if (imageFile) formPayload.append("image", imageFile);

    try {
      await updateProfile(formPayload).unwrap();
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
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

  const displayImage = imagePreview || user?.image || null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900">
            My Profile
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Manage your personal information
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-stone-800 transition-all duration-200 shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 text-stone-600 text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-stone-50 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-stone-800 transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        {/* Profile Header with gradient backdrop */}
        <div className="relative h-32 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-700">
          {/* Avatar with drag & drop support */}
          <div className="absolute -bottom-12 left-8 flex flex-col items-start">
            <div
              onDrop={isEditing ? handleDrop : undefined}
              onDragOver={isEditing ? handleDragOver : undefined}
              onDragLeave={isEditing ? handleDragLeave : undefined}
              onClick={handleImageClick}
              className={`relative w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white overflow-hidden transition-all duration-200 ${
                isEditing ? "cursor-pointer hover:border-stone-400" : ""
              } ${isDragOver ? "scale-105 border-stone-900 shadow-xl" : ""}`}
            >
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={user?.name || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-stone-400" />
              )}

              {/* Camera overlay on hover in edit mode */}
              {isEditing && !isDragOver && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-7 h-7 text-white" />
                </div>
              )}

              {/* Drag-over overlay */}
              {isDragOver && (
                <div className="absolute inset-0 bg-stone-900/70 flex flex-col items-center justify-center gap-1">
                  <Upload className="w-7 h-7 text-white" />
                  <span className="text-white text-[10px] font-medium">
                    Drop image
                  </span>
                </div>
              )}

              {/* Dashed border indicator in edit mode */}
              {isEditing && !isDragOver && (
                <div className="absolute inset-0 border-2 border-dashed border-white/40 rounded-2xl pointer-events-none" />
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />

            {/* Edit hint */}
            {isEditing && (
              <p className="text-[11px] text-stone-400 mt-2">
                Drag & drop or click to change photo
              </p>
            )}
          </div>
        </div>

        <div className="pt-20 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="text-2xl font-semibold text-stone-900 bg-transparent border-b-2 border-stone-300 focus:border-stone-900 outline-none pb-1 w-full"
                  placeholder="Your name"
                />
              ) : (
                <h3 className="text-2xl font-semibold text-stone-900">
                  {user?.name || "User"}
                </h3>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-50/80">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-stone-600" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold tracking-[0.1em] text-stone-400 uppercase mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full text-stone-900 font-medium bg-transparent border-b-2 border-stone-300 focus:border-stone-900 outline-none pb-0.5"
                    placeholder="your@email.com"
                  />
                ) : (
                  <p className="text-stone-900 font-medium truncate">
                    {user?.email || "N/A"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-50/80">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-stone-600" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold tracking-[0.1em] text-stone-400 uppercase mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full text-stone-900 font-medium bg-transparent border-b-2 border-stone-300 focus:border-stone-900 outline-none pb-0.5"
                    placeholder="+91 9876543210"
                  />
                ) : (
                  <p className="text-stone-900 font-medium truncate">
                    {user?.phone || "N/A"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-50/80">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-stone-600" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[0.1em] text-stone-400 uppercase mb-1">
                  Member Since
                </label>
                <p className="text-stone-900 font-medium">{memberSince}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-50/80">
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-stone-600" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-[0.1em] text-stone-400 uppercase mb-1">
                  Role
                </label>
                <p className="text-stone-900 font-medium capitalize">
                  {user?.role || "Client"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
