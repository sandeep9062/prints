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
    <div className="min-h-screen bg-[#FDFDFD] pt-12">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-3">
            <h1 className="text-3xl font-serif text-stone-900 mb-10">
              My Account
            </h1>

            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </aside>

          {/* RIGHT CONTENT AREA */}
          <main className="lg:col-span-9">{renderActiveContent()}</main>
        </div>
      </div>
    </div>
  );
}
