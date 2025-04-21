"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { useDemoState, useDemoActions } from "@/lib/redux/hooks";
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
} from "@heroicons/react/24/outline";
import { buildDemoUrl } from "@/lib/utils";
import { fetchCallVolumeData } from "@/lib/redux/slices/analyticsSlice";
import CallAnalyticsSection from "@/components/features/analytics/CallAnalyticsSection";
import AppLayout from "@/components/templates/AppLayout/AppLayout";

// Mock data for the dashboard
const recentTickets = [
  {
    id: "TK-3829",
    customer: "Emily Johnson",
    issue: "Unable to redeem ExtraBucks",
    priority: "High",
    status: "Open",
    timeCreated: "2 hours ago",
    flagged: true,
    tier: "Tier1",
  },
  {
    id: "TK-3828",
    customer: "Michael Williams",
    issue: "Coupon showing expired but should not be",
    priority: "Medium",
    status: "Open",
    timeCreated: "4 hours ago",
    flagged: true,
    tier: "Tier1",
  },
  {
    id: "TK-3825",
    customer: "Robert Johnson",
    issue: "Missing tokens after app update",
    priority: "Medium",
    status: "Open",
    timeCreated: "1 day ago",
    flagged: false,
    tier: "Tier1",
  },
  {
    id: "TK-3821",
    customer: "Sophia Martinez",
    issue: "Account linking error with ExtraCare ID",
    priority: "Low",
    status: "Open",
    timeCreated: "2 days ago",
    flagged: false,
    tier: "Tier1",
  },
  {
    id: "TK-3820",
    customer: "David Chen",
    issue: "Loyalty points not reflecting recent purchase",
    priority: "Medium",
    status: "In Progress",
    timeCreated: "2 days ago",
    flagged: false,
    tier: "Tier1",
  },
  {
    id: "TK-3818",
    customer: "James Wilson",
    issue: "Digital receipt not showing rewards earned",
    priority: "Low",
    status: "In Progress",
    timeCreated: "3 days ago",
    flagged: false,
    tier: "Tier1",
  },
];

const actionItems = [
  { id: 1, task: "Complete agent profile setup", completed: true },
  {
    id: 2,
    task: "Review ExtraCare token management guidelines",
    completed: true,
  },
  { id: 3, task: "Watch token troubleshooting tutorial", completed: false },
  { id: 4, task: "Try the token search functionality", completed: false },
  { id: 5, task: "Submit first case report by Friday", completed: false },
];

const dashboardStats = [
  {
    id: 1,
    name: "Active tickets",
    value: "23",
    icon: <TicketIcon className="h-8 w-8 text-blue-500" />,
  },
  {
    id: 2,
    name: "Resolved today",
    value: "14",
    icon: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
  },
  {
    id: 3,
    name: "Token issues",
    value: "17",
    icon: <ExclamationCircleIcon className="h-8 w-8 text-yellow-500" />,
  },
  {
    id: 4,
    name: "Average resolve time",
    value: "26m",
    icon: <ClockIcon className="h-8 w-8 text-purple-500" />,
  },
];

