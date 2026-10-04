"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin-dashbaord/AdminSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardShell({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-muted text-foreground flex">
      <aside
        className={`bg-card border-r border-border flex flex-col transition-all duration-300 shrink-0 sticky top-0 h-screen ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-end p-2 border-b border-border h-14 shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
