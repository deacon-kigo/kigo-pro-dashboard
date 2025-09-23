"use client";

import React, { Suspense } from "react";
import MarketingInsightsView from "@/components/features/marketing-insights/MarketingInsightsView";
import Sidebar from "@/components/organisms/Sidebar/Sidebar";
import Header from "@/components/organisms/Header/Header";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";

export default function AIInsightsPage() {
  const { sidebarWidth } = useAppSelector((state) => state.ui);

  const breadcrumb = (
    <Breadcrumb className="mb-6 px-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Campaign Manager</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>AI Insights</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  // Simple inline style using Redux state directly
  const mainContentStyle = {
    paddingLeft: `calc(${sidebarWidth} + 1.5rem)`,
    transition: "padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading AI Insights...
        </div>
      }
    >
      <div className="flex min-h-screen bg-bg-light">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          <Header />
          <main
            className="pt-[72px] min-h-screen overflow-hidden transition-all duration-300 ease-in-out will-change-padding"
            style={mainContentStyle}
          >
            <div className="h-full w-full pt-4">
              {breadcrumb}
              <div className="px-6">
                <MarketingInsightsView />
              </div>
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
}
