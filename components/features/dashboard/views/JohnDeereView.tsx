"use client";

import React, { useState } from "react";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms";
import Card from "@/components/atoms/Card/Card";
import { useDemoState } from "@/lib/redux/hooks";
import { PageHeader } from "@/components/molecules/PageHeader";
import {
  ArrowLeftIcon,
  UsersIcon,
  CalendarIcon,
  EnvelopeIcon,
  LinkIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  FunnelChart,
  Funnel,
  LabelList,
  ComposedChart,
  Area,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Component props interface
interface JohnDeereViewProps {
  onBack?: () => void;
}

// Performance data for charts
const performanceData = [
  { name: "Jan", impressions: 1200000, clicks: 65000, ctr: 5.4 },
  { name: "Feb", impressions: 1350000, clicks: 74000, ctr: 5.5 },
  { name: "Mar", impressions: 1500000, clicks: 85000, ctr: 5.7 },
  { name: "Apr", impressions: 1800000, clicks: 104000, ctr: 5.8 },
  { name: "May", impressions: 2100000, clicks: 126000, ctr: 6.0 },
  { name: "Jun", impressions: 2560000, clicks: 148200, ctr: 5.8 },
];

// Platform performance data
const platformData = [
  { name: "YouTube", impressions: 1200000, clicks: 76800, ctr: 6.4 },
  { name: "Instagram", impressions: 850000, clicks: 42500, ctr: 5.0 },
  { name: "TikTok", impressions: 510000, clicks: 28900, ctr: 5.7 },
];

// Funnel data
const funnelData = [
  { name: "Impressions", value: 2560000, fill: "#c8e6c9" },
  { name: "Link Clicks", value: 148200, fill: "#81c784" },
  { name: "Page Views", value: 35400, fill: "#4caf50" },
  { name: "Conversions", value: 4872, fill: "#2e7d32" },
];

// Regional distribution data
interface RegionDataItem {
  name: string;
  value: number;
  fill: string;
}

const regionData: RegionDataItem[] = [
  { name: "Midwest", value: 32, fill: "#367C2B" },
  { name: "Southeast", value: 28, fill: "#4c8e41" },
  { name: "West", value: 18, fill: "#63a057" },
  { name: "Northeast", value: 14, fill: "#89c180" },
  { name: "Southwest", value: 8, fill: "#dee8dc" },
];

// Top states data
interface StateDataItem {
  name: string;
  value: number;
}

const topStatesData: StateDataItem[] = [
  { name: "Illinois", value: 8.2 },
  { name: "Iowa", value: 7.5 },
  { name: "Ohio", value: 6.8 },
  { name: "Indiana", value: 6.2 },
  { name: "Texas", value: 5.4 },
];

// John Deere brand colors
const johnDeereGreen = "#367C2B";
const johnDeereYellow = "#FFDE00";

export default function JohnDeereView({
  onBack = () => console.log("Back clicked"),
}: JohnDeereViewProps) {
  const { userProfile } = useDemoState();
  const [activeTab, setActiveTab] = useState("campaign");

  return (
    <>
      <PageHeader
        title="John Deere Influencer Campaign"
        description="Create and manage influencer campaigns for John Deere products"
        variant="default"
        gradientColors={{
          from: `${johnDeereGreen}20`, // Light version of John Deere green (with opacity)
          to: `${johnDeereGreen}40`, // Slightly darker version of John Deere green
        }}
        logo={
          <div className="h-16 w-28 relative bg-white p-2 rounded shadow-sm">
            <img
              src="/images/john-deere/john-deere-logo.png"
              alt="John Deere Logo"
              className="w-full h-full object-contain"
            />
          </div>
        }
        actions={
          <div className="flex space-x-2">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              icon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Back to Dashboard
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        <Tabs
          defaultValue="campaign"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="campaign" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Campaign Creation
            </TabsTrigger>
            <TabsTrigger
              value="influencers"
              className="flex items-center gap-2"
            >
              <UsersIcon className="h-4 w-4" />
              Influencer Management
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Tracking Links
            </TabsTrigger>
            <TabsTrigger value="landing" className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              Landing Pages
            </TabsTrigger>
            <TabsTrigger value="reporting" className="flex items-center gap-2">
              <ArrowUpTrayIcon className="h-4 w-4" />
              Reporting
            </TabsTrigger>
          </TabsList>

          {/* Campaign Creation Tab */}
          <TabsContent value="campaign">
            <Card className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Campaign Setup</h2>
                    <p className="text-gray-600 mt-1">
                      Configure your John Deere influencer marketing campaign
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Save as Template
                  </Button>
                </div>

                {/* Campaign setup form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">
                        Campaign Details
                      </h3>

                      <div className="space-y-6">
                        {/* Basic campaign info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Campaign Name
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                              placeholder="e.g., Spring 2023 Construction Equipment"
                              defaultValue="330 P-Tier Skid Steer Launch"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Product Category
                            </label>
                            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500">
                              <option value="">Select Category</option>
                              <option value="construction" selected>
                                Construction & Forestry
                              </option>
                              <option value="agriculture">
                                Agriculture & Turf
                              </option>
                              <option value="commercial">
                                Commercial Equipment
                              </option>
                              <option value="residential">
                                Residential Equipment
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* Date range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                              defaultValue={
                                new Date().toISOString().split("T")[0]
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                              defaultValue={
                                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            />
                          </div>
                        </div>

                        {/* Social channels */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Social Media Channels
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="channel-youtube"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                defaultChecked
                              />
                              <label
                                htmlFor="channel-youtube"
                                className="text-sm text-gray-700"
                              >
                                YouTube
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="channel-tiktok"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                defaultChecked
                              />
                              <label
                                htmlFor="channel-tiktok"
                                className="text-sm text-gray-700"
                              >
                                TikTok
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="channel-instagram"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                defaultChecked
                              />
                              <label
                                htmlFor="channel-instagram"
                                className="text-sm text-gray-700"
                              >
                                Instagram
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="channel-facebook"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor="channel-facebook"
                                className="text-sm text-gray-700"
                              >
                                Facebook
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="channel-x"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor="channel-x"
                                className="text-sm text-gray-700"
                              >
                                X (Twitter)
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Product selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Featured Product
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center space-x-3">
                              <input
                                type="radio"
                                name="product"
                                id="product-skidsteer"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                defaultChecked
                              />
                              <label
                                htmlFor="product-skidsteer"
                                className="flex-1"
                              >
                                <span className="block text-sm font-medium">
                                  330 P-Tier Skid Steer Loader
                                </span>
                                <span className="block text-xs text-gray-500">
                                  Construction & Forestry
                                </span>
                              </label>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center space-x-3">
                              <input
                                type="radio"
                                name="product"
                                id="product-tractor"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                              />
                              <label
                                htmlFor="product-tractor"
                                className="flex-1"
                              >
                                <span className="block text-sm font-medium">
                                  8R 410 Tractor
                                </span>
                                <span className="block text-xs text-gray-500">
                                  Agriculture & Turf
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Button variant="outline" size="sm">
                              Select More Products
                            </Button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                          <Button variant="outline">Cancel</Button>
                          <Button
                            variant="primary"
                            className="bg-green-600 hover:bg-green-700 border-green-600"
                          >
                            Create Campaign
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campaign summary and product image */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
                      <h3 className="text-lg font-medium mb-4">
                        Selected Product
                      </h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src="/images/john-deere/330p-tier.avif"
                          alt="330 P-Tier Skid Steer Loader"
                          className="w-full h-48 object-cover object-center"
                        />
                        <div className="p-4">
                          <h4 className="font-medium">
                            330 P-Tier Skid Steer Loader
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Powerful and versatile skid steer loader with
                            enhanced performance and comfort features.
                          </p>
                          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                            <span>Model: 330 P-Tier</span>
                            <span>HP: 100</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                      >
                        View Product Details
                      </Button>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-3">
                        Campaign Summary
                      </h3>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Campaign type:
                          </span>
                          <span className="text-sm font-medium">
                            Influencer Marketing
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Target audience:
                          </span>
                          <span className="text-sm font-medium">
                            Contractors, Builders
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Primary channel:
                          </span>
                          <span className="text-sm font-medium">YouTube</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Duration:
                          </span>
                          <span className="text-sm font-medium">30 Days</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-green-200">
                        <h4 className="text-sm font-medium mb-2">
                          Sample Influencer Content
                        </h4>
                        <div className="rounded-lg overflow-hidden mb-3">
                          <video
                            controls
                            className="w-full h-auto"
                            poster="/images/john-deere/330p-tier.avif"
                          >
                            <source
                              src="/video/330 P-Tier Skid Steer.mp4"
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 border-green-600"
                        >
                          Assign Influencers
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Influencer Management Tab */}
          <TabsContent value="influencers">
            <Card className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Influencer Management
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Manage influencer partnerships and track performance
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Import Influencers
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 border-green-600"
                    >
                      Add Influencer
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Influencer list */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {/* Search and filters */}
                      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search influencers..."
                            className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 w-64"
                          />
                          <svg
                            className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                            <option>All Categories</option>
                            <option>Construction</option>
                            <option>Agriculture</option>
                            <option>DIY & Home</option>
                          </select>
                          <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                            <option>All Platforms</option>
                            <option>YouTube</option>
                            <option>TikTok</option>
                            <option>Instagram</option>
                          </select>
                        </div>
                      </div>

                      {/* Influencer table */}
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Influencer
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Specialty
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Audience
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Influencer 1 */}
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src="/images/john-deere/mike-builder-avatar.png"
                                    alt="Mike Builder"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    Mike Builder
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    @realmikebuilder
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                Construction
                              </div>
                              <div className="text-xs text-gray-500">
                                Heavy Machinery
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">1.2M</div>
                              <div className="text-xs text-gray-500">
                                4.8% Engagement
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button className="text-green-600 hover:text-green-800">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </button>
                                <button className="text-green-600 hover:text-green-800">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Influencer 2 */}
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src="/images/john-deere/sarah-fieldwork-avatar.png"
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    Sarah Fieldwork
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    @farmingsarah
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                Agriculture
                              </div>
                              <div className="text-xs text-gray-500">
                                Farming Equipment
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">890K</div>
                              <div className="text-xs text-gray-500">
                                5.2% Engagement
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button className="text-green-600 hover:text-green-800">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </button>
                                <button className="text-green-600 hover:text-green-800">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Influencer 3 */}
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src="/images/john-deere/john-mechanics-avatar.png"
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    Josh Mechanics
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    @joshmechanics
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                Construction
                              </div>
                              <div className="text-xs text-gray-500">
                                Equipment Reviews
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">2.4M</div>
                              <div className="text-xs text-gray-500">
                                6.1% Engagement
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button className="text-green-600 hover:text-green-800">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </button>
                                <button className="text-green-600 hover:text-green-800">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Pagination */}
                      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Showing 3 of 12 influencers
                        </div>
                        <div className="flex-1 flex justify-end">
                          <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                          >
                            <a
                              href="#"
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Previous</span>
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </a>
                            <a
                              href="#"
                              aria-current="page"
                              className="z-10 bg-green-50 border-green-500 text-green-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                              1
                            </a>
                            <a
                              href="#"
                              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                              2
                            </a>
                            <a
                              href="#"
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Next</span>
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </a>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Influencer profile and tracking */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">
                        Influencer Profile
                      </h3>

                      <div className="flex flex-col items-center">
                        <div className="h-20 w-20 rounded-full overflow-hidden mb-3">
                          <img
                            src="/images/john-deere/mike-builder-avatar.png"
                            alt="Mike Builder"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h4 className="text-xl font-medium">Mike Builder</h4>
                        <p className="text-sm text-gray-600">
                          @realmikebuilder
                        </p>

                        <div className="grid grid-cols-3 gap-3 w-full mt-4">
                          <div className="text-center">
                            <div className="text-xl font-bold">1.2M</div>
                            <div className="text-xs text-gray-500">
                              Followers
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold">4.8%</div>
                            <div className="text-xs text-gray-500">
                              Engagement
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold">12</div>
                            <div className="text-xs text-gray-500">
                              Campaigns
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium mb-2">
                          Primary Platforms
                        </h4>
                        <div className="flex justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-red-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                              </svg>
                            </div>
                            <span className="text-sm">YouTube</span>
                          </div>
                          <div className="text-sm font-medium">
                            720K Subscribers
                          </div>
                        </div>
                        <div className="flex justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-purple-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                fill="currentColor"
                              >
                                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                              </svg>
                            </div>
                            <span className="text-sm">Instagram</span>
                          </div>
                          <div className="text-sm font-medium">
                            480K Followers
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium mb-3">
                          Recent Content
                        </h4>
                        <div className="rounded-lg overflow-hidden mb-3">
                          <video
                            controls
                            className="w-full h-auto"
                            poster="/images/john-deere/330p-tier.avif"
                          >
                            <source
                              src="/video/330 P-Tier Skid Steer.mp4"
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                          <div className="mt-1 text-xs text-gray-600">
                            <div className="font-medium">
                              330 P-Tier First Look
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>2.4M views</span>
                              <span>Posted 2 days ago</span>
                            </div>
                          </div>
                        </div>
                        <h4 className="text-sm font-medium mb-3">
                          Generate Tracking ID
                        </h4>
                        <div className="space-y-2">
                          <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                            <option>330 P-Tier Skid Steer Launch</option>
                            <option>Summer Construction Promo</option>
                            <option>Agriculture Innovation Series</option>
                          </select>
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700 border-green-600"
                          >
                            Generate Tracking ID
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-3">
                        Performance Summary
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Conversion Rate</span>
                            <span className="font-medium">4.2%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: "42%" }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Click-through Rate</span>
                            <span className="font-medium">8.7%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: "87%" }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Engagement Score</span>
                            <span className="font-medium">92/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: "92%" }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-green-200 flex justify-between text-sm">
                        <div>Total Revenue Generated:</div>
                        <div className="font-bold">$128,450</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tracking Links Tab */}
          <TabsContent value="tracking">
            <Card className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Tracking Links</h2>
                    <p className="text-gray-600 mt-1">
                      Create and manage trackable links for your influencer
                      campaigns
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Import Links
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 border-green-600"
                    >
                      Create New Link
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Link Generation Form */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">
                        Link Generator
                      </h3>

                      <div className="space-y-6">
                        {/* Basic link info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Campaign
                            </label>
                            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500">
                              <option>330 P-Tier Skid Steer Launch</option>
                              <option>Summer Construction Promo</option>
                              <option>Agriculture Innovation Series</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Influencer
                            </label>
                            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500">
                              <option>Mike Builder</option>
                              <option>Sarah Fieldwork</option>
                              <option>Josh Mechanics</option>
                              <option value="">No specific influencer</option>
                            </select>
                          </div>
                        </div>

                        {/* Destination URL */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destination URL
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                            placeholder="https://www.deere.com/en/skid-steers/330p-tier/"
                            defaultValue="https://www.deere.com/en/skid-steers/330p-tier/"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Enter the full URL including https://
                          </p>
                        </div>

                        {/* UTM Parameters */}
                        <div>
                          <h4 className="text-md font-medium mb-3 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            UTM Parameters
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Source
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                                defaultValue="influencer"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Medium
                              </label>
                              <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500">
                                <option value="youtube" selected>
                                  youtube
                                </option>
                                <option value="instagram">instagram</option>
                                <option value="tiktok">tiktok</option>
                                <option value="facebook">facebook</option>
                                <option value="twitter">twitter</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Campaign
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                                defaultValue="330-p-tier-launch"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Content
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                                defaultValue="mike-builder"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Custom parameters */}
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-md font-medium flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Custom Parameters
                            </h4>
                            <Button variant="outline" size="xs">
                              Add Parameter
                            </Button>
                          </div>

                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              placeholder="Key"
                              className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                              defaultValue="influencer_id"
                            />
                            <input
                              type="text"
                              placeholder="Value"
                              className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                              defaultValue="MB001"
                            />
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                          <Button variant="outline">Reset</Button>
                          <Button
                            variant="primary"
                            className="bg-green-600 hover:bg-green-700 border-green-600"
                          >
                            Generate Link
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Link Preview & History */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">
                        Generated Link
                      </h3>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Short URL
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            readOnly
                            className="flex-1 px-3 py-2 bg-white rounded-l-md border border-r-0 border-gray-300 focus:ring-green-500 focus:border-green-500"
                            value="kigo.ly/jd-p330"
                          />
                          <button className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-r-md px-3 py-2 text-gray-600">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full URL with Parameters
                          </label>
                          <textarea
                            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                            rows={3}
                            readOnly
                            value="https://www.deere.com/en/skid-steers/330p-tier/?utm_source=influencer&utm_medium=youtube&utm_campaign=330-p-tier-launch&utm_content=mike-builder&influencer_id=MB001"
                          ></textarea>
                        </div>

                        <div className="flex space-x-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium">Recent Links</h3>
                        <Button variant="outline" size="xs">
                          View All
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              kigo.ly/jd-p330
                            </span>
                            <span className="text-xs text-gray-500">
                              5 min ago
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            330 P-Tier Skid Steer Launch / Mike Builder
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              28 clicks
                            </span>
                            <div className="flex space-x-2">
                              <button className="text-green-600 hover:text-green-800">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              kigo.ly/jd-sarah
                            </span>
                            <span className="text-xs text-gray-500">
                              2 days ago
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            Summer Construction Promo / Sarah Fieldwork
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              142 clicks
                            </span>
                            <div className="flex space-x-2">
                              <button className="text-green-600 hover:text-green-800">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              kigo.ly/jd-josh
                            </span>
                            <span className="text-xs text-gray-500">
                              4 days ago
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            Agriculture Innovation Series / Josh Mechanics
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              312 clicks
                            </span>
                            <div className="flex space-x-2">
                              <button className="text-green-600 hover:text-green-800">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Landing Pages Tab */}
          <TabsContent value="landing">
            <Card className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Landing Pages</h2>
                    <p className="text-gray-600 mt-1">
                      Create and customize landing pages for your influencer
                      campaigns
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Templates
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 border-green-600"
                    >
                      Create Page
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Landing Page Builder */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <h3 className="font-medium">Landing Page Editor</h3>
                        <div className="flex items-center space-x-2">
                          <select className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                            <option>Desktop View</option>
                            <option>Mobile View</option>
                            <option>Tablet View</option>
                          </select>
                          <Button variant="outline" size="xs">
                            Preview
                          </Button>
                        </div>
                      </div>

                      {/* Page Preview */}
                      <div className="p-6 border-b border-gray-200">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
                          {/* Header */}
                          <div className="bg-[#377d2b] p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-white h-8 w-20 rounded flex items-center justify-center">
                                <div className="h-6 w-16 relative">
                                  <img
                                    src="/images/john-deere/john-deere-logo.png"
                                    alt="John Deere Logo"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>
                              <nav className="hidden md:flex ml-6 space-x-4">
                                <span className="text-white hover:text-[#ffdb00] cursor-pointer text-sm">
                                  Products
                                </span>
                                <span className="text-white hover:text-[#ffdb00] cursor-pointer text-sm">
                                  Agriculture
                                </span>
                                <span className="text-white hover:text-[#ffdb00] cursor-pointer text-sm">
                                  Construction
                                </span>
                                <span className="text-white hover:text-[#ffdb00] cursor-pointer text-sm">
                                  Dealers
                                </span>
                              </nav>
                            </div>
                            <div className="text-white text-sm">
                              <span className="cursor-pointer hover:text-[#ffdb00]">
                                Sign In
                              </span>
                            </div>
                          </div>

                          {/* Hero Section */}
                          <div className="relative">
                            <div className="h-56 bg-gray-300 relative overflow-hidden">
                              <img
                                src="/images/john-deere/330p-tier.avif"
                                alt="330 P-Tier Skid Steer"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                              <div className="absolute inset-0 flex flex-col justify-center p-8">
                                <h2 className="text-white text-2xl font-bold mb-2">
                                  330 P-Tier Skid Steer Loader
                                </h2>
                                <p className="text-white text-sm mb-4">
                                  Powerful and versatile for your toughest jobs
                                </p>
                                <button className="bg-[#ffdb00] hover:bg-yellow-400 text-[#377d2b] font-medium rounded px-4 py-2 w-40 text-sm transition-colors">
                                  Learn More
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-[#377d2b] mb-2">
                                  Ultimate Performance
                                </h3>
                                <p className="text-sm text-gray-600">
                                  The 330 P-Tier delivers exceptional
                                  performance with improved pushing power and
                                  breakout force, making it ideal for
                                  construction and landscaping projects.
                                </p>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-[#377d2b] mb-2">
                                  Enhanced Comfort
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Redesigned cab with improved visibility and
                                  ergonomic controls keeps operators comfortable
                                  and productive throughout the workday.
                                </p>
                              </div>
                            </div>

                            {/* Form */}
                            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                              <h3 className="font-bold text-[#377d2b] mb-3">
                                Get Exclusive Offer
                              </h3>
                              <p className="text-sm text-gray-600 mb-4">
                                Sign up to receive your special pricing and
                                financing options.
                              </p>
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    placeholder="First Name"
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#377d2b] focus:border-[#377d2b]"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#377d2b] focus:border-[#377d2b]"
                                  />
                                </div>
                                <input
                                  type="email"
                                  placeholder="Email Address"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#377d2b] focus:border-[#377d2b]"
                                />
                                <input
                                  type="tel"
                                  placeholder="Phone Number"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#377d2b] focus:border-[#377d2b]"
                                />
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="consent"
                                    className="mr-2 text-[#377d2b] focus:ring-[#377d2b] rounded"
                                  />
                                  <label
                                    htmlFor="consent"
                                    className="text-xs text-gray-600"
                                  >
                                    I consent to receive marketing
                                    communications from John Deere
                                  </label>
                                </div>
                                <button className="w-full bg-[#377d2b] hover:bg-[#2b6522] text-white rounded-md py-2 text-sm transition-colors">
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="bg-gray-800 text-gray-400 p-4 text-xs">
                            <div className="flex flex-wrap justify-between">
                              <div>
                                © 2023 Deere & Company. All Rights Reserved.
                              </div>
                              <div className="space-x-4">
                                <span className="cursor-pointer hover:text-white">
                                  Privacy
                                </span>
                                <span className="cursor-pointer hover:text-white">
                                  Terms
                                </span>
                                <span className="cursor-pointer hover:text-white">
                                  Contact
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Editing Tools */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="space-x-2">
                          <Button variant="outline" size="xs">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                              />
                            </svg>
                            Layout
                          </Button>
                          <Button variant="outline" size="xs">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            Images
                          </Button>
                          <Button variant="outline" size="xs">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Text
                          </Button>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 border-green-600"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Template Selection & Settings */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">
                        Page Settings
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Page Name
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                            defaultValue="330 P-Tier Landing Page"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Campaign
                          </label>
                          <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500">
                            <option>330 P-Tier Skid Steer Launch</option>
                            <option>Summer Construction Promo</option>
                            <option>Agriculture Innovation Series</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Page URL
                          </label>
                          <div className="flex rounded-md">
                            <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              kigo.page/
                            </span>
                            <input
                              type="text"
                              className="flex-1 min-w-0 px-3 py-2 rounded-r-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                              defaultValue="jd-330p-tier"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Authentication
                          </label>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="auth-public"
                                name="auth-type"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                              />
                              <label
                                htmlFor="auth-public"
                                className="ml-2 text-sm text-gray-700"
                              >
                                Public Page (No Login)
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="auth-email"
                                name="auth-type"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                              />
                              <label
                                htmlFor="auth-email"
                                className="ml-2 text-sm text-gray-700"
                              >
                                Email Capture
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="auth-john-deere"
                                name="auth-type"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                defaultChecked
                              />
                              <label
                                htmlFor="auth-john-deere"
                                className="ml-2 text-sm text-gray-700"
                              >
                                John Deere Account Login
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Templates</h3>
                        <Button variant="outline" size="xs">
                          View All
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-green-200 rounded-lg overflow-hidden bg-green-50">
                          <div className="h-24 bg-gray-100 flex items-center justify-center">
                            <svg
                              className="h-10 w-10 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </div>
                          <div className="p-2 text-center">
                            <span className="text-xs font-medium">Product</span>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <div className="h-24 bg-gray-100 flex items-center justify-center">
                            <svg
                              className="h-10 w-10 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                              />
                            </svg>
                          </div>
                          <div className="p-2 text-center">
                            <span className="text-xs font-medium">
                              Promotion
                            </span>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <div className="h-24 bg-gray-100 flex items-center justify-center">
                            <svg
                              className="h-10 w-10 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                          <div className="p-2 text-center">
                            <span className="text-xs font-medium">Dealer</span>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <div className="h-24 bg-gray-100 flex items-center justify-center">
                            <svg
                              className="h-10 w-10 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="p-2 text-center">
                            <span className="text-xs font-medium">Video</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-3">
                        Page Statistics
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Visitors</span>
                            <span className="font-medium text-sm">842</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: "84%" }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Form Submissions</span>
                            <span className="font-medium text-sm">318</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: "37%" }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Conversion Rate</span>
                            <span className="font-medium text-sm">37.8%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: "37.8%" }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-green-200">
                        <Button variant="outline" size="sm" className="w-full">
                          View Detailed Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Reporting Tab */}
          <TabsContent value="reporting">
            <Card className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Campaign Reporting
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Track and analyze campaign performance metrics
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Export
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 border-green-600"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Generate Report
                    </Button>
                  </div>
                </div>

                {/* Campaign selection and date range */}
                <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign
                      </label>
                      <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500">
                        <option>All Campaigns</option>
                        <option selected>330 P-Tier Skid Steer Launch</option>
                        <option>Summer Construction Promo</option>
                        <option>Agriculture Innovation Series</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Range
                      </label>
                      <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500">
                        <option>Last 7 days</option>
                        <option selected>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>Year to date</option>
                        <option>Custom range</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Influencer
                      </label>
                      <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500">
                        <option>All Influencers</option>
                        <option>Mike Builder</option>
                        <option>Sarah Fieldwork</option>
                        <option>Josh Mechanics</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Campaign Performance */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium">
                          Performance Overview
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="xs"
                            className="bg-gray-100"
                          >
                            Daily
                          </Button>
                          <Button variant="outline" size="xs">
                            Weekly
                          </Button>
                          <Button variant="outline" size="xs">
                            Monthly
                          </Button>
                        </div>
                      </div>

                      {/* Metrics cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-500">
                            Total Impressions
                          </div>
                          <div className="text-2xl font-bold mt-1">2.56M</div>
                          <div className="flex items-center mt-1 text-xs text-green-600">
                            <svg
                              className="h-3 w-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                            <span>12.3% vs. prev</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-500">Clicks</div>
                          <div className="text-2xl font-bold mt-1">148.2K</div>
                          <div className="flex items-center mt-1 text-xs text-green-600">
                            <svg
                              className="h-3 w-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                            <span>8.7% vs. prev</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-500">
                            Conversions
                          </div>
                          <div className="text-2xl font-bold mt-1">4,872</div>
                          <div className="flex items-center mt-1 text-xs text-green-600">
                            <svg
                              className="h-3 w-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                            <span>15.2% vs. prev</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-500">Revenue</div>
                          <div className="text-2xl font-bold mt-1">$642K</div>
                          <div className="flex items-center mt-1 text-xs text-green-600">
                            <svg
                              className="h-3 w-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                            <span>18.4% vs. prev</span>
                          </div>
                        </div>
                      </div>

                      {/* Chart */}
                      <div className="h-72 bg-white border border-gray-200 rounded-lg p-4 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={performanceData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                            />
                            <XAxis
                              dataKey="name"
                              stroke="#6b7280"
                              fontSize={12}
                            />
                            <YAxis
                              yAxisId="left"
                              stroke="#6b7280"
                              fontSize={12}
                              tickFormatter={(value) =>
                                `${(value / 1000000).toFixed(1)}M`
                              }
                            />
                            <YAxis
                              yAxisId="right"
                              orientation="right"
                              stroke="#6b7280"
                              fontSize={12}
                              tickFormatter={(value) => `${value}K`}
                            />
                            <Tooltip
                              formatter={(value, name) => {
                                if (name === "impressions")
                                  return [
                                    `${(Number(value) / 1000000).toFixed(2)}M`,
                                    "Impressions",
                                  ];
                                if (name === "clicks")
                                  return [
                                    `${(Number(value) / 1000).toFixed(1)}K`,
                                    "Clicks",
                                  ];
                                return [value, name];
                              }}
                            />
                            <Legend />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="impressions"
                              stroke={johnDeereGreen}
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                              name="Impressions"
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="clicks"
                              stroke={johnDeereYellow}
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                              name="Clicks"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Platform breakdown */}
                      <div>
                        <h4 className="text-sm font-medium mb-3">
                          Performance by Platform
                        </h4>
                        <div className="h-60 bg-white mb-3">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={platformData}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                              />
                              <XAxis
                                dataKey="name"
                                stroke="#6b7280"
                                fontSize={12}
                              />
                              <YAxis
                                stroke="#6b7280"
                                fontSize={12}
                                tickFormatter={(value) =>
                                  `${(value / 1000000).toFixed(1)}M`
                                }
                              />
                              <Tooltip
                                formatter={(value, name) => {
                                  if (name === "impressions")
                                    return [
                                      `${(Number(value) / 1000000).toFixed(2)}M`,
                                      "Impressions",
                                    ];
                                  if (name === "clicks")
                                    return [
                                      `${(Number(value) / 1000).toFixed(1)}K`,
                                      "Clicks",
                                    ];
                                  if (name === "ctr")
                                    return [`${value}%`, "CTR"];
                                  return [value, name];
                                }}
                              />
                              <Legend />
                              <Bar
                                dataKey="impressions"
                                name="Impressions"
                                fill={johnDeereGreen}
                              />
                              <Bar
                                dataKey="ctr"
                                name="CTR %"
                                fill={johnDeereYellow}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center text-xs">
                          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div
                              className="font-medium"
                              style={{ color: johnDeereGreen }}
                            >
                              YouTube
                            </div>
                            <div className="mt-1">47% of total</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div
                              className="font-medium"
                              style={{ color: johnDeereGreen }}
                            >
                              Instagram
                            </div>
                            <div className="mt-1">33% of total</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div
                              className="font-medium"
                              style={{ color: johnDeereGreen }}
                            >
                              TikTok
                            </div>
                            <div className="mt-1">20% of total</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conversion Funnel */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">
                        Conversion Funnel
                      </h3>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">2.56M</div>
                          <div className="text-sm text-gray-500">
                            Impressions
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">148.2K</div>
                          <div className="text-sm text-gray-500">
                            Link Clicks
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">35.4K</div>
                          <div className="text-sm text-gray-500">
                            Page Views
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">4,872</div>
                          <div className="text-sm text-gray-500">
                            Conversions
                          </div>
                        </div>
                      </div>

                      {/* Interactive Funnel Chart */}
                      <div className="h-80 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <FunnelChart>
                            <Tooltip
                              formatter={(value, name) => {
                                if (name === "Impressions")
                                  return [
                                    `${(Number(value) / 1000000).toFixed(2)}M`,
                                    name,
                                  ];
                                if (name === "Link Clicks")
                                  return [
                                    `${(Number(value) / 1000).toFixed(1)}K`,
                                    name,
                                  ];
                                if (name === "Page Views")
                                  return [
                                    `${(Number(value) / 1000).toFixed(1)}K`,
                                    name,
                                  ];
                                return [value, name];
                              }}
                            />
                            <Funnel
                              dataKey="value"
                              data={funnelData}
                              isAnimationActive
                            >
                              <LabelList
                                position="right"
                                fill="#374151"
                                stroke="none"
                                dataKey="name"
                              />
                              <LabelList
                                position="left"
                                fill="#374151"
                                stroke="none"
                                dataKey={(entry) => {
                                  if (entry.name === "Impressions")
                                    return `${(entry.value / 1000000).toFixed(2)}M`;
                                  if (
                                    entry.name === "Link Clicks" ||
                                    entry.name === "Page Views"
                                  )
                                    return `${(entry.value / 1000).toFixed(1)}K`;
                                  return entry.value.toLocaleString();
                                }}
                              />
                            </Funnel>
                          </FunnelChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Conversion rates between stages */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                          <div
                            className="text-sm font-medium"
                            style={{ color: johnDeereGreen }}
                          >
                            5.8%
                          </div>
                          <div className="text-xs text-gray-600">
                            Impression to Click
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                          <div
                            className="text-sm font-medium"
                            style={{ color: johnDeereGreen }}
                          >
                            23.9%
                          </div>
                          <div className="text-xs text-gray-600">
                            Click to View
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                          <div
                            className="text-sm font-medium"
                            style={{ color: johnDeereGreen }}
                          >
                            13.8%
                          </div>
                          <div className="text-xs text-gray-600">
                            View to Conversion
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-sm text-gray-600 mt-4">
                        <span
                          className="font-medium"
                          style={{ color: johnDeereGreen }}
                        >
                          3.3%
                        </span>{" "}
                        Total Funnel Conversion Rate
                      </div>
                    </div>
                  </div>

                  {/* Influencer Performance & Geo Data */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">
                        Influencer Performance
                      </h3>

                      <div className="space-y-4">
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                              <img
                                src="/images/john-deere/mike-builder-avatar.png"
                                alt="Mike Builder"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                Mike Builder
                              </div>
                              <div className="text-xs text-gray-500">
                                Construction
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="text-xs text-gray-500">
                                Clicks
                              </div>
                              <div className="font-medium text-sm">82.4K</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">CTR</div>
                              <div className="font-medium text-sm">6.2%</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Conv.</div>
                              <div className="font-medium text-sm">2,345</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                              <img
                                src="/images/john-deere/sarah-fieldwork-avatar.png"
                                alt="Sarah Fieldwork"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                Sarah Fieldwork
                              </div>
                              <div className="text-xs text-gray-500">
                                Agriculture
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="text-xs text-gray-500">
                                Clicks
                              </div>
                              <div className="font-medium text-sm">41.2K</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">CTR</div>
                              <div className="font-medium text-sm">5.8%</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Conv.</div>
                              <div className="font-medium text-sm">1,487</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                              <img
                                src="/images/john-deere/john-mechanics-avatar.png"
                                alt="Josh Mechanics"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                Josh Mechanics
                              </div>
                              <div className="text-xs text-gray-500">
                                Equipment Reviews
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="text-xs text-gray-500">
                                Clicks
                              </div>
                              <div className="font-medium text-sm">24.6K</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">CTR</div>
                              <div className="font-medium text-sm">4.9%</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Conv.</div>
                              <div className="font-medium text-sm">1,040</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <h4 className="text-sm font-medium mb-3 text-left">
                          Top Performing Content
                        </h4>
                        <div className="rounded-lg overflow-hidden mb-3">
                          <video
                            controls
                            className="w-full h-auto"
                            poster="/images/john-deere/330p-tier.avif"
                          >
                            <source
                              src="/video/330 P-Tier Skid Steer.mp4"
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                          <div className="mt-1 text-xs text-left text-gray-600">
                            <div className="font-medium">
                              Mike Builder: "330 P-Tier In Action"
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>82.4K clicks • 2,345 conversions</span>
                              <span>6.2% CTR</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View All Influencers
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">
                        Geographic Distribution
                      </h3>

                      <div className="h-72 bg-white rounded-lg">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={regionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill={johnDeereGreen}
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {regionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [
                                `${value}%`,
                                "Audience Share",
                              ]}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <h4 className="text-sm font-medium mt-4 mb-2">
                        Top States
                      </h4>
                      <div className="space-y-2">
                        {topStatesData.map((state, index) => (
                          <div
                            key={`state-${index}`}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 rounded-full mr-2"
                                style={{
                                  backgroundColor:
                                    index < 2
                                      ? "#367C2B"
                                      : index < 4
                                        ? "#4c8e41"
                                        : "#63a057",
                                }}
                              ></div>
                              <span className="text-sm">{state.name}</span>
                            </div>
                            <span className="text-sm font-medium">
                              {state.value}%
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div
                              className="text-sm font-medium"
                              style={{ color: johnDeereGreen }}
                            >
                              Midwest
                            </div>
                            <div className="mt-1 text-2xl font-bold">32%</div>
                            <div className="text-xs text-gray-500">
                              Highest Engagement
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div
                              className="text-sm font-medium"
                              style={{ color: johnDeereGreen }}
                            >
                              Illinois
                            </div>
                            <div className="mt-1 text-2xl font-bold">8.2%</div>
                            <div className="text-xs text-gray-500">
                              Top State
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-3">Campaign ROI</h3>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Total Investment:
                          </span>
                          <span className="text-sm font-medium">$124,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Estimated Revenue:
                          </span>
                          <span className="text-sm font-medium">$642,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">ROI:</span>
                          <span className="text-sm font-medium text-green-700">
                            516%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Cost per Acquisition:
                          </span>
                          <span className="text-sm font-medium">$25.55</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Campaign Efficiency
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Excellent
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: "92%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
