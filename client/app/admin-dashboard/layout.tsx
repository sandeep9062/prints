"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin-dashbaord/AdminSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <aside
        className={`bg-white border-r border-stone-200 flex flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-end p-2 border-b border-stone-200 h-14">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-stone-100 text-stone-500 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminSidebar collapsed={collapsed} />
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
