"use client";

import { Award } from "lucide-react";

export default function RewardHistoryPage() {
  const rewards = [
    {
      date: "15 Dec 2025",
      points: "+500",
      description: "Welcome Bonus",
      type: "credit",
    },
    {
      date: "22 Dec 2025",
      points: "+120",
      description: "Order Purchase #4321",
      type: "credit",
    },
    {
      date: "05 Jan 2026",
      points: "-300",
      description: "Redeemed for Coupon",
      type: "debit",
    },
    {
      date: "10 Jan 2026",
      points: "+250",
      description: "Referral Bonus",
      type: "credit",
    },
  ];

  const totalPoints = 570;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
        <h2 className="text-2xl font-serif text-stone-900">Reward History</h2>
      </div>

      <div className="bg-white border border-stone-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.1em] text-stone-400 uppercase mb-1">
              Total Reward Points
            </p>
            <p className="text-3xl font-serif text-stone-900">
              {totalPoints}{" "}
              <span className="text-lg font-normal text-stone-500">points</span>
            </p>
          </div>
          <button className="px-6 py-3 border border-stone-900 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase hover:bg-stone-800 transition-colors">
            Redeem Points
          </button>
        </div>
      </div>

      <div className="bg-white border border-stone-100 shadow-sm">
        {rewards.map((reward, index) => (
          <div
            key={index}
            className={`p-6 flex items-center justify-between ${index !== rewards.length - 1 ? "border-b border-stone-100" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${reward.type === "credit" ? "bg-green-50 text-green-600" : "bg-stone-100 text-stone-500"}`}
              >
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-stone-900">
                  {reward.description}
                </h3>
                <p className="text-sm text-stone-500">{reward.date}</p>
              </div>
            </div>
            <p
              className={`font-bold ${reward.type === "credit" ? "text-green-600" : "text-stone-500"}`}
            >
              {reward.points}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
