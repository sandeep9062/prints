"use client";

import React from "react";
import {
  Package,
  Heart,
  User,
  Ticket,
  Share2,
  Key,
  BookText,
  Award,
} from "lucide-react";

const menuItems = [
  { id: "orders", label: "Order History", icon: Package },
  { id: "saved", label: "Saved Creation", icon: Heart, count: 0 },
  { id: "profile", label: "Profile", icon: User },
  { id: "coupons", label: "Saved Coupon", icon: Ticket },
  { id: "accounts", label: "Connected Accounts", icon: Share2 },
  { id: "password", label: "Change Password", icon: Key },
  { id: "address", label: "Address Book", icon: BookText },
  { id: "rewards", label: "Reward History", icon: Award },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <nav className="flex flex-col bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/50">
        <p className="text-[10px] font-bold text-muted-foreground">
          Navigation
        </p>
      </div>
      <div className="p-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-footer text-footer-foreground shadow-md shadow-foreground/30/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "bg-card/15 text-primary-foreground"
                      : "bg-muted-foreground group-hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
                </div>
                <span
                  className={`text-sm font-medium tracking-wide ${
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {item.count !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    isActive
                      ? "bg-card/20 text-primary-foreground"
                      : "bg-muted-foreground"
                  }`}
                >
                  {item.count}
                </span>
              )}

              {!isActive && (
                <svg
                  className="w-4 h-4 text-muted-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
