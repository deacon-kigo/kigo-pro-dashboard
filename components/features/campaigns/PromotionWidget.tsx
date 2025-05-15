"use client";

import React from "react";
import { Badge } from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card/Card";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { MapPinIcon, Wallet, StarIcon } from "lucide-react";

interface PromotionWidgetProps {
  merchantLogo: string;
  merchantName: string;
  promotionText: string;
  featured?: boolean;
  className?: string;
  bannerImage?: string;
  mediaType?: string;
  distance?: string;
  additionalOffers?: number;
}

const PromotionWidget: React.FC<PromotionWidgetProps> = ({
  merchantLogo,
  merchantName,
  promotionText,
  featured = true,
  className = "",
  bannerImage,
  mediaType,
  distance,
  additionalOffers,
}) => {
  // Determine if we should show the banner as background
  const showBanner =
    bannerImage &&
    (mediaType === "display_banner" || mediaType === "double_decker");
  const isNative = mediaType === "native" || (!mediaType && !bannerImage);
  const isDisplayBanner = mediaType === "display_banner";
  const isDoubleDecker = mediaType === "double_decker";

  return (
    <Card
      className={`overflow-hidden shadow-sm w-full rounded-xl ${className}`}
    >
      <div className="relative flex flex-col w-full">
        {/* Featured badge for banner types */}
        {featured && showBanner && !isDoubleDecker && (
          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant="default"
              className="flex items-center gap-1 px-2 py-0.5 bg-white/90 text-gray-800 border border-gray-100 w-[90px] justify-center"
            >
              <SparklesIcon className="h-3 w-3 text-violet-500" />
              <span className="text-xs font-medium">Featured</span>
            </Badge>
          </div>
        )}

        {/* Display mode: Native */}
        {isNative && (
          <div className="flex p-3">
            {/* Left side - Logo */}
            <div className="mr-3">
              <div className="w-16 h-16 rounded-md flex items-center justify-center p-1 border overflow-hidden bg-white">
                <img
                  src={merchantLogo}
                  alt={merchantName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Featured badge for native type - positioned above offer */}
              {featured && (
                <div className="mb-1">
                  <Badge
                    variant="default"
                    className="flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 border-0 w-[90px] justify-center"
                  >
                    <SparklesIcon className="h-3 w-3 text-violet-500" />
                    <span className="text-xs font-medium">Featured</span>
                  </Badge>
                </div>
              )}

              {/* Offer details */}
              <h3 className="font-bold text-xl leading-tight text-gray-900 mb-1">
                {promotionText}
              </h3>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {merchantName}
              </p>

              {distance && (
                <div className="flex items-center text-gray-500 mb-1">
                  <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                  <span className="text-sm">{distance}</span>
                </div>
              )}

              {additionalOffers && additionalOffers > 0 && (
                <p className="text-sm font-medium text-blue-600">
                  +{additionalOffers} more{" "}
                  {additionalOffers === 1 ? "offer" : "offers"}
                </p>
              )}
            </div>

            {/* Wallet button */}
            <div className="ml-3 self-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 p-2 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </div>
        )}

        {/* Display Banner Type */}
        {isDisplayBanner && showBanner && (
          <>
            {/* Brand Logo - Top */}
            <div className="absolute top-4 left-4 z-10">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-1 border shadow-md">
                <img
                  src={merchantLogo}
                  alt={merchantName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Banner background */}
            <div
              className="w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${bannerImage})`,
                height: "180px",
              }}
            >
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"
                style={{ height: "180px" }}
              ></div>
            </div>

            {/* Text content */}
            <div className="p-4 bg-white">
              {/* Merchant name on top for display banner */}
              <div className="mb-1">
                <p className="text-gray-700 font-medium">{merchantName}</p>
              </div>

              {/* Promotion text */}
              <h3 className="text-2xl font-bold text-gray-900 leading-snug">
                {promotionText}
              </h3>

              {/* Wallet button */}
              <div className="flex justify-end mt-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-blue-700" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Double Decker Type */}
        {isDoubleDecker && showBanner && (
          <div className="h-full">
            {/* Featured badge for double decker in top-left */}
            {featured && (
              <div className="absolute top-3 left-3 z-20">
                <Badge
                  variant="default"
                  className="flex items-center gap-1 px-2 py-0.5 bg-white/90 text-gray-800 border border-gray-100 w-[90px] justify-center"
                >
                  <SparklesIcon className="h-3 w-3 text-violet-500" />
                  <span className="text-xs font-medium">Featured</span>
                </Badge>
              </div>
            )}

            {/* Brand Logo - Top Left, positioned below the featured badge */}
            <div className="absolute top-12 left-4 z-10">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center p-2 border-2 border-white shadow-md">
                <img
                  src={merchantLogo}
                  alt={merchantName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Banner background - Made taller to match Panera image */}
            <div
              className="w-full bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${bannerImage || "https://placehold.co/1200x600/4C7C29/fff?text=Food+Image"})`,
                height: "270px",
                backgroundColor: "#4C7C29", // Green background similar to Panera
                backgroundBlendMode: "soft-light",
              }}
            >
              {/* Dark scrim at bottom for readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(45,87,44,0.7)]"></div>

              {/* Bottom text overlay with merchant name */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h2 className="text-2xl font-bold drop-shadow-md">
                  {merchantName}
                </h2>
              </div>
            </div>

            {/* Text content */}
            <div className="p-5 bg-white flex flex-col">
              {/* Promotion text - Larger font size to match Panera */}
              <h3 className="text-[32px] font-bold text-gray-900 leading-tight mb-2">
                {promotionText}
              </h3>

              {/* Wallet button without label to match Panera */}
              <div className="flex justify-end items-center mt-auto">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shadow-sm">
                  <Wallet className="h-7 w-7 text-blue-700" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PromotionWidget;
