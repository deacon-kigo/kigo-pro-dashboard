"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LandingPageConfig } from "@/types/tmt-campaign";
import { useToast } from "@/lib/hooks/use-toast";
import { apiService } from "@/lib/services/tmtCampaignService";
import {
  CheckCircleIcon,
  ClipboardDocumentIcon,
  LinkIcon,
  QrCodeIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

interface PublishShareSectionProps {
  config: LandingPageConfig;
  campaignId?: string;
}

export default function PublishShareSection({
  config,
  campaignId,
}: PublishShareSectionProps) {
  const { toast } = useToast();
  const [testCode, setTestCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const baseUrl = "https://kigo-pro-dashboard.vercel.app";
  const campaignUrl = config.affiliateSlug
    ? `${baseUrl}/p/${config.affiliateSlug}`
    : "";
  const fullUrl = testCode ? `${campaignUrl}?code=${testCode}` : "";

  const isReady = !!(
    config.campaignName &&
    config.affiliateSlug &&
    config.isActive &&
    config.endCampaignDate
  );

  const resolvedId = campaignId || config.id;

  const handleGenerateTestCode = async () => {
    setIsGenerating(true);
    try {
      if (resolvedId) {
        const result = await apiService.generateTestCode(resolvedId);
        setTestCode(result.code);
        toast({ title: "Test Code Generated", description: result.code });
      } else {
        throw new Error("no id");
      }
    } catch {
      // Mock fallback — use preview mode so the landing page still renders
      const mockCode = `PREVIEW`;
      setTestCode(mockCode);
      toast({
        title: "Test Code (Preview Mode)",
        description:
          "Using preview mode — landing page will render without backend validation.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ title: "Copied!", description: text });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const readinessChecks = [
    { label: "Campaign name set", ok: !!config.campaignName },
    { label: "Affiliate slug configured", ok: !!config.affiliateSlug },
    { label: "Campaign is active", ok: !!config.isActive },
    { label: "End date set", ok: !!config.endCampaignDate },
    { label: "Page content configured", ok: !!config.title },
  ];

  return (
    <div className="space-y-5">
      {/* Readiness Checklist */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          Publish Readiness
        </Label>
        <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5">
          {readinessChecks.map((check) => (
            <div key={check.label} className="flex items-center gap-2">
              {check.ok ? (
                <CheckCircleSolid className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <ExclamationTriangleIcon className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <span
                className={`text-sm ${check.ok ? "text-gray-700" : "text-amber-700 font-medium"}`}
              >
                {check.label}
              </span>
            </div>
          ))}
        </div>
        {isReady ? (
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Ready to Share
            </Badge>
          </div>
        ) : (
          <p className="text-xs text-amber-600 mt-2">
            Complete all checks above before sharing.
          </p>
        )}
      </div>

      {/* Public Campaign URL */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          <LinkIcon className="h-4 w-4 inline mr-1" />
          Campaign Landing Page URL
        </Label>
        {config.affiliateSlug ? (
          <div className="flex gap-2">
            <Input
              value={campaignUrl}
              readOnly
              className="font-mono text-sm bg-muted/50"
            />
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => copyToClipboard(campaignUrl, "url")}
            >
              {copiedField === "url" ? (
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              ) : (
                <ClipboardDocumentIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Set an affiliate slug in Campaign Settings first.
          </p>
        )}
      </div>

      {/* Test Code Generation */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          <KeyIcon className="h-4 w-4 inline mr-1" />
          Generate Test Link
        </Label>
        <p className="text-xs text-muted-foreground mb-2">
          Generate a test code and get a complete shareable URL for the TMT
          client.
        </p>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={testCode}
              placeholder="Click generate to create a test code"
              readOnly
              className="font-mono text-sm bg-muted/50"
            />
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={handleGenerateTestCode}
              disabled={isGenerating || !config.affiliateSlug}
            >
              {isGenerating ? "..." : "Generate"}
            </Button>
          </div>

          {fullUrl && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircleSolid className="h-4 w-4 text-green-600 shrink-0" />
                <span className="text-sm font-semibold text-green-800">
                  Shareable Link Ready
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={fullUrl}
                  readOnly
                  className="font-mono text-xs bg-white border-green-200"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-green-300 hover:bg-green-100"
                  onClick={() => copyToClipboard(fullUrl, "fullUrl")}
                >
                  {copiedField === "fullUrl" ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.open(fullUrl, "_blank")}
                >
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 mr-1" />
                  Preview in New Tab
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  disabled
                  title="QR code generation — coming soon"
                >
                  <QrCodeIcon className="h-3.5 w-3.5 mr-1" />
                  QR Code
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-lg border bg-blue-50/50 p-3">
        <p className="text-xs font-semibold text-blue-800 mb-2">
          How sharing works
        </p>
        <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
          <li>Generate or upload codes via the Codes Manager</li>
          <li>
            Each code creates a unique URL:{" "}
            <code className="bg-blue-100 px-1 rounded">/p/slug?code=ABC</code>
          </li>
          <li>
            Share the URL with the TMT client — they only see the landing page
          </li>
          <li>
            The client cannot access the dashboard or any other Kigo Pro pages
          </li>
        </ol>
      </div>
    </div>
  );
}
