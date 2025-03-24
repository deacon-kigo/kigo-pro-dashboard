'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDemo } from '@/contexts/DemoContext';

export default function RootPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Simply forward the user to the dashboard page with the same params
    // Don't update the demo state here as it will be handled in the dashboard
    const params = new URLSearchParams(searchParams);
    router.push(`/dashboard?${params.toString()}`);
  }, [router, searchParams]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-3">Redirecting to dashboard...</h2>
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
}
