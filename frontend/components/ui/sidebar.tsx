"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Store,
  Sparkles,
  PlusCircle,
  ArrowLeftRight,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

const links = [
  {
    href: "/merchant-dashboard",
    icon: Home,
    label: "Dashboard",
    color: "from-brand to-brand-hover",
    gradient: "from-brand-soft to-brand/20",
  },
  {
    href: "/merchant-dashboard/products",
    icon: Package,
    label: "Products",
    color: "from-brand to-brand-hover",
    gradient: "from-brand-soft to-brand/20",
  },
  {
    href: "/merchant-dashboard/orders",
    icon: ShoppingCart,
    label: "Orders",
    color: "from-brand to-brand-hover",
    gradient: "from-brand-soft to-brand/20",
  },
  {
    href: "/merchant-dashboard/customers",
    icon: Users,
    label: "Customers",
    color: "from-brand to-brand-hover",
    gradient: "from-brand-soft to-brand/20",
  },
  {
    href: "/merchant-dashboard/settings",
    icon: Settings,
    label: "Settings",
    color: "from-brand to-brand-hover",
    gradient: "from-brand-soft to-brand/20",
  },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/merchant-dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`flex flex-col h-full space-y-6 overflow-y-auto transition-all duration-300 ${
        collapsed ? "p-4" : "p-6"
      }`}
    >
      {/* Logo/Brand */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={`flex items-center gap-3 mb-2 ${collapsed ? "justify-center" : ""}`}
      >
        <div className="p-2.5 bg-gradient-to-br from-brand via-brand-hover to-brand-hover rounded-xl shadow-lg shadow-brand/25 shrink-0">
          <Store className="h-6 w-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <h2 className="font-sans text-xl font-semibold bg-gradient-to-r from-brand to-brand-hover bg-clip-text text-transparent">
              My Store
            </h2>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Merchant Dashboard
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Divider */}
      <div className="border-b border-border dark:border-border/50"></div>

      {/* Navigation Links */}
      <div className="space-y-1">
        {!collapsed && (
          <p className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>
        )}
        <ul className="space-y-1.5">
          {links.map(({ href, icon: Icon, label, color }, index) => (
            <motion.li
              key={href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link
                href={href}
                className={`group relative flex items-center rounded-xl transition-all duration-300 overflow-hidden ${
                  collapsed ? "justify-center p-3" : "gap-3.5 px-4 py-3"
                } ${
                  isActive(href)
                    ? `bg-gradient-to-r ${color} text-primary-foreground shadow-lg shadow-${color.split(" ")[1]}/30 scale-[1.02]`
                    : "hover:bg-muted dark:hover:bg-brand-hover/40 hover:scale-[1.01]"
                }`}
                title={collapsed ? label : undefined}
              >
                {/* Active Indicator */}
                {isActive(href) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-card/90 rounded-r-full" />
                )}

                {/* Icon Container */}
                <div
                  className={`relative p-2 rounded-lg transition-all duration-300 shrink-0 ${
                    isActive(href)
                      ? "bg-card/15"
                      : "bg-muted group-hover:scale-110 group-hover:bg-brand-soft"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-all duration-300 ${
                      isActive(href)
                        ? "text-primary-foreground"
                        : "text-muted-foreground dark:text-muted-foreground group-hover:text-brand"
                    }`}
                  />
                </div>

                {/* Label */}
                {!collapsed && (
                  <span
                    className={`font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                      isActive(href)
                        ? "text-primary-foreground"
                        : "text-foreground dark:text-muted-foreground/70 group-hover:text-foreground dark:group-hover:text-primary-foreground"
                    }`}
                  >
                    {label}
                  </span>
                )}

                {/* Active BG Shimmer */}
                {isActive(href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="space-y-1">
        {!collapsed && (
          <p className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Quick Actions
          </p>
        )}
        <Link
          href="/merchant-dashboard/add-product"
          className={`group flex items-center rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-soft hover:to-brand-soft dark:hover:to-brand-hover/20 hover:scale-[1.01] ${
            collapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
          }`}
          title={collapsed ? "Add Product" : undefined}
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-brand-soft to-brand-soft dark:from-brand-hover/30 dark:to-brand-hover/30 group-hover:scale-110 transition-all duration-300 shrink-0">
            <PlusCircle className="h-5 w-5 text-brand" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-medium text-sm text-foreground dark:text-muted-foreground/70 group-hover:text-brand dark:group-hover:text-brand transition-colors">
                Add Product
              </span>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                Create new listing
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Support Section */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-auto"
        >
          <div className="p-4 bg-gradient-to-br from-brand-soft to-brand-soft dark:from-ink dark:to-ink/50 rounded-2xl border border-border">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 bg-gradient-to-br from-brand to-brand-hover rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-brand/25">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground dark:text-muted-foreground/70">
                Need help?
              </p>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 mb-3">
                We're here to assist you
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand dark:text-brand dark:hover:text-brand bg-card dark:bg-card px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                Contact Support
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
