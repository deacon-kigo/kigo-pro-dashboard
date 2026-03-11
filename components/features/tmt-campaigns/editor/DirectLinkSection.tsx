"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LandingPageConfig } from "@/types/tmt-campaign";

interface DirectLinkSectionProps {
  config: LandingPageConfig;
  onDeepUpdate: (path: string, value: any) => void;
}

export default function DirectLinkSection({
  config,
  onDeepUpdate,
}: DirectLinkSectionProps) {
  const redirectUrl = config.directLinkConfig.redirectUrl;
  const hasValidEnding = redirectUrl.endsWith("=");

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Direct Link campaigns skip the landing page entirely. Users are
        redirected immediately to the target URL with their unique code
        appended.
      </p>

      {/* Redirect URL */}
      <div className="space-y-1.5">
        <Label htmlFor="directLinkUrl">
          Redirect URL <span className="text-red-500">*</span>
        </Label>
        <Input
          id="directLinkUrl"
          value={redirectUrl}
          onChange={(e) =>
            onDeepUpdate("directLinkConfig.redirectUrl", e.target.value)
          }
          placeholder="https://example.com/redeem?code="
        />
        {redirectUrl && !hasValidEnding && (
          <p className="text-xs text-red-500">
            URL must end with &quot;=&quot; so the affiliate code can be
            appended (e.g. https://example.com/redeem?code=).
          </p>
        )}
        {redirectUrl && hasValidEnding && (
          <p className="text-xs text-green-600">
            URL format is valid. The affiliate code will be appended after the
            &quot;=&quot;.
          </p>
        )}
        {!redirectUrl && (
          <p className="text-xs text-muted-foreground">
            The unique affiliate code will be appended to the end of this URL.
            Make sure it ends with &quot;=&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
