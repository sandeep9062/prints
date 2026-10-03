"use client";

import { Award, Gift, Plus, Minus, TrendingUp } from "lucide-react";

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
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h2 className="text-2xl md:text-3xl font-sans text-foreground">
            Reward History
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Track your loyalty points and rewards
          </p>
        </div>
      </div>

      {/* Points Balance Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-hover opacity-[0.03] pointer-events-none" />
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center shadow-lg shadow-gold/25/50">
                  <Award className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-1.5">
                    Total Reward Points
                  </p>
                  <p className="text-4xl font-serif text-foreground tracking-tight">
                    {totalPoints}{" "}
                    <span className="text-lg font-normal text-muted-foreground">
                      points
                    </span>
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-success">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="font-medium">+250 points this month</span>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2.5 px-6 py-3.5 bg-footer text-footer-foreground text-xs font-bold rounded-xl hover:bg-brand-hover hover:text-primary-foreground transition-all duration-200 shadow-sm active:scale-[0.98]">
                <Gift className="w-4 h-4" />
                Redeem Points
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Timeline */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h3 className="font-semibold text-foreground text-sm">History</h3>
        </div>

        <div className="divide-y divide-border">
          {rewards.map((reward, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors duration-150"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    reward.type === "credit"
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {reward.type === "credit" ? (
                    <Plus className="w-5 h-5" />
                  ) : (
                    <Minus className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {reward.description}
                  </h3>
                  <p className="text-xs text-muted-foreground">{reward.date}</p>
                </div>
              </div>
              <span
                className={`font-bold text-base ${
                  reward.type === "credit" ? "text-success" : "text-muted-foreground"
                }`}
              >
                {reward.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
