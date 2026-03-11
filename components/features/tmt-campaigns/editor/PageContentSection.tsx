"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LandingPageConfig } from "@/types/tmt-campaign";

interface PageContentSectionProps {
  config: LandingPageConfig;
  onUpdate: (field: string, value: any) => void;
  onDeepUpdate: (path: string, value: any) => void;
}

export default function PageContentSection({
  config,
  onUpdate,
  onDeepUpdate,
}: PageContentSectionProps) {
  return (
    <div className="space-y-4">
      {/* Logo URL */}
      <div className="space-y-1.5">
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input
          id="logoUrl"
          value={config.logo.url}
          onChange={(e) => onDeepUpdate("logo.url", e.target.value)}
          placeholder="https://example.com/logo.png"
        />
      </div>

      {/* Logo Alt Text */}
      <div className="space-y-1.5">
        <Label htmlFor="logoAlt">Logo Alt Text</Label>
        <Input
          id="logoAlt"
          value={config.logo.alt}
          onChange={(e) => onDeepUpdate("logo.alt", e.target.value)}
          placeholder="Company Logo"
        />
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={config.title}
          onChange={(e) => onUpdate("title", e.target.value)}
          placeholder="Your Amazing Offer"
        />
      </div>

      {/* Description (HTML) */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description (HTML)</Label>
        <Textarea
          id="description"
          value={config.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="<p>Get exclusive access to our special promotion.</p>"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Supports HTML tags for formatting (e.g. &lt;p&gt;, &lt;strong&gt;,
          &lt;br/&gt;).
        </p>
      </div>

      {/* Product Image URL */}
      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">Product Image URL</Label>
        <Input
          id="imageUrl"
          value={config.image.url}
          onChange={(e) => onDeepUpdate("image.url", e.target.value)}
          placeholder="https://example.com/product.png"
        />
      </div>

      {/* Product Image Alt Text */}
      <div className="space-y-1.5">
        <Label htmlFor="imageAlt">Product Image Alt Text</Label>
        <Input
          id="imageAlt"
          value={config.image.alt}
          onChange={(e) => onDeepUpdate("image.alt", e.target.value)}
          placeholder="Product Image"
        />
      </div>

      {/* Secondary Description (HTML) */}
      <div className="space-y-1.5">
        <Label htmlFor="secondaryDescription">
          Secondary Description (HTML)
        </Label>
        <Textarea
          id="secondaryDescription"
          value={config.secondaryDescription}
          onChange={(e) => onUpdate("secondaryDescription", e.target.value)}
          placeholder="<p>Additional details about the promotion.</p>"
          rows={3}
        />
      </div>
    </div>
  );
}
