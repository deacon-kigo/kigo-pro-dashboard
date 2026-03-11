"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LandingPageConfig } from "@/types/tmt-campaign";

interface AppStoreSectionProps {
  config: LandingPageConfig;
  onDeepUpdate: (path: string, value: any) => void;
}

export default function AppStoreSection({
  config,
  onDeepUpdate,
}: AppStoreSectionProps) {
  return (
    <div className="space-y-4">
      {/* App Store Link */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="appStoreEnabled">App Store Link</Label>
          <Switch
            checked={config.appStoreLink.enabled}
            onCheckedChange={(checked) =>
              onDeepUpdate("appStoreLink.enabled", checked)
            }
          />
        </div>

        {config.appStoreLink.enabled && (
          <div className="space-y-1.5">
            <Label htmlFor="appStoreUrl">
              App Store URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="appStoreUrl"
              value={config.appStoreLink.url}
              onChange={(e) => onDeepUpdate("appStoreLink.url", e.target.value)}
              placeholder="https://apps.apple.com/app/..."
            />
          </div>
        )}
      </div>

      {/* Google Play Link */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="googlePlayEnabled">Google Play Link</Label>
          <Switch
            checked={config.googlePlayLink.enabled}
            onCheckedChange={(checked) =>
              onDeepUpdate("googlePlayLink.enabled", checked)
            }
          />
        </div>

        {config.googlePlayLink.enabled && (
          <div className="space-y-1.5">
            <Label htmlFor="googlePlayUrl">
              Google Play URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="googlePlayUrl"
              value={config.googlePlayLink.url}
              onChange={(e) =>
                onDeepUpdate("googlePlayLink.url", e.target.value)
              }
              placeholder="https://play.google.com/store/apps/..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
