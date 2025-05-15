"use client";

import React from "react";
import { Badge } from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card/Card";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";

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
  const isCompact = mediaType === "display_banner" || mediaType === "compact";

  return (
    <Card
      className={`overflow-hidden shadow-sm w-full rounded-xl ${className}`}
    >
      <div className="relative flex flex-col w-full">
        {/* Featured badge */}
        {featured && (
          <div
            className={`absolute top-2 left-2 z-10 ${isNative ? "top-4" : ""}`}
          >
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
          <div className="flex items-center p-4 gap-4">
            <div className="w-14 h-14 min-w-[56px] rounded-md bg-white flex items-center justify-center p-1 border">
              <img
                src={merchantLogo}
                alt={merchantName}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <h3 className="font-bold text-lg leading-tight mb-1">
                    {promotionText}
                  </h3>
                  <p className="text-sm text-gray-700">{merchantName}</p>
                  {distance && (
                    <div className="flex items-center text-gray-500 mt-1">
                      <span className="text-sm">{distance}</span>
                    </div>
                  )}
                </div>
              </div>
              {additionalOffers && additionalOffers > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  +{additionalOffers} more [offer(s)]
                </p>
              )}
            </div>
          </div>
        )}

        {/* Banner modes: Display Banner & Double Decker */}
        {showBanner && (
          <>
            {/* Banner background */}
            <div
              className="w-full bg-cover bg-center relative"
              style={{
                backgroundImage: `url(${bannerImage})`,
                height: mediaType === "double_decker" ? "192px" : "150px",
              }}
            >
              {/* Logo overlay */}
              <div className="absolute bottom-0 left-0 z-10 p-4 flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-1 border shadow-sm">
                  <img
                    src={merchantLogo}
                    alt={merchantName}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div className="text-white">
                  <p className="text-xl font-bold drop-shadow-md">
                    {merchantName}
                  </p>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="p-4 bg-white">
              <h3 className="text-2xl font-bold">{promotionText}</h3>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default PromotionWidget;
