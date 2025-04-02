'use client';

import React, { useState } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import Image from 'next/image';
import Card from '@/components/ui/data-display/Card';
import StandardDashboard from '@/components/shared/StandardDashboard';

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

export default function DeaconsPizzaView() {
  const { userProfile, theme } = useDemo();
  const [selectedTab, setSelectedTab] = useState('campaigns');
  
  // Stats data
  const statsData = {
    activeCampaigns: {
      value: 8,
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
      <Card className="relative overflow-hidden p-4">
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
              {statsData.activeCampaigns.increased ? '↑' : '↓'} {statsData.activeCampaigns.change}% vs last month
            </span>
          </div>
        </div>
      </Card>
      
      <Card className="relative overflow-hidden p-4">
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-600">Total Merchants</p>
          <p className="text-3xl font-bold mt-1">{statsData.totalMerchants.value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-xs ${statsData.totalMerchants.increased ? 'text-green-500' : 'text-red-500'}`}>
              {statsData.totalMerchants.increased ? '↑' : '↓'} {statsData.totalMerchants.change}% vs last month
            </span>
          </div>
        </div>
      </Card>
      
      <Card className="relative overflow-hidden p-4">
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-600">Monthly Revenue</p>
          <p className="text-3xl font-bold mt-1">${statsData.monthlyRevenue.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            <span className={`text-xs ${statsData.monthlyRevenue.increased ? 'text-green-500' : 'text-red-500'}`}>
              {statsData.monthlyRevenue.increased ? '↑' : '↓'} {statsData.monthlyRevenue.change}% vs last month
            </span>
          </div>
        </div>
      </Card>
      
      <Card className="relative overflow-hidden p-4">
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-600">Engagement Rate</p>
          <p className="text-3xl font-bold mt-1">{statsData.engagementRate.value}%</p>
          <div className="flex items-center mt-2">
            <span className={`text-xs ${statsData.engagementRate.increased ? 'text-green-500' : 'text-red-500'}`}>
              {statsData.engagementRate.increased ? '↑' : '↓'} {statsData.engagementRate.change}% vs last month
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
  
  // Custom header content with logo, search, and new campaign button
  const headerContent = (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-blue-700">
          Dashboard
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search campaigns, products..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64" 
          />
          <div className="absolute left-3 top-2.5">
            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Campaign
        </button>
      </div>
    </div>
  );
  
  // Main content 
  const mainContent = (
    <div className="space-y-4">
      {revenueAnalyticsSection}
    </div>
  );
  
  return (
    <StandardDashboard
      headerContent={headerContent}
      statsSection={statsSection}
    >
      {mainContent}
    </StandardDashboard>
  );
} 