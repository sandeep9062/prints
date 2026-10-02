"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { OrderCard } from "./OrderCard";
import { Filter } from "lucide-react";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Sidebar Section */}
          <div className="lg:col-span-3">
            <h1 className="font-serif text-4xl text-stone-900 mb-12">
              My Account
            </h1>
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-stone-200">
              <h2 className="font-serif text-2xl text-stone-900">
                Order History
              </h2>
              <button className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-stone-900 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* List of Orders */}
            <div className="space-y-6">
              <OrderCard
                orderId="ZO-B43A47AB89"
                status="Delivered"
                customerName="Sandeep Saini"
                address="sco7, Dashmesh Square, Patiala Road, Lohgarh, Zirakpur, Mohali, Punjab, 140603"
                phone="+91 9729907448"
              />
              {/* You can map through your actual order data here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
