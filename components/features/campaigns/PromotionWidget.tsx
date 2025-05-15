"use client";

import React from "react";
import { Badge } from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card/Card";
import { SparklesIcon } from "@heroicons/react/24/solid";

interface PromotionWidgetProps {
  merchantLogo: string;
  merchantName: string;
  promotionText: string;
  featured?: boolean;
  className?: string;
  bannerImage?: string;
  mediaType?: string;
}

const PromotionWidget: React.FC<PromotionWidgetProps> = ({
  merchantLogo,
  merchantName,
  promotionText,
  featured = true,
  className = "",
  bannerImage,
  mediaType,
}) => {
  // Determine if we should show the banner as background
  const showBanner =
    bannerImage &&
    (mediaType === "display_banner" || mediaType === "double_decker");
  const isNative = mediaType === "native" || (!mediaType && !bannerImage);

  return (
    <Card className={`overflow-hidden shadow-md w-full ${className}`}>
      <div className="relative flex flex-col w-full">
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant="default"
              className="flex items-center gap-1 px-2 py-0.5"
            >
              <SparklesIcon className="h-3 w-3" />
              <span className="text-xs font-medium">Featured</span>
            </Badge>
          </div>
        )}

        {/* Banner as background for the top section */}
        <div
          className={`w-full ${isNative ? "bg-white" : ""} ${showBanner ? "bg-cover bg-center" : ""}`}
          style={
            showBanner
              ? {
                  backgroundImage: `url(${bannerImage})`,
                  height: mediaType === "double_decker" ? "144px" : "90px",
                }
              : {}
          }
        >
          {/* Logo - only shown for native type or when no banner is provided */}
          {isNative && (
            <div className="flex justify-center items-center p-4 h-24">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-1 border">
                <img
                  src={merchantLogo}
                  alt={merchantName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* For banner types, show a logo overlay in the top-right */}
          {showBanner && (
            <div className="absolute top-2 right-2 z-10">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1 border shadow-sm">
                <img
                  src={merchantLogo}
                  alt={merchantName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Text content */}
        <div className="p-3 bg-slate-50 flex-grow">
          <p className="text-sm font-semibold text-gray-600 mb-1">
            {merchantName}
          </p>
          <p className="text-base font-bold">{promotionText}</p>
        </div>
      </div>
    </Card>
  );
};

export default PromotionWidget;
