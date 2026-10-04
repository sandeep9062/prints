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
    icon: <Store className="h-5 w-5 text-brand dark:text-brand" />,
    gradient: "from-brand to-brand-hover",
  },
  "/merchant-dashboard/products": {
    title: "Products Management",
    subtitle: "Manage your product catalog",
    icon: (
      <Package className="h-5 w-5 text-success dark:text-brand" />
    ),
    gradient: "from-brand from-brand",
  },
  "/merchant-dashboard/orders": {
    title: "Order Management",
    subtitle: "Track and manage customer orders",
    icon: <Package className="h-5 w-5 text-brand dark:text-brand" />,
    gradient: "from-brand from-brand",
  },
  "/merchant-dashboard/customers": {
    title: "Customer Management",
    subtitle: "Manage and analyze your customer base",
    icon: <Package className="h-5 w-5 text-gold dark:text-gold" />,
    gradient: "from-brand to-brand-hover",
  },
  "/merchant-dashboard/add-product": {
    title: "Add New Product",
    subtitle: "Create and publish your product",
    icon: <Package className="h-5 w-5 text-brand dark:text-brand" />,
    gradient: "from-brand to-brand-hover",
  },
  // The lookup below matches by path prefix, so /edit-product/:id would
  // otherwise fall through to the dashboard home title.
  "/merchant-dashboard/edit-product": {
    title: "Edit Product",
    subtitle: "Update the details of your product",
    icon: <Package className="h-5 w-5 text-brand dark:text-brand" />,
    gradient: "from-brand to-brand-hover",
  },
  "/merchant-dashboard/settings": {
    title: "Settings",
    subtitle: "Manage your account and preferences",
    icon: <Settings className="h-5 w-5 text-brand dark:text-brand" />,
    gradient: "from-brand to-brand-hover",
  },
};

export default function MerchantDashboardShell({ children }: MerchantLayoutProps) {
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
      className={`grid min-h-screen w-full transition-all duration-300 bg-gradient-to-br from-brand-soft via-white to-card dark:from-brand dark:via-brand dark:to-brand-hover ${
        collapsed ? "lg:grid-cols-[80px_1fr]" : "lg:grid-cols-[280px_1fr]"
      }`}
    >
      {/* Sidebar */}
      <div className="hidden border-r bg-card/80 backdrop-blur-sm lg:flex flex-col dark:bg-black/80 dark:border-border relative group">
        <div className="flex items-center justify-end p-2 border-b border-border dark:border-border h-[68px]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-muted dark:hover:bg-brand-hover text-muted-foreground transition-colors"
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
        <header className="flex h-16 lg:h-[68px] items-center gap-4 border-b bg-card/80 backdrop-blur-md px-6 dark:bg-black/80 dark:border-border shadow-sm sticky top-0 z-30">
          <Link href="#" className="lg:hidden">
            <Package className="h-6 w-6 text-brand" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="flex-1 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-brand-soft dark:bg-footer/30 rounded-lg">
                  {config.icon}
                </div>
                <div>
                  <h1
                    className={`text-xl font-bold bg-gradient-to-r to-brand-hover ${config.gradient} bg-clip-text text-transparent`}
                  >
                    {config.title}
                  </h1>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">
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
                    className="bg-gradient-to-r from-brand to-brand-hover hover:from-brand hover:to-brand-hover text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hidden sm:flex items-center gap-2"
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
                  className="hover:bg-brand-soft bg-card/80 border-border dark:bg-card dark:border-border dark:hover:bg-brand-hover transition-all duration-200"
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
