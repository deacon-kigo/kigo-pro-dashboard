'use client';

import React, { useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { useRouter } from 'next/navigation';
import DashboardView from '@/components/features/dashboard/DashboardView';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setSidebarCollapsed } from '@/lib/redux/slices/uiSlice';

export default function CVSDashboardPage() {
  const { updateDemoState, themeMode } = useDemo();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sidebarCollapsed } = useAppSelector(state => state.ui);
  
  // Force light mode for this component
  useEffect(() => {
    if (themeMode !== 'light') {
      router.replace('/demos/cvs-dashboard?role=support&client=cvs&scenario=dashboard&theme=light');
    }
  }, [themeMode, router]);
  
  // Set up initial demo state on mount
  useEffect(() => {
    // Initialize the demo state with CVS context
    updateDemoState({
      clientId: 'cvs',
      scenario: 'dashboard',
      role: 'support'
    });
    
    // Ensure sidebar state is initialized from localStorage or default
    const storedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (storedSidebarState) {
      dispatch(setSidebarCollapsed(storedSidebarState === 'true'));
    }
    
    // Apply CSS variable for sidebar width
    const sidebarWidth = sidebarCollapsed ? '70px' : '225px';
    document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
    
    // Clean up styles when component unmounts
    return () => {
      document.documentElement.style.setProperty('--sidebar-width', '225px');
    };
  }, [updateDemoState, dispatch, sidebarCollapsed]);

  return (
    <div className="relative w-full overflow-x-hidden">
      <style jsx global>{`
        /* Ensure content doesn't overflow and respects sidebar width */
        main {
          padding-left: calc(var(--sidebar-width) + 1.5rem) !important;
          transition: padding-left 0.3s ease-in-out;
        }
        
        /* Additional overflow protection */
        .overflow-container {
          max-width: 100%;
          overflow-x: hidden;
        }
        
        /* Ensure tables don't cause horizontal overflow */
        table {
          width: 100%;
          table-layout: fixed;
        }
        
        /* Add responsive handling for small screens */
        @media (max-width: 768px) {
          main {
            padding-left: 1.5rem !important;
          }
        }
      `}</style>
      <div className="overflow-container">
        <DashboardView />
      </div>
    </div>
  );
} 