/**
 * @view GenericDashboardView
 * @description A generic dashboard view that displays various statistics and activities
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import Card from '@/components/atoms/Card/Card';
import { getTimeBasedGreeting, getWelcomeBackMessage } from '@/lib/userProfileUtils';
import StandardDashboard from '@/components/templates/StandardDashboard';

export default function GenericDashboardView() {
  const { userProfile, theme, themeMode } = useDemo();
  
  // Calculate task completion rate
  const userData = {
    name: userProfile?.firstName || 'User',
    role: userProfile?.role || 'User',
    tasks: { completed: 12, total: 15 },
    notifications: 3
  };
  
  const taskCompletionRate = Math.round((userData.tasks.completed / userData.tasks.total) * 100);
  
  // Create sections for StandardDashboard
  const statsSection = (
    <>
      <Card className="flex items-center p-4">
        <div className="p-1.5 bg-primary/10 rounded-md mr-3">
          <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <p className="font-medium">Tasks</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs">{userData.tasks.completed}/{userData.tasks.total} completed</p>
        </div>
      </Card>
      
      <Card className="flex items-center p-4">
        <div className="p-1.5 bg-primary/10 rounded-md mr-3">
          <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <p className="font-medium">Notifications</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs">{userData.notifications} unread messages</p>
        </div>
      </Card>
      
      <Card className="flex items-center p-4">
        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md mr-3">
          <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <div>
          <p className="font-medium">Messages</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs">5 new messages</p>
        </div>
      </Card>
      
      <Card className="flex items-center p-4">
        <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md mr-3">
          <svg className="h-5 w-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-medium">Completed</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs">{taskCompletionRate}% tasks done</p>
        </div>
      </Card>
    </>
  );

  const sidebarContent = (
    <Card title="Progress">
      <div className="flex flex-col items-center p-4">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-primary"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 40 * taskCompletionRate / 100} ${2 * Math.PI * 40}`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="text-xl font-bold">{taskCompletionRate}%</span>
          </div>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Keep up the good work! You've completed {userData.tasks.completed} of {userData.tasks.total} tasks.
        </p>
      </div>
    </Card>
  );

  // Main content for StandardDashboard
  const mainContent = (
    <>
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
          <button className="p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left">
            <h3 className="font-medium mb-1">Create Campaign</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Launch a new marketing campaign</p>
          </button>
          <button className="p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left">
            <h3 className="font-medium mb-1">View Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Check performance metrics</p>
          </button>
          <button className="p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left">
            <h3 className="font-medium mb-1">Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Contact customer support</p>
          </button>
        </div>
      </Card>
      
      <Card title="Recent Activity">
        <div className="space-y-3 p-4">
          <div className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
            <div className="flex">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md mr-3">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Campaign Created</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">New marketing campaign "Summer Special" has been created</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
            <div className="flex">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-md mr-3">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Task Completed</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">You've completed the "Update profile" task</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
            <div className="flex">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md mr-3">
                <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">New Message</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">You received a new message from support team</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
  
  return (
    <StandardDashboard
      statsSection={statsSection}
      sidebarContent={sidebarContent}
    >
      {mainContent}
    </StandardDashboard>
  );
} 