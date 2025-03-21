'use client';

import React from 'react';
import { useDemo } from '@/contexts/DemoContext';
import UserGreeting from './UserGreeting';
import { getPersonalizedSuggestions } from '@/lib/userProfileUtils';

const PersonalizedDashboard: React.FC = () => {
  const { userProfile, clientId, role } = useDemo();
  const personalizedSuggestions = getPersonalizedSuggestions(userProfile);

  // Dynamically determine content based on user role and client
  const getRoleSpecificContent = () => {
    if (role === 'merchant') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Recent Performance</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your loyalty program is showing strong engagement this week.
            </p>
            <div className="mt-4 flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Customer Visits</span>
                <p className="text-2xl font-bold text-primary">127</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Redemption Rate</span>
                <p className="text-2xl font-bold text-green-500">24%</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">New Sign-ups</span>
                <p className="text-2xl font-bold text-blue-500">18</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Top Customers</h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>Emily Johnson</span>
                <span className="font-semibold">12 visits</span>
              </li>
              <li className="flex justify-between">
                <span>Michael Chen</span>
                <span className="font-semibold">9 visits</span>
              </li>
              <li className="flex justify-between">
                <span>Sarah Rodriguez</span>
                <span className="font-semibold">8 visits</span>
              </li>
            </ul>
            <button className="mt-4 text-primary hover:text-primary-dark text-sm">
              View all customers →
            </button>
          </div>
        </div>
      );
    }
    
    if (role === 'support') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Support Queue</h3>
            <div className="mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Open Tickets</span>
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold text-primary">7</p>
                <span className="text-green-500 text-sm">-3 from yesterday</span>
              </div>
            </div>
            <button className="mt-2 px-4 py-2 bg-primary text-white rounded-lg">
              View Queue
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Recent Interactions</h3>
            <ul className="space-y-3">
              <li className="pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium">Deacon's Pizza - Token Issue</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Resolved 1h ago</p>
              </li>
              <li className="pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium">CVS #372 - Campaign Setup</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">In progress</p>
              </li>
            </ul>
          </div>
        </div>
      );
    }
    
    if (role === 'admin') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Platform Health</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span>API Response Time</span>
                <span className="font-semibold text-green-500">94ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Database Load</span>
                <span className="font-semibold text-green-500">32%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Error Rate (24h)</span>
                <span className="font-semibold text-green-500">0.03%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Merchant Onboarding</h3>
            <div className="mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">New Merchants (This Week)</span>
              <p className="text-2xl font-bold text-primary">14</p>
            </div>
            <div className="mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</span>
              <p className="text-2xl font-bold text-amber-500">3</p>
            </div>
            <button className="mt-2 px-4 py-2 bg-primary text-white rounded-lg">
              Review Queue
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="personalized-dashboard p-6">
      {/* User Greeting Section */}
      <UserGreeting showRole={true} showWelcomeMessage={true} className="mb-6" />
      
      {/* Personalized Suggestions */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Suggested for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {personalizedSuggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>
      
      {/* Role-specific Content */}
      {getRoleSpecificContent()}
      
      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            New Campaign
          </button>
          <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
            Analytics
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedDashboard; 