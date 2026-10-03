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
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "@/services/authApi";
import { logoutSuccess as logoutAction } from "@/store/authSlice";
import { toast } from "sonner";

import { Heart, LogOut, User as UserIcon } from "lucide-react";

interface ProfileMenuProps {
  user: any;
  mobile?: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, mobile }) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  // Resolve the avatar URL (Cloudinary URL or legacy relative path).
  const getProfileImageUrl = () => {
    if (!user?.image) return null;
    if (user.image.startsWith("http")) return user.image;
    return `/${user.image.replace(/\\/g, "/")}`;
  };

  const preview = getProfileImageUrl();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      router.push("/auth");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleOpenProfile = () => {
    router.push("/profile");
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
          <Avatar className="w-12 h-12 ring-2 ring-brand/40 shadow-sm">
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
            onClick={handleOpenProfile}
          >
            <UserIcon className="mr-2 h-5 w-5 text-gold-text dark:text-gold" />
            Edit Profile
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start rounded-xl py-5 shadow-sm"
            onClick={handleDashboardRedirect}
          >
            <Heart className="mr-2 h-5 w-5 text-gold-text dark:text-gold" />
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
          <Avatar className="cursor-pointer ring-2 ring-brand/40 shadow-md hover:scale-105 transition-all">
            <AvatarImage src={preview || undefined} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-60 rounded-xl shadow-xl border bg-background/90 dark:bg-card/90 backdrop-blur-xl dark:border-border"
          align="end"
        >
          <DropdownMenuLabel className="pb-2">
            <p className="font-semibold text-base">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="rounded-md cursor-pointer"
            onClick={handleOpenProfile}
          >
            <UserIcon className="mr-2 h-4 w-4 text-gold-text dark:text-gold" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            className="rounded-md cursor-pointer"
            onClick={handleDashboardRedirect}
          >
            <Heart className="mr-2 h-4 w-4 text-gold-text dark:text-gold" />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive dark:text-destructive rounded-md cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileMenu;
