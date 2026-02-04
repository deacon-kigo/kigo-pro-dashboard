"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MagnifyingGlassIcon,
  HomeIcon,
  GiftIcon,
  WalletIcon,
  UserCircleIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

// Mock Yardi Marketplace Data
const yardiOffers = [
  {
    id: "1",
    merchant: "Home Services Pro",
    title: "20% Off Cleaning & Handyman Services",
    description:
      "Professional home services for new tenants. Includes deep cleaning, minor repairs, and installation services.",
    category: "Home Services",
    value: "$50 savings",
    type: "Percentage Off",
    expiresIn: "12 days",
    rating: 4.8,
    reviews: 245,
    featured: true,
    image: "🏠",
  },
  {
    id: "2",
    merchant: "Local Moving Company",
    title: "$100 Off Your Move-In",
    description:
      "Professional moving services for Yardi residents. Full-service packing, loading, and unloading.",
    category: "Moving",
    value: "$100 value",
    type: "Fixed Discount",
    expiresIn: "23 days",
    rating: 4.9,
    reviews: 189,
    featured: true,
    image: "🚚",
  },
  {
    id: "3",
    merchant: "Downtown Dining Partners",
    title: "$50 Monthly Restaurant Credit",
    description:
      "Enjoy local dining at 15+ partner restaurants. Valid at breakfast, lunch, and dinner.",
    category: "Dining",
    value: "$50/month",
    type: "Credit",
    expiresIn: "60 days",
    rating: 4.7,
    reviews: 892,
    featured: false,
    image: "🍽️",
  },
  {
    id: "4",
    merchant: "FitLife Gym & Wellness",
    title: "Free 3-Month Premium Membership",
    description:
      "Full gym access, group classes, and wellness coaching. Exclusive to luxury property residents.",
    category: "Fitness",
    value: "$299 value",
    type: "Free Trial",
    expiresIn: "30 days",
    rating: 4.6,
    reviews: 156,
    featured: false,
    image: "💪",
  },
  {
    id: "5",
    merchant: "Pet Paradise Supplies",
    title: "$75 Pet Owner Welcome Package",
    description:
      "Pet supplies, grooming, and vet services. Perfect for new pet-friendly residents.",
    category: "Pets",
    value: "$75 credit",
    type: "Credit",
    expiresIn: "25 days",
    rating: 4.8,
    reviews: 324,
    featured: false,
    image: "🐾",
  },
  {
    id: "6",
    merchant: "City Entertainment Hub",
    title: "2-for-1 Movie Tickets & Events",
    description:
      "Entertainment discounts at local theaters, concerts, and events throughout the city.",
    category: "Entertainment",
    value: "50% off",
    type: "BOGO",
    expiresIn: "45 days",
    rating: 4.5,
    reviews: 567,
    featured: false,
    image: "🎬",
  },
  {
    id: "7",
    merchant: "Smart Home Solutions",
    title: "15% Off Smart Home Devices",
    description:
      "Upgrade your apartment with smart locks, thermostats, lighting, and security systems.",
    category: "Technology",
    value: "15% savings",
    type: "Percentage Off",
    expiresIn: "90 days",
    rating: 4.7,
    reviews: 203,
    featured: false,
    image: "🔌",
  },
  {
    id: "8",
    merchant: "Green Grocery Delivery",
    title: "$25 Off First Grocery Order",
    description:
      "Fresh groceries delivered to your door. Organic options and same-day delivery available.",
    category: "Groceries",
    value: "$25 off",
    type: "First Purchase",
    expiresIn: "15 days",
    rating: 4.6,
    reviews: 431,
    featured: false,
    image: "🛒",
  },
];

const categories = [
  "All Offers",
  "Home Services",
  "Moving",
  "Dining",
  "Fitness",
  "Pets",
  "Entertainment",
  "Technology",
  "Groceries",
];

const walletTokens = [
  {
    id: "w1",
    title: "Move-In Welcome Package",
    value: "$100",
    type: "Credit",
    expires: "Valid for 30 days",
    status: "Active",
  },
  {
    id: "w2",
    title: "Lease Renewal Bonus",
    value: "$250",
    type: "Credit",
    expires: "Valid for 60 days",
    status: "Active",
  },
  {
    id: "w3",
    title: "Referral Reward",
    value: "$500",
    type: "Gift Card",
    expires: "No expiration",
    status: "Active",
  },
];

