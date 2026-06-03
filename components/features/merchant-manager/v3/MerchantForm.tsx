"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import type { Merchant, MerchantStatus } from "./types";

// Mirrors kigo-admin-tools/.../create-merchant-form/constants.ts
const MIN_DBA_NAME_LENGTH = 3;
const MAX_DBA_NAME_LENGTH = 100;
const MIN_CORP_NAME_LENGTH = 3;
const MAX_CORP_NAME_LENGTH = 100;
const MAX_HIGHLIGHTS_LENGTH = 2000;
const FILE_HELPER_TEXT = "JPG or PNG (max file size 2MB)";

const SOURCE_OPTIONS = [
  { label: "Augeo", value: "augeo" },
  { label: "Entertainment Benefits Group", value: "ebg" },
  { label: "Direct Partnership", value: "direct" },
] as const;

const CATEGORY_OPTIONS = [
  { label: "Retail", value: "retail" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Health & Wellness", value: "health-wellness" },
  { label: "Food & Dining", value: "food-dining" },
  { label: "Travel", value: "travel" },
  { label: "Pets", value: "pets" },
  { label: "Sports", value: "sports" },
  { label: "Home & Garden", value: "home-garden" },
];

export interface MerchantFormData {
  dbaName: string;
  logo: File | null;
  logoPreview: string | null;
  source: string;
  categories: string[];
  locationsTab: "upload" | "manual";
  locationsFile: File | null;
  manualAddress: string;
  manualState: string;
  bannerImage: File | null;
  bannerPreview: string | null;
  corpName: string;
  url: string;
  highlights: string;
}

const initialFormState: MerchantFormData = {
  dbaName: "",
  logo: null,
  logoPreview: null,
  source: "",
  categories: [],
  locationsTab: "upload",
  locationsFile: null,
  manualAddress: "",
  manualState: "",
  bannerImage: null,
  bannerPreview: null,
  corpName: "",
  url: "",
  highlights: "",
};

export function merchantToFormState(m: Merchant): MerchantFormData {
  return {
    ...initialFormState,
    dbaName: m.name,
    source: m.source ? m.source.toLowerCase().replace(/\s+/g, "-") : "",
    categories: m.category
      ? [m.category.toLowerCase().replace(/\s+/g, "-")]
      : [],
    corpName: m.name,
    url: m.website ?? "",
    highlights: m.merchantDetail ?? "",
  };
}

interface MerchantFormProps {
  /** When provided, the form pre-fills for edit mode (no logo required). */
  initialMerchant?: Merchant;
  /** Form element id — required so an outside submit button can use `form={formId}`. */
  formId: string;
  /** Called with the form data when the form is submitted (only fires if valid). */
  onSubmit: (data: MerchantFormData) => void;
  /** Fires whenever the validity changes so a parent can disable a submit button. */
  onValidityChange?: (isValid: boolean) => void;
  /** Current merchant status (edit mode only). When provided, renders a Status
   * panel near the top of the form so ops can publish/unpublish/close from
   * inside the edit flow — per Slack addendum from John K. */
  status?: MerchantStatus;
  /** Called when the operator picks a different status (edit mode only). */
  onStatusChange?: (next: MerchantStatus) => void;
}

export default function MerchantForm({
  initialMerchant,
  formId,
  onSubmit,
  onValidityChange,
  status,
  onStatusChange,
}: MerchantFormProps) {
  const isEdit = Boolean(initialMerchant);
  const [form, setForm] = useState<MerchantFormData>(() =>
    initialMerchant ? merchantToFormState(initialMerchant) : initialFormState
  );
  const [urlTouched, setUrlTouched] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const locationsFileInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof MerchantFormData>(
    field: K,
    value: MerchantFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const dbaValid =
    form.dbaName.trim().length >= MIN_DBA_NAME_LENGTH &&
    form.dbaName.trim().length <= MAX_DBA_NAME_LENGTH;
  const sourceValid = form.source.length > 0;
  const categoriesValid = form.categories.length > 0;
  const locationsValid =
    form.locationsTab === "upload"
      ? form.locationsFile !== null
      : form.manualAddress.trim().length > 0 &&
        form.manualState.trim().length > 0;
  const logoValid = isEdit ? true : form.logo !== null;
  const urlValid = useMemo(() => {
    if (!form.url) return true;
    try {
      const u = new URL(form.url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }, [form.url]);
  const urlError = urlTouched && !urlValid;

  const isValid =
    dbaValid &&
    logoValid &&
    sourceValid &&
    categoriesValid &&
    locationsValid &&
    urlValid;

  // Notify parent on validity change (lets parent enable/disable Save button).
  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  const readFileAsDataUrl = (file: File, onLoad: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => onLoad(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    update("logo", file);
    readFileAsDataUrl(file, (url) => update("logoPreview", url));
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    update("bannerImage", file);
    readFileAsDataUrl(file, (url) => update("bannerPreview", url));
  };

  const handleLocationsFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;
    update("locationsFile", file);
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Address",
      "City",
      "State",
      "Country",
      "Zip",
      "Longitude",
      "Latitude",
    ];
    const csv = headers.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "locations-template.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(form);
  };

  return (
    <form
      id={formId}
      onSubmit={handleFormSubmit}
      className="p-6 space-y-6 divide-y divide-gray-200"
    >
      {/* ============================================================ */}
      {/* Status — edit mode only. Owns publish / unpublish / close per */}
      {/* Slack addendum: "Unpublish capability in the edit form." */}
      {/* ============================================================ */}
      {isEdit && status && onStatusChange && (
        <div className="pb-6">
          <Label className="text-sm">Merchant status</Label>
          <p className="mt-1.5 text-sm font-medium text-gray-600">
            Controls whether this merchant&apos;s offers appear in the
            marketplace. Closed is a one-way state — re-enable by creating a new
            record.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(
              [
                {
                  value: "published" as const,
                  label: "Active",
                  description: "Visible in marketplace",
                },
                {
                  value: "unpublished" as const,
                  label: "Unpublished",
                  description: "Offers hidden from marketplace",
                },
                {
                  value: "closed" as const,
                  label: "Closed",
                  description: "Out of business",
                },
              ] satisfies {
                value: MerchantStatus;
                label: string;
                description: string;
              }[]
            ).map((opt) => {
              const isActive = status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onStatusChange(opt.value)}
                  aria-pressed={isActive}
                  className={`flex flex-col items-start gap-1 rounded-md border p-3 text-left transition-colors ${
                    isActive
                      ? "border-primary bg-pastel-blue"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      isActive ? "text-primary" : "text-gray-900"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {opt.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Required Fields */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 pb-6 lg:grid-cols-2">
        {/* DBA Name */}
        <div>
          <Label htmlFor="dbaName">
            DBA Name (Brand Name)
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dbaName"
            placeholder="Joe's Pizza"
            value={form.dbaName}
            onChange={(e) => update("dbaName", e.target.value)}
            maxLength={MAX_DBA_NAME_LENGTH}
            className="mt-1"
          />
          <p className="mt-1.5 text-sm font-medium text-gray-600">
            The name customers will see ({MIN_DBA_NAME_LENGTH}-
            {MAX_DBA_NAME_LENGTH} chars)
          </p>
        </div>

        {/* Logo — spans 2 rows on lg, sits next to DBA + Source */}
        <div className="lg:row-span-2">
          <Label htmlFor="merchantLogo">
            Logo<span className="text-destructive">*</span>
          </Label>
          {form.logoPreview ? (
            <div className="relative mt-1 flex h-32 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
              <img
                src={form.logoPreview}
                alt="Logo preview"
                className="h-28 w-28 rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  update("logo", null);
                  update("logoPreview", null);
                }}
                aria-label="Remove logo"
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
              >
                <XMarkIcon className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              aria-label="Upload merchant logo"
              className="mt-1 flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <PhotoIcon className="h-7 w-7 text-gray-500" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-700">
                Upload file
              </span>
              <span className="text-sm font-medium text-gray-600">
                {FILE_HELPER_TEXT}
              </span>
            </button>
          )}
          <input
            ref={logoInputRef}
            id="merchantLogo"
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        {/* Source */}
        <div>
          <Label htmlFor="source">
            Source<span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.source}
            onValueChange={(v) => update("source", v)}
          >
            <SelectTrigger id="source" className="mt-1">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {SOURCE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1.5 text-sm font-medium text-gray-600">
            Where is this merchant from?
          </p>
        </div>

        {/* Categories — full width */}
        <div className="lg:col-span-2">
          <Label htmlFor="categories">
            Categories<span className="text-destructive">*</span>
          </Label>
          <div className="mt-1">
            <ReactSelectMulti
              options={CATEGORY_OPTIONS}
              values={form.categories}
              onChange={(values) => update("categories", values)}
              placeholder="Select one or more categories"
            />
          </div>
          <p className="mt-1.5 text-sm font-medium text-gray-600">
            Select one or more categories for this merchant
          </p>
        </div>

        {/* Locations — full width */}
        <fieldset className="space-y-3 lg:col-span-2">
          <Label asChild>
            <legend>
              Locations<span className="text-destructive">*</span>
            </legend>
          </Label>
          <Tabs
            value={form.locationsTab}
            onValueChange={(v) => {
              update("locationsTab", v as "upload" | "manual");
              update("locationsFile", null);
              update("manualAddress", "");
              update("manualState", "");
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">File Upload</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="locationsFile">Upload Locations</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                >
                  <ArrowDownTrayIcon
                    className="mr-1 h-4 w-4"
                    aria-hidden="true"
                  />
                  Download Template
                </Button>
              </div>
              <button
                type="button"
                onClick={() => locationsFileInputRef.current?.click()}
                className="flex min-h-[180px] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {form.locationsFile ? (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircleIcon
                      className="h-5 w-5 text-green-700"
                      aria-hidden="true"
                    />
                    <span className="font-medium">
                      {form.locationsFile.name}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      ({Math.round(form.locationsFile.size / 1024)} KB)
                    </span>
                  </div>
                ) : (
                  <>
                    <ArrowUpTrayIcon
                      className="h-7 w-7 text-gray-500"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-medium text-gray-700">
                      Drop Locations file here
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      CSV or XLSX file with Address, City, State, and Zip
                      columns
                    </div>
                  </>
                )}
              </button>
              <input
                ref={locationsFileInputRef}
                id="locationsFile"
                type="file"
                accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleLocationsFileChange}
                className="hidden"
              />
            </TabsContent>

            <TabsContent value="manual" className="mt-4 space-y-3">
              <div className="flex gap-2">
                <div className="grow">
                  <Label htmlFor="manualAddress">Address</Label>
                  <Input
                    id="manualAddress"
                    placeholder="Business street address"
                    value={form.manualAddress}
                    onChange={(e) => update("manualAddress", e.target.value)}
                    className="mt-1"
                  />
                  <p className="mt-1.5 text-sm font-medium text-gray-600">
                    The business street address (3-100 chars)
                  </p>
                </div>
                <div className="w-1/4">
                  <Label htmlFor="manualState">State</Label>
                  <Input
                    id="manualState"
                    placeholder="e.g. CA"
                    value={form.manualState}
                    onChange={(e) => update("manualState", e.target.value)}
                    className="mt-1"
                    maxLength={100}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </fieldset>
      </div>

      {/* ============================================================ */}
      {/* Optional Fields — Collapsible */}
      {/* ============================================================ */}
      <Collapsible className="group/optional pb-2 pt-4">
        <CollapsibleTrigger className="flex items-center gap-2 [&[data-state=open]>svg]:rotate-90">
          <ChevronRightIcon
            className="h-4 w-4 text-gray-500 transition-transform"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-gray-700">
            Optional Fields
          </span>
          <span className="text-sm font-medium text-gray-600">
            (Banner, Corporation Name, URL, Highlights)
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
            {/* Banner Image */}
            <div>
              <Label htmlFor="bannerImage">Banner Image</Label>
              {form.bannerPreview ? (
                <div className="relative mt-1 h-24 w-full">
                  <img
                    src={form.bannerPreview}
                    alt="Banner preview"
                    className="h-24 w-full rounded-lg border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      update("bannerImage", null);
                      update("bannerPreview", null);
                    }}
                    aria-label="Remove banner image"
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                  >
                    <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  aria-label="Upload banner image"
                  className="mt-1 flex h-24 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <PhotoIcon
                    className="h-6 w-6 text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Upload file
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {FILE_HELPER_TEXT}
                  </span>
                </button>
              )}
              <input
                ref={bannerInputRef}
                id="bannerImage"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleBannerUpload}
                className="hidden"
              />
            </div>

            {/* Corporation Name */}
            <div>
              <Label htmlFor="corpName">Corporation Name</Label>
              <Input
                id="corpName"
                placeholder="Legal entity name"
                value={form.corpName}
                onChange={(e) => update("corpName", e.target.value)}
                maxLength={MAX_CORP_NAME_LENGTH}
                className="mt-1"
              />
              <p className="mt-1.5 text-sm font-medium text-gray-600">
                {MIN_CORP_NAME_LENGTH}-{MAX_CORP_NAME_LENGTH} characters
              </p>
            </div>

            {/* URL — full width */}
            <div className="lg:col-span-2">
              <Label
                htmlFor="url"
                className={urlError ? "text-destructive" : ""}
              >
                URL
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.example.com"
                value={form.url}
                onChange={(e) => update("url", e.target.value)}
                onBlur={() => setUrlTouched(true)}
                className={`mt-1 ${urlError ? "border-destructive" : ""}`}
              />
              {urlError && (
                <p className="mt-1.5 text-sm text-destructive">
                  URL is invalid. Make sure to follow the format:
                  https://example.com
                </p>
              )}
            </div>
          </div>

          {/* Merchant Highlights */}
          <div>
            <Label htmlFor="highlights">Merchant Highlights</Label>
            <Textarea
              id="highlights"
              placeholder="What makes this merchant special?"
              value={form.highlights}
              onChange={(e) => update("highlights", e.target.value)}
              maxLength={MAX_HIGHLIGHTS_LENGTH}
              rows={4}
              className="mt-1"
            />
            <p className="mt-1.5 text-right text-sm font-medium text-gray-600">
              {form.highlights.length} / {MAX_HIGHLIGHTS_LENGTH} characters
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </form>
  );
}
