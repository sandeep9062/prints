"use client";

import React, { useState } from "react";
import { Sidebar } from "../../components/user-dashbaord/Sidebar";
import OrderHistoryPage from "./order-history/page";
import SavedCreationPage from "./saved-creation/page";
import ProfilePage from "./profile/page";
import AddressBookPage from "./address-book/page";
import ChangePasswordPage from "./change-password/page";
import ConnectedAccountPage from "./connected-account/page";
import SavedCouponPage from "./saved-coupan/page";
import RewardHistoryPage from "./reward-history/page";

export default function UserDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("orders");

  const renderActiveContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrderHistoryPage />;
      case "saved":
        return <SavedCreationPage />;
      case "profile":
        return <ProfilePage />;
      case "coupons":
        return <SavedCouponPage />;
      case "accounts":
        return <ConnectedAccountPage />;
      case "password":
        return <ChangePasswordPage />;
      case "address":
        return <AddressBookPage />;
      case "rewards":
        return <RewardHistoryPage />;
      default:
        return children;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white pt-8 md:pt-12 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-tight">
            My Account
          </h1>
          <p className="text-stone-500 mt-2 text-sm hidden md:block">
            Manage your profile, orders, and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDEBAR */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </aside>

          {/* RIGHT CONTENT AREA */}
          <main className="flex-1 min-w-0">
            <div className="animate-fadeIn">{renderActiveContent()}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