function YardiMarketplaceMock() {
  const [activeTab, setActiveTab] = useState<"home" | "offers" | "wallet">(
    "offers"
  );
  const [selectedCategory, setSelectedCategory] = useState("All Offers");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOffers = yardiOffers.filter((offer) => {
    const matchesCategory =
      selectedCategory === "All Offers" || offer.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderHeader = () => (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">Yardi</div>
            <div className="text-sm opacity-90">Resident Marketplace</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="opacity-90">Welcome,</span>
              <span className="font-semibold ml-1">Sarah Thompson</span>
            </div>
            <UserCircleIcon className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "home"
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <HomeIcon className="h-5 w-5" />
              Home
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "offers"
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <GiftIcon className="h-5 w-5" />
              Offers
            </button>
            <button
              onClick={() => setActiveTab("wallet")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "wallet"
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <WalletIcon className="h-5 w-5" />
              My Wallet
              <Badge variant="default" className="bg-blue-600">
                3
              </Badge>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOffersPage = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Exclusive Resident Offers
            </h1>
            <p className="text-gray-600 text-lg">
              Save on local services, dining, entertainment, and more.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <MapPinIcon className="h-4 w-4 inline mr-1" />
              Downtown Properties | 185 properties
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">$12,847</div>
            <div className="text-sm text-gray-600 mt-1">
              Total resident savings this month
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search offers by merchant, category, or service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? "bg-blue-600 text-white font-semibold"
                : "bg-white border border-gray-300 text-gray-700 hover:border-blue-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Offers */}
      {selectedCategory === "All Offers" && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Offers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {yardiOffers
              .filter((offer) => offer.featured)
              .map((offer) => (
                <Card
                  key={offer.id}
                  className="p-6 hover:shadow-lg transition-shadow border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{offer.image}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge
                            variant="default"
                            className="bg-yellow-500 text-white mb-2"
                          >
                            <SparklesIcon className="h-3 w-3 inline mr-1" />
                            Featured
                          </Badge>
                          <h3 className="text-xl font-bold text-gray-900">
                            {offer.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {offer.merchant}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">
                        {offer.description}
                      </p>
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <StarIconSolid className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{offer.rating}</span>
                          <span className="text-gray-500">
                            ({offer.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <ClockIcon className="h-4 w-4" />
                          {offer.expiresIn}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-300"
                        >
                          {offer.value}
                        </Badge>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Claim Offer
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* All Offers Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {selectedCategory === "All Offers" ? "All Offers" : selectedCategory}
          <span className="text-gray-500 text-lg ml-2">
            ({filteredOffers.length})
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <Card
              key={offer.id}
              className="p-5 hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="text-4xl mb-3">{offer.image}</div>
              <Badge variant="outline" className="text-xs mb-2">
                <TagIcon className="h-3 w-3 inline mr-1" />
                {offer.category}
              </Badge>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {offer.title}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{offer.merchant}</p>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {offer.description}
              </p>
              <div className="flex items-center gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <StarIconSolid className="h-3 w-3 text-yellow-500" />
                  <span className="font-semibold">{offer.rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <ClockIcon className="h-3 w-3" />
                  {offer.expiresIn}
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 font-semibold"
                >
                  {offer.value}
                </Badge>
                <span className="text-xs text-gray-500">{offer.type}</span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                Claim Offer
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWalletPage = () => (
    <div className="space-y-6">
      {/* Wallet Hero */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
            <p className="text-gray-600 text-lg">
              Your rewards, credits, and exclusive resident benefits
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600">$850</div>
            <div className="text-sm text-gray-600 mt-1">
              Total available value
            </div>
          </div>
        </div>
      </div>

      {/* Active Rewards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Active Rewards & Credits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {walletTokens.map((token) => (
            <Card
              key={token.id}
              className="p-6 border-2 border-green-200 bg-gradient-to-br from-white to-green-50"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="default" className="bg-green-600 mb-2">
                    <CheckCircleIcon className="h-3 w-3 inline mr-1" />
                    {token.status}
                  </Badge>
                  <h3 className="text-lg font-bold text-gray-900">
                    {token.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">{token.type}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {token.value}
              </div>
              <p className="text-xs text-gray-600 mb-4">
                <ClockIcon className="h-3 w-3 inline mr-1" />
                {token.expires}
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Use Now
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Savings Summary */}
      <Card className="p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Your Savings Summary
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">18</div>
            <div className="text-sm text-gray-600 mt-1">Offers Claimed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">$1,245</div>
            <div className="text-sm text-gray-600 mt-1">Total Saved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-600 mt-1">Active Rewards</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderHomePage = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
        <div className="flex items-center gap-4">
          <HomeIcon className="h-16 w-16 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Home, Sarah!
            </h1>
            <p className="text-gray-600 text-lg">
              Discover exclusive offers and benefits designed for Yardi
              residents.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 text-center border border-gray-200">
          <div className="text-4xl mb-2">🎁</div>
          <div className="text-3xl font-bold text-blue-600">8</div>
          <div className="text-sm text-gray-600 mt-1">New Offers Available</div>
        </Card>
        <Card className="p-6 text-center border border-gray-200">
          <div className="text-4xl mb-2">💰</div>
          <div className="text-3xl font-bold text-green-600">$850</div>
          <div className="text-sm text-gray-600 mt-1">Wallet Balance</div>
        </Card>
        <Card className="p-6 text-center border border-gray-200">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-3xl font-bold text-yellow-600">4.8</div>
          <div className="text-sm text-gray-600 mt-1">Your Average Rating</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setActiveTab("offers")}
            className="bg-blue-600 hover:bg-blue-700 text-white h-16"
          >
            <GiftIcon className="h-5 w-5 mr-2" />
            Browse Offers
          </Button>
          <Button
            onClick={() => setActiveTab("wallet")}
            className="bg-green-600 hover:bg-green-700 text-white h-16"
          >
            <WalletIcon className="h-5 w-5 mr-2" />
            View My Wallet
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "home" && renderHomePage()}
        {activeTab === "offers" && renderOffersPage()}
        {activeTab === "wallet" && renderWalletPage()}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-2">
            Yardi Resident Marketplace
          </div>
          <p className="text-sm text-gray-400">
            Powered by Kigo Digital | Exclusive offers for Yardi property
            residents
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Questions? Contact your property manager or visit the resident
            portal.
          </p>
        </div>
      </div>
    </div>
  );
}

export default YardiMarketplaceMock;
