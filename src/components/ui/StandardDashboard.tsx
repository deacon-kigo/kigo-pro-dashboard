'use client';

import React from 'react';

type StandardDashboardProps = {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  statsSection?: React.ReactNode;
  sidebarContent?: React.ReactNode;
};

/**
 * A standard dashboard layout with header, stats section, sidebar, and main content area
 */
export default function StandardDashboard({
  children,
  headerContent,
  statsSection,
  sidebarContent,
}: StandardDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-6">
        {headerContent}
      </header>

      {/* Stats section */}
      {statsSection && (
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsSection}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content area */}
          <main className="flex-1 order-2 lg:order-1">
            {children}
          </main>

          {/* Sidebar */}
          {sidebarContent && (
            <aside className="lg:w-80 order-1 lg:order-2">
              {sidebarContent}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
} 