"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import {
  Package,
  Store,
  ArrowLeft,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MerchantLayoutProps {
  children: React.ReactNode;
}

const pageConfig: Record<
  string,
  { title: string; subtitle: string; icon: React.ReactNode; gradient: string }
> = {
  "/merchant-dashboard": {
    title: "Merchant Dashboard",
    subtitle: "Manage your store effectively",
    icon: <Store className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
    gradient: "from-rose-600 to-pink-600",
  },
  "/merchant-dashboard/products": {
    title: "Products Management",
    subtitle: "Manage your product catalog",
    icon: (
      <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    ),
    gradient: "from-emerald-600 to-teal-600",
  },
  "/merchant-dashboard/orders": {
    title: "Order Management",
    subtitle: "Track and manage customer orders",
    icon: <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    gradient: "from-purple-600 to-fuchsia-600",
  },
  "/merchant-dashboard/customers": {
    title: "Customer Management",
    subtitle: "Manage and analyze your customer base",
    icon: <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
    gradient: "from-orange-600 to-amber-600",
  },
  "/merchant-dashboard/add-product": {
    title: "Add New Product",
    subtitle: "Create and publish your product",
    icon: <Package className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
    gradient: "from-rose-600 to-pink-600",
  },
  "/merchant-dashboard/settings": {
    title: "Settings",
    subtitle: "Manage your account and preferences",
    icon: <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    gradient: "from-blue-600 to-indigo-600",
  },
};

export default function MerchantLayout({ children }: MerchantLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Find the matching page config
  const config =
    Object.entries(pageConfig).find(
      ([path]) => pathname === path || pathname.startsWith(path + "/"),
    )?.[1] || pageConfig["/merchant-dashboard"];

  const isHome = pathname === "/merchant-dashboard";

  return (
    <div
      className={`grid min-h-screen w-full transition-all duration-300 bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 ${
        collapsed ? "lg:grid-cols-[80px_1fr]" : "lg:grid-cols-[280px_1fr]"
      }`}
    >
      {/* Sidebar */}
      <div className="hidden border-r bg-white/80 backdrop-blur-sm lg:flex flex-col dark:bg-gray-900/80 dark:border-gray-800 relative group">
        <div className="flex items-center justify-end p-2 border-b border-gray-100 dark:border-gray-800 h-[68px]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <Sidebar collapsed={collapsed} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-16 lg:h-[68px] items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6 dark:bg-gray-900/80 dark:border-gray-800 shadow-sm sticky top-0 z-30">
          <Link href="#" className="lg:hidden">
            <Package className="h-6 w-6 text-rose-500" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="flex-1 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                  {config.icon}
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                  >
                    {config.title}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {config.subtitle}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isHome && (
                <Link href="/merchant-dashboard/add-product">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hidden sm:flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Product
                  </Button>
                </Link>
              )}
              <Link href="/" passHref>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-rose-50 bg-white/80 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  {isHome ? "Home" : "Dashboard"}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
