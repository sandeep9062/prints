"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "@/services/authApi";
import { useUpdateProfileMutation } from "@/services/userApi";
import { logoutSuccess as logoutAction, setUser } from "@/store/authSlice";
import { toast } from "sonner";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Heart, LogOut, User as UserIcon, X } from "lucide-react";

interface ProfileMenuProps {
  user: any;
  mobile?: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, mobile }) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);

  // Properly resolve image URL immediately (no race condition)
  const getProfileImageUrl = () => {
    if (!user?.image) return null;
    if (user.image.startsWith("http")) return user.image;
    // Use relative path that works in both development and production
    return `/${user.image.replace(/\\/g, "/")}`;
  };

  const [preview, setPreview] = useState<string | null>(getProfileImageUrl());

  useEffect(() => {
    setPreview(getProfileImageUrl());
  }, [user?.image]);

  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      router.push("/auth");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);

    if (imageFile) formData.append("image", imageFile);

    try {
      const updatedUser = await updateProfile(formData).unwrap();
      dispatch(
        setUser({
          user: { ...user, ...updatedUser },
          token: localStorage.getItem("token") || "",
        }),
      );
      toast.success("Profile updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleDashboardRedirect = () => {
    if (!user) return;
    else if (user.role === "client") {
      router.push("/my-account");
    } else if (user?.role === "admin") {
      router.push("/admin-dashboard");
    } else if (user?.role === "merchant") {
      router.push("/merchant-dashboard");
    }
  };

  if (!mounted) return null;

  // -------------------------------------------------------
  //                 Mobile Version UI
  // -------------------------------------------------------
  if (mobile) {
    return (
      <div className="border-t border-border/40 pt-5 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-12 h-12 ring-2 ring-rose-400/40 shadow-sm">
            <AvatarImage src={preview || undefined} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full justify-start rounded-xl py-5 shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <UserIcon className="mr-2 h-5 w-5" />
            Edit Profile
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start rounded-xl py-5 shadow-sm"
            onClick={handleDashboardRedirect}
          >
            <Heart className="mr-2 h-5 w-5" />
            Dashboard
          </Button>

          <Button
            variant="destructive"
            className="w-full justify-start rounded-xl py-5 shadow-sm"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  //                 Desktop Version UI
  // -------------------------------------------------------
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer ring-2 ring-rose-400/40 shadow-md hover:scale-105 transition-all">
            <AvatarImage src={preview || undefined} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-60 rounded-xl shadow-xl border bg-white/90 backdrop-blur-xl"
          align="end"
        >
          <DropdownMenuLabel className="pb-2">
            <p className="font-semibold text-base">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="rounded-md cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            className="rounded-md cursor-pointer"
            onClick={handleDashboardRedirect}
          >
            <Heart className="mr-2 h-4 w-4" />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-500 rounded-md cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ---------------------------------------------------
                  EDIT PROFILE MODAL
      ---------------------------------------------------- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[430px] rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Profile
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <Label>Phone</Label>
              <PhoneInput
                value={phone}
                onChange={(val) => setPhone(val || "")}
                defaultCountry="IN"
                className="border rounded-xl px-3 py-2 bg-gray-50"
              />
            </div>

            {/* Picture */}
            <div className="flex flex-col gap-2">
              <Label>Profile Picture</Label>

              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 ring-2 ring-rose-400/40 shadow-sm">
                  <AvatarImage src={preview || undefined} />
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>

                <Input
                  type="file"
                  accept="image/*"
                  className="rounded-xl"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      setImageFile(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleProfileUpdate}
              disabled={isLoading}
              className="rounded-xl w-full bg-rose-300 hover:bg-rose-500"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileMenu;
