"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GiftIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  ArchiveBoxIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OfferManagerDashboardV1Props {
  onCreateOffer: () => void;
}

// Simple mock data for V1 - no analytics
const mockOffersV1 = [
  {
    id: "1",
    offerName: "20% Off Dinner Entrees",
    description: "Get 20% off any dinner entree when you dine in",
    shortText: "20% Off Dinner Entrees", // Backward compatibility
    longText: "Get 20% off any dinner entree when you dine in", // Backward compatibility
    status: "active",
    startDate: "2026-01-15",
    endDate: "2026-03-15",
    redemptionType: "mobile",
    promoCode: "DINNER20",
    usageCount: 47,
  },
  {
    id: "2",
    offerName: "Buy One Get One Free Appetizer",
    description: "Purchase any appetizer and get a second one free",
    shortText: "Buy One Get One Free Appetizer",
    longText: "Purchase any appetizer and get a second one free",
    status: "active",
    startDate: "2026-02-01",
    endDate: "2026-02-28",
    redemptionType: "online_print",
    promoCode: "BOGO2026",
    usageCount: 23,
  },
  {
    id: "3",
    offerName: "$10 Off Your Next Visit",
    description: "Save $10 on any purchase of $50 or more",
    shortText: "$10 Off Your Next Visit",
    longText: "Save $10 on any purchase of $50 or more",
    status: "draft",
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    redemptionType: "mobile",
    promoCode: "SAVE10",
    usageCount: 0,
  },
  {
    id: "4",
    offerName: "Free Dessert with Entree",
    description: "Enjoy a complimentary dessert with any entree purchase",
    shortText: "Free Dessert with Entree",
    longText: "Enjoy a complimentary dessert with any entree purchase",
    status: "scheduled",
    startDate: "2026-04-01",
    endDate: "2026-05-31",
    redemptionType: "external_url",
    promoCode: "—",
    usageCount: 0,
  },
  {
    id: "5",
    offerName: "Happy Hour Special",
    description: "50% off drinks and appetizers 3-6pm weekdays",
    shortText: "Happy Hour Special",
    longText: "50% off drinks and appetizers 3-6pm weekdays",
    status: "paused",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    redemptionType: "mobile",
    promoCode: "HAPPYHOUR",
    usageCount: 156,
  },
];

const getStatusClassV1 = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-300";
    case "draft":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "scheduled":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "paused":
      return "bg-gray-100 text-gray-800 border-gray-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getRedemptionTypeLabel = (type: string) => {
  switch (type) {
    case "mobile":
      return "Mobile";
    case "online_print":
      return "Online Print";
    case "external_url":
      return "External URL";
    default:
      return type;
  }
};

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const today = new Date();
  const diff = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff > 0 ? diff : 0;
};

export default function OfferManagerDashboardV1({
  onCreateOffer,
}: OfferManagerDashboardV1Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOffers = mockOffersV1.filter((offer) => {
    const matchesSearch = (offer.offerName || offer.shortText)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || offer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Simple stats
  const activeCount = mockOffersV1.filter((o) => o.status === "active").length;
  const draftCount = mockOffersV1.filter((o) => o.status === "draft").length;
  const totalUsage = mockOffersV1.reduce((sum, o) => sum + o.usageCount, 0);

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-gradient-to-r from-white/95 via-white/90 to-white/85 backdrop-blur-md">
        <div className="h-[72px] flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Offer Manager</h1>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage promotional offers
            </p>
          </div>
          <Button onClick={onCreateOffer} className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Create New Offer
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Simple Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border border-green-200 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Active Offers
                  </p>
                  <p className="text-3xl font-bold text-green-700 mt-1">
                    {activeCount}
                  </p>
                </div>
                <CheckCircleIcon className="h-10 w-10 text-green-500" />
              </div>
            </Card>

            <Card className="p-4 border border-yellow-200 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Draft Offers
                  </p>
                  <p className="text-3xl font-bold text-yellow-700 mt-1">
                    {draftCount}
                  </p>
                </div>
                <ClockIcon className="h-10 w-10 text-yellow-500" />
              </div>
            </Card>

            <Card className="p-4 border border-blue-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Total Redemptions
                  </p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">
                    {totalUsage}
                  </p>
                </div>
                <GiftIcon className="h-10 w-10 text-blue-500" />
              </div>
            </Card>
          </div>

          {/* Simple Filters */}
          <Card className="p-4 border border-gray-300">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search offers by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 text-base"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-base bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </Card>

          {/* Offers List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Offers</h2>
              <p className="text-sm text-gray-600 font-medium">
                Showing {filteredOffers.length} of {mockOffersV1.length} offers
              </p>
            </div>

            {filteredOffers.length === 0 ? (
              <Card className="p-12 text-center border border-dashed border-gray-300">
                <GiftIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600">
                  No offers found
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search or filters
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOffers.map((offer) => {
                  const daysLeft =
                    offer.status === "active"
                      ? getDaysRemaining(offer.endDate)
                      : null;

                  return (
                    <Card
                      key={offer.id}
                      className="p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Offer Icon & Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md bg-primary">
                            <GiftIcon className="h-7 w-7 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-gray-900">
                              {offer.offerName || offer.shortText}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {offer.description || offer.longText}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              <Badge
                                variant="outline"
                                className={`text-sm px-2 py-1 font-semibold border ${getStatusClassV1(offer.status)}`}
                              >
                                {offer.status.toUpperCase()}
                              </Badge>

                              <Badge
                                variant="outline"
                                className="text-sm px-2 py-1 border border-gray-300 bg-white"
                              >
                                {getRedemptionTypeLabel(offer.redemptionType)}
                              </Badge>

                              {offer.promoCode !== "—" && (
                                <Badge
                                  variant="outline"
                                  className="text-sm px-2 py-1 font-mono border border-blue-300 bg-blue-50 text-blue-700"
                                >
                                  {offer.promoCode}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex items-center gap-6 lg:gap-4">
                          {/* Usage Count */}
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                              {offer.usageCount}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">
                              uses
                            </p>
                          </div>

                          {/* Days Left */}
                          {daysLeft !== null && (
                            <>
                              <div className="h-12 w-px bg-gray-300" />
                              <div className="text-center">
                                <p className="text-2xl font-bold text-orange-600">
                                  {daysLeft}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">
                                  days left
                                </p>
                              </div>
                            </>
                          )}

                          {/* Scheduled Date */}
                          {offer.status === "scheduled" && (
                            <>
                              <div className="h-12 w-px bg-gray-300" />
                              <div className="flex items-center gap-2 text-purple-700">
                                <CalendarIcon className="h-5 w-5" />
                                <div className="text-left">
                                  <p className="text-sm font-medium">Starts</p>
                                  <p className="text-sm font-semibold">
                                    {new Date(
                                      offer.startDate
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border border-gray-300 hover:bg-gray-50"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border border-gray-300 hover:bg-gray-50"
                                >
                                  <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                {offer.status === "active" && (
                                  <DropdownMenuItem className="cursor-pointer">
                                    <ClockIcon className="h-4 w-4 mr-2" />
                                    Pause
                                  </DropdownMenuItem>
                                )}
                                {offer.status === "paused" && (
                                  <DropdownMenuItem className="cursor-pointer">
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    Resume
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="cursor-pointer text-red-600">
                                  <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Simple Pagination */}
          {filteredOffers.length > 0 && (
            <Card className="p-4 border border-gray-300">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 font-medium">
                  Showing {filteredOffers.length} of {mockOffersV1.length}{" "}
                  offers
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="border border-gray-300"
                  >
                    ← Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border border-gray-300"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
