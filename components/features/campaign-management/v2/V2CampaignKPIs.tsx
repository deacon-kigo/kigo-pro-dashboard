"use client";

import React from "react";
import StatCard from "@/components/molecules/cards/StatCard";
import Progress from "@/components/atoms/Progress/Progress";
import {
  MegaphoneIcon,
  CursorArrowRaysIcon,
  BookmarkIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function V2CampaignKPIs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Active Campaigns */}
      <StatCard
        title="Active Campaigns"
        value={7}
        change={75}
        icon={<MegaphoneIcon className="w-5 h-5" />}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      />

      {/* Banner CTR */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-5">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mr-4">
            <CursorArrowRaysIcon className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-muted">Banner CTR</p>
            <h3 className="text-2xl font-bold mt-1">0.31%</h3>
            <div className="flex items-center mt-1">
              <span className="text-xs text-green-600 font-medium">
                ↑ from 0.20% baseline
              </span>
            </div>
            <Progress value={55} size="sm" className="mt-2" />
            <p className="text-[11px] text-gray-400 mt-1">Target: 0.40%</p>
          </div>
        </div>
      </div>

      {/* Saved-Offer Redemption */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light p-5">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mr-4">
            <BookmarkIcon className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-muted">
              Saved-Offer Redemption
            </p>
            <h3 className="text-2xl font-bold mt-1">3.2%</h3>
            <Progress value={64} size="sm" className="mt-2" />
            <p className="text-[11px] text-gray-400 mt-1">Target: 5.0%</p>
          </div>
        </div>
      </div>

      {/* Transaction Revenue */}
      <StatCard
        title="Transaction Revenue"
        value="$48.2K"
        change={18}
        icon={<CurrencyDollarIcon className="w-5 h-5" />}
        iconBg="bg-amber-50"
        iconColor="text-amber-500"
      />
    </div>
  );
}
