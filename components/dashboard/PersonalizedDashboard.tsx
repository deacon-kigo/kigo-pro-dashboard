'use client';

import React from 'react';
import { useDemo } from '@/contexts/DemoContext';
import UserGreeting from './UserGreeting';
import { getPersonalizedSuggestions } from '@/lib/userProfileUtils';

const PersonalizedDashboard: React.FC = () => {
  const { userProfile, clientId, role, theme } = useDemo();
  const personalizedSuggestions = getPersonalizedSuggestions(userProfile);

  // Get client-specific metrics
  const getClientMetrics = () => {
    if (clientId === 'deacons-pizza') {
      return {
        primary: { label: 'Offer Redemptions', value: '127', change: '+12%' },
        secondary: { label: 'Redemption Rate', value: '24%', change: '+5%' },
        tertiary: { label: 'New Sign-ups', value: '18', change: '+3' }
      };
    } else if (clientId === 'cvs') {
      return {
        primary: { label: 'Prescription Refills', value: '1,453', change: '+8%' },
        secondary: { label: 'Health Service Visits', value: '532', change: '+15%' },
        tertiary: { label: 'Loyalty Members', value: '4,287', change: '+124' }
      };
    } else {
      return {
        primary: { label: 'Transactions', value: '384', change: '+7%' },
        secondary: { label: 'Avg. Order Value', value: '$42.50', change: '+3%' },
        tertiary: { label: 'Customer Retention', value: '76%', change: '+2%' }
      };
    }
  };

  // Get client-specific customers/data
  const getTopCustomers = () => {
    if (clientId === 'deacons-pizza') {
      return [
        { name: 'Emily Johnson', value: '12 visits' },
        { name: 'Michael Chen', value: '9 visits' },
        { name: 'Sarah Rodriguez', value: '8 visits' }
      ];
    } else if (clientId === 'cvs') {
      return [
        { name: 'Downtown Location', value: '320 redemptions' },
        { name: 'Westside Mall', value: '287 redemptions' },
        { name: 'North Avenue', value: '243 redemptions' }
      ];
    } else {
      return [
        { name: 'John Smith', value: '15 purchases' },
        { name: 'Lisa Wong', value: '12 purchases' },
        { name: 'Robert Miller', value: '10 purchases' }
      ];
    }
  };

  // Dynamically determine content based on user role and client
  const getRoleSpecificContent = () => {
    const metrics = getClientMetrics();
    const topItems = getTopCustomers();
    
    if (role === 'merchant') {
      const title = clientId === 'cvs' ? 'Location Performance' : 'Recent Performance';
      const subtitle = clientId === 'deacons-pizza' 
        ? 'Your loyalty program is showing strong engagement this week.'
        : clientId === 'cvs'
          ? 'Multi-location campaign performance metrics across your region.'
          : 'Your marketing campaigns are performing well this month.';
      
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{metrics.primary.label}</span>
                <div className="flex items-end">
                  <p className="text-2xl font-bold text-primary">{metrics.primary.value}</p>
                  <span className="ml-1 text-xs text-green-500">{metrics.primary.change}</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{metrics.secondary.label}</span>
                <div className="flex items-end">
                  <p className="text-2xl font-bold text-green-500">{metrics.secondary.value}</p>
                  <span className="ml-1 text-xs text-green-500">{metrics.secondary.change}</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{metrics.tertiary.label}</span>
                <div className="flex items-end">
                  <p className="text-2xl font-bold text-blue-500">{metrics.tertiary.value}</p>
                  <span className="ml-1 text-xs text-green-500">{metrics.tertiary.change}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-3">
              {clientId === 'cvs' ? 'Top Locations' : 'Top Customers'}
            </h3>
            <ul className="space-y-3">
              {topItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span className="font-semibold">{item.value}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 text-primary hover:text-primary-dark text-sm">
              {clientId === 'cvs' ? 'View all locations →' : 'View all customers →'}
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
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-2">
                <span className="text-xs text-red-600 dark:text-red-400">Urgent</span>
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">2</p>
              </div>
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-2">
                <span className="text-xs text-yellow-600 dark:text-yellow-400">High</span>
                <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">3</p>
              </div>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2">
                <span className="text-xs text-blue-600 dark:text-blue-400">Normal</span>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">2</p>
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
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Resolved 1h ago</p>
                  <span className="text-xs py-1 px-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">Resolved</span>
                </div>
              </li>
              <li className="pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium">CVS #372 - Campaign Setup</p>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">In progress</p>
                  <span className="text-xs py-1 px-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">In Progress</span>
                </div>
              </li>
              <li className="pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium">Generic Store - API Integration</p>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Escalated to Tier 2</p>
                  <span className="text-xs py-1 px-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">Escalated</span>
                </div>
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
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span>Database Load</span>
                <span className="font-semibold text-green-500">32%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '32%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span>Error Rate (24h)</span>
                <span className="font-semibold text-green-500">0.03%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '2%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Merchant Onboarding</h3>
            <div className="mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">New Merchants (This Week)</span>
              <p className="text-2xl font-bold text-primary">14</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3">
                <span className="text-xs text-amber-600 dark:text-amber-400">Pending Approval</span>
                <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">3</p>
              </div>
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
                <span className="text-xs text-green-600 dark:text-green-400">Approved</span>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">11</p>
              </div>
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
      <div 
        className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 mb-6"
        style={{
          backgroundImage: `linear-gradient(to right, ${theme.primaryColor}0d, ${theme.secondaryColor}0d)`
        }}
      >
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
          {role === 'merchant' && (
            <>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                {clientId === 'deacons-pizza' ? 'New Local Campaign' : 'New Regional Campaign'}
              </button>
              <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                View Analytics
              </button>
            </>
          )}
          
          {role === 'support' && (
            <>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                Create Support Ticket
              </button>
              <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                Knowledge Base
              </button>
            </>
          )}
          
          {role === 'admin' && (
            <>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                System Settings
              </button>
              <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                User Management
              </button>
            </>
          )}
          
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedDashboard; 