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
    <nav className="flex flex-col bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/50">
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400">
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
                  ? "bg-stone-900 text-white shadow-md shadow-stone-900/10"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
                </div>
                <span
                  className={`text-sm font-medium tracking-wide ${
                    isActive ? "text-white" : "text-stone-600"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {item.count !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {item.count}
                </span>
              )}

              {!isActive && (
                <svg
                  className="w-4 h-4 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity"
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
