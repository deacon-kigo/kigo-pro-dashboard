"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/lib/hooks/use-toast";
import MerchantForm, { type MerchantFormData } from "./MerchantForm";
import type { Merchant } from "./types";

const FORM_ID = "create-merchant-form";

interface CreateMerchantViewProps {
  /** When provided, the view renders in "edit" mode and pre-fills from the merchant. */
  initialMerchant?: Merchant;
}

export default function CreateMerchantView({
  initialMerchant,
}: CreateMerchantViewProps = {}) {
  const isEdit = Boolean(initialMerchant);
  const router = useRouter();
  const { toast } = useToast();
  const [isValid, setIsValid] = useState(false);

  const handleCancel = () => {
    router.push("/merchants");
  };

  const handleSubmit = (data: MerchantFormData) => {
    toast({
      title: isEdit ? "Merchant updated" : "Merchant created",
      description: isEdit
        ? `${data.dbaName} (${initialMerchant?.id}) was updated.`
        : `${data.dbaName} was added.`,
    });
    router.push("/merchants");
  };

  const pageTitle = isEdit ? "Edit Merchant" : "Create Merchant";
  const pageDescription = isEdit
    ? `Update merchant details${initialMerchant ? ` for ${initialMerchant.name}` : ""}.`
    : "Add merchant details to create your offer";
  const saveLabel = isEdit ? "Save Changes" : "Save Merchant";

  return (
    <div className="overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
      <div className="h-full flex gap-3">
        <div className="flex-1 min-w-0">
          <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md">
            {/* Header bar — matches offer manager / ad manager pattern */}
            <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
              <div className="flex items-center">
                <BuildingStorefrontIcon
                  className="h-5 w-5 mr-2 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-medium">{pageTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pageDescription}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  form={FORM_ID}
                  type="submit"
                  size="sm"
                  disabled={!isValid}
                >
                  {saveLabel}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <MerchantForm
                formId={FORM_ID}
                initialMerchant={initialMerchant}
                onSubmit={handleSubmit}
                onValidityChange={setIsValid}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
