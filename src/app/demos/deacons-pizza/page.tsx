'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '../../../components/shared/Card';
import { ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import {
  AreaChart,
  BarChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useDemo } from '../../../contexts/DemoContext';

// Create a client component that uses useSearchParams
function DeaconsPizzaDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setClientId } = useDemo();
  const [greeting, setGreeting] = useState('Good morning');
  const [newCampaignAdded, setNewCampaignAdded] = useState(false);

  // Use useCallback for getGreeting function to avoid recreating it on every render
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }, []);

  // Improved useEffect with stable dependency array
  useEffect(() => {
    // Set client ID for the demo only once
    setClientId('deacons');
    
    // Set greeting based on time of day
    setGreeting(getGreeting());

    // Check if we're coming from campaign launch
    const fromCampaignLaunch = searchParams.get('from') === 'campaign-launch';
    if (fromCampaignLaunch) {
      setNewCampaignAdded(true);
      
      // Clear the flag after 5 seconds
      setTimeout(() => {
        setNewCampaignAdded(false);
      }, 5000);
    }
    
  }, [getGreeting, searchParams, setClientId]);

  // Memoize sample data to prevent unnecessary recreations on each render
  const campaignData = useMemo(() => {
    const campaigns = [
      { name: 'Family Friday', status: 'Active', audience: 'Families', budget: 1500, spend: 950, roi: 3.2 },
      { name: 'Student Specials', status: 'Scheduled', audience: 'College Students', budget: 1200, spend: 0, roi: 0 },
      { name: 'Game Day Bundle', status: 'Active', audience: 'Sports Fans', budget: 2000, spend: 1200, roi: 2.8 },
      { name: 'Wing Wednesday', status: 'Paused', audience: 'Young Adults', budget: 800, spend: 600, roi: 1.9 }
    ];
    
    // Add the new campaign if we just launched it
    if (newCampaignAdded || searchParams.get('from') === 'campaign-launch') {
      campaigns.unshift({ 
        name: 'Family Weekday Special', 
        status: 'Active', 
        audience: 'Families within 5 miles', 
        budget: 750, 
        spend: 0, 
        roi: 0 
      });
    }
    
    return campaigns;
  }, [newCampaignAdded, searchParams]);

  const weekdayData = useMemo(() => [
    { name: 'Mon', sales: 7200, orders: 210 },
    { name: 'Tue', sales: 6800, orders: 195 },
    { name: 'Wed', sales: 7500, orders: 225 },
    { name: 'Thu', sales: 8200, orders: 240 },
    { name: 'Fri', sales: 12500, orders: 320 },
    { name: 'Sat', sales: 14800, orders: 380 },
    { name: 'Sun', sales: 13200, orders: 345 }
  ], []);

  const topPerformingItems = useMemo(() => [
    { name: 'Classic Pepperoni', sales: 12800, change: 8.5 },
    { name: 'Buffalo Wings', sales: 9500, change: 12.3 },
    { name: 'Four Cheese', sales: 8300, change: 4.2 },
    { name: 'Meat Lovers', sales: 7800, change: -1.5 },
    { name: 'Hawaiian', sales: 6900, change: 5.8 }
  ], []);

  const marketingOpportunities = useMemo(() => [
    {
      title: 'Boost Weekday Dinner Sales',
      description: 'Customer data shows potential to increase Tuesday-Thursday dinner orders with targeted promotions.',
      impact: 'High',
      difficulty: 'Medium'
    },
    {
      title: 'Re-engage Lapsed Customers',
      description: 'Over 500 customers haven\'t ordered in 60+ days. A win-back campaign could recover this segment.',
      impact: 'Medium',
      difficulty: 'Low'
    },
    {
      title: 'Loyalty Program Promotion',
      description: 'Only 25% of regular customers are enrolled in the loyalty program. Increase enrollment with app-exclusive offers.',
      impact: 'High',
      difficulty: 'Low'
    }
  ], []);

  // Memoize the tickFormatter function to prevent recreation on each render
  const currencyTickFormatter = useCallback((value: number) => `$${value / 1000}k`, []);

  // Memoize the tooltip formatter to prevent recreation on each render
  const tooltipFormatter = useCallback((value: any) => [`$${value.toLocaleString()}`, 'Sales'], []);

  return (
    <div className="p-6 pb-20 space-y-6">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{greeting}, Deacon!</h2>
        <p className="opacity-90 mb-4">Welcome to your personalized Deacon's Pizza dashboard.</p>
        
        {newCampaignAdded && (
          <div className="bg-green-400/30 backdrop-blur-sm rounded-lg p-4 mb-4 border border-green-300/50 animate-pulse">
            <p className="font-medium">🎉 Congratulations! Your new "Family Weekday Special" campaign has been launched successfully!</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm font-medium opacity-90">Today's Sales</p>
            <h3 className="text-2xl font-bold">$4,285</h3>
            <p className="text-sm flex items-center mt-1">
              <span className="inline-block bg-green-500 rounded-full w-2 h-2 mr-1"></span>
              <span>+12% from yesterday</span>
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm font-medium opacity-90">Orders Today</p>
            <h3 className="text-2xl font-bold">108</h3>
            <p className="text-sm flex items-center mt-1">
              <span className="inline-block bg-green-500 rounded-full w-2 h-2 mr-1"></span>
              <span>+8% from yesterday</span>
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm font-medium opacity-90">Active Campaigns</p>
            <h3 className="text-2xl font-bold">{newCampaignAdded ? "3" : "2"}</h3>
            <p className="text-sm flex items-center mt-1">
              <span className="inline-block bg-blue-300 rounded-full w-2 h-2 mr-1"></span>
              <span>1 scheduled for next week</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
          </div>
          <div>
            <h2 className="text-2xl font-bold">$86,400</h2>
            <div className="flex items-center text-sm">
              <span className="text-green-600 mr-1">+5.2%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        </Card>
        <Card>
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-500">Orders</h3>
          </div>
          <div>
            <h2 className="text-2xl font-bold">2,450</h2>
            <div className="flex items-center text-sm">
              <span className="text-green-600 mr-1">+3.8%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        </Card>
        <Card>
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-500">Avg. Order Value</h3>
          </div>
          <div>
            <h2 className="text-2xl font-bold">$35.28</h2>
            <div className="flex items-center text-sm">
              <span className="text-green-600 mr-1">+1.4%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        </Card>
        <Card>
          <div className="pb-2">
            <h3 className="text-sm font-medium text-gray-500">Customer Retention</h3>
          </div>
          <div>
            <h2 className="text-2xl font-bold">78%</h2>
            <div className="flex items-center text-sm">
              <span className="text-red-600 mr-1">-2.1%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card title="Active Marketing Campaigns">
        <div className="mb-2 text-sm text-gray-600">Overview of your current marketing efforts</div>
        <div className="space-y-3">
          {campaignData.map((campaign, i) => (
            <div 
              key={i} 
              className={`p-3 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors ${
                newCampaignAdded && i === 0 ? 
                'border-green-500 bg-green-50 animate-pulse' : 
                'border-gray-200'
              }`}
            >
              <div className="flex-grow mr-4">
                <h4 className="font-medium">{campaign.name}</h4>
                <p className="text-sm text-gray-500">Target: {campaign.audience}</p>
              </div>
              <div className="hidden md:grid grid-cols-4 gap-6 items-center">
                <div className="w-24 text-right">
                  <div className="text-sm text-gray-500 mb-1">Budget</div>
                  <div className="font-medium">${campaign.budget.toLocaleString()}</div>
                </div>
                <div className="w-24 text-right">
                  <div className="text-sm text-gray-500 mb-1">Spend</div>
                  <div className="font-medium">${campaign.spend.toLocaleString()}</div>
                </div>
                <div className="w-16 text-right">
                  <div className="text-sm text-gray-500 mb-1">ROI</div>
                  <div className="font-medium">{campaign.roi}x</div>
                </div>
                <div className="flex justify-end">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium min-w-[80px] text-center ${
                    campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Sales Performance by Day of Week">
          <div className="text-sm text-gray-600 mb-4">Comparing sales across different days</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  tickFormatter={currencyTickFormatter}
                />
                <Tooltip
                  formatter={tooltipFormatter}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#2563EB" 
                  radius={[4, 4, 0, 0]}
                  barSize={30} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Key Insight:</span> Weekday dinner sales (Tue-Thu) 
              show the highest growth potential. Consider targeted weeknight promotions.
            </p>
          </div>
        </Card>

        <Card title="Top Performing Menu Items">
          <div className="mb-2 text-sm text-gray-600">Best selling items this month</div>
          <div className="space-y-4">
            {topPerformingItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">${item.sales.toLocaleString()} in sales</p>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  item.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.change > 0 ? '+' : ''}{item.change}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Marketing Opportunities */}
      <Card title="Marketing Opportunities">
        <div className="mb-2 text-sm text-gray-600">AI-detected opportunities to boost sales</div>
        <div className="space-y-4">
          {marketingOpportunities.map((opportunity, i) => (
            <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-lg">
              <h4 className="text-lg font-medium mb-1">{opportunity.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
              <div className="flex space-x-3">
                <span className={`text-xs font-medium text-white px-2 py-1 rounded ${
                  opportunity.impact === 'High' ? 'bg-green-500' :
                  opportunity.impact === 'Medium' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`}>
                  Impact: {opportunity.impact}
                </span>
                <span className={`text-xs font-medium text-white px-2 py-1 rounded ${
                  opportunity.difficulty === 'Low' ? 'bg-green-500' :
                  opportunity.difficulty === 'Medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}>
                  Difficulty: {opportunity.difficulty}
                </span>
                <Link href="/demos/ai-campaign-creation" className="ml-auto text-sm text-blue-600 flex items-center">
                  Create campaign <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Create a loading fallback
function DeaconsPizzaLoading() {
  return <div className="p-6 text-center">Loading dashboard...</div>;
}

// Main component that wraps the content in Suspense
export default function DeaconsPizzaDashboard() {
  return (
    <Suspense fallback={<DeaconsPizzaLoading />}>
      <DeaconsPizzaDashboardContent />
    </Suspense>
  );
} 