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

// Component props interface
interface CampaignManagementViewProps {
  onBack?: () => void;
}

export default function CampaignManagementView({
  onBack = () => console.log("Back clicked"),
}: CampaignManagementViewProps) {
  const { userProfile } = useDemoState();
  const [activeTab, setActiveTab] = useState("audience");

  return (
    <>
      <PageHeader
        title="Campaign Management"
        description="Create and manage targeted marketing campaigns"
        variant="default"
        logo={
          <div className="h-14 w-24 relative">
            <img
              src="/logos/lowes-logo-white.png"
              alt="Lowes Logo"
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
          defaultValue="audience"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="audience" className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              Audience
            </TabsTrigger>
            <TabsTrigger value="scheduling" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Scheduling
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4" />
              Channels
            </TabsTrigger>
            <TabsTrigger value="deeplinks" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Deep Links
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <ArrowUpTrayIcon className="h-4 w-4" />
              Customer Lists
            </TabsTrigger>
          </TabsList>

          {/* Audience Segmentation Tab */}
          <TabsContent value="audience">
            <Card className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Audience Segmentation
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Target specific customer segments for your campaign
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Import Segments
                  </Button>
                </div>

                {/* Audience segmentation tool */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">
                        Segment Builder
                      </h3>

                      <div className="space-y-6">
                        {/* Demographics filter */}
                        <div>
                          <h4 className="text-md font-medium mb-3 flex items-center">
                            <UsersIcon className="h-4 w-4 mr-2 text-blue-600" />
                            Demographics
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Age Range
                              </label>
                              <div className="flex items-center space-x-3">
                                <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                  <option value="">Any Age</option>
                                  <option value="18-24">18-24</option>
                                  <option value="25-34">25-34</option>
                                  <option value="35-44">35-44</option>
                                  <option value="45-54">45-54</option>
                                  <option value="55-64">55-64</option>
                                  <option value="65+">65+</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Homeowner Status
                              </label>
                              <div className="flex items-center space-x-3">
                                <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                  <option value="">Any Status</option>
                                  <option value="homeowner">Homeowner</option>
                                  <option value="renter">Renter</option>
                                  <option value="new-homeowner">
                                    New Homeowner (≤ 1 year)
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Location filter */}
                        <div>
                          <h4 className="text-md font-medium mb-3 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Location
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Region
                              </label>
                              <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Any Region</option>
                                <option value="northeast">Northeast</option>
                                <option value="southeast">Southeast</option>
                                <option value="midwest">Midwest</option>
                                <option value="southwest">Southwest</option>
                                <option value="west">West</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                State
                              </label>
                              <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Any State</option>
                                <option value="CA">California</option>
                                <option value="TX">Texas</option>
                                <option value="FL">Florida</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                {/* More states would be here */}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP Code Range
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 90210, 30301-30381"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Purchase history filter */}
                        <div>
                          <h4 className="text-md font-medium mb-3 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                            Purchase History
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Categories
                              </label>
                              <select
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                multiple
                                size={3}
                              >
                                <option value="tools">Tools & Hardware</option>
                                <option value="appliances">Appliances</option>
                                <option value="plumbing">Plumbing</option>
                                <option value="electrical">Electrical</option>
                                <option value="paint">Paint</option>
                                <option value="garden">Garden & Outdoor</option>
                              </select>
                              <p className="mt-1 text-xs text-gray-500">
                                Hold Ctrl/Cmd to select multiple
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Purchase Recency
                              </label>
                              <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Any Time</option>
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 90 days</option>
                                <option value="180">Last 6 months</option>
                                <option value="365">Last year</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                          <Button variant="outline">Reset Filters</Button>
                          <Button variant="primary">Apply Filters</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload & segment summary */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
                      <h3 className="text-lg font-medium mb-4">
                        Upload Audience
                      </h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium text-blue-600">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          CSV, XLS, or XLSX (max 10MB)
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".csv,.xls,.xlsx"
                        />
                        <Button variant="outline" className="mt-4">
                          Upload File
                        </Button>
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        <p className="font-medium">Supported formats:</p>
                        <ul className="list-disc ml-5 mt-1 text-xs">
                          <li>Customer email addresses</li>
                          <li>Mobile phone numbers</li>
                          <li>Customer IDs</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-2">
                        Estimated Audience
                      </h3>
                      <div className="text-3xl font-bold text-blue-600">
                        24,580
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        customers match your current criteria
                      </p>

                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Homeowners:</span>
                          <span className="font-medium">16,721</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600">
                            Recent purchasers:
                          </span>
                          <span className="font-medium">8,954</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-600">
                            Southeast region:
                          </span>
                          <span className="font-medium">11,280</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Scheduling Tab */}
          <TabsContent value="scheduling">
            <Card className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Campaign Scheduling
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Set campaign start and end dates with delivery timing
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Schedule Templates
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Campaign Duration */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Campaign Duration
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date & Time
                          </label>
                          <div className="flex flex-col space-y-2">
                            <input
                              type="date"
                              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              defaultValue={
                                new Date().toISOString().split("T")[0]
                              }
                            />
                            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                              <option value="00:00">12:00 AM</option>
                              <option value="08:00">8:00 AM</option>
                              <option value="09:00" selected>
                                9:00 AM
                              </option>
                              <option value="10:00">10:00 AM</option>
                              <option value="11:00">11:00 AM</option>
                              <option value="12:00">12:00 PM</option>
                              <option value="13:00">1:00 PM</option>
                              <option value="14:00">2:00 PM</option>
                              <option value="15:00">3:00 PM</option>
                              <option value="16:00">4:00 PM</option>
                            </select>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            When the campaign will begin sending
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date & Time
                          </label>
                          <div className="flex flex-col space-y-2">
                            <input
                              type="date"
                              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              defaultValue={
                                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            />
                            <select className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                              <option value="23:59" selected>
                                11:59 PM
                              </option>
                              <option value="17:00">5:00 PM</option>
                              <option value="18:00">6:00 PM</option>
                              <option value="19:00">7:00 PM</option>
                              <option value="20:00">8:00 PM</option>
                              <option value="21:00">9:00 PM</option>
                            </select>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            When the campaign will stop sending
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2 text-gray-700">
                          Campaign Duration
                        </h4>
                        <div className="h-10 relative bg-gray-100 rounded-full">
                          <div
                            className="absolute top-0 left-0 h-10 bg-blue-100 rounded-full"
                            style={{ width: "70%" }}
                          ></div>
                          <div className="absolute top-0 left-0 h-10 flex items-center justify-center w-full">
                            <span className="text-sm font-medium">30 Days</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-md font-medium mb-3">
                          Delivery Timing
                        </h4>

                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="timing-immediate"
                              name="delivery-timing"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              defaultChecked
                            />
                            <label
                              htmlFor="timing-immediate"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Send immediately (once per recipient)
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="timing-scheduled"
                              name="delivery-timing"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label
                              htmlFor="timing-scheduled"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Schedule for specific date/time
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="timing-recurring"
                              name="delivery-timing"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label
                              htmlFor="timing-recurring"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Recurring (specify frequency)
                            </label>
                          </div>
                        </div>

                        <div className="mt-4 pl-6">
                          <div className="grid grid-cols-2 gap-4">
                            <select
                              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              disabled
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly" selected>
                                Weekly
                              </option>
                              <option value="biweekly">Bi-weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>

                            <select
                              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                              disabled
                            >
                              <option value="monday">Monday</option>
                              <option value="tuesday">Tuesday</option>
                              <option value="wednesday">Wednesday</option>
                              <option value="thursday" selected>
                                Thursday
                              </option>
                              <option value="friday">Friday</option>
                              <option value="saturday">Saturday</option>
                              <option value="sunday">Sunday</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calendar & Optimization */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
                      <h3 className="text-lg font-medium mb-3">
                        Calendar View
                      </h3>

                      {/* Simple mini calendar display */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>
                          <span className="font-medium">May 2023</span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-0 text-center">
                          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                            <div
                              key={i}
                              className="px-1 py-1 text-xs font-medium bg-gray-50 border-b border-gray-200"
                            >
                              {day}
                            </div>
                          ))}

                          {/* Calendar days - first row */}
                          <div className="px-1 py-2 text-xs text-gray-400">
                            30
                          </div>
                          <div className="px-1 py-2 text-xs">1</div>
                          <div className="px-1 py-2 text-xs">2</div>
                          <div className="px-1 py-2 text-xs">3</div>
                          <div className="px-1 py-2 text-xs">4</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">5</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">6</div>

                          {/* Second row */}
                          <div className="px-1 py-2 text-xs bg-blue-50">7</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">8</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">9</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">10</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">11</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">12</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">13</div>

                          {/* More rows abbreviated */}
                          <div className="px-1 py-2 text-xs bg-blue-50">14</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">15</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">16</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">17</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">18</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">19</div>
                          <div className="px-1 py-2 text-xs bg-blue-50">20</div>
                        </div>
                      </div>

                      <div className="mt-3 text-xs">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-sm bg-blue-50 mr-1"></div>
                          <span className="text-gray-600">Campaign Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-3">
                        Timing Optimization
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Based on historical data, these times have the highest
                        engagement rates for your audience:
                      </p>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700">
                            Thu, 6-8 PM
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            28% Open Rate
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700">
                            Sat, 10 AM-12 PM
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            24% Open Rate
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700">
                            Wed, 12-2 PM
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            19% Open Rate
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="mt-4 w-full"
                        size="sm"
                      >
                        Apply Optimized Timing
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="channels">
            <Card className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Delivery Channels</h2>
                    <p className="text-gray-600 mt-1">
                      Configure how your campaign will reach customers
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Channel Settings
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Channel Selection */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">
                        Channel Selection
                      </h3>

                      <div className="space-y-6">
                        {/* Email Channel */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <input
                                type="checkbox"
                                id="channel-email"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <label
                                  htmlFor="channel-email"
                                  className="font-medium text-gray-800"
                                >
                                  Email
                                </label>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Recommended
                                </span>
                              </div>

                              <p className="text-sm text-gray-600 mt-1 mb-3">
                                Send personalized emails with rich content and
                                tracking capabilities.
                              </p>

                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-gray-800 mb-2">
                                  Email Configuration
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Email Template
                                    </label>
                                    <select className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                      <option value="spring-promo">
                                        Spring Promotion
                                      </option>
                                      <option value="discount-offer" selected>
                                        Discount Offer
                                      </option>
                                      <option value="new-products">
                                        New Products
                                      </option>
                                      <option value="newsletter">
                                        Newsletter
                                      </option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Sender Profile
                                    </label>
                                    <select className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                      <option value="marketing">
                                        Lowes Marketing
                                      </option>
                                      <option value="customer-service">
                                        Customer Service
                                      </option>
                                      <option value="local-store" selected>
                                        Local Store Manager
                                      </option>
                                    </select>
                                  </div>
                                </div>

                                <div className="mt-3">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Email Subject Line
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    defaultValue="Special Spring Offer Just For You"
                                  />
                                </div>

                                <div className="mt-3 flex justify-end">
                                  <Button variant="outline" size="xs">
                                    Preview Template
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SMS Channel */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <input
                                type="checkbox"
                                id="channel-sms"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <label
                                  htmlFor="channel-sms"
                                  className="font-medium text-gray-800"
                                >
                                  SMS
                                </label>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  High Engagement
                                </span>
                              </div>

                              <p className="text-sm text-gray-600 mt-1 mb-3">
                                Send direct text messages for immediate reach
                                and high open rates.
                              </p>

                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-gray-800 mb-2">
                                  SMS Configuration
                                </h4>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Message Text (160 char. max)
                                  </label>
                                  <textarea
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    defaultValue="LOWES: 20% off your next purchase! Use code HOME20 in-store or online. Valid through 5/31. Exclusions apply. Reply STOP to opt out."
                                  ></textarea>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Character count:{" "}
                                    <span className="font-medium">141</span>/160
                                  </p>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Include Link
                                    </label>
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        id="sms-include-link"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        defaultChecked
                                      />
                                      <label
                                        htmlFor="sms-include-link"
                                        className="ml-2 text-xs text-gray-700"
                                      >
                                        Add tracking link
                                      </label>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Opt-out Message
                                    </label>
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        id="sms-include-optout"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        defaultChecked
                                      />
                                      <label
                                        htmlFor="sms-include-optout"
                                        className="ml-2 text-xs text-gray-700"
                                      >
                                        Include STOP instructions
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* In-App Channel */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <input
                                type="checkbox"
                                id="channel-app"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                defaultChecked
                              />
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <label
                                  htmlFor="channel-app"
                                  className="font-medium text-gray-800"
                                >
                                  In-App Notification
                                </label>
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                  App Users Only
                                </span>
                              </div>

                              <p className="text-sm text-gray-600 mt-1 mb-3">
                                Target active app users with personalized in-app
                                messages.
                              </p>

                              <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-gray-800 mb-2">
                                  In-App Configuration
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Notification Type
                                    </label>
                                    <select className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                      <option value="banner">
                                        Banner Message
                                      </option>
                                      <option value="modal" selected>
                                        Modal Popup
                                      </option>
                                      <option value="inbox">
                                        Inbox Message
                                      </option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Display Duration
                                    </label>
                                    <select className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                                      <option value="1">1 Day</option>
                                      <option value="3" selected>
                                        3 Days
                                      </option>
                                      <option value="7">7 Days</option>
                                      <option value="14">14 Days</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="mt-3">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Message Content
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    defaultValue="Spring Into Savings! Get 20% off with code HOME20"
                                  />
                                </div>

                                <div className="mt-3 flex justify-end">
                                  <Button variant="outline" size="xs">
                                    Preview In-App
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Channel Effectiveness & Settings */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
                      <h3 className="text-lg font-medium mb-4">
                        Channel Effectiveness
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">Email</span>
                            <span className="text-gray-700">22% Open Rate</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: "65%" }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">SMS</span>
                            <span className="text-gray-700">96% Open Rate</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: "90%" }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">In-App</span>
                            <span className="text-gray-700">84% View Rate</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: "75%" }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Recommendation:</span>{" "}
                          Use a multi-channel approach to maximize reach and
                          engagement.
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-3">
                        Audience Channel Coverage
                      </h3>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Email addresses:
                          </span>
                          <span className="text-sm font-medium">
                            24,580 (100%)
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Mobile numbers:
                          </span>
                          <span className="text-sm font-medium">
                            18,435 (75%)
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            App users:
                          </span>
                          <span className="text-sm font-medium">
                            9,832 (40%)
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            All channels:
                          </span>
                          <span className="text-sm font-medium">
                            7,865 (32%)
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <Button className="w-full" variant="outline" size="sm">
                          Collect More Mobile Numbers
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="deeplinks">
            <Card className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Deep Links & Tracking
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Create and manage trackable links for your campaign
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Import Links
                    </Button>
                    <Button variant="primary" size="sm">
                      New Link
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Link Management Section */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium">Campaign Links</h3>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search links..."
                            className="pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                      </div>

                      {/* Links Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Link Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Destination
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Clicks
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
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-blue-100 rounded-md">
                                    <svg
                                      className="h-4 w-4 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                                      />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      Spring Sale Homepage
                                    </div>
                                    <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                                      kigo.ly/spring-23
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  lowes.com/spring-sale
                                </div>
                                <div className="text-xs text-gray-500">
                                  Product page
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  1,245
                                </div>
                                <div className="text-xs text-gray-500">
                                  3.2% CTR
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                  <button className="text-gray-600 hover:text-gray-800">
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
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-green-100 rounded-md">
                                    <svg
                                      className="h-4 w-4 text-green-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                                      />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      Patio Furniture Deals
                                    </div>
                                    <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                                      kigo.ly/patio-furn
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  lowes.com/dept/patio-furniture
                                </div>
                                <div className="text-xs text-gray-500">
                                  Category page
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">968</div>
                                <div className="text-xs text-gray-500">
                                  2.8% CTR
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                  <button className="text-gray-600 hover:text-gray-800">
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
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-purple-100 rounded-md">
                                    <svg
                                      className="h-4 w-4 text-purple-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                                      />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      Garden Tools Discount
                                    </div>
                                    <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                                      kigo.ly/tools-coupon
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  lowes.com/coupon/spring-tools
                                </div>
                                <div className="text-xs text-gray-500">
                                  Coupon page
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">721</div>
                                <div className="text-xs text-gray-500">
                                  2.1% CTR
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                  <button className="text-gray-600 hover:text-gray-800">
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
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Showing 3 of 14 links
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
                              className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
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
                              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                              3
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

                  {/* QR Code Generator & Analytics */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">
                        QR Code Generator
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Link
                          </label>
                          <select className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                            <option value="spring-23">
                              Spring Sale Homepage
                            </option>
                            <option value="patio-furn">
                              Patio Furniture Deals
                            </option>
                            <option value="tools-coupon">
                              Garden Tools Discount
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            QR Code Customization
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <select className="px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                              <option value="default">Default Style</option>
                              <option value="rounded">Rounded Corners</option>
                              <option value="dotted">Dotted Pattern</option>
                            </select>
                            <div className="flex">
                              <div className="w-8 h-8 rounded-l border-l border-y border-gray-300 flex items-center justify-center bg-gray-50">
                                <svg
                                  className="h-5 w-5 text-gray-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 2a1 1 0 011-1h8a1 1 0 011 1v1H5V4zm10 10a1 1 0 01-1 1H6a1 1 0 01-1-1v-6h10v6zM8 10a1 1 0 100 2h4a1 1 0 100-2H8z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <input
                                type="text"
                                value="#1E40AF"
                                className="rounded-r border-r border-y border-gray-300 flex-1 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-36 h-36 bg-white p-2 border border-gray-300 rounded-md flex items-center justify-center">
                            <div className="w-full h-full bg-[url('/images/sample-qr.png')] bg-contain bg-center bg-no-repeat"></div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            className="w-full"
                            variant="outline"
                            size="sm"
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            Download
                          </Button>
                          <Button
                            className="w-full"
                            variant="outline"
                            size="sm"
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
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                              />
                            </svg>
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">
                        Link Analytics
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Performance Overview
                          </h4>
                          <div className="flex items-baseline">
                            <div className="text-2xl font-bold">2,934</div>
                            <div className="ml-2 text-sm text-green-600 flex items-center">
                              <svg
                                className="w-3 h-3 mr-1"
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
                              12.5%
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Total clicks across all links
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Top Performers
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                Spring Sale Homepage
                              </div>
                              <div className="text-sm font-medium">42.4%</div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: "42.4%" }}
                              ></div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                Patio Furniture Deals
                              </div>
                              <div className="text-sm font-medium">33.0%</div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: "33.0%" }}
                              ></div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                Garden Tools Discount
                              </div>
                              <div className="text-sm font-medium">24.6%</div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: "24.6%" }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                          <Button
                            className="w-full"
                            variant="outline"
                            size="sm"
                          >
                            View Detailed Analytics
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Customer Lists</h2>
                    <p className="text-gray-600 mt-1">
                      Import and manage customer lists for targeted campaigns
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Import List
                    </Button>
                    <Button variant="primary" size="sm">
                      Create List
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Lists Management */}
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium">Your Lists</h3>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search lists..."
                            className="pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                      </div>

                      {/* Lists Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                List Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Contacts
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Last Updated
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
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-blue-100 rounded-md">
                                    <svg
                                      className="h-4 w-4 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                      />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      Spring Homeowners
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Created on Apr 15, 2023
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  12,458
                                </div>
                                <div className="text-xs text-gray-500">
                                  98% valid
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  May 3, 2023
                                </div>
                                <div className="text-xs text-gray-500">
                                  by John Smith
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                  <button className="text-blue-600 hover:text-blue-800">
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
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-green-100 rounded-md">
                                    <svg
                                      className="h-4 w-4 text-green-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                      />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      Southeast DIYers
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Created on Feb 28, 2023
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  9,872
                                </div>
                                <div className="text-xs text-gray-500">
                                  95% valid
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  Apr 10, 2023
                                </div>
                                <div className="text-xs text-gray-500">
                                  by Sarah Johnson
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                  <button className="text-blue-600 hover:text-blue-800">
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
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-purple-100 rounded-md">
                                    <svg
                                      className="h-4 w-4 text-purple-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                      />
                                    </svg>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      Loyal Customers
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Created on Jan 12, 2023
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  18,356
                                </div>
                                <div className="text-xs text-gray-500">
                                  99% valid
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  May 1, 2023
                                </div>
                                <div className="text-xs text-gray-500">
                                  by John Smith
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                  <button className="text-blue-600 hover:text-blue-800">
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                  <button className="text-blue-600 hover:text-blue-800">
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
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          Showing 3 of 8 lists
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
                              className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
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
                              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                              3
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

                  {/* List Upload & Stats */}
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">
                        Upload Customer Data
                      </h3>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium text-blue-600">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          CSV, XLS, or XLSX (max 20MB)
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".csv,.xls,.xlsx"
                        />
                        <Button variant="outline" className="mt-4">
                          Upload File
                        </Button>
                      </div>

                      <div className="mt-4 text-sm text-gray-600">
                        <p className="font-medium">Required columns:</p>
                        <ul className="list-disc ml-5 mt-1 text-xs">
                          <li>Email (required)</li>
                          <li>First Name</li>
                          <li>Last Name</li>
                          <li>Phone Number</li>
                          <li>Zip Code</li>
                        </ul>
                        <p className="mt-2 text-xs text-gray-500">
                          <a href="#" className="text-blue-600 hover:underline">
                            Download template
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-3">
                        List Statistics
                      </h3>

                      <div className="mt-2 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Total lists:
                          </span>
                          <span className="text-sm font-medium">8</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Total contacts:
                          </span>
                          <span className="text-sm font-medium">45,782</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Average list size:
                          </span>
                          <span className="text-sm font-medium">5,723</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-700">
                            Last upload:
                          </span>
                          <span className="text-sm font-medium">
                            May 3, 2023
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <h4 className="text-sm font-medium mb-2">
                          List Growth
                        </h4>
                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden w-full">
                          <div
                            className="h-2.5 rounded-full"
                            style={{
                              width: "68%",
                              backgroundColor: "#3b82f6",
                              display: "block",
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-600">
                            +12.4% this month
                          </span>
                          <span className="text-xs font-medium">68%</span>
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
