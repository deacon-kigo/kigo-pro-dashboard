"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CampaignManagerPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to analytics page
    router.push('/campaign-manager/analytics');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-2 text-gray-600">Redirecting to analytics...</p>
      </div>
    </div>
  );
} 