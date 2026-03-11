"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LandingPageConfig } from "@/types/tmt-campaign";

interface CampaignSettingsSectionProps {
  config: LandingPageConfig;
  onUpdate: (field: string, value: any) => void;
}

const GET_CODE_OPTIONS = [
  { value: "", label: "None (Form Only)" },
  { value: "pos", label: "POS" },
  { value: "with-timer", label: "With Timer" },
  { value: "online", label: "Online" },
  { value: "direct-link", label: "Direct Link" },
] as const;

export default function CampaignSettingsSection({
  config,
  onUpdate,
}: CampaignSettingsSectionProps) {
  return (
    <div className="space-y-4">
      {/* Campaign Name */}
      <div className="space-y-1.5">
        <Label htmlFor="campaignName">
          Campaign Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="campaignName"
          value={config.campaignName}
          onChange={(e) => onUpdate("campaignName", e.target.value)}
          placeholder="e.g. Summer Promo 2026"
        />
      </div>

      {/* Google Tag Manager ID */}
      <div className="space-y-1.5">
        <Label htmlFor="gtmId">Google Tag Manager ID</Label>
        <Input
          id="gtmId"
          value={config.googleTagManagerId}
          onChange={(e) => onUpdate("googleTagManagerId", e.target.value)}
          placeholder="GTM-XXXXXXX"
        />
      </div>

      {/* Affiliate Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="affiliateSlug">
          Affiliate Slug <span className="text-red-500">*</span>
        </Label>
        <Input
          id="affiliateSlug"
          value={config.affiliateSlug}
          onChange={(e) => onUpdate("affiliateSlug", e.target.value)}
          placeholder="e.g. my-brand-summer"
        />
        <p className="text-xs text-muted-foreground">
          Used in the campaign URL: /promo/&#123;slug&#125;
        </p>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Campaign Active</Label>
        <Switch
          checked={config.isActive}
          onCheckedChange={(checked) => onUpdate("isActive", checked)}
        />
      </div>

      {/* End Campaign Date */}
      <div className="space-y-1.5">
        <Label htmlFor="endCampaignDate">
          End Campaign Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="endCampaignDate"
          type="datetime-local"
          value={config.endCampaignDate}
          onChange={(e) => onUpdate("endCampaignDate", e.target.value)}
        />
      </div>

      {/* Get Code Type */}
      <div className="space-y-1.5">
        <Label htmlFor="getCode">Redemption Type</Label>
        <Select
          value={config.getCode || "__none__"}
          onValueChange={(value) =>
            onUpdate("getCode", value === "__none__" ? "" : value)
          }
        >
          <SelectTrigger id="getCode">
            <SelectValue placeholder="Select redemption type" />
          </SelectTrigger>
          <SelectContent>
            {GET_CODE_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value || "__none__"}
                value={opt.value || "__none__"}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Controls which additional sections appear and how codes are
          distributed.
        </p>
      </div>

      {/* Background Color */}
      <div className="space-y-1.5">
        <Label htmlFor="backgroundColor">Page Background Color</Label>
        <div className="flex items-center gap-2">
          <input
            id="backgroundColor"
            type="color"
            value={config.backgroundColor}
            onChange={(e) => onUpdate("backgroundColor", e.target.value)}
            className="h-9 w-12 rounded border cursor-pointer"
          />
          <Input
            value={config.backgroundColor}
            onChange={(e) => onUpdate("backgroundColor", e.target.value)}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
