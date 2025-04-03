/**
 * @view PizzaManagementView
 * @description A view for managing pizza campaigns and sales
 */
'use client';

import React, { useState } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import Image from 'next/image';
import Card from '@/components/atoms/Card/Card';
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

export default function PizzaManagementView() {
  const { userProfile } = useDemo();
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
          <p className="text-3xl font-bold mt-1">${statsData.monthlyRevenue.value.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            <span className={`text-xs ${statsData.monthlyRevenue.increased ? 'text-green-500' : 'text-red-500'}`}>
              {statsData.monthlyRevenue.increased ? '↑' : '↓'} {statsData.monthlyRevenue.change}% vs last month
            </span>
          </div>
        </div>
      </Card>
      
      <Card className="relative overflow-hidden p-4">
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

  // Campaigns table for main content
  const campaignsTable = (
    <Card title="Active Campaigns">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Campaign
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Dates
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Budget
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Engagement
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ROI
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {sampleCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{campaign.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {campaign.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  <div>{formatDate(campaign.startDate)}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">to {formatDate(campaign.endDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">{formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}</div>
                  <div className="mt-1 relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="absolute h-1 bg-blue-600 rounded-full" 
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {campaign.status === 'Draft' || campaign.status === 'Scheduled' ? (
                    <span className="text-gray-400 dark:text-gray-500">--</span>
                  ) : (
                    <>
                      <div>{formatPercentage(campaign.engagement)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{formatNumber(campaign.customers)} customers</div>
                    </>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {campaign.status === 'Draft' || campaign.status === 'Scheduled' ? (
                    <span className="text-gray-400 dark:text-gray-500">--</span>
                  ) : (
                    <span className={campaign.roi >= 3 ? 'text-green-600 dark:text-green-400' : campaign.roi >= 1 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}>
                      {campaign.roi}x
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
  
  // Create new campaign card
  const newCampaignCard = (
    <Card title="Create New Campaign">
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Campaign Name
            </label>
            <input
              type="text"
              id="campaign-name"
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Enter campaign name"
            />
          </div>
          
          <div>
            <label htmlFor="campaign-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Campaign Type
            </label>
            <select
              id="campaign-type"
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
              <option value="social">Social Media</option>
              <option value="multiple">Multiple Channels</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="campaign-budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Budget
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                id="campaign-budget"
                className="pl-7 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Audience
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="audience-all"
                  name="audience"
                  type="radio"
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-700"
                  defaultChecked
                />
                <label htmlFor="audience-all" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  All Customers
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="audience-loyalty"
                  name="audience"
                  type="radio"
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-700"
                />
                <label htmlFor="audience-loyalty" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Loyalty Program Members
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="audience-inactive"
                  name="audience"
                  type="radio"
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-700"
                />
                <label htmlFor="audience-inactive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Inactive Customers (90+ days)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="audience-custom"
                  name="audience"
                  type="radio"
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-700"
                />
                <label htmlFor="audience-custom" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Custom Segment
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-5">
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                className="py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Save Draft
              </button>
              <button 
                type="button" 
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
  
  // Tabs for main content
  const mainContent = (
    <div>
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="-mb-px flex space-x-8">
            <button 
              className={`${
                selectedTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700'
              } py-2 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setSelectedTab('campaigns')}
            >
              Campaigns
            </button>
            <button 
              className={`${
                selectedTab === 'new'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700'
              } py-2 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setSelectedTab('new')}
            >
              Create New
            </button>
          </nav>
        </div>
      </div>
      
      {selectedTab === 'campaigns' ? campaignsTable : newCampaignCard}
    </div>
  );
  
  return (
    <StandardDashboard statsSection={statsSection}>
      {mainContent}
    </StandardDashboard>
  );
} 