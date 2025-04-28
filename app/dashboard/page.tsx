"use client";

import React, { Suspense } from "react";
import { DashboardView } from "@/components/features/dashboard";
import { useDemoState } from "@/lib/redux/hooks";
import { BellIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import LowesView from "@/components/features/dashboard/views/LowesView";

function DashboardContent() {
  const { clientId, themeMode } = useDemoState();
  const router = useRouter();

  return (
    <div
      className={`dashboard-page min-h-screen ${themeMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 py-3 px-6">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <h1 className="text-lg font-bold">
            {clientId === "deacons-pizza" ? "Deacon's Pizza" : "Dashboard"}
          </h1>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                5
              </span>
            </button>
            <button className="relative p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 pt-6">
        <LowesView
          onCreateCampaign={() => router.push("/dashboard/campaigns/create")}
          onCreateOffer={() => router.push("/dashboard/offers/create")}
          onViewCampaign={(id) => router.push(`/dashboard/campaigns/${id}`)}
          showAnalytics={true}
          showCampaignPerformance={true}
        />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