export default function CVSDashboard() {
  const { userProfile, themeMode } = useDemoState();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [dateString, setDateString] = useState("");

  // CVS branding colors
  const cvsRed = "#CC0000";
  const cvsBlue = "#2563EB";
  const kigoBlue = "#3268cc";

  // Shadow styling
  const softShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";

  const { updateDemoState } = useDemoActions();
  const dispatch = useAppDispatch();

  // Set up client-side rendering
  useEffect(() => {
    setIsClient(true);
    updateTimeAndGreeting();
  }, []);

  // Force light mode for this component
  useEffect(() => {
    if (themeMode !== "light") {
      router.replace(
        "/demos/cvs-dashboard?role=support&client=cvs&scenario=support-flow&theme=light"
      );
    }
  }, [themeMode, router]);

  // Set personalized greeting based on time of day
  const updateTimeAndGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    setCurrentTime(now.toLocaleTimeString("en-US", options));

    let greeting = "Good evening";
    if (hours < 12) greeting = "Good morning";
    else if (hours < 18) greeting = "Good afternoon";

    setGreeting(greeting);

    // Format date like: Tuesday, March 25, 2025
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setDateString(now.toLocaleDateString("en-US", dateOptions));
  };

  // Count high priority tickets
  const getHighPriorityCount = () => {
    return recentTickets.filter((ticket) => ticket.priority === "High").length;
  };

  // Set up initial demo state on mount
  useEffect(() => {
    updateDemoState({
      clientId: "cvs",
      scenario: "dashboard",
      role: "support",
    });
  }, []);

  useEffect(() => {
    // Initialize analytics data when dashboard loads
    dispatch(fetchCallVolumeData());
  }, [dispatch]);

  const navigateToCreateTicket = () => {
    router.push("/demos/cvs-tickets?action=create");
  };

  // Dashboard content to be wrapped in AppLayout
  const dashboardContent = (
    <div className="w-full">
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Welcome Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex items-center">
              <div className="h-14 w-24 relative mr-4">
                <Image
                  src="/logos/cvs-logo.svg"
                  alt="CVS Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {greeting}, {userProfile.firstName}!
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {dateString} •{" "}
                  <span style={{ color: cvsRed }} className="font-medium">
                    ExtraCare Support Agent
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  You currently have{" "}
                  <span className="font-medium text-red-600">
                    {getHighPriorityCount()} high priority
                  </span>{" "}
                  tickets to review
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-5 shadow-sm h-full">
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={buildDemoUrl("cvs", "tickets")}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <TicketIcon className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-sm text-center">Support Tickets</span>
              </Link>

              <Link
                href={buildDemoUrl("cvs", "token-management")}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <StarIcon className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-sm text-center">Token Management</span>
              </Link>

              <button
                onClick={navigateToCreateTicket}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <QueueListIcon className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-sm text-center">Create Ticket</span>
              </button>

              <Link
                href={buildDemoUrl("cvs", "token-catalog")}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <Squares2X2Icon className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-sm text-center">Token Catalog</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {dashboardStats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex items-center">
              <div className="mr-4">{stat.icon}</div>
              <div>
                <h3 className="text-lg font-bold">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-semibold">Recent Tickets</h2>
              <Link
                href={buildDemoUrl("cvs", "tickets")}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                View All <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 bg-gray-50">
                    <th className="px-5 py-3 font-medium">ID</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Issue</th>
                    <th className="px-5 py-3 font-medium">Priority</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map((ticket, index) => (
                    <tr
                      key={ticket.id}
                      className={`border-t border-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={buildDemoUrl("cvs", "tickets")}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {ticket.id}
                        </Link>
                      </td>
                      <td className="px-5 py-4">{ticket.customer}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center">
                          {ticket.flagged && (
                            <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <span>{ticket.issue}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ticket.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : ticket.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ticket.status === "Open"
                              ? "bg-blue-100 text-blue-800"
                              : ticket.status === "In Progress"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {ticket.timeCreated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Items & Resources */}
        <div className="lg:col-span-1">
          {/* Action Items */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold">Action Items</h2>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                {actionItems.map((item) => (
                  <li key={item.id} className="flex items-start">
                    <span
                      className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full mr-3 mt-0.5 ${
                        item.completed
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <ClockIcon className="h-4 w-4" />
                      )}
                    </span>
                    <span
                      className={`text-sm ${
                        item.completed
                          ? "line-through text-gray-500"
                          : "text-gray-700"
                      }`}
                    >
                      {item.task}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold">Resources</h2>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <ClipboardDocumentCheckIcon className="h-4 w-4 mr-2" />
                    ExtraCare Token Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
                    Support FAQ & Knowledgebase
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                    Common Troubleshooting Steps
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <ShieldCheckIcon className="h-4 w-4 mr-2" />
                    Security & Privacy Policies
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call Analytics Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold">Call Analytics</h2>
        </div>
        <div className="p-5">
          <CallAnalyticsSection />
        </div>
      </div>
    </div>
  );

  // Wrap the dashboard content in the AppLayout component
  return dashboardContent;
}
