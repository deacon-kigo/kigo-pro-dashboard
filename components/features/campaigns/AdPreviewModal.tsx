"use client";

import React from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import PromotionWidget from "@/components/features/campaigns/PromotionWidget";
import { X, Layers, Download, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad?: any;
  onEdit?: () => void;
  getMerchantLogo?: (offerId: string) => string;
  getPromotionText?: (offerId: string) => string;
  getMediaTypeLabel?: (typeId: string) => string;
}

export function AdPreviewModal({
  isOpen,
  onClose,
  ad,
  onEdit,
  getMerchantLogo,
  getPromotionText,
  getMediaTypeLabel,
}: AdPreviewModalProps) {
  console.log("AdPreviewModal rendered with:", { isOpen, ad: !!ad });

  if (!ad) {
    console.log("AdPreviewModal: No ad provided, returning null");
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">
                {ad.merchantName} - Ad Preview
              </DialogTitle>
              <p className="text-sm text-slate-600 mt-1">
                {getPromotionText?.(ad.offerId) || "Promotion"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onEdit();
                    onClose();
                  }}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ad Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Merchant:</span>
                <span className="font-medium ml-2">{ad.merchantName}</span>
              </div>
              <div>
                <span className="text-slate-600">Media Assets:</span>
                <span className="font-medium ml-2">
                  {ad.mediaAssets?.length || 0} uploaded
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-600">Media Types:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ad.mediaType?.map((type: string) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {getMediaTypeLabel?.(type) || type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Media Type Previews */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-600" />
              <h3 className="font-medium">Media Type Previews</h3>
              <Badge variant="outline" className="text-xs">
                {ad.mediaType?.length || 0} formats
              </Badge>
            </div>

            <div className="grid gap-6">
              {ad.mediaType?.map((mediaType: string) => (
                <div key={mediaType} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-sm">
                        {getMediaTypeLabel?.(mediaType) || mediaType}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {/* Add dimensions if available */}
                        {mediaType === "display_banner" && "970x250"}
                        {mediaType === "double_decker" && "600x320"}
                        {mediaType === "native" && "Auto-adapting"}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-xs"
                    >
                      <Download className="h-3 w-3" />
                      Export
                    </Button>
                  </div>

                  {/* Full-size preview */}
                  <div className="bg-white border rounded-lg p-6 flex justify-center">
                    <div className="max-w-md">
                      <PromotionWidget
                        merchantLogo={getMerchantLogo?.(ad.offerId) || ""}
                        merchantName={ad.merchantName}
                        promotionText={getPromotionText?.(ad.offerId) || ""}
                        featured={true}
                        bannerImage={
                          ad.mediaAssets?.length > 0
                            ? ad.mediaAssets[0].previewUrl
                            : undefined
                        }
                        mediaType={mediaType}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Assets */}
          {ad.mediaAssets?.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Uploaded Assets</h3>
              <div className="grid grid-cols-4 gap-3">
                {ad.mediaAssets.map((asset: any) => (
                  <div key={asset.id} className="space-y-2">
                    <div className="aspect-video bg-slate-100 rounded border overflow-hidden">
                      {asset.type.startsWith("image/") && (
                        <img
                          src={asset.previewUrl}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="text-xs">
                      <p className="font-medium truncate">{asset.name}</p>
                      <p className="text-slate-500">
                        {(asset.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
