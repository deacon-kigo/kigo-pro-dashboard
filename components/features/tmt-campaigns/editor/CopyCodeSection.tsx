"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LandingPageConfig } from "@/types/tmt-campaign";

interface CopyCodeSectionProps {
  config: LandingPageConfig;
  onDeepUpdate: (path: string, value: any) => void;
}

export default function CopyCodeSection({
  config,
  onDeepUpdate,
}: CopyCodeSectionProps) {
  const copyCode = config.copyCode;

  return (
    <div className="space-y-4">
      {/* Enable Copy Code */}
      <div className="flex items-center justify-between">
        <Label htmlFor="copyCodeEnabled">Enable Copy Code</Label>
        <Switch
          checked={copyCode.enabled}
          onCheckedChange={(checked) =>
            onDeepUpdate("copyCode.enabled", checked)
          }
        />
      </div>

      {copyCode.enabled && (
        <>
          {/* Promo Code */}
          <div className="space-y-1.5">
            <Label htmlFor="copyCodeCode">
              Promo Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="copyCodeCode"
              value={copyCode.code}
              onChange={(e) => onDeepUpdate("copyCode.code", e.target.value)}
              placeholder="e.g. SUMMER2026"
            />
          </div>

          {/* Copy Button Color */}
          <div className="space-y-1.5">
            <Label htmlFor="copyButtonColor">Copy Button Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="copyButtonColor"
                type="color"
                value={copyCode.copyButtonColor}
                onChange={(e) =>
                  onDeepUpdate("copyCode.copyButtonColor", e.target.value)
                }
                className="h-9 w-12 rounded border cursor-pointer"
              />
              <Input
                value={copyCode.copyButtonColor}
                onChange={(e) =>
                  onDeepUpdate("copyCode.copyButtonColor", e.target.value)
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* Border Radius */}
          <div className="space-y-1.5">
            <Label htmlFor="copyCodeRadius">Border Radius (px)</Label>
            <Input
              id="copyCodeRadius"
              type="number"
              value={copyCode.borderRadius}
              onChange={(e) =>
                onDeepUpdate(
                  "copyCode.borderRadius",
                  parseInt(e.target.value) || 0
                )
              }
              placeholder="8"
            />
          </div>

          {/* Redeem Button Sub-section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <Label htmlFor="redeemEnabled">Show Redeem Button</Label>
              <Switch
                checked={copyCode.button.enabled}
                onCheckedChange={(checked) =>
                  onDeepUpdate("copyCode.button.enabled", checked)
                }
              />
            </div>

            {copyCode.button.enabled && (
              <div className="space-y-3">
                {/* Redeem Button Text */}
                <div className="space-y-1.5">
                  <Label>Button Text</Label>
                  <Input
                    value={copyCode.button.text}
                    onChange={(e) =>
                      onDeepUpdate("copyCode.button.text", e.target.value)
                    }
                    placeholder="Redeem"
                  />
                </div>

                {/* Redeem Button URL */}
                <div className="space-y-1.5">
                  <Label>Button URL</Label>
                  <Input
                    value={copyCode.button.url}
                    onChange={(e) =>
                      onDeepUpdate("copyCode.button.url", e.target.value)
                    }
                    placeholder="https://example.com/redeem"
                  />
                </div>

                {/* Background Color */}
                <div className="space-y-1.5">
                  <Label>Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={copyCode.button.backgroundColor}
                      onChange={(e) =>
                        onDeepUpdate(
                          "copyCode.button.backgroundColor",
                          e.target.value
                        )
                      }
                      className="h-9 w-12 rounded border cursor-pointer"
                    />
                    <Input
                      value={copyCode.button.backgroundColor}
                      onChange={(e) =>
                        onDeepUpdate(
                          "copyCode.button.backgroundColor",
                          e.target.value
                        )
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div className="space-y-1.5">
                  <Label>Text Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={copyCode.button.textColor}
                      onChange={(e) =>
                        onDeepUpdate(
                          "copyCode.button.textColor",
                          e.target.value
                        )
                      }
                      className="h-9 w-12 rounded border cursor-pointer"
                    />
                    <Input
                      value={copyCode.button.textColor}
                      onChange={(e) =>
                        onDeepUpdate(
                          "copyCode.button.textColor",
                          e.target.value
                        )
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Border Radius */}
                <div className="space-y-1.5">
                  <Label>Border Radius (px)</Label>
                  <Input
                    type="number"
                    value={copyCode.button.borderRadius}
                    onChange={(e) =>
                      onDeepUpdate(
                        "copyCode.button.borderRadius",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="25"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
