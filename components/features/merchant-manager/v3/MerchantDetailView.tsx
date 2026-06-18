"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PencilSquareIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/lib/hooks/use-toast";
import MerchantProfileDisplay from "./MerchantProfileDisplay";
import MerchantForm, { type MerchantFormData } from "./MerchantForm";
import { CATEGORY_BY_ID } from "./category-select";
import type { Merchant, MerchantStatus } from "./types";

type DetailMode = "view" | "edit";

const EDIT_FORM_ID = "merchant-edit-form";

const MERCHANT_STATUS_LABEL: Record<MerchantStatus, string> = {
  published: "Active",
  unpublished: "Unpublished",
  closed: "Closed",
};

interface MerchantDetailViewProps {
  merchant: Merchant;
}

export default function MerchantDetailView({
  merchant,
}: MerchantDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const tabParam = searchParams.get("tab");
  const initialMode: DetailMode = tabParam === "edit" ? "edit" : "view";
  const [mode, setMode] = useState<DetailMode>(initialMode);
  const [isFormValid, setIsFormValid] = useState(false);
  const [merchantState, setMerchantState] = useState<Merchant>(merchant);
  const [merchantStatus, setMerchantStatus] = useState<MerchantStatus>(
    merchant.status ?? "published"
  );

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());
    if (mode === "view") {
      next.delete("tab");
    } else {
      next.set("tab", "edit");
    }
    const qs = next.toString();
    const url = qs ? `?${qs}` : "";
    router.replace(`/merchants/${encodeURIComponent(merchant.id)}${url}`, {
      scroll: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, merchant.id]);

  const handleEditSubmit = (data: MerchantFormData) => {
    const sourceLabel =
      data.source.charAt(0).toUpperCase() + data.source.slice(1);
    const categoryLabel = data.categoryIds
      .map((id) => CATEGORY_BY_ID.get(id)?.categoryName)
      .filter((s): s is string => Boolean(s))
      .join(", ");
    setMerchantState((prev) => ({
      ...prev,
      name: data.dbaName.trim(),
      source: sourceLabel,
      category: categoryLabel || prev.category,
      categoryIds: data.categoryIds,
      website: data.url.trim(),
      merchantDetail: data.highlights,
    }));
    toast({
      title: "Merchant updated",
      description: `${data.dbaName} (${merchant.id}) was updated.`,
    });
    setMode("view");
  };

  const handleStatusChange = (next: MerchantStatus) => {
    if (next === merchantStatus) return;
    setMerchantStatus(next);
    toast({
      title: `Merchant set to ${MERCHANT_STATUS_LABEL[next]}`,
      description:
        next === "unpublished"
          ? "Offers from this merchant will no longer appear in marketplace."
          : next === "closed"
            ? "Merchant marked as closed. Re-enable by creating a new record."
            : `${merchantState.name} is now visible in marketplace.`,
    });
  };

  const chromeHeader =
    mode === "edit"
      ? {
          icon: PencilSquareIcon,
          title: "Edit Merchant",
          description: "Update merchant details before saving back.",
        }
      : {
          icon: BuildingStorefrontIcon,
          title: "Merchant Profile",
          description:
            "View and edit merchant details, branding, locations, and offers.",
        };
  const ChromeIcon = chromeHeader.icon;

  const headerActions =
    mode === "edit" ? (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setMode("view")}>
          Cancel
        </Button>
        <Button
          form={EDIT_FORM_ID}
          type="submit"
          size="sm"
          disabled={!isFormValid}
        >
          Save Changes
        </Button>
      </div>
    ) : (
      <Button size="sm" onClick={() => setMode("edit")}>
        <PencilSquareIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
        Edit Merchant
      </Button>
    );

  return (
    <div className="overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
      <div className="h-full flex gap-3">
        <div className="flex-1 min-w-0">
          <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md">
            <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
              <div className="flex items-center">
                <ChromeIcon
                  className="h-5 w-5 mr-2 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-medium">{chromeHeader.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {chromeHeader.description}
                  </p>
                </div>
              </div>
              {headerActions}
            </div>

            <div className="flex-1 overflow-auto">
              {mode === "view" ? (
                <div className="p-6">
                  <MerchantProfileDisplay
                    merchant={merchantState}
                    status={merchantStatus}
                  />
                </div>
              ) : (
                <MerchantForm
                  formId={EDIT_FORM_ID}
                  initialMerchant={merchantState}
                  onSubmit={handleEditSubmit}
                  onValidityChange={setIsFormValid}
                  status={merchantStatus}
                  onStatusChange={handleStatusChange}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
