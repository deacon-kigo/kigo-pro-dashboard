"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Root page that redirects to Campaign Manager
 * Making /campaign-manager the default landing page for the prototype
 *
 * Note: /campaigns route is handled separately and should not be redirected
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect from root path - other paths like /campaigns should be accessible
    if (window.location.pathname === "/") {
      // Redirect to campaign manager as the default page
      router.replace("/campaign-manager");
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Kigo PRO Dashboard...</p>
      </div>
    </div>
  );
}
