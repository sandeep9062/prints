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
    color: "from-blue-500 to-blue-600",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    href: "/merchant-dashboard/products",
    icon: Package,
    label: "Products",
    color: "from-emerald-500 to-emerald-600",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    href: "/merchant-dashboard/orders",
    icon: ShoppingCart,
    label: "Orders",
    color: "from-purple-500 to-purple-600",
    gradient: "from-purple-400 to-fuchsia-500",
  },
  {
    href: "/merchant-dashboard/customers",
    icon: Users,
    label: "Customers",
    color: "from-orange-500 to-orange-600",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    href: "/merchant-dashboard/settings",
    icon: Settings,
    label: "Settings",
    color: "from-blue-500 to-indigo-600",
    gradient: "from-blue-400 to-indigo-500",
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
        <div className="p-2.5 bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 rounded-xl shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30 shrink-0">
          <Store className="h-6 w-6 text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <h2 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              My Store
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Merchant Dashboard
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Divider */}
      <div className="border-b border-gray-100 dark:border-gray-700/50"></div>

      {/* Navigation Links */}
      <div className="space-y-1">
        {!collapsed && (
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-3">
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
                    ? `bg-gradient-to-r ${color} text-white shadow-lg shadow-${color.split(" ")[1]}/30 scale-[1.02]`
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:scale-[1.01]"
                }`}
                title={collapsed ? label : undefined}
              >
                {/* Active Indicator */}
                {isActive(href) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/90 rounded-r-full" />
                )}

                {/* Icon Container */}
                <div
                  className={`relative p-2 rounded-lg transition-all duration-300 shrink-0 ${
                    isActive(href)
                      ? "bg-white/15"
                      : "bg-gray-50 dark:bg-gray-800/60 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-rose-50 group-hover:to-pink-50 dark:group-hover:from-rose-900/20 dark:group-hover:to-pink-900/20"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-all duration-300 ${
                      isActive(href)
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-rose-500"
                    }`}
                  />
                </div>

                {/* Label */}
                {!collapsed && (
                  <span
                    className={`font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                      isActive(href)
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
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
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-3">
            Quick Actions
          </p>
        )}
        <Link
          href="/merchant-dashboard/add-product"
          className={`group flex items-center rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-900/20 dark:hover:to-pink-900/20 hover:scale-[1.01] ${
            collapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
          }`}
          title={collapsed ? "Add Product" : undefined}
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 group-hover:scale-110 transition-all duration-300 shrink-0">
            <PlusCircle className="h-5 w-5 text-rose-500" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Add Product
              </span>
              <p className="text-xs text-gray-400 dark:text-gray-500">
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
          <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-rose-100 dark:border-gray-700/30">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-rose-200/50 dark:shadow-rose-900/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Need help?
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">
                We're here to assist you
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
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
