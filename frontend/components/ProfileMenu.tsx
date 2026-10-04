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
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
   Colour rules for this menu
   -------------------------------------------------------------------------- */
/**
 * The shared `DropdownMenuItem` ships `focus:bg-accent-foreground`. That paints
 * the accent FOREGROUND colour (ink navy in light, near-white in dark) behind a
 * label of the same tone, so every row went invisible the moment it was
 * hovered or keyboard-focused. Re-point `focus` at `accent` plus its matching
 * `accent-foreground` so the highlight and the label stay a pair in both themes.
 */
const itemIdle =
  "cursor-pointer rounded-md focus:bg-accent focus:text-accent-foreground";

/** The accent role for the row icons — gold as TEXT on paper, plain gold on
 *  the deep navy dark surface (same tokens the Navbar uses). */
const iconAccent = "text-gold-text dark:text-gold";

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
      <div className="border-t border-border pt-5 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-12 h-12 ring-1 ring-gold/40 shadow-sm">
            <AvatarImage src={preview || undefined} alt={user?.name} />
            <AvatarFallback className="bg-brand-soft text-base font-semibold text-brand">
              {user?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/*
            The `outline` variant fills with `bg-primary` on hover, so the gold
            icons have to hand the hover state back to the label colour —
            gold-text on ink blue is ~2.5:1 and effectively unreadable.
          */}
          <Button
            variant="outline"
            className="group w-full justify-start rounded-xl py-5 shadow-sm"
            onClick={handleOpenProfile}
          >
            <UserIcon
              className={cn(
                "mr-2 h-5 w-5",
                iconAccent,
                "group-hover:text-primary-foreground",
              )}
            />
            Edit Profile
          </Button>

          <Button
            variant="outline"
            className="group w-full justify-start rounded-xl py-5 shadow-sm"
            onClick={handleDashboardRedirect}
          >
            <Heart
              className={cn(
                "mr-2 h-5 w-5",
                iconAccent,
                "group-hover:text-primary-foreground",
              )}
            />
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
          <Avatar
            className={cn(
              "cursor-pointer shadow-md transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100",
              // The trigger sits on the translucent navbar, so the ring is the
              // only affordance separating it from the bar: a 1px foil-gold ring
              // (3.9:1 on paper) rather than the old 40%-alpha ink-blue ring,
              // which faded to ~1.6:1. Focus reuses the brand focus ring.
              "ring-1 ring-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <AvatarImage src={preview || undefined} alt={user?.name} />
            <AvatarFallback className="bg-brand-soft text-sm font-semibold text-brand">
              {user?.name?.[0]}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        {/*
          Keep the primitive's own `bg-popover` / `text-popover-foreground` pair.
          It was overridden with `bg-background/90 dark:bg-card/90`, which made the
          surface translucent (page content bled through the labels) and stopped
          the surface and its label from flipping as a pair in dark mode.
          `border-border` is explicit because the base layer only gives `border`
          a width — the colour comes from `* { border-border }`.
        */}
        <DropdownMenuContent
          className="w-60 rounded-xl border-border bg-popover text-popover-foreground shadow-xl"
          align="end"
        >
          <DropdownMenuLabel className="pb-2">
            <p className="font-semibold text-base text-popover-foreground">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className={itemIdle}
            onClick={handleOpenProfile}
          >
            <UserIcon className={cn("mr-2 h-4 w-4", iconAccent)} />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            className={itemIdle}
            onClick={handleDashboardRedirect}
          >
            <Heart className={cn("mr-2 h-4 w-4", iconAccent)} />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            // Destructive fills with its own colour (not `accent-foreground`) on
            // focus, so red keeps a readable pairing. `dark:text-destructive` was
            // a redundant duplicate — `--destructive` is a single token in both
            // themes and never needed a second declaration.
            className="cursor-pointer rounded-md text-destructive focus:bg-destructive focus:text-destructive-foreground"
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
