"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  BarChart3,
  Settings,
  CreditCard,
  Bell,
  Notebook,
  Home,
} from "lucide-react";

// Admin-specific menu items with routes
const adminMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin-dashboard",
  },
  {
    id: "products",
    label: "Product Management",
    icon: ShoppingBag,
    href: "/admin-dashboard/products",
  },
  {
    id: "blogs",
    label: "Blog Management",
    icon: Notebook,
    href: "/admin-dashboard/blogs",
  },
  {
    id: "orders",
    label: "Global Orders",
    icon: CreditCard,
    href: "/admin-dashboard/orders",
    count: 12,
  },
  {
    id: "users",
    label: "User Directory",
    icon: Users,
    href: "/admin-dashboard/users",
  },
  {
    id: "media",
    label: "Media Library",
    icon: ImageIcon,
    href: "/admin-dashboard/media",
  },
  {
    id: "analytics",
    label: "Sales Analytics",
    icon: BarChart3,
    href: "/admin-dashboard/analytics",
  },
  {
    id: "notifications",
    label: "System Alerts",
    icon: Bell,
    href: "/admin-dashboard/notifications",
    count: 3,
  },
  {
    id: "settings",
    label: "Site Settings",
    icon: Settings,
    href: "/admin-dashboard/settings",
  },
];

interface SidebarProps {
  activeTab?: string;
  collapsed?: boolean;
}

export const AdminSidebar = ({ activeTab, collapsed }: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (href: string, id: string) => {
    if (activeTab) return activeTab === id;
    if (href === "/admin-dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex flex-col gap-0.5 p-2">
      {adminMenuItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`flex items-center justify-between rounded-r-lg py-2.5 pl-4 pr-3 transition-colors border-l-2 ${
            isActive(item.href, item.id)
              ? "bg-brand-soft border-brand text-brand"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
          } ${collapsed ? "justify-center px-0" : ""}`}
          title={collapsed ? item.label : undefined}
          aria-current={isActive(item.href, item.id) ? "page" : undefined}
        >
          <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
            <item.icon
              className={`w-5 h-5 shrink-0 transition-colors ${
                isActive(item.href, item.id)
                  ? "text-brand"
                  : "text-muted-foreground"
              }`}
            />
            {!collapsed && (
              <span
                className={`text-sm transition-colors ${
                  isActive(item.href, item.id)
                    ? "text-brand font-semibold"
                    : "text-muted-foreground font-medium"
                }`}
              >
                {item.label}
              </span>
            )}
          </div>

          {!collapsed && item.count !== undefined && item.count > 0 && (
            <span className="bg-brand text-primary-foreground text-[11px] font-bold px-2 py-0.5 min-w-[1.5rem] text-center rounded-full">
              {item.count}
            </span>
          )}
        </Link>
      ))}

      {/* The storefront Navbar is hidden on /admin-dashboard (see HIDDEN_ROUTES
          in components/layout/Navbar.tsx), so without this the admin has no way
          back to the public site. Pinned below a divider and styled distinctly
          from the admin nav so it never reads as another dashboard section. */}
      <div className="mt-2 border-t border-border pt-2">
        <Link
          href="/"
          className={`flex items-center rounded-r-lg py-2.5 pl-4 pr-3 transition-colors border-l-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted ${
            collapsed ? "justify-center px-0" : "gap-3"
          }`}
          title={collapsed ? "Back to Home" : undefined}
        >
          <Home className="w-5 h-5 shrink-0 text-muted-foreground transition-colors" />
          {!collapsed && (
            <span className="text-sm font-medium transition-colors">
              Back to Home
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};
