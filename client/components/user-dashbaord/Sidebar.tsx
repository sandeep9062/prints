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
    <nav className="flex flex-col space-y-1">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex items-center justify-between px-4 py-4 transition-all border-l-2 ${
            activeTab === item.id
              ? "bg-stone-50 border-stone-900 text-stone-900 shadow-sm"
              : "border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-50/50"
          }`}
        >
          <div className="flex items-center gap-4">
            <item.icon
              className={`w-5 h-5 ${activeTab === item.id ? "text-stone-900" : "text-stone-400"}`}
            />
            <span className="text-sm font-medium tracking-tight uppercase tracking-widest text-[11px]">
              {item.label}
            </span>
          </div>

          {item.count !== undefined && (
            <span className="bg-stone-200 text-stone-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
              {item.count}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};
