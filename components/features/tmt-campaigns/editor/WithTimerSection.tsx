"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LandingPageConfig } from "@/types/tmt-campaign";

interface WithTimerSectionProps {
  config: LandingPageConfig;
  onDeepUpdate: (path: string, value: any) => void;
}

export default function WithTimerSection({
  config,
  onDeepUpdate,
}: WithTimerSectionProps) {
  const timerConfig = config.withTimerConfig;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Configure the secondary &quot;Get Code&quot; page that appears after
        form submission. Users see a countdown timer with their promo code.
      </p>

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="timerTitle">Title</Label>
        <Input
          id="timerTitle"
          value={timerConfig.title}
          onChange={(e) =>
            onDeepUpdate("withTimerConfig.title", e.target.value)
          }
          placeholder="Your Offer"
        />
      </div>

      {/* Subtitle (HTML) */}
      <div className="space-y-1.5">
        <Label htmlFor="timerSubtitle">Subtitle (HTML)</Label>
        <Textarea
          id="timerSubtitle"
          value={timerConfig.subtitle}
          onChange={(e) =>
            onDeepUpdate("withTimerConfig.subtitle", e.target.value)
          }
          placeholder='<p><span style="color: #8b6914;">DRIVE THRU</span> or <span style="color: #8b6914;">CARRY OUT</span></p>'
          rows={2}
        />
      </div>

      {/* Description (HTML) */}
      <div className="space-y-1.5">
        <Label htmlFor="timerDescription">Description (HTML)</Label>
        <Textarea
          id="timerDescription"
          value={timerConfig.description}
          onChange={(e) =>
            onDeepUpdate("withTimerConfig.description", e.target.value)
          }
          placeholder="<p>Show the code to your server to receive the discount.</p>"
          rows={3}
        />
      </div>

      {/* Show Image */}
      <div className="flex items-center justify-between">
        <Label htmlFor="timerShowImage">Show Product Image</Label>
        <Switch
          checked={timerConfig.showImage}
          onCheckedChange={(checked) =>
            onDeepUpdate("withTimerConfig.showImage", checked)
          }
        />
      </div>

      {/* Primary Button */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-3">Primary Button</h4>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Text</Label>
            <Input
              value={timerConfig.primaryButton.text}
              onChange={(e) =>
                onDeepUpdate(
                  "withTimerConfig.primaryButton.text",
                  e.target.value
                )
              }
              placeholder="Show My Code"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={timerConfig.primaryButton.backgroundColor}
                onChange={(e) =>
                  onDeepUpdate(
                    "withTimerConfig.primaryButton.backgroundColor",
                    e.target.value
                  )
                }
                className="h-9 w-12 rounded border cursor-pointer"
              />
              <Input
                value={timerConfig.primaryButton.backgroundColor}
                onChange={(e) =>
                  onDeepUpdate(
                    "withTimerConfig.primaryButton.backgroundColor",
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
                value={timerConfig.primaryButton.textColor}
                onChange={(e) =>
                  onDeepUpdate(
                    "withTimerConfig.primaryButton.textColor",
                    e.target.value
                  )
                }
                className="h-9 w-12 rounded border cursor-pointer"
              />
              <Input
                value={timerConfig.primaryButton.textColor}
                onChange={(e) =>
                  onDeepUpdate(
                    "withTimerConfig.primaryButton.textColor",
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
              value={timerConfig.primaryButton.borderRadius}
              onChange={(e) =>
                onDeepUpdate(
                  "withTimerConfig.primaryButton.borderRadius",
                  parseInt(e.target.value) || 0
                )
              }
              placeholder="25"
            />
          </div>
        </div>
      </div>

      {/* Secondary Button */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Secondary Button</h4>
          <Switch
            checked={timerConfig.secondaryButton.enabled}
            onCheckedChange={(checked) =>
              onDeepUpdate("withTimerConfig.secondaryButton.enabled", checked)
            }
          />
        </div>

        {timerConfig.secondaryButton.enabled && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Text</Label>
              <Input
                value={timerConfig.secondaryButton.text}
                onChange={(e) =>
                  onDeepUpdate(
                    "withTimerConfig.secondaryButton.text",
                    e.target.value
                  )
                }
                placeholder="Find A Location"
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL</Label>
              <Input
                value={timerConfig.secondaryButton.url}
                onChange={(e) =>
                  onDeepUpdate(
                    "withTimerConfig.secondaryButton.url",
                    e.target.value
                  )
                }
                placeholder="https://example.com/locations"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Background Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={timerConfig.secondaryButton.backgroundColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "withTimerConfig.secondaryButton.backgroundColor",
                      e.target.value
                    )
                  }
                  className="h-9 w-12 rounded border cursor-pointer"
                />
                <Input
                  value={timerConfig.secondaryButton.backgroundColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "withTimerConfig.secondaryButton.backgroundColor",
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
                  value={timerConfig.secondaryButton.textColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "withTimerConfig.secondaryButton.textColor",
                      e.target.value
                    )
                  }
                  className="h-9 w-12 rounded border cursor-pointer"
                />
                <Input
                  value={timerConfig.secondaryButton.textColor}
                  onChange={(e) =>
                    onDeepUpdate(
                      "withTimerConfig.secondaryButton.textColor",
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
                value={timerConfig.secondaryButton.borderRadius}
                onChange={(e) =>
                  onDeepUpdate(
                    "withTimerConfig.secondaryButton.borderRadius",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="25"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal Settings */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-3">Countdown Modal</h4>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Modal Title</Label>
            <Input
              value={timerConfig.modal.title}
              onChange={(e) =>
                onDeepUpdate("withTimerConfig.modal.title", e.target.value)
              }
              placeholder="Your Offer"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Modal Subtitle (HTML)</Label>
            <Textarea
              value={timerConfig.modal.subtitle}
              onChange={(e) =>
                onDeepUpdate("withTimerConfig.modal.subtitle", e.target.value)
              }
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Modal Description (HTML)</Label>
            <Textarea
              value={timerConfig.modal.description}
              onChange={(e) =>
                onDeepUpdate(
                  "withTimerConfig.modal.description",
                  e.target.value
                )
              }
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Static Code (optional)</Label>
            <Input
              value={timerConfig.modal.code}
              onChange={(e) =>
                onDeepUpdate("withTimerConfig.modal.code", e.target.value)
              }
              placeholder="Leave empty to use generated code"
            />
            <p className="text-xs text-muted-foreground">
              If blank, a dynamically generated code will be shown.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Redeem Text</Label>
            <Input
              value={timerConfig.modal.redeemText}
              onChange={(e) =>
                onDeepUpdate("withTimerConfig.modal.redeemText", e.target.value)
              }
              placeholder="Redeem in the next"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Countdown Minutes</Label>
            <Input
              type="number"
              value={timerConfig.modal.countdownMinutes}
              onChange={(e) =>
                onDeepUpdate(
                  "withTimerConfig.modal.countdownMinutes",
                  parseInt(e.target.value) || 30
                )
              }
              placeholder="30"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Timer Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={timerConfig.modal.timerBackgroundColor}
                onChange={(e) =>
                  onDeepUpdate(
                    "withTimerConfig.modal.timerBackgroundColor",
                    e.target.value
                  )
                }
                className="h-9 w-12 rounded border cursor-pointer"
              />
              <Input
                value={timerConfig.modal.timerBackgroundColor}
                onChange={(e) =>
                  onDeepUpdate(
                    "withTimerConfig.modal.timerBackgroundColor",
                    e.target.value
                  )
                }
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
