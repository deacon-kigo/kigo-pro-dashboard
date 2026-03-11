"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { LandingPageConfig } from "@/types/tmt-campaign";
import { apiService } from "@/lib/services/tmtCampaignService";

interface TMTCodesModalProps {
  campaign: LandingPageConfig;
  onClose: () => void;
}

export default function TMTCodesModal({
  campaign,
  onClose,
}: TMTCodesModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [totalCodes, setTotalCodes] = useState(0);
  const [usedCodes, setUsedCodes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [generateCount, setGenerateCount] = useState("100");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [testCode, setTestCode] = useState("");

  const loadCounts = async () => {
    if (!campaign.id) return;
    setIsLoading(true);
    try {
      const [total, used] = await Promise.all([
        apiService.getCampaignCodesCount(campaign.id),
        apiService.getUsedCodesCount(campaign.id),
      ]);
      setTotalCodes(total.total_count);
      setUsedCodes(used.total_count);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCounts();
  }, [campaign.id]);

  const handleGenerate = async () => {
    if (!campaign.id) return;
    setIsGenerating(true);
    try {
      const result = await apiService.generateCampaignCodes(
        campaign.id,
        parseInt(generateCount),
        prefix || undefined,
        suffix || undefined
      );
      toast({
        title: "Codes Generated",
        description: `${result.generated_count} codes generated.`,
      });
      loadCounts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestCode = async () => {
    if (!campaign.id) return;
    try {
      const result = await apiService.generateTestCode(campaign.id);
      setTestCode(result.code);
      toast({ title: "Test Code", description: `Code: ${result.code}` });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleExport = async (isUsed?: boolean) => {
    if (!campaign.id) return;
    setIsExporting(true);
    try {
      const blob = await apiService.exportCampaignCodesCsv(campaign.id, isUsed);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${campaign.affiliateSlug}-codes${isUsed !== undefined ? (isUsed ? "-used" : "-unused") : ""}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !campaign.id) return;
    setIsUploading(true);
    try {
      await apiService.uploadCampaignCodesCsv(campaign.id, file);
      toast({
        title: "Upload Success",
        description: "Codes uploaded successfully.",
      });
      loadCounts();
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAll = async () => {
    if (
      !campaign.id ||
      !confirm("Delete ALL codes for this campaign? This cannot be undone.")
    )
      return;
    setIsDeleting(true);
    try {
      await apiService.deleteCampaignCodes(campaign.id);
      toast({
        title: "Codes Deleted",
        description: "All codes have been deleted.",
      });
      loadCounts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Codes — {campaign.campaignName}</DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Total Codes</p>
            <p className="text-xl font-bold text-blue-600">
              {isLoading ? "..." : totalCodes.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Used</p>
            <p className="text-xl font-bold text-green-600">
              {isLoading ? "..." : usedCodes.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-xl font-bold text-gray-600">
              {isLoading ? "..." : (totalCodes - usedCodes).toLocaleString()}
            </p>
          </div>
        </div>

        <Tabs defaultValue="generate">
          <TabsList className="w-full">
            <TabsTrigger value="generate" className="flex-1">
              Generate
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-1">
              Upload CSV
            </TabsTrigger>
            <TabsTrigger value="export" className="flex-1">
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Number of Codes</Label>
              <Input
                type="number"
                value={generateCount}
                onChange={(e) => setGenerateCount(e.target.value)}
                min="1"
                max="4000000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prefix (optional)</Label>
                <Input
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g. TMO"
                />
              </div>
              <div className="space-y-2">
                <Label>Suffix (optional)</Label>
                <Input
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="e.g. 2026"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? "Generating..." : "Generate Codes"}
              </Button>
              <Button variant="outline" onClick={handleTestCode}>
                Test Code
              </Button>
            </div>
            {testCode && (
              <div className="bg-green-50 p-3 rounded text-center">
                <p className="text-xs text-muted-foreground mb-1">Test Code</p>
                <p className="font-mono font-bold text-lg">{testCode}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Test URL: /p/{campaign.affiliateSlug}?code={testCode}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Upload a CSV file with columns:{" "}
              <code className="text-xs bg-gray-100 px-1 rounded">
                code,affiliate_code_one,affiliate_code_two
              </code>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? "Uploading..." : "Select CSV File"}
            </Button>
          </TabsContent>

          <TabsContent value="export" className="space-y-3 mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleExport()}
              disabled={isExporting}
            >
              Export All Codes
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleExport(false)}
              disabled={isExporting}
            >
              Export Unused Only
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleExport(true)}
              disabled={isExporting}
            >
              Export Used Only
            </Button>
          </TabsContent>
        </Tabs>

        {/* Delete all */}
        <div className="border-t pt-4 mt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteAll}
            disabled={isDeleting || totalCodes === 0}
          >
            {isDeleting ? "Deleting..." : "Delete All Codes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
