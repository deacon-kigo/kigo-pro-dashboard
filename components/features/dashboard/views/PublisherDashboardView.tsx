"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDemoState } from "@/lib/redux/hooks";
import { convertMockUserToUserProfile } from "@/lib/userProfileUtils";
import { PageHeader } from "@/components/molecules/PageHeader";

// The main Publisher Dashboard component
export default function PublisherDashboardView() {
  const demoState = useDemoState();
  const mockUserProfile = demoState.userProfile;
  const userProfile = useMemo(
    () =>
      mockUserProfile
        ? convertMockUserToUserProfile(mockUserProfile)
        : undefined,
    [mockUserProfile]
  );

  // Get current date in a nice format
  const currentDate = useMemo(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return now.toLocaleDateString("en-US", options);
  }, []);

  return (
    <div className="space-y-4">
      {/* Aurora PageHeader */}
      <PageHeader
        title={`Welcome, ${userProfile?.name?.split(" ")[0] || "User"}!`}
        description={`${currentDate} • Global Rewards Inc. • Publisher`}
        emoji="✨"
        variant="aurora"
      />

      {/* PowerBI dashboard embed */}
      <PowerBIEmbed />
    </div>
  );
}

// PowerBI Embed component with Advertiser Campaign label
const PowerBIEmbed = () => {
  const powerBIUrl =
    "https://app.powerbi.com/reportEmbed?reportId=cd3e45c5-bf62-4248-ae49-ba2fc0659afe&autoAuth=true&ctid=81549142-4900-41ac-a022-6ce1b9a87cd1";

  return (
    <div className="w-full">
      <div className="aspect-[16/9] w-full rounded-lg overflow-hidden">
        <iframe
          src={powerBIUrl}
          title="Advertiser Campaign Analytics Dashboard"
          className="w-full h-full border-0"
          allowFullScreen
          style={{
            minHeight: "700px",
            backgroundColor: "transparent",
          }}
        />
      </div>
    </div>
  );
};
