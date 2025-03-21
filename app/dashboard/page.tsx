'use client';

import React from 'react';
import PersonalizedDashboard from '@/components/dashboard/PersonalizedDashboard';
import { useDemo } from '@/contexts/DemoContext';

export default function DashboardPage() {
  const { clientId, role, themeMode } = useDemo();
  
  return (
    <div className={`dashboard-page min-h-screen ${themeMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <main className="container mx-auto max-w-7xl">
        <PersonalizedDashboard />
      </main>
    </div>
  );
} 