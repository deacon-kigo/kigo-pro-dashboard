'use client';

import React, { useState, useEffect, ReactNode, useMemo } from 'react';
import { useDemoState } from '@/lib/redux/hooks';
import { useAppSelector } from "@/lib/redux/hooks";
import { convertMockUserToUserProfile } from '@/lib/userProfileUtils';
import { getMockAvatarUrl } from '@/lib/avatarUtils';
import Card from '@/components/atoms/Card/Card';
import { AIAssistant } from '@/components/features/ai';
import VersionBadge from '@/components/molecules/badges/VersionBadge';
import { UserIcon, ClockIcon, PlusIcon } from "@heroicons/react/24/outline";

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
  const user = useAppSelector((state) => state.user.profile);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { role, clientId, clientName, themeMode, version } = useDemoState();
  const mockUserProfile = useDemoState().userProfile;
  
  const userProfile = useMemo(() => 
    mockUserProfile ? convertMockUserToUserProfile(mockUserProfile) : undefined
  , [mockUserProfile]);
  
  const [currentGreeting, setCurrentGreeting] = useState(greeting || '');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState("");
  const [weatherEmoji, setWeatherEmoji] = useState('☀️'); // Default sunny
  
  const patternStyles = useMemo(() => `
    .bg-pattern {
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
      background-size: 120px 120px;
    }
  `, []);
  
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
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const avatarUrl = user?.avatar || '';
  
  return (
    <div className="pt-4 transition-all duration-300 ease-in-out">
      <style dangerouslySetInnerHTML={{ __html: patternStyles }} />
      
      {version !== 'current' && <VersionBadge version={version} />}
      
      <div 
        className="relative overflow-hidden rounded-lg mb-6"
        style={{ 
          background: "linear-gradient(to right, #3b82f6, #4f46e5)",
          overflow: "hidden",
          borderRadius: "0.5rem",
          marginBottom: "1.5rem"
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px"
          }} />
        </div>
        
        <div className="relative p-5 z-10">
          {headerContent ? (
            headerContent
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <span className="text-4xl mr-3">{weatherEmoji}</span>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {currentGreeting}, {userProfile?.name?.split(' ')[0] || 'User'}!
                  </h1>
                  <p className="text-sm text-white/80 mt-1">
                    {currentDate} • <span className="text-white font-medium">{userProfile?.role || 'User'}</span>
                  </p>
                  <p className="text-sm text-white/70 italic mt-1">
                    Your most unhappy customers are your greatest source of learning.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {statsSection && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsSection}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {children}
        </div>
        
        <div className="space-y-6">
          {sidebarContent || (
            <>
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-sm">
                <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Hey {userProfile?.name?.split(' ')[0] || 'User'}, I'm your AI Assistant</h3>
                      <p className="text-xs text-white/80">Personalized insights for your campaigns</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="flex items-center text-sm text-white hover:text-blue-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Review today's metrics
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-sm text-white hover:text-blue-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Run performance report
                        </a>
                      </li>
                    </ul>
                  </div>
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
                        <div className="text-sm text-gray-500">Deacon&apos;s Pizza requesting special discount approval for upcoming holiday promotion</div>
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
                        <div className="text-sm text-gray-500">Review Deacon&apos;s Pizza summer campaign performance</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <div className="flex">
                      <div className="p-2 bg-yellow-100 rounded-md mr-3 flex-shrink-0">
                        <svg className="h-4 w-4 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-3.943 7.864-7 12.342-7C20.477 5 24.268 7.943 25.542 12c-1.274 4.057-3.943 7.864-7.864 9.138-4.057 1.274-7.864-2.477-9.138-6.534-7.864z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">New analysis</h4>
                        <div className="text-sm text-gray-500">New analysis shows that &quot;Buy One Get One&quot; offers generate 32% more engagement than flat discounts</div>
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