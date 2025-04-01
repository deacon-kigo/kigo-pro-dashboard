'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { getMockAvatarUrl } from '@/lib/avatarUtils';
import Card from '@/components/ui/data-display/Card';
import AIAssistant from '@/components/shared/AIAssistant';
import VersionBadge from '@/components/shared/VersionBadge';

interface StandardDashboardProps {
  children: ReactNode;
  greeting?: string;
  // Optional sections - if not provided, will use default/empty sections
  headerContent?: ReactNode;
  statsSection?: ReactNode;
  sidebarContent?: ReactNode;
}

/**
 * StandardDashboard provides a consistent layout for all dashboard views.
 * It manages the common elements like greeting section, stats section, and sidebar layout.
 */
export default function StandardDashboard({
  children,
  greeting,
  headerContent,
  statsSection,
  sidebarContent
}: StandardDashboardProps) {
  const { role, clientId, userProfile, themeMode, version } = useDemo();
  const [currentGreeting, setCurrentGreeting] = useState(greeting || '');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [weatherEmoji, setWeatherEmoji] = useState('☀️'); // Default sunny
  
  // Set greeting based on time of day if not provided
  useEffect(() => {
    if (greeting) {
      setCurrentGreeting(greeting);
      return;
    }
    
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      
      let newGreeting = '';
      if (hour < 12) {
        newGreeting = 'Good morning';
        setWeatherEmoji('🌅');
      } else if (hour < 17) {
        newGreeting = 'Good afternoon';
        setWeatherEmoji('☀️');
      } else {
        newGreeting = 'Good evening';
        setWeatherEmoji('🌙');
      }
      
      setCurrentGreeting(newGreeting);
      
      // Format time
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
      }));
      
      // Format date
      setCurrentDate(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      }));
    };
    
    updateTimeAndGreeting();
    const timer = setInterval(updateTimeAndGreeting, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [greeting]);
  
  const avatarUrl = getMockAvatarUrl({
    id: userProfile.id,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName
  });
  
  return (
    <div className="pt-4 transition-all duration-300 ease-in-out">
      {/* Version Badge - only show for non-current versions */}
      {version !== 'current' && <VersionBadge version={version} />}
      
      {/* Header/Greeting Banner */}
      <div className="relative overflow-hidden rounded-lg bg-blue-50 mb-6">
        <div className="relative p-5 z-10">
          {headerContent ? (
            headerContent
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <span className="text-4xl mr-3">{weatherEmoji}</span>
                <div>
                  <h1 className="text-2xl font-bold text-blue-700">
                    {currentGreeting}, {userProfile.firstName}!
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentDate} • <span className="text-primary font-medium">{userProfile.title}</span>
                  </p>
                  <p className="text-sm text-gray-500 italic mt-1">
                    Your most unhappy customers are your greatest source of learning.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      {statsSection && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsSection}
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Primary content provided via children */}
          {children}
        </div>
        
        <div className="space-y-6">
          {/* Sidebar content - either custom or default AI assistant */}
          {sidebarContent || (
            <>
              <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Hey {userProfile.firstName}, I'm your AI Assistant</h3>
                    <p className="text-xs text-gray-600">Personalized insights for your campaigns</p>
                  </div>
                </div>
                <div className="mt-4">
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Review today's metrics
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Run performance report
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <Card title="Tasks & Notifications">
                <div className="space-y-3 p-4">
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <div className="flex">
                      <div className="p-2 bg-purple-100 rounded-md mr-3 flex-shrink-0">
                        <svg className="h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Approve merchant discount request</h4>
                        <p className="text-xs text-gray-600 mt-1">Acme Corporation has requested a custom discount rate</p>
                        <p className="text-xs text-gray-500 mt-1">Today</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <div className="flex">
                      <div className="p-2 bg-green-100 rounded-md mr-3 flex-shrink-0">
                        <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Review campaign performance</h4>
                        <p className="text-xs text-gray-600 mt-1">The "Summer Sale Promotion" campaign has reached 50% completion</p>
                        <p className="text-xs text-gray-500 mt-1">Today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 