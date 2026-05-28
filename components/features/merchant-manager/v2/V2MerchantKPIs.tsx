"use client";

import React from "react";
import StatCard from "@/components/molecules/cards/StatCard";
import {
  BuildingStorefrontIcon,
  GiftIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

export default function V2MerchantKPIs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Merchants"
        value="40,218"
        icon={<BuildingStorefrontIcon className="w-5 h-5" />}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      />
      <StatCard
        title="Active Offers"
        value="3,841"
        change={6}
        icon={<GiftIcon className="w-5 h-5" />}
        iconBg="bg-green-50"
        iconColor="text-green-500"
      />

      {/* Expired — red accent */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light border-l-[3px] border-l-red-500 p-5">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mr-4">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">
              Expired — Needs Action
            </p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">47</h3>
            <p className="text-xs text-red-500 mt-1">Cannot be set active</p>
          </div>
        </div>
      </div>

      {/* Duplicates — amber accent */}
      <div className="bg-white rounded-xl shadow-sm border border-border-light border-l-[3px] border-l-amber-500 p-5">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center mr-4">
            <DocumentDuplicateIcon className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">
              Duplicate Records
            </p>
            <h3 className="text-2xl font-bold text-amber-700 mt-1">3</h3>
            <p className="text-xs text-amber-500 mt-1">Flagged for review</p>
          </div>
        </div>
      </div>
    </div>
  );
}
