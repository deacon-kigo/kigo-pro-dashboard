'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/atoms/Card/Card';
import Progress from '@/components/atoms/Progress';
import { AIAssistantCard } from '@/components/molecules/cards';
import { 
  ChevronRightIcon, 
  PlusIcon,
  ChartBarIcon,
  DocumentTextIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ReceiptPercentIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
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
import { useDemoActions } from '@/lib/redux/hooks';

// Add custom CSS for patterns and styling
const headerStyles = `
  .bg-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-size: 120px 120px;
  }
`;

// Create a client component that uses useSearchParams
function DeaconsPizzaDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setClientId } = useDemoActions();
  const [greeting, setGreeting] = useState('Good morning');
  const [newCampaignAdded, setNewCampaignAdded] = useState(false);
  
  // Add initialization ref to ensure the effect only runs exactly once
  const isInitializedRef = useRef(false);

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
  
  // Store fromParam in a ref to avoid dependency on searchParams
  const fromParamRef = useRef(searchParams.get('from'));

  // Improved useEffect with strict one-time execution
  useEffect(() => {
    // Check if we've already initialized to prevent any possibility of re-execution
    if (isInitializedRef.current) {
      console.log("DeaconsPizzaDashboard: Skipping repeated initialization");
      return;
    }
    
    // Mark as initialized immediately to prevent any potential race conditions
    isInitializedRef.current = true;
    
    console.log("DeaconsPizzaDashboard: Initializing once with clientId=deacons");
    
    // Set client ID for the demo only once
    setClientId('deacons');
    
    // Set greeting based on time of day
    setGreeting(getGreeting());

    // Get the parameter only once
    const fromCampaignLaunch = fromParamRef.current === 'campaign-launch';
    
    if (fromCampaignLaunch) {
      setNewCampaignAdded(true);
      
      // Clear the flag after 5 seconds
      const timer = setTimeout(() => {
        setNewCampaignAdded(false);
      }, 5000);
      
      // Clean up timer to prevent memory leaks
      return () => clearTimeout(timer);
    }
    
    // Empty dependency array with initialization guard ensures this runs exactly once
  }, []);

  // Memoize sample data to prevent unnecessary recreations
  const campaignData = useMemo(() => {
    const campaigns = [
      { name: 'Family Friday', status: 'Active', audience: 'Families', budget: 1500, spend: 950, roi: 3.2 },
      { name: 'Student Specials', status: 'Scheduled', audience: 'College Students', budget: 1200, spend: 0, roi: 0 },
      { name: 'Game Day Bundle', status: 'Active', audience: 'Sports Fans', budget: 2000, spend: 1200, roi: 2.8 },
      { name: 'Wing Wednesday', status: 'Paused', audience: 'Young Adults', budget: 800, spend: 600, roi: 1.9 }
    ];
    
    // Add the new campaign if we just launched it
    if (newCampaignAdded) {
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
  }, [newCampaignAdded]); // Only depend on newCampaignAdded, not searchParams

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

  // Memoize AI Assistant actions
  const aiAssistantActions = useMemo(() => [
    {
      icon: <ChartBarIcon className="w-5 h-5" />,
      title: "Analyze morning campaign performance",
      href: "/demos/ai-campaign-creation"
    },
    {
      icon: <DocumentTextIcon className="w-5 h-5" />,
      title: "Run performance report",
      href: "/demos/ai-campaign-creation"
    }
  ], []);

  return (
    <div className="p-6 pb-20 space-y-6 bg-blue-50">
      {/* Include the CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />
      
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-md overflow-hidden relative">
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
                <h2 className="text-2xl font-bold mb-1">{greeting}, Deacon!</h2>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm font-medium opacity-90">Today's Sales</p>
              <h3 className="text-2xl font-bold">$4,285</h3>
              <p className="text-sm flex items-center mt-1">
                <span className="inline-block bg-green-400 rounded-full w-2 h-2 mr-1"></span>
                <span>+12% from yesterday</span>
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm font-medium opacity-90">Orders Today</p>
              <h3 className="text-2xl font-bold">108</h3>
              <p className="text-sm flex items-center mt-1">
                <span className="inline-block bg-green-400 rounded-full w-2 h-2 mr-1"></span>
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
          
          {newCampaignAdded && (
            <div className="bg-green-400/30 backdrop-blur-sm rounded-lg p-4 mt-4 border border-green-300/50 animate-pulse">
              <p className="font-medium">🎉 Congratulations! Your new "Family Weekday Special" campaign has been launched successfully!</p>
            </div>
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card variant="elevated" className="overflow-visible bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-4 rounded-lg mr-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
                  <h2 className="text-2xl font-bold">$86,400</h2>
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 mr-1">+5.2%</span>
                    <span className="text-gray-500">vs last month</span>
                  </div>
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="overflow-visible bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-4 rounded-lg mr-3">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <ShoppingBagIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Orders</h3>
                  <h2 className="text-2xl font-bold">2,450</h2>
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 mr-1">+3.8%</span>
                    <span className="text-gray-500">vs last month</span>
                  </div>
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="overflow-visible bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-4 rounded-lg mr-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <ReceiptPercentIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Avg. Order Value</h3>
                  <h2 className="text-2xl font-bold">$35.28</h2>
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 mr-1">+1.4%</span>
                    <span className="text-gray-500">vs last month</span>
                  </div>
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="overflow-visible bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-4 rounded-lg mr-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <UserGroupIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer Retention</h3>
                  <h2 className="text-2xl font-bold">78%</h2>
                  <div className="flex items-center text-sm">
                    <span className="text-red-600 mr-1">-2.1%</span>
                    <span className="text-gray-500">vs last month</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Revenue Overview Chart */}
          <Card title="Revenue Overview" variant="elevated" className="overflow-visible bg-white shadow-sm">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">$35.2k</h3>
                <div className="flex items-center text-sm">
                  <span className="text-red-600 mr-1">-33.2%</span>
                  <span className="text-gray-500">vs previous period</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-md shadow-sm">1M</button>
                <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">3M</button>
                <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">6M</button>
                <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">1Y</button>
                <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">All</button>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekdayData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
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
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3b82f6" 
                    fillOpacity={1}
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Active Campaigns */}
          <Card 
            title="Active Campaigns" 
            variant="elevated" 
            className="bg-white shadow-sm"
            cardIcon={<CalendarIcon className="w-5 h-5 text-blue-600" />} 
            headerContent={
              <Link href="/demos/ai-campaign-creation" className="text-blue-600 text-sm font-medium flex items-center">
                View All <ChevronRightIcon className="w-4 h-4 ml-1" />
              </Link>
            }
          >
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
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* AI Assistant Card - Custom styling to match the screenshot */}
          <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 rounded-xl border border-blue-200 shadow-md p-5">
            <div className="flex">
              <div className="mr-4 bg-blue-500/20 rounded-lg p-2 shadow-sm">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Hey Deacon, I'm your AI Assistant</h3>
                <p className="text-sm text-blue-700/80 mt-1">Personalized insights for your campaigns</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Link 
                href="/demos/ai-campaign-creation"
                className="flex items-center p-3 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors group shadow-sm"
              >
                <div className="text-blue-600 mr-3">
                  <ChartBarIcon className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-700 font-medium flex-grow">
                  Analyze morning campaign performance
                </span>
                <ChevronRightIcon className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
              </Link>
              
              <Link 
                href="/demos/ai-campaign-creation"
                className="flex items-center p-3 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors group shadow-sm"
              >
                <div className="text-blue-600 mr-3">
                  <DocumentTextIcon className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-700 font-medium flex-grow">
                  Run performance report
                </span>
                <ChevronRightIcon className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Top Performing Items */}
          <Card 
            title="Top Performing Menu Items" 
            variant="elevated" 
            className="bg-white shadow-sm"
            cardIcon={<ChartBarIcon className="w-5 h-5 text-blue-600" />}
          >
            <div className="mb-4 text-sm text-gray-600">Best selling items this month</div>
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

          {/* Your Favorites */}
          <Card 
            title="Your Favorites" 
            variant="elevated" 
            className="bg-white shadow-sm"
            cardIcon={<PlusIcon className="w-5 h-5 text-amber-500" />}
          >
            <div className="space-y-3 mt-2">
              <Link 
                href="/demos/ai-campaign-creation"
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors shadow-sm"
              >
                <div className="flex items-center justify-center bg-blue-100 text-blue-600 w-8 h-8 rounded-lg mr-3">
                  <ChartBarIcon className="w-5 h-5" />
                </div>
                <span className="text-gray-700 font-medium">Campaign Analytics</span>
              </Link>
              
              <Link 
                href="/demos/ai-campaign-creation"
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors shadow-sm"
              >
                <div className="flex items-center justify-center bg-green-100 text-green-600 w-8 h-8 rounded-lg mr-3">
                  <RocketLaunchIcon className="w-5 h-5" />
                </div>
                <span className="text-gray-700 font-medium">Create Campaign</span>
              </Link>
            </div>
          </Card>

          {/* Recent Searches */}
          <Card 
            title="Recent Searches" 
            variant="elevated" 
            className="bg-white shadow-sm"
            cardIcon={<PlusIcon className="w-5 h-5 text-gray-500 rotate-45" />}
          >
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg cursor-pointer transition-colors shadow-sm">
                Summer campaign
              </span>
              <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg cursor-pointer transition-colors shadow-sm">
                ROI analysis
              </span>
              <span className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg cursor-pointer transition-colors shadow-sm">
                Weekend promotions
              </span>
            </div>
          </Card>

          {/* Marketing Opportunities */}
          <Card 
            title="Marketing Opportunities" 
            variant="elevated"
            className="bg-white shadow-sm"
            cardIcon={<RocketLaunchIcon className="w-5 h-5 text-purple-600" />}
          >
            <div className="mb-2 text-sm text-gray-600">AI-detected opportunities to boost sales</div>
            <div className="space-y-4">
              {marketingOpportunities.map((opportunity, i) => (
                <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-lg shadow-sm">
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
      </div>
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