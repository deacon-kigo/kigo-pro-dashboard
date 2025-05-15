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
        {/* Featured badge */}
        {featured && isNative && (
          <div className="absolute top-3 left-3 z-10">
            <Badge
              variant="default"
              className="flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 border-0"
            >
              <SparklesIcon className="h-3 w-3 text-violet-500" />
              <span className="text-xs font-medium">Featured</span>
            </Badge>
          </div>
        )}

        {featured && showBanner && (
          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant="default"
              className="flex items-center gap-1 px-2 py-0.5 bg-white/90 text-gray-800 border border-gray-100"
            >
              <SparklesIcon className="h-3 w-3 text-violet-500" />
              <span className="text-xs font-medium">Featured</span>
            </Badge>
          </div>
        )}

        {/* Display mode: Native */}
        {isNative && (
          <div className="flex p-4 pt-12">
            {/* Left side - Logo */}
            <div className="mr-4">
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
              {/* Offer details */}
              <h3 className="font-bold text-xl leading-tight text-gray-900">
                {promotionText}
              </h3>
              <p className="text-sm font-medium text-gray-700 mt-1">
                {merchantName}
              </p>

              {distance && (
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                  <span className="text-sm">{distance}</span>
                </div>
              )}

              {additionalOffers && additionalOffers > 0 && (
                <p className="text-sm font-medium text-blue-600 mt-1">
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
            <div className="p-5 bg-white">
              {/* Merchant name on top for display banner */}
              <div className="mb-2">
                <p className="text-gray-700 font-medium">{merchantName}</p>
              </div>

              {/* Promotion text */}
              <h3 className="text-2xl font-bold text-gray-900">
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
          <>
            {/* Brand Logo - Top Left */}
            <div className="absolute top-4 left-4 z-10">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-2 border shadow-md">
                <img
                  src={merchantLogo}
                  alt={merchantName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Banner background */}
            <div
              className="w-full bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${bannerImage})`,
                height: "300px",
              }}
            >
              {/* Dark scrim at bottom for readability */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent"></div>

              {/* Bottom text overlay with merchant name */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h2 className="text-2xl font-bold">{merchantName}</h2>
              </div>
            </div>

            {/* Text content */}
            <div className="p-5 bg-white">
              {/* Promotion text */}
              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                {promotionText}
              </h3>

              {/* Wallet button with label */}
              <div className="flex justify-end items-center mt-4">
                <div className="mr-3">
                  <span className="text-sm font-medium text-blue-700">
                    Add to Wallet
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-blue-700" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default PromotionWidget;
