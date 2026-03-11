"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LandingPageConfig } from "@/types/tmt-campaign";

interface SubmitButtonSectionProps {
  config: LandingPageConfig;
  onDeepUpdate: (path: string, value: any) => void;
}

export default function SubmitButtonSection({
  config,
  onDeepUpdate,
}: SubmitButtonSectionProps) {
  const btn = config.submitButton;

  return (
    <div className="space-y-4">
      {/* Button Text */}
      <div className="space-y-1.5">
        <Label htmlFor="submitText">Button Text</Label>
        <Input
          id="submitText"
          value={btn.text}
          onChange={(e) => onDeepUpdate("submitButton.text", e.target.value)}
          placeholder="Get My Offer"
        />
      </div>

      {/* Style */}
      <div className="space-y-1.5">
        <Label htmlFor="submitStyle">Button Style</Label>
        <Select
          value={btn.style}
          onValueChange={(value) => onDeepUpdate("submitButton.style", value)}
        >
          <SelectTrigger id="submitStyle">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contained">Contained</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="text">Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Background Color */}
      <div className="space-y-1.5">
        <Label htmlFor="submitBgColor">Background Color</Label>
        <div className="flex items-center gap-2">
          <input
            id="submitBgColor"
            type="color"
            value={btn.backgroundColor}
            onChange={(e) =>
              onDeepUpdate("submitButton.backgroundColor", e.target.value)
            }
            className="h-9 w-12 rounded border cursor-pointer"
          />
          <Input
            value={btn.backgroundColor}
            onChange={(e) =>
              onDeepUpdate("submitButton.backgroundColor", e.target.value)
            }
            className="flex-1"
          />
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-1.5">
        <Label htmlFor="submitTextColor">Text Color</Label>
        <div className="flex items-center gap-2">
          <input
            id="submitTextColor"
            type="color"
            value={btn.textColor}
            onChange={(e) =>
              onDeepUpdate("submitButton.textColor", e.target.value)
            }
            className="h-9 w-12 rounded border cursor-pointer"
          />
          <Input
            value={btn.textColor}
            onChange={(e) =>
              onDeepUpdate("submitButton.textColor", e.target.value)
            }
            className="flex-1"
          />
        </div>
      </div>

      {/* Border Radius */}
      <div className="space-y-1.5">
        <Label htmlFor="submitRadius">Border Radius (px)</Label>
        <Input
          id="submitRadius"
          type="number"
          value={btn.borderRadius}
          onChange={(e) =>
            onDeepUpdate(
              "submitButton.borderRadius",
              parseInt(e.target.value) || 0
            )
          }
          placeholder="6"
        />
      </div>

      {/* Redirect URL */}
      <div className="space-y-1.5">
        <Label htmlFor="submitRedirectUrl">Redirect URL</Label>
        <Input
          id="submitRedirectUrl"
          value={btn.redirectUrl}
          onChange={(e) =>
            onDeepUpdate("submitButton.redirectUrl", e.target.value)
          }
          placeholder="https://example.com/thank-you"
        />
        <p className="text-xs text-muted-foreground">
          Where the user is sent after form submission. Form field values are
          appended as query parameters.
        </p>
      </div>
    </div>
  );
}
