"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  PlusIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { offersService } from "@/lib/services/offersService";
import type { Offer, OfferStatus, OfferType } from "@/types/offers";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setOfferSelectionMode,
  setSelectedOffer,
} from "@/lib/redux/slices/offerManagerSlice";

// Mock data for offer selection (fallback when database is not available)
const mockOffers: Offer[] = [
  {
    id: "offer-1",
    title: "20% Off All Menu Items",
    description: "Get 20% off your entire order at participating locations",
    offer_type: "percentage_savings",
    offer_status: "published",
    value: "20% OFF",
    external_reference: "SAVE20",
    offer_redemption_methods: ["promo_code", "show_and_save"],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "offer-2",
    title: "Buy One Get One Free",
    description: "Purchase any entree and get a second one free",
    offer_type: "bogo",
    offer_status: "published",
    value: "BOGO",
    external_reference: "BOGO2024",
    offer_redemption_methods: ["promo_code"],
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
  {
    id: "offer-3",
    title: "$10 Off Orders Over $50",
    description: "Save $10 when you spend $50 or more",
    offer_type: "dollars_off",
    offer_status: "published",
    value: "$10 OFF",
    external_reference: "SAVE10",
    offer_redemption_methods: ["promo_code", "barcode"],
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-05T10:00:00Z",
  },
  {
    id: "offer-4",
    title: "Free Dessert with Entree",
    description: "Enjoy a complimentary dessert with any entree purchase",
    offer_type: "free_with_purchase",
    offer_status: "published",
    value: "FREE DESSERT",
    external_reference: "FREEDESSERT",
    offer_redemption_methods: ["show_and_save"],
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "offer-5",
    title: "Earn 500 Loyalty Points",
    description: "Get 500 bonus points on your next purchase",
    offer_type: "loyalty_points",
    offer_status: "draft",
    value: "500 POINTS",
    external_reference: "POINTS500",
    offer_redemption_methods: ["loyalty_card"],
    created_at: "2023-12-28T10:00:00Z",
    updated_at: "2023-12-28T10:00:00Z",
  },
  {
    id: "offer-6",
    title: "Summer Sale - 30% Off",
    description: "Special summer promotion - 30% off all items",
    offer_type: "percentage_savings",
    offer_status: "expired",
    value: "30% OFF",
    external_reference: "SUMMER30",
    offer_redemption_methods: ["promo_code"],
    created_at: "2023-12-20T10:00:00Z",
    updated_at: "2023-12-20T10:00:00Z",
  },
];

interface OfferSelectionStepProps {
  onNext: () => void;
  onCreateNew: () => void;
}

/**
 * Offer Selection Step
 *
 * First step in campaign creation workflow
 * Allows users to either:
 * 1. Select an existing offer from catalog
 * 2. Create a new offer
 */
export default function OfferSelectionStep({
  onNext,
  onCreateNew,
}: OfferSelectionStepProps) {
  const dispatch = useAppDispatch();
  const { selectedOffer, offerSelectionMode } = useAppSelector(
    (state) => state.offerManager
  );

  // Local state for offers list
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OfferStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<OfferType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Fetch offers on component mount
   */
  useEffect(() => {
    fetchOffers();
  }, [statusFilter, typeFilter]);

  /**
   * Fetch offers from API (with mock data fallback)
   */
  const fetchOffers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: any = {
        limit: 100,
        sort_by: "created_at",
        sort_order: "desc",
      };

      if (statusFilter !== "all") {
        params.offer_status = statusFilter;
      }

      if (typeFilter !== "all") {
        params.offer_type = typeFilter;
      }

      const response = await offersService.listOffers(params);

      if (response.success && response.data) {
        setOffers(response.data.offers);
      } else {
        // Use mock data as fallback when API fails
        console.log("Using mock data for offer selection");
        let filteredMockOffers = [...mockOffers];

        if (statusFilter !== "all") {
          filteredMockOffers = filteredMockOffers.filter(
            (offer) => offer.offer_status === statusFilter
          );
        }

        if (typeFilter !== "all") {
          filteredMockOffers = filteredMockOffers.filter(
            (offer) => offer.offer_type === typeFilter
          );
        }

        setOffers(filteredMockOffers);
      }
    } catch (err) {
      // Use mock data on error
      console.log("Using mock data due to error:", err);
      let filteredMockOffers = [...mockOffers];

      if (statusFilter !== "all") {
        filteredMockOffers = filteredMockOffers.filter(
          (offer) => offer.offer_status === statusFilter
        );
      }

      if (typeFilter !== "all") {
        filteredMockOffers = filteredMockOffers.filter(
          (offer) => offer.offer_type === typeFilter
        );
      }

      setOffers(filteredMockOffers);
    }

    setIsLoading(false);
  };

  /**
   * Handle offer selection
   */
  const handleSelectOffer = (offer: Offer) => {
    dispatch(setSelectedOffer(offer));
    dispatch(setOfferSelectionMode("select"));
  };

  /**
   * Handle create new offer
   */
  const handleCreateNew = () => {
    dispatch(setSelectedOffer(undefined));
    dispatch(setOfferSelectionMode("create"));
    onCreateNew();
  };

  /**
   * Filter offers by search query
   */
  const filteredOffers = offers.filter((offer) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      offer.title?.toLowerCase().includes(query) ||
      offer.description?.toLowerCase().includes(query) ||
      offer.external_reference?.toLowerCase().includes(query) ||
      offer.id.toLowerCase().includes(query)
    );
  });

  /**
   * Format offer type for display
   */
  const formatOfferType = (type: OfferType): string => {
    const typeMap: Record<OfferType, string> = {
      bogo: "BOGO",
      percentage_savings: "Percentage Off",
      dollars_off: "Dollars Off",
      cashback: "Cashback",
      free_with_purchase: "Free with Purchase",
      price_point: "Price Point",
      clickthrough: "Clickthrough",
      loyalty_points: "Loyalty Points",
      spend_and_get: "Spend & Get",
    };
    return typeMap[type] || type;
  };

  /**
   * Get status badge color
   */
  const getStatusColor = (status: OfferStatus): string => {
    const colorMap: Record<OfferStatus, string> = {
      draft: "bg-gray-100 text-gray-700",
      published: "bg-green-100 text-green-700",
      archived: "bg-yellow-100 text-yellow-700",
      expired: "bg-red-100 text-red-700",
    };
    return colorMap[status];
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Select or Create Offer
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Choose an existing offer from your catalog or create a new one
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Create New Offer
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search offers by title, description, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <FunnelIcon className="h-5 w-5" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as OfferStatus | "all")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as OfferType | "all")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="percentage_savings">Percentage Off</option>
                <option value="dollars_off">Dollars Off</option>
                <option value="bogo">BOGO</option>
                <option value="cashback">Cashback</option>
                <option value="free_with_purchase">Free with Purchase</option>
                <option value="price_point">Price Point</option>
                <option value="clickthrough">Clickthrough</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-700 text-center">{error}</p>
          <Button
            variant="outline"
            onClick={fetchOffers}
            className="mt-4 mx-auto block"
          >
            Try Again
          </Button>
        </Card>
      )}

      {/* Offers Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOffers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                No offers found. Create your first offer to get started.
              </p>
              <Button onClick={handleCreateNew} className="mt-4">
                <PlusIcon className="h-5 w-5 mr-2" />
                Create First Offer
              </Button>
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <Card
                key={offer.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedOffer?.id === offer.id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : ""
                }`}
                onClick={() => handleSelectOffer(offer)}
              >
                {/* Selected Indicator */}
                {selectedOffer?.id === offer.id && (
                  <div className="flex justify-end mb-2">
                    <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                  </div>
                )}

                {/* Offer Title */}
                <h3 className="font-semibold text-gray-900 mb-2">
                  {offer.title || offer.external_reference || "Untitled Offer"}
                </h3>

                {/* Offer Description */}
                {offer.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {offer.description}
                  </p>
                )}

                {/* Offer Type and Value */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                    {formatOfferType(offer.offer_type)}
                  </span>
                  {offer.value && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded font-medium">
                      {offer.value}
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 text-sm rounded font-medium ${getStatusColor(
                      offer.offer_status
                    )}`}
                  >
                    {offer.offer_status.charAt(0).toUpperCase() +
                      offer.offer_status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(offer.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Redemption Methods */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {offer.offer_redemption_methods.map((method) => (
                    <span
                      key={method}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                    >
                      {method.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Selected Offer Summary */}
      {selectedOffer && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Selected Offer
              </h3>
              <p className="text-blue-700">
                {selectedOffer.title ||
                  selectedOffer.external_reference ||
                  "Untitled Offer"}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {formatOfferType(selectedOffer.offer_type)} •{" "}
                {selectedOffer.offer_status}
              </p>
            </div>
            <Button onClick={onNext} className="flex items-center gap-2">
              Continue to Campaign Setup →
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
