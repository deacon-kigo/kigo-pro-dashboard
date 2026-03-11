"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LandingPageConfig } from "@/types/tmt-campaign";

interface OnlineSectionProps {
  config: LandingPageConfig;
  onDeepUpdate: (path: string, value: any) => void;
}

export default function OnlineSection({
  config,
  onDeepUpdate,
}: OnlineSectionProps) {
  const online = config.onlineConfig;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Configure the online redemption page shown after form submission. Users
        can copy promo codes and visit the online store.
      </p>

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="onlineTitle">Title</Label>
        <Input
          id="onlineTitle"
          value={online.title}
          onChange={(e) => onDeepUpdate("onlineConfig.title", e.target.value)}
          placeholder="Your Offer"
        />
      </div>

      {/* Show Image */}
      <div className="flex items-center justify-between">
        <Label htmlFor="onlineShowImage">Show Product Image</Label>
        <Switch
          checked={online.showImage}
          onCheckedChange={(checked) =>
            onDeepUpdate("onlineConfig.showImage", checked)
          }
        />
      </div>

      {/* Affiliate Code One */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Affiliate Code 1</h4>
          <Switch
            checked={online.affiliateCodeOne.enabled}
            onCheckedChange={(checked) =>
              onDeepUpdate("onlineConfig.affiliateCodeOne.enabled", checked)
            }
          />
        </div>

        {online.affiliateCodeOne.enabled && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input
                value={online.affiliateCodeOne.label}
                onChange={(e) =>
                  onDeepUpdate(
                    "onlineConfig.affiliateCodeOne.label",
                    e.target.value
                  )
                }
                placeholder="Promo Code"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hardcoded Value (optional)</Label>
              <Input
                value={online.affiliateCodeOne.hardcodedValue || ""}
                onChange={(e) =>
                  onDeepUpdate(
                    "onlineConfig.affiliateCodeOne.hardcodedValue",
                    e.target.value
                  )
                }
                placeholder="Leave empty to use generated code"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Copy Button Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={online.affiliateCodeOne.copyButtonColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "onlineConfig.affiliateCodeOne.copyButtonColor",
                      e.target.value
                    )
                  }
                  className="h-9 w-12 rounded border cursor-pointer"
                />
                <Input
                  value={online.affiliateCodeOne.copyButtonColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "onlineConfig.affiliateCodeOne.copyButtonColor",
                      e.target.value
                    )
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Border Radius (px)</Label>
              <Input
                type="number"
                value={online.affiliateCodeOne.borderRadius}
                onChange={(e) =>
                  onDeepUpdate(
                    "onlineConfig.affiliateCodeOne.borderRadius",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="8"
              />
            </div>
          </div>
        )}
      </div>

      {/* Affiliate Code Two */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Affiliate Code 2</h4>
          <Switch
            checked={online.affiliateCodeTwo.enabled}
            onCheckedChange={(checked) =>
              onDeepUpdate("onlineConfig.affiliateCodeTwo.enabled", checked)
            }
          />
        </div>

        {online.affiliateCodeTwo.enabled && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input
                value={online.affiliateCodeTwo.label}
                onChange={(e) =>
                  onDeepUpdate(
                    "onlineConfig.affiliateCodeTwo.label",
                    e.target.value
                  )
                }
                placeholder="Secondary Code"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hardcoded Value (optional)</Label>
              <Input
                value={online.affiliateCodeTwo.hardcodedValue || ""}
                onChange={(e) =>
                  onDeepUpdate(
                    "onlineConfig.affiliateCodeTwo.hardcodedValue",
                    e.target.value
                  )
                }
                placeholder="Leave empty to use generated code"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Copy Button Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={online.affiliateCodeTwo.copyButtonColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "onlineConfig.affiliateCodeTwo.copyButtonColor",
                      e.target.value
                    )
                  }
                  className="h-9 w-12 rounded border cursor-pointer"
                />
                <Input
                  value={online.affiliateCodeTwo.copyButtonColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "onlineConfig.affiliateCodeTwo.copyButtonColor",
                      e.target.value
                    )
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Border Radius (px)</Label>
              <Input
                type="number"
                value={online.affiliateCodeTwo.borderRadius}
                onChange={(e) =>
                  onDeepUpdate(
                    "onlineConfig.affiliateCodeTwo.borderRadius",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="8"
              />
            </div>
          </div>
        )}
      </div>

      {/* Promo Barcode Image */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Promo Barcode Image</h4>
          <Switch
            checked={online.promoBarcodeImage.enabled}
            onCheckedChange={(checked) =>
              onDeepUpdate("onlineConfig.promoBarcodeImage.enabled", checked)
            }
          />
        </div>

        {online.promoBarcodeImage.enabled && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>
                Image URL <span className="text-red-500">*</span>
              </Label>
              <Input
                value={online.promoBarcodeImage.url}
                onChange={(e) =>
                  onDeepUpdate(
                    "onlineConfig.promoBarcodeImage.url",
                    e.target.value
                  )
                }
                placeholder="https://example.com/barcode.png"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Alt Text</Label>
              <Input
                value={online.promoBarcodeImage.alt}
                onChange={(e) =>
                  onDeepUpdate(
                    "onlineConfig.promoBarcodeImage.alt",
                    e.target.value
                  )
                }
                placeholder="Promo Barcode"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Action Button</h4>
          <Switch
            checked={online.button.enabled}
            onCheckedChange={(checked) =>
              onDeepUpdate("onlineConfig.button.enabled", checked)
            }
          />
        </div>

        {online.button.enabled && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Button Text</Label>
              <Input
                value={online.button.text}
                onChange={(e) =>
                  onDeepUpdate("onlineConfig.button.text", e.target.value)
                }
                placeholder="Order Now"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Button URL</Label>
              <Input
                value={online.button.url}
                onChange={(e) =>
                  onDeepUpdate("onlineConfig.button.url", e.target.value)
                }
                placeholder="https://example.com/order"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Append Affiliate Code to URL</Label>
              <Switch
                checked={online.button.appendAffiliateCode}
                onCheckedChange={(checked) =>
                  onDeepUpdate(
                    "onlineConfig.button.appendAffiliateCode",
                    checked
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Background Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={online.button.backgroundColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "onlineConfig.button.backgroundColor",
                      e.target.value
                    )
                  }
                  className="h-9 w-12 rounded border cursor-pointer"
                />
                <Input
                  value={online.button.backgroundColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "onlineConfig.button.backgroundColor",
                      e.target.value
                    )
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Text Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={online.button.textColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "onlineConfig.button.textColor",
                      e.target.value
                    )
                  }
                  className="h-9 w-12 rounded border cursor-pointer"
                />
                <Input
                  value={online.button.textColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "onlineConfig.button.textColor",
                      e.target.value
                    )
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Border Radius (px)</Label>
              <Input
                type="number"
                value={online.button.borderRadius}
                onChange={(e) =>
                  onDeepUpdate(
                    "onlineConfig.button.borderRadius",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="25"
              />
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="border-t pt-4 space-y-1.5">
        <Label>Description (HTML)</Label>
        <Textarea
          value={online.description}
          onChange={(e) =>
            onDeepUpdate("onlineConfig.description", e.target.value)
          }
          placeholder="<p>Use this code at checkout to receive your discount.</p>"
          rows={3}
        />
      </div>
    </div>
  );
}
