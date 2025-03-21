'use client';

import React, { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import TaskCard from '../components/dashboard/TaskCard';
import CampaignCard from '../components/dashboard/CampaignCard';
import AIAssistant from '../components/shared/AIAssistant';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import RevenueChart from '../components/dashboard/charts/RevenueChart';
import CampaignPerformanceChart from '../components/dashboard/charts/CampaignPerformanceChart';
import Link from 'next/link';
import {
  ChartBarIcon,
  TagIcon,
  UserGroupIcon,
  BellAlertIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
  StarIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import {
  RocketLaunchIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  UsersIcon
} from '@heroicons/react/24/solid';

// User data - would come from a database in a real app
const userData = {
  name: 'Jane',
  fullName: 'Jane Doe',
  role: 'Campaign Manager',
  team: 'Marketing',
  recentSearches: ['Summer campaign', 'ROI analysis', 'Weekend promotions'],
  favoritePages: [
    { name: 'Campaign Analytics', path: '/analytics' },
    { name: 'Create Campaign', path: '/campaigns/create' }
  ],
  preferredCharts: ['revenue', 'campaign-performance'],
  tasks: {
    completed: 12,
    total: 18
  }
};

// Mock data - this would come from a server component in a real app
const activeCampaigns = [
  {
    id: '1',
    title: 'Summer Sale Promotion',
    status: 'active',
    merchantName: 'Acme Corporation',
    startDate: 'Jun 1, 2024',
    endDate: 'Aug 31, 2024',
    progress: 65
  },
  {
    id: '2',
    title: 'Back to School Special',
    status: 'scheduled',
    merchantName: 'Widget Co',
    startDate: 'Aug 15, 2024',
    endDate: 'Sep 15, 2024',
    progress: 0
  },
  {
    id: '3',
    title: 'New Customer Welcome',
    status: 'draft',
    merchantName: 'Example LLC',
    progress: 0
  }
];

const tasks = [
  {
    title: 'Approve merchant discount request',
    description: 'Acme Corporation has requested a custom discount rate for their upcoming campaign.',
    icon: <TagIcon className="w-5 h-5 text-indigo-600" />,
    iconBg: 'bg-pastel-purple',
    link: '/tasks/discount-request',
    date: 'Today'
  },
  {
    title: 'Review campaign performance',
    description: 'The "Summer Sale Promotion" campaign has reached 50% completion. Review current performance metrics.',
    icon: <ChartBarIcon className="w-5 h-5 text-green-600" />,
    iconBg: 'bg-pastel-green',
    link: '/campaigns/1',
    date: 'Today'
  },
  {
    title: 'Update merchant onboarding documents',
    description: 'Legal has approved new terms for merchant onboarding. Update templates in the system.',
    icon: <DocumentTextIcon className="w-5 h-5 text-orange-600" />,
    iconBg: 'bg-pastel-orange',
    link: '/tasks/update-documents',
    date: 'Tomorrow'
  }
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [weatherEmoji, setWeatherEmoji] = useState('☀️'); // Default sunny
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'campaigns' | 'audience'>('overview');
  const [revenueChartTab, setRevenueChartTab] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');
  
  const quotes = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The best way to predict the future is to create it.",
    "Your most unhappy customers are your greatest source of learning.",
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "Marketing is no longer about the stuff that you make, but about the stories you tell."
  ];
  
  // Set greeting based on time of day
  useEffect(() => {
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
      
      setGreeting(newGreeting);
      
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
    
    // Get a random motivational quote
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    
    updateTimeAndGreeting();
    const timer = setInterval(updateTimeAndGreeting, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate task completion rate
  const taskCompletionRate = Math.round((userData.tasks.completed / userData.tasks.total) * 100);

  // Data for the tab content
  const mockAudienceData = {
    totalUsers: 15872,
    activeUsers: 8743,
    newUsers: 1254,
    avgSessionDuration: '3m 42s',
    topCountries: [
      { name: 'United States', percent: 45 },
      { name: 'United Kingdom', percent: 15 },
      { name: 'Canada', percent: 12 },
      { name: 'Australia', percent: 8 },
      { name: 'Germany', percent: 5 }
    ]
  };

  return (
    <div className="space-y-4 pt-4 transition-all duration-300 ease-in-out">
      <div className="relative overflow-hidden rounded-xl shadow-sm">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary-light/50 to-pastel-purple/30"></div>
        
        {/* Mesh Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" 
             style={{ 
               backgroundImage: `radial-gradient(circle at 25px 25px, currentColor 2%, transparent 0%), 
                                 radial-gradient(circle at 75px 75px, currentColor 2%, transparent 0%)`,
               backgroundSize: '100px 100px' 
             }}></div>
        
        <div className="relative p-5 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center">
              <span className="text-3xl mr-3">{weatherEmoji}</span>
              <div>
                <h1 className="text-2xl font-bold pb-1 transition-transform duration-300 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 text-transparent bg-clip-text">
                  {greeting}, {userData.name}!
                </h1>
                <p className="text-sm text-text-dark/75">
                  {currentDate} • <span className="text-primary font-medium">{userData.role}</span>
                </p>
                <p className="text-xs mt-1 text-text-muted italic">{motivationalQuote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Campaigns"
          value={8}
          change={12.5}
          icon={<RocketLaunchIcon className="w-6 h-6" />}
          iconBg="bg-pastel-blue"
          iconColor="text-blue-600"
        />
        <StatCard 
          title="Total Merchants"
          value={24}
          change={8.3}
          icon={<UsersIcon className="w-6 h-6" />}
          iconBg="bg-pastel-purple"
          iconColor="text-indigo-600"
        />
        <StatCard 
          title="Monthly Revenue"
          value="$42,589"
          change={-3.2}
          icon={<CurrencyDollarIcon className="w-6 h-6" />}
          iconBg="bg-pastel-green"
          iconColor="text-green-600"
        />
        <StatCard 
          title="Engagement Rate"
          value="18.7%"
          change={5.9}
          icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
          iconBg="bg-pastel-yellow"
          iconColor="text-yellow-600"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart with Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300">
            <div className="border-b border-border-light px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 text-primary mr-2" />
                <h3 className="font-bold text-text-dark">Revenue Analytics</h3>
              </div>
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setRevenueChartTab('daily')}
                  className={`px-3 py-1 text-xs rounded-md transition-all duration-300 ${
                    revenueChartTab === 'daily' 
                      ? 'bg-white shadow-sm text-primary font-medium' 
                      : 'text-text-muted hover:text-text-dark'
                  }`}
                >
                  Daily
                </button>
                <button 
                  onClick={() => setRevenueChartTab('weekly')}
                  className={`px-3 py-1 text-xs rounded-md transition-all duration-300 ${
                    revenueChartTab === 'weekly' 
                      ? 'bg-white shadow-sm text-primary font-medium' 
                      : 'text-text-muted hover:text-text-dark'
                  }`}
                >
                  Weekly
                </button>
                <button 
                  onClick={() => setRevenueChartTab('monthly')}
                  className={`px-3 py-1 text-xs rounded-md transition-all duration-300 ${
                    revenueChartTab === 'monthly' 
                      ? 'bg-white shadow-sm text-primary font-medium' 
                      : 'text-text-muted hover:text-text-dark'
                  }`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setRevenueChartTab('quarterly')}
                  className={`px-3 py-1 text-xs rounded-md transition-all duration-300 ${
                    revenueChartTab === 'quarterly' 
                      ? 'bg-white shadow-sm text-primary font-medium' 
                      : 'text-text-muted hover:text-text-dark'
                  }`}
                >
                  Quarterly
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <div className="flex space-x-4 items-center">
                    <div className="flex space-x-2 items-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-xs text-text-muted">Revenue</span>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <div className="w-3 h-3 bg-pastel-green rounded-full"></div>
                      <span className="text-xs text-text-muted">Expenses</span>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-xs text-text-muted">Profit</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select className="text-xs border border-gray-200 rounded-md py-1 px-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary/30">
                    <option>All Campaigns</option>
                    <option>Summer Sale</option>
                    <option>Back to School</option>
                  </select>
                  <button className="text-xs text-primary hover:bg-primary-light p-1 rounded-full transition-colors">
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <RevenueChart timeRangeTab={revenueChartTab} />

              {/* Dense Data Table */}
              <div className="mt-6 border-t border-border-light pt-4">
                <h4 className="text-sm font-medium mb-3">Revenue Breakdown</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                      <tr className="text-text-muted text-xs">
                        <th className="px-2 py-2 text-left font-medium">Period</th>
                        <th className="px-2 py-2 text-right font-medium">Revenue</th>
                        <th className="px-2 py-2 text-right font-medium">Expenses</th>
                        <th className="px-2 py-2 text-right font-medium">Profit</th>
                        <th className="px-2 py-2 text-right font-medium">Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {revenueChartTab === 'monthly' && (
                        <>
                          <tr>
                            <td className="px-2 py-2 text-left font-medium">July</td>
                            <td className="px-2 py-2 text-right">$38,250</td>
                            <td className="px-2 py-2 text-right">$12,350</td>
                            <td className="px-2 py-2 text-right">$25,900</td>
                            <td className="px-2 py-2 text-right text-green-500">68%</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-left font-medium">August</td>
                            <td className="px-2 py-2 text-right">$42,589</td>
                            <td className="px-2 py-2 text-right">$14,795</td>
                            <td className="px-2 py-2 text-right">$27,794</td>
                            <td className="px-2 py-2 text-right text-green-500">65%</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-left font-medium">September</td>
                            <td className="px-2 py-2 text-right">$47,120</td>
                            <td className="px-2 py-2 text-right">$16,492</td>
                            <td className="px-2 py-2 text-right">$30,628</td>
                            <td className="px-2 py-2 text-right text-green-500">65%</td>
                          </tr>
                        </>
                      )}
                      {revenueChartTab === 'weekly' && (
                        <>
                          <tr>
                            <td className="px-2 py-2 text-left font-medium">Week 1</td>
                            <td className="px-2 py-2 text-right">$10,220</td>
                            <td className="px-2 py-2 text-right">$3,450</td>
                            <td className="px-2 py-2 text-right">$6,770</td>
                            <td className="px-2 py-2 text-right text-green-500">66%</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-left font-medium">Week 2</td>
                            <td className="px-2 py-2 text-right">$11,870</td>
                            <td className="px-2 py-2 text-right">$4,120</td>
                            <td className="px-2 py-2 text-right">$7,750</td>
                            <td className="px-2 py-2 text-right text-green-500">65%</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-left font-medium">Week 3</td>
                            <td className="px-2 py-2 text-right">$9,150</td>
                            <td className="px-2 py-2 text-right">$3,250</td>
                            <td className="px-2 py-2 text-right">$5,900</td>
                            <td className="px-2 py-2 text-right text-green-500">64%</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-left font-medium">Week 4</td>
                            <td className="px-2 py-2 text-right">$11,349</td>
                            <td className="px-2 py-2 text-right">$3,975</td>
                            <td className="px-2 py-2 text-right">$7,374</td>
                            <td className="px-2 py-2 text-right text-green-500">65%</td>
                          </tr>
                        </>
                      )}
                      {revenueChartTab === 'daily' && (
                        Array.from({ length: 5 }).map((_, index) => {
                          const date = new Date();
                          date.setDate(date.getDate() - index);
                          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                          const dayNumber = date.getDate();
                          const formattedDate = `${dayName} ${dayNumber}`;
                          
                          const revenue = Math.floor(1000 + Math.random() * 1000);
                          const expenses = Math.floor(revenue * 0.35);
                          const profit = revenue - expenses;
                          const margin = Math.floor((profit / revenue) * 100);
                          
                          return (
                            <tr key={index}>
                              <td className="px-2 py-2 text-left font-medium">{formattedDate}</td>
                              <td className="px-2 py-2 text-right">${revenue}</td>
                              <td className="px-2 py-2 text-right">${expenses}</td>
                              <td className="px-2 py-2 text-right">${profit}</td>
                              <td className="px-2 py-2 text-right text-green-500">{margin}%</td>
                            </tr>
                          );
                        })
                      )}
                      {revenueChartTab === 'quarterly' && (
                        <>
                          <tr>
                            <td className="px-2 py-2 text-left font-medium">Q1</td>
                            <td className="px-2 py-2 text-right">$125,450</td>
                            <td className="px-2 py-2 text-right">$42,650</td>
                            <td className="px-2 py-2 text-right">$82,800</td>
                            <td className="px-2 py-2 text-right text-green-500">66%</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-left font-medium">Q2</td>
                            <td className="px-2 py-2 text-right">$143,280</td>
                            <td className="px-2 py-2 text-right">$49,750</td>
                            <td className="px-2 py-2 text-right">$93,530</td>
                            <td className="px-2 py-2 text-right text-green-500">65%</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-left font-medium">Q3</td>
                            <td className="px-2 py-2 text-right">$127,959</td>
                            <td className="px-2 py-2 text-right">$43,637</td>
                            <td className="px-2 py-2 text-right">$84,322</td>
                            <td className="px-2 py-2 text-right text-green-500">66%</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              title="Active Campaigns" 
              titleAction={
                <Button 
                  variant="secondary"
                  href="/campaigns/create"
                  icon={<RocketLaunchIcon className="w-4 h-4" />}
                  className="shadow-sm text-sm"
                >
                  New Campaign
                </Button>
              }
            >
              <div className="space-y-4">
                {activeCampaigns.slice(0, 2).map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    id={campaign.id}
                    title={campaign.title}
                    status={campaign.status as any}
                    merchantName={campaign.merchantName}
                    startDate={campaign.startDate}
                    endDate={campaign.endDate}
                    progress={campaign.progress}
                  />
                ))}
              </div>
            </Card>
            
            <CampaignPerformanceChart />
          </div>
        </div>
        
        <div className="space-y-6">
          <AIAssistant />
          
          <Card title="Tasks & Notifications">
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <TaskCard
                  key={index}
                  title={task.title}
                  description={task.description}
                  icon={task.icon}
                  iconBg={task.iconBg}
                  link={task.link}
                  date={task.date}
                />
              ))}
              
              <div className="pt-2 border-t border-border-light">
                <Button 
                  variant="outline"
                  href="/tasks"
                  icon={<ClipboardDocumentCheckIcon className="w-4 h-4" />}
                >
                  View All Tasks
                </Button>
              </div>
            </div>
          </Card>
          
          <Card title="Your Favorites">
            <div className="flex flex-col space-y-2">
              {userData.favoritePages.map((page, index) => (
                <Link 
                  key={index}
                  href={page.path} 
                  className="group flex items-center p-3 rounded-lg hover:bg-primary-light transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-pastel-blue flex items-center justify-center mr-3">
                    <StarIcon className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="font-medium group-hover:text-primary">{page.name}</p>
                </Link>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-border-light">
              <p className="text-sm font-medium mb-2">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {userData.recentSearches.map((search, index) => (
                  <button 
                    key={index}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-text-muted px-3 py-1 rounded-full transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
