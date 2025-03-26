'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/contexts/DemoContext';
import { useAppSelector } from '@/lib/redux/hooks';
import { useDemoActions } from '@/lib/redux/hooks';
import { 
  UserCircleIcon, 
  BellIcon, 
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  TicketIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  ChartBarIcon,
  InboxIcon,
  CalendarIcon,
  QueueListIcon,
  Squares2X2Icon,
  HomeIcon,
  UserGroupIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { buildDemoUrl } from '@/lib/utils';

// Mock data for the dashboard
const recentTickets = [
  { 
    id: 'TK-3829', 
    customer: 'Emily Johnson', 
    issue: 'Unable to redeem ExtraBucks',
    priority: 'High',
    status: 'Open',
    timeCreated: '2 hours ago',
    flagged: true
  },
  { 
    id: 'TK-3828', 
    customer: 'Michael Williams', 
    issue: 'Coupon showing expired but should not be',
    priority: 'Medium',
    status: 'Open',
    timeCreated: '4 hours ago',
    flagged: true
  },
  { 
    id: 'TK-3825', 
    customer: 'Robert Johnson', 
    issue: 'Missing tokens after app update',
    priority: 'Medium',
    status: 'Open',
    timeCreated: '1 day ago',
    flagged: false
  },
  { 
    id: 'TK-3821', 
    customer: 'Sophia Martinez', 
    issue: 'Account linking error with ExtraCare ID',
    priority: 'Low',
    status: 'Open',
    timeCreated: '2 days ago',
    flagged: false
  },
  { 
    id: 'TK-3820', 
    customer: 'David Chen', 
    issue: 'Loyalty points not reflecting recent purchase',
    priority: 'Medium',
    status: 'In Progress',
    timeCreated: '2 days ago',
    flagged: false
  },
  { 
    id: 'TK-3818', 
    customer: 'James Wilson', 
    issue: 'Digital receipt not showing rewards earned',
    priority: 'Low',
    status: 'In Progress',
    timeCreated: '3 days ago',
    flagged: false
  },
];

const actionItems = [
  { id: 1, task: 'Complete agent profile setup', completed: true },
  { id: 2, task: 'Review ExtraCare token management guidelines', completed: true },
  { id: 3, task: 'Watch token troubleshooting tutorial', completed: false },
  { id: 4, task: 'Try the token search functionality', completed: false },
  { id: 5, task: 'Submit first case report by Friday', completed: false },
];

const dashboardStats = [
  { id: 1, name: 'Active tickets', value: '23', icon: <TicketIcon className="h-8 w-8 text-blue-500" /> },
  { id: 2, name: 'Resolved today', value: '14', icon: <CheckCircleIcon className="h-8 w-8 text-green-500" /> },
  { id: 3, name: 'Token issues', value: '17', icon: <ExclamationCircleIcon className="h-8 w-8 text-yellow-500" /> },
  { id: 4, name: 'Average resolve time', value: '26m', icon: <ClockIcon className="h-8 w-8 text-purple-500" /> },
];

export default function CVSDashboard() {
  const { userProfile, themeMode } = useDemo();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [dateString, setDateString] = useState('');
  
  // Get the sidebar width from Redux state
  const { sidebarWidth } = useAppSelector(state => state.ui);
  
  // CVS branding colors
  const cvsRed = '#CC0000';
  const cvsBlue = '#2563EB';
  const kigoBlue = '#3268cc';
  
  // Shadow styling
  const softShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
  
  const { updateDemoState } = useDemoActions();
  
  // Set up client-side rendering
  useEffect(() => {
    setIsClient(true);
    updateTimeAndGreeting();
  }, []);
  
  // Force light mode for this component
  useEffect(() => {
    if (themeMode !== 'light') {
      router.replace('/demos/cvs-dashboard?role=support&client=cvs&scenario=support-flow&theme=light');
    }
  }, [themeMode, router]);
  
  // Set personalized greeting based on time of day
  const updateTimeAndGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    setCurrentTime(now.toLocaleTimeString('en-US', options));
    
    let greeting = 'Good evening';
    if (hours < 12) greeting = 'Good morning';
    else if (hours < 18) greeting = 'Good afternoon';
    
    setGreeting(greeting);
    
    // Format date like: Tuesday, March 25, 2025
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setDateString(now.toLocaleDateString('en-US', dateOptions));
  };
  
  // Count high priority tickets
  const getHighPriorityCount = () => {
    return recentTickets.filter(ticket => ticket.priority === 'High').length;
  };
  
  // Set up initial demo state on mount
  useEffect(() => {
    updateDemoState({
      clientId: 'cvs',
      scenario: 'dashboard',
      role: 'support'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main 
        className="py-6 overflow-auto"
        style={{ 
          position: 'fixed',
          top: '72px',  // Header height
          bottom: '56px', // Footer height
          right: 0,
          left: sidebarWidth,
          width: `calc(100% - ${sidebarWidth})`,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <div className="px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Content (2/3 width) */}
            <div className="lg:col-span-2 space-y-5">
              {/* Welcome Card with Gradient Background and Manage Tokens Button */}
              <div className="rounded-lg p-6 border border-gray-100" 
                   style={{ 
                     background: `linear-gradient(to right, #f0f8ff, ${kigoBlue}10, ${cvsRed}05)`,
                     boxShadow: softShadow
                   }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-800">{greeting}, {userProfile?.firstName || 'Agent'}</h1>
                    <p className="text-gray-600 mt-1">{dateString} • {currentTime}</p>
                    {getHighPriorityCount() > 0 && (
                      <div className="mt-3 py-2 px-3 bg-blue-50 text-blue-700 rounded-md inline-block">
                        <span>You have {getHighPriorityCount()} high-priority tickets needing attention today</span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={buildDemoUrl('cvs', 'token-management')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
                  >
                    <span>Manage Customer Tokens</span>
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
              
              {/* Support Overview Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Support Overview</h2>
                
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {dashboardStats.map((stat) => (
                    <div key={stat.id} className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: softShadow }}>
                      <div className="flex justify-center items-center mb-1">
                        {stat.icon}
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-gray-800">{stat.value}</div>
                        <span className="text-sm font-medium text-gray-500">{stat.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recent Tickets Table */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Tickets</h2>
                  <Link
                    href={buildDemoUrl('cvs', 'tickets')}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    View all tickets
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden" style={{ boxShadow: softShadow }}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentTickets.map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              <div className="flex items-center">
                                {ticket.flagged && <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />}
                                {ticket.id}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {ticket.customer}
                              <div className="text-xs text-gray-500">{ticket.timeCreated}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{ticket.issue}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                ticket.priority === 'High' 
                                  ? 'bg-red-100 text-red-800' 
                                  : ticket.priority === 'Medium' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                ticket.status === 'Open' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {ticket.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Sidebar (1/3 width) */}
            <div className="space-y-5">
              {/* Getting Started */}
              <div className="bg-white rounded-lg border border-gray-100 overflow-hidden" style={{ boxShadow: softShadow }}>
                <div className="px-4 py-3 border-b border-gray-200 bg-white flex justify-between">
                  <h2 className="font-semibold text-gray-800">Getting Started</h2>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">2/5 completed</span>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {actionItems.map((item) => (
                      <li key={item.id} className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 ${item.completed ? 'text-green-500' : 'text-gray-300'}`}>
                          {item.completed ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                          )}
                        </div>
                        <span className={`ml-2 text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                          {item.task}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Link href="#" className="text-sm text-blue-600 flex items-center">
                      <span>View all training resources</span>
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* System Status - replacing Quick Actions */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Token Types</h2>
                <div className="bg-white rounded-lg border border-gray-100" style={{ boxShadow: softShadow }}>
                  <ul className="divide-y divide-gray-100">
                    <li className="p-4 flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <span className="text-red-600 font-semibold text-xs">EB</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">ExtraBucks</h3>
                        <p className="text-xs text-gray-500 mt-1">Store credit earned through the ExtraCare program</p>
                      </div>
                    </li>
                    <li className="p-4 flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-xs">CP</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Coupons</h3>
                        <p className="text-xs text-gray-500 mt-1">Percentage or fixed amount discounts on eligible products</p>
                      </div>
                    </li>
                    <li className="p-4 flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-semibold text-xs">RW</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Rewards</h3>
                        <p className="text-xs text-gray-500 mt-1">Special offers and loyalty rewards for frequent shoppers</p>
                      </div>
                    </li>
                  </ul>
                  <div className="p-4 border-t border-gray-100">
                    <Link href={buildDemoUrl('cvs', 'token-management')} className="text-sm text-blue-600 flex items-center">
                      <span>Manage customer tokens</span>
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="bg-white shadow-inner border-t border-gray-200 py-4"
        style={{ 
          position: 'fixed',
          bottom: 0,
          right: 0,
          left: sidebarWidth,
          width: `calc(100% - ${sidebarWidth})`,
          height: '56px',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <div className="px-8 flex justify-between items-center h-full">
          <div>
            <p className="text-xs text-gray-500">
              &copy; 2023 CVS Health + Kigo. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500">
              Support Portal v1.2.3
            </p>
            <div className="flex items-center">
              <WrenchScrewdriverIcon className="h-4 w-4 text-gray-400 mr-1" />
              <Link href={buildDemoUrl('cvs', 'help')} className="text-xs text-blue-600 hover:text-blue-800">
                Report an issue
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 