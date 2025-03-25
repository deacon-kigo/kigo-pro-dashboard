'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/contexts/DemoContext';
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
  EnvelopeIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

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
  
  // CVS branding colors
  const cvsRed = '#CC0000';
  const cvsBlue = '#2563EB';
  const kigoBlue = '#3268cc';
  
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
  };
  
  // Get today's date in a readable format
  const getTodayDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-8">
          {/* Welcome Banner */}
          <div className="bg-white rounded-lg mb-6 overflow-hidden shadow-sm border border-gray-100">
            <div className="bg-gradient-to-r from-red-50 via-blue-50 to-indigo-50 px-6 py-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{greeting}, Sarah</h1>
                  <p className="text-gray-600">{getTodayDate()} • {currentTime}</p>
                  <p className="text-sm text-blue-600 mt-1">You have 3 high-priority tickets needing attention today</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button 
                    onClick={() => router.push('/demos/cvs-token-management')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Manage Customer Tokens
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-2 space-y-6">
              {/* Stats Overview */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Support Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dashboardStats.map((stat) => (
                    <div key={stat.id} className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                      {stat.icon}
                      <h3 className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</h3>
                      <p className="text-gray-500 text-sm">{stat.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tickets From External System */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Recent Tickets</h2>
                  <Link href="/demos/cvs-tickets" className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    View all tickets
                  </Link>
                </div>
                <div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Issue</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              {ticket.flagged && (
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                              )}
                              <span className={`text-sm font-medium ${ticket.flagged ? 'text-red-600' : 'text-gray-900'}`}>{ticket.id}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ticket.customer}</div>
                            <div className="text-xs text-gray-500">{ticket.timeCreated}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900 truncate max-w-xs">{ticket.issue}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                              ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/demos/cvs-tickets/${ticket.id}`} className="text-blue-600 hover:text-blue-900">
                              View details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Onboarding Checklist */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Getting Started</h2>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{actionItems.filter(item => item.completed).length}/{actionItems.length} completed</span>
                </div>
                <div className="space-y-3">
                  {actionItems.map((item) => (
                    <div key={item.id} className="flex items-start">
                      <div className={`flex-shrink-0 h-5 w-5 rounded-full ${item.completed ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
                        {item.completed ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="h-3 w-3 rounded-full bg-gray-300" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {item.task}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link href="/demos/cvs-training" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />
                    View all training resources
                  </Link>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href="/demos/cvs-customers/new"
                    className="flex flex-col items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <UserCircleIcon className="h-6 w-6 text-blue-500 mb-2" />
                    <span className="text-xs text-gray-700">New Customer</span>
                  </Link>
                  <Link 
                    href="/demos/cvs-tickets/new"
                    className="flex flex-col items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <TicketIcon className="h-6 w-6 text-blue-500 mb-2" />
                    <span className="text-xs text-gray-700">Create Ticket</span>
                  </Link>
                  <Link 
                    href="/demos/cvs-calls/log"
                    className="flex flex-col items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <PhoneIcon className="h-6 w-6 text-blue-500 mb-2" />
                    <span className="text-xs text-gray-700">Log Call</span>
                  </Link>
                  <Link 
                    href="/demos/cvs-email/compose"
                    className="flex flex-col items-center justify-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <EnvelopeIcon className="h-6 w-6 text-blue-500 mb-2" />
                    <span className="text-xs text-gray-700">Send Email</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
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
              <Link href="/demos/cvs-support" className="text-xs text-blue-600 hover:text-blue-800">
                Report an issue
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 