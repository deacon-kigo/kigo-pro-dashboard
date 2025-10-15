"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GiftIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  ArrowPathIcon,
  ArchiveBoxIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OfferManagerDashboardProps {
  onCreateOffer: () => void;
}

// Mock data based on BRD requirements
const mockOffers = [
  {
    id: "1",
    title: "20% Off Parts & Service",
    description: "Dealer Network Promotion",
    programType: "john_deere",
    programLabel: "John Deere",
    programBadge: "Closed Loop",
    status: "active",
    redemptionMethod: "Promo Code",
    redemptionCount: 1234,
    ctr: "15%",
    daysRemaining: 47,
    offerType: "Percentage Discount",
    campaignCount: 3,
  },
  {
    id: "2",
    title: "$50 Tenant Welcome Bonus",
    description: "Property Portfolio Campaign",
    programType: "yardi",
    programLabel: "Yardi",
    programBadge: "Open Loop",
    status: "active",
    redemptionMethod: "Hub Airdrop",
    redemptionCount: 892,
    ctr: "23%",
    daysRemaining: 12,
    offerType: "Fixed Discount",
    campaignCount: 1,
  },
  {
    id: "3",
    title: "Lightning Deal: BOGO Tools",
    description: "Q4 Flash Sale",
    programType: "general",
    programLabel: "General",
    programBadge: "Hybrid",
    status: "draft",
    redemptionMethod: "Show & Save",
    redemptionCount: 0,
    ctr: "—",
    daysRemaining: null,
    offerType: "BOGO",
    campaignCount: 0,
  },
  {
    id: "4",
    title: "Summer Equipment Financing",
    description: "National Campaign",
    programType: "john_deere",
    programLabel: "John Deere",
    programBadge: "Closed Loop",
    status: "scheduled",
    redemptionMethod: "Online Link",
    redemptionCount: 0,
    ctr: "—",
    daysRemaining: null,
    scheduledDate: "Jun 1, 2026",
    offerType: "Cashback",
    campaignCount: 2,
  },
  {
    id: "5",
    title: "Loyalty Points Boost",
    description: "Member Appreciation Week",
    programType: "yardi",
    programLabel: "Yardi",
    programBadge: "Open Loop",
    status: "active",
    redemptionMethod: "Promo Code",
    redemptionCount: 2145,
    ctr: "31%",
    daysRemaining: 5,
    offerType: "Loyalty Points",
    campaignCount: 4,
  },
];

const statsCards = [
  { label: "All Offers", value: "156", icon: GiftIcon, color: "blue" },
  {
    label: "Active",
    value: "24",
    badge: "✓ Live",
    icon: CheckCircleIcon,
    color: "green",
  },
  {
    label: "Draft",
    value: "8",
    badge: "⏱ Pending",
    icon: ClockIcon,
    color: "orange",
  },
  {
    label: "Scheduled",
    value: "5",
    badge: "📅 Upcoming",
    icon: CalendarIcon,
    color: "purple",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "draft":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "scheduled":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "paused":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getProgramColor = (programType: string) => {
  switch (programType) {
    case "john_deere":
      return "bg-green-50 text-green-700 border-green-200";
    case "yardi":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function OfferManagerDashboard({
  onCreateOffer,
}: OfferManagerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProgram, setFilterProgram] = useState("all");

  const filteredOffers = mockOffers.filter((offer) => {
    const matchesSearch = offer.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || offer.status === filterStatus;
    const matchesProgram =
      filterProgram === "all" || offer.programType === filterProgram;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GiftIcon className="h-7 w-7 text-blue-600" />
            Offer Manager
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage promotional offers and campaigns across all programs
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button
            onClick={onCreateOffer}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <SparklesIcon className="h-4 w-4 mr-2" />
            Create New Offer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.label}
                </h3>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    stat.color === "blue"
                      ? "bg-blue-50"
                      : stat.color === "green"
                        ? "bg-green-50"
                        : stat.color === "orange"
                          ? "bg-orange-50"
                          : "bg-purple-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "green"
                          ? "text-green-600"
                          : stat.color === "orange"
                            ? "text-orange-600"
                            : "text-purple-600"
                    }`}
                  />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              {stat.badge && (
                <p className="text-xs text-gray-500">{stat.badge}</p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Filters & Search */}
      <Card className="p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Programs</option>
              <option value="john_deere">John Deere</option>
              <option value="yardi">Yardi</option>
              <option value="general">General</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="paused">Paused</option>
            </select>

            <Button variant="outline" size="sm">
              <FunnelIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Offers Table */}
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaigns
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.map((offer) => (
                <tr
                  key={offer.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Offer Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <GiftIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {offer.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {offer.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0 h-5 border-gray-300"
                          >
                            {offer.redemptionMethod}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {offer.offerType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Program */}
                  <td className="px-6 py-4">
                    <div>
                      <Badge
                        variant="outline"
                        className={`${getProgramColor(offer.programType)} font-medium`}
                      >
                        {offer.programLabel}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {offer.programBadge}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(offer.status)} font-medium capitalize`}
                      >
                        {offer.status}
                      </Badge>
                      {offer.status === "active" && offer.daysRemaining && (
                        <p className="text-xs text-gray-600 mt-1">
                          {offer.daysRemaining} days left
                        </p>
                      )}
                      {offer.status === "scheduled" && offer.scheduledDate && (
                        <p className="text-xs text-gray-600 mt-1">
                          Starts: {offer.scheduledDate}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Performance */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {offer.redemptionCount.toLocaleString()} redemptions
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {offer.ctr} CTR
                      </p>
                    </div>
                  </td>

                  {/* Campaigns */}
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {offer.campaignCount} campaign
                      {offer.campaignCount !== 1 ? "s" : ""}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer">
                          <ChartBarIcon className="h-4 w-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {offer.status === "active" && (
                          <DropdownMenuItem className="cursor-pointer">
                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="cursor-pointer text-red-600">
                          <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredOffers.length}</span>{" "}
            of <span className="font-medium">{mockOffers.length}</span> offers
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              ← Previous
            </Button>
            <Button variant="outline" size="sm">
              Next →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
