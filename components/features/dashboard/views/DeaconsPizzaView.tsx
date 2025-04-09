'use client';

import React, { useState, useMemo } from 'react';
import { useDemoState } from '@/lib/redux/hooks';
import { convertMockUserToUserProfile } from '@/lib/userProfileUtils';
import Image from 'next/image';
import Card from '@/components/atoms/Card/Card';
import StandardDashboard from '@/components/templates/StandardDashboard';

// Custom CSS for banner pattern
const headerStyles = `
  .bg-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-size: 120px 120px;
  }
`;

// Sample campaign data
const sampleCampaigns = [
  {
    id: 'camp-001',
    name: 'Summer Special Discount',
    status: 'Active',
    type: 'Email + SMS',
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    budget: 5000,
    spent: 2245,
    customers: 12500,
    engagement: 32,
    roi: 3.2,
  },
  {
    id: 'camp-002',
    name: 'New Pepperoni Supreme Launch',
    status: 'Draft',
    type: 'Social Media',
    startDate: '2023-07-15',
    endDate: '2023-09-15',
    budget: 7500,
    spent: 0,
    customers: 0,
    engagement: 0,
    roi: 0,
  },
  {
    id: 'camp-003',
    name: 'Loyalty Program Rewards',
    status: 'Active',
    type: 'Push Notification',
    startDate: '2023-05-10',
    endDate: '2023-12-31',
    budget: 3000,
    spent: 1200,
    customers: 8750,
    engagement: 45,
    roi: 4.5,
  },
  {
    id: 'camp-004',
    name: 'Weekend Happy Hour Promo',
    status: 'Scheduled',
    type: 'Email',
    startDate: '2023-07-01',
    endDate: '2023-07-31',
    budget: 2500,
    spent: 0,
    customers: 0,
    engagement: 0,
    roi: 0,
  },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch(status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
}

// Format currency
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage
function formatPercentage(value: number) {
  return `${value}%`;
}

// Format number with commas
function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

// Format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Function component interface
interface DeaconsPizzaViewProps {
  newCampaignAdded?: boolean;
}

export default function DeaconsPizzaView({ newCampaignAdded = false }: DeaconsPizzaViewProps) {
  const demoState = useDemoState();
  const mockUserProfile = demoState.userProfile;
  const userProfile = useMemo(() => 
    mockUserProfile ? convertMockUserToUserProfile(mockUserProfile) : undefined
  , [mockUserProfile]);
  const { theme } = demoState;
  
  const [selectedTab, setSelectedTab] = useState('campaigns');
  
  // Stats data
  const statsData = {
    activeCampaigns: {
      value: newCampaignAdded ? 9 : 8,
      change: 12.5,
      increased: true
    },
    totalMerchants: {
      value: 24,
      change: 8.3,
      increased: true
    },
    monthlyRevenue: {
      value: 42589,
      change: 3.2,
      increased: false
    },
    engagementRate: {
      value: 18.7,
      change: 5.9,
      increased: true
    }
  };

  // Create stats section for StandardDashboard
  const statsSection = (
    <>
      <Card className="relative overflow-hidden p-4 bg-white">
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-600">Active Campaigns</p>
          <p className="text-3xl font-bold mt-1">{statsData.activeCampaigns.value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-xs ${statsData.activeCampaigns.increased ? 'text-green-500' : 'text-red-500'}`}>
              ↑ {statsData.activeCampaigns.change}% vs last month
            </span>
          </div>
        </div>
      </Card>
      
      <Card className="relative overflow-hidden p-4 bg-white">
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-600">Total Merchants</p>
          <p className="text-3xl font-bold mt-1">{statsData.totalMerchants.value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-xs ${statsData.totalMerchants.increased ? 'text-green-500' : 'text-red-500'}`}>
              ↑ {statsData.totalMerchants.change}% vs last month
            </span>
          </div>
        </div>
      </Card>
      
      <Card className="relative overflow-hidden p-4 bg-white">
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-600">Monthly Revenue</p>
          <p className="text-3xl font-bold mt-1">${formatNumber(statsData.monthlyRevenue.value)}</p>
          <div className="flex items-center mt-2">
            <span className={`text-xs ${statsData.monthlyRevenue.increased ? 'text-green-500' : 'text-red-500'}`}>
              ↓ {statsData.monthlyRevenue.change}% vs last month
            </span>
          </div>
        </div>
      </Card>
      
      <Card className="relative overflow-hidden p-4 bg-white">
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-600">Engagement Rate</p>
          <p className="text-3xl font-bold mt-1">{statsData.engagementRate.value}%</p>
          <div className="flex items-center mt-2">
            <span className={`text-xs ${statsData.engagementRate.increased ? 'text-green-500' : 'text-red-500'}`}>
              ↑ {statsData.engagementRate.change}% vs last month
            </span>
          </div>
        </div>
      </Card>
    </>
  );
  
  // Revenue Analytics section
  const revenueAnalyticsSection = (
    <Card className="mt-6">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="font-semibold">Revenue Analytics</h3>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Daily</button>
          <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Weekly</button>
          <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">Monthly</button>
          <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Quarterly</button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <button className="px-2 py-1 text-sm text-blue-600 font-medium border-b-2 border-blue-600">Revenue</button>
          <button className="px-2 py-1 text-sm text-gray-500">Expenses</button>
          <button className="px-2 py-1 text-sm text-gray-500">Profit</button>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium">Revenue Overview</h3>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">$35.2k</h2>
            <span className="ml-2 text-xs text-red-500">↓ 33.2% vs previous period</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">[Revenue Chart Placeholder]</p>
          </div>
          
          <div className="flex items-center justify-center mt-4 gap-6">
            <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">1M</button>
            <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">3M</button>
            <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">6M</button>
            <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">1Y</button>
            <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">All</button>
            <span className="h-4 border-r border-gray-300"></span>
            <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Area</button>
            <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Line</button>
            <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Bar</button>
          </div>
          
          <div className="flex items-center justify-center mt-6 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-gray-300 rounded-full"></span>
              <span>Last Period</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-green-500 rounded-full"></span>
              <span>Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-purple-500 rounded-full"></span>
              <span>Profit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-blue-500 rounded-full"></span>
              <span>Revenue</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
  
  // Main content 
  const mainContent = (
    <div className="space-y-4">
      {revenueAnalyticsSection}
    </div>
  );
  
  // Main render
  return (
    <div className="bg-blue-50 p-6 pb-20 space-y-6">
      {/* Include the CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />
      
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-md overflow-hidden relative mb-6">
        {/* Add overlay pattern for texture */}
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex items-start">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5 mr-4">
                <Image 
                  src="/images/deacons-pizza-logo.png" 
                  alt="Deacon's Pizza" 
                  width={48} 
                  height={48}
                  className="rounded"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Good morning, Jane!</h2>
                <p className="opacity-90 text-sm">Friday, March 14 • Campaign Manager</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-4 min-w-[250px]">
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-medium text-white">Weekly Progress</span>
                <span className="text-sm font-medium text-white">67%</span>
              </div>
              <div className="h-2.5 w-full bg-blue-600/30 rounded-full">
                <div className="h-2.5 rounded-full bg-white" style={{ width: '67%' }}></div>
              </div>
              <div className="mt-2 flex justify-between text-sm text-white/90">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-1.5"></span>
                  <span>Complete: 12</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-white/60 mr-1.5"></span>
                  <span>Total: 18</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsSection}
      </div>
      
      {/* Main Dashboard Content */}
      {mainContent}
    </div>
  );
} 