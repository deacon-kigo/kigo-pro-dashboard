"use client";

import React from "react";
import { Badge } from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card/Card";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { MapPinIcon, Wallet, StarIcon } from "lucide-react";
import { TallOfferCard } from "./TallOfferCard";
import { DisplayBannerCard } from "./DisplayBannerCard";
import { MaterialUIProvider } from "./MaterialUIProvider";

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
  customIconUrl?: string;
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
  customIconUrl,
}) => {
  // Determine which component type to render based on mediaType
  const renderNative = mediaType === "native" || !mediaType;
  const renderDisplayBanner = mediaType === "display_banner";
  const renderDoubleDecker = mediaType === "double_decker";

  return (
    <MaterialUIProvider>
      {/* Native Type - Keep using Card */}
      {renderNative && (
        <Card
          className={`overflow-hidden shadow-sm w-full rounded-xl ${className}`}
        >
          <div className="relative flex flex-col w-full">
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
          </div>
        </Card>
      )}

      {/* Display Banner Type - Using DisplayBannerCard */}
      {renderDisplayBanner && (
        <div
          className={`w-full h-full ${className}`}
          style={{ minHeight: "150px" }}
        >
          <DisplayBannerCard
            imageUrl={
              bannerImage ||
              "https://placehold.co/1200x600/0072CE/fff?text=Banner+Image"
            }
            title={promotionText}
            subTitle={merchantName}
            additionalInfo="Tap to add to wallet"
            tags={featured ? ["featured"] : []}
            onClick={() => console.log("Offer clicked")}
            distanceFromUser={
              distance ? parseFloat(distance.replace(" miles", "")) : undefined
            }
            onAddToWalletClick={(onSuccess) => {
              console.log("Add to wallet clicked");
              setTimeout(onSuccess, 1000); // Simulate async operation
            }}
            customIconUrl={customIconUrl}
          />
        </div>
      )}

      {/* Double Decker Type - Using TallOfferCard */}
      {renderDoubleDecker && (
        <div
          className={`w-full h-full ${className}`}
          style={{ minHeight: "200px" }}
        >
          <TallOfferCard
            imageUrl={
              bannerImage ||
              "https://placehold.co/1200x600/4C7C29/fff?text=Food+Image"
            }
            title={promotionText}
            subTitle={merchantName}
            additionalInfo="Tap to add to wallet"
            tags={featured ? ["featured"] : []}
            onClick={() => console.log("Offer clicked")}
            distanceFromUser={
              distance ? parseFloat(distance.replace(" miles", "")) : undefined
            }
            onAddToWalletClick={(onSuccess) => {
              console.log("Add to wallet clicked");
              setTimeout(onSuccess, 1000); // Simulate async operation
            }}
            customIconUrl={customIconUrl}
          />
        </div>
      )}
    </MaterialUIProvider>
  );
};

export default PromotionWidget;
