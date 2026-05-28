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
    <nav className="flex flex-col space-y-1">
      {adminMenuItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`flex items-center justify-between px-4 py-4 transition-all border-l-2 ${
            isActive(item.href, item.id)
              ? "bg-stone-100 border-stone-900 text-stone-900 shadow-sm"
              : "border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-50/50"
          } ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? item.label : undefined}
        >
          <div className={`flex items-center ${collapsed ? "" : "gap-4"}`}>
            <item.icon
              className={`w-5 h-5 transition-colors ${
                isActive(item.href, item.id)
                  ? "text-stone-900"
                  : "text-stone-400 group-hover:text-stone-600"
              }`}
            />
            {!collapsed && (
              <span
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${
                  isActive(item.href, item.id)
                    ? "text-stone-900"
                    : "text-stone-500"
                }`}
              >
                {item.label}
              </span>
            )}
          </div>

          {!collapsed && item.count !== undefined && item.count > 0 && (
            <span className="bg-stone-900 text-white text-[9px] font-bold px-2 py-0.5 min-w-[1.5rem] text-center">
              {item.count}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};
