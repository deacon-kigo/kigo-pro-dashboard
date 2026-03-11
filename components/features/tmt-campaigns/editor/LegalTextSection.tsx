"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LandingPageConfig } from "@/types/tmt-campaign";

interface LegalTextSectionProps {
  config: LandingPageConfig;
  onUpdate: (field: string, value: any) => void;
}

export default function LegalTextSection({
  config,
  onUpdate,
}: LegalTextSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="legalText">
          Legal Text (HTML){" "}
          {config.getCode !== "direct-link" && (
            <span className="text-red-500">*</span>
          )}
        </Label>
        <Textarea
          id="legalText"
          value={config.legalText}
          onChange={(e) => onUpdate("legalText", e.target.value)}
          placeholder="<p>Terms and conditions apply. See details at...</p>"
          rows={6}
        />
        <p className="text-xs text-muted-foreground">
          Displayed at the bottom of the landing page. Supports HTML tags for
          formatting (e.g. &lt;p&gt;, &lt;a href=&quot;...&quot;&gt;,
          &lt;strong&gt;).
        </p>
      </div>
    </div>
  );
}
