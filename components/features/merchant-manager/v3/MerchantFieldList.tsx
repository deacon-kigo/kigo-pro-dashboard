"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/atoms/Badge";
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
  PhotoIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/lib/hooks/use-toast";
import { MerchantLogo } from "./MerchantLogo";
import type { Merchant, MerchantStatus } from "./types";

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

const STATUS_OPTIONS: {
  value: MerchantStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "published",
    label: "Active",
    description: "Visible in marketplace",
  },
  {
    value: "unpublished",
    label: "Unpublished",
    description: "Offers hidden from marketplace",
  },
  { value: "closed", label: "Closed", description: "Out of business" },
];

const STATUS_LABEL: Record<MerchantStatus, string> = {
  published: "Active",
  unpublished: "Unpublished",
  closed: "Closed",
};

const statusVariant = (s: MerchantStatus) =>
  s === "published"
    ? ("success" as const)
    : s === "unpublished"
      ? ("warning" as const)
      : ("error" as const);

const MIN_NAME = 3;
const MAX_NAME = 100;
const MIN_CORP_NAME = 3;
const MAX_CORP_NAME = 100;
const MAX_DETAIL = 2000;
const FILE_HELPER = "JPG or PNG (max file size 2MB)";

const readFileAsDataUrl = (file: File, onLoad: (url: string) => void) => {
  const r = new FileReader();
  r.onloadend = () => onLoad(r.result as string);
  r.readAsDataURL(file);
};

type LocationsValue =
  | { mode: "upload"; fileName: string }
  | { mode: "manual"; address: string; state: string };

interface MerchantFieldListProps {
  merchant: Merchant;
  status: MerchantStatus;
  onStatusChange: (s: MerchantStatus) => void;
  onMerchantChange: (next: Partial<Merchant>) => void;
}

export default function MerchantFieldList({
  merchant,
  status,
  onStatusChange,
  onMerchantChange,
}: MerchantFieldListProps) {
  const { toast } = useToast();
  const [editing, setEditing] = useState<string | null>(null);

  // Per-field draft state — reinitialized from the current value when edit
  // starts via startEdit() so drafts never carry stale data between sessions.
  const [draftStatus, setDraftStatus] = useState<MerchantStatus>(status);
  const [draftName, setDraftName] = useState(merchant.name);
  const [draftSource, setDraftSource] = useState("");
  const [draftCategories, setDraftCategories] = useState<string[]>([]);
  const [draftWebsite, setDraftWebsite] = useState(merchant.website ?? "");
  const [draftContact, setDraftContact] = useState(merchant.contact ?? "");
  const [draftDetail, setDraftDetail] = useState(merchant.merchantDetail ?? "");

  // Prototype-local file fields — Merchant type doesn't carry logo / banner /
  // locations / corpName payloads, so these live in component state and don't
  // round-trip through onMerchantChange.
  const [savedLogo, setSavedLogo] = useState<string | null>(null);
  const [draftLogo, setDraftLogo] = useState<{
    file: File | null;
    preview: string | null;
  }>({ file: null, preview: null });
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [savedBanner, setSavedBanner] = useState<string | null>(null);
  const [draftBanner, setDraftBanner] = useState<{
    file: File | null;
    preview: string | null;
  }>({ file: null, preview: null });
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [savedLocations, setSavedLocations] = useState<LocationsValue | null>(
    null
  );
  const [draftLocationsTab, setDraftLocationsTab] = useState<
    "upload" | "manual"
  >("upload");
  const [draftLocationsFile, setDraftLocationsFile] = useState<File | null>(
    null
  );
  const [draftLocationsAddress, setDraftLocationsAddress] = useState("");
  const [draftLocationsState, setDraftLocationsState] = useState("");
  const locationsFileInputRef = useRef<HTMLInputElement>(null);

  const [savedCorpName, setSavedCorpName] = useState("");
  const [draftCorpName, setDraftCorpName] = useState("");

  const closeEdit = () => setEditing(null);

  const startEdit = (field: string, init: () => void) => () => {
    init();
    setEditing(field);
  };

  const toastSaved = (field: string) =>
    toast({
      title: `${field} updated`,
      description: `Saved for ${merchant.name}.`,
    });

  const handleLogoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsDataUrl(file, (preview) => setDraftLogo({ file, preview }));
  };

  const handleBannerPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsDataUrl(file, (preview) => setDraftBanner({ file, preview }));
  };

  const handleLocationsFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setDraftLocationsFile(file);
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

  const locationsDraftValid =
    draftLocationsTab === "upload"
      ? draftLocationsFile !== null
      : draftLocationsAddress.trim().length > 0 &&
        draftLocationsState.trim().length > 0;

  // URL validation — same rule as MerchantForm.
  const websiteValid = (() => {
    if (!draftWebsite) return true;
    try {
      const u = new URL(
        draftWebsite.startsWith("http")
          ? draftWebsite
          : `https://${draftWebsite}`
      );
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  })();

  return (
    <>
      <dl className="divide-y divide-gray-200">
        <FieldRow
          label="Status"
          helper="Controls whether this merchant's offers appear in the marketplace."
          actionLabel="Edit"
          isEditing={editing === "status"}
          onStartEdit={startEdit("status", () => setDraftStatus(status))}
          onCancel={closeEdit}
          onSave={() => {
            onStatusChange(draftStatus);
            toastSaved("Status");
            closeEdit();
          }}
          display={
            <Badge variant={statusVariant(status)} className="font-medium">
              {STATUS_LABEL[status]}
            </Badge>
          }
          editor={
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {STATUS_OPTIONS.map((opt) => {
                const isActive = draftStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraftStatus(opt.value)}
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
          }
        />

        <FieldRow
          label="DBA Name"
          helper="The name customers will see."
          actionLabel="Edit"
          isEditing={editing === "dbaName"}
          onStartEdit={startEdit("dbaName", () => setDraftName(merchant.name))}
          onCancel={closeEdit}
          canSave={
            draftName.trim().length >= MIN_NAME &&
            draftName.trim().length <= MAX_NAME
          }
          onSave={() => {
            onMerchantChange({ name: draftName.trim() });
            toastSaved("DBA Name");
            closeEdit();
          }}
          display={merchant.name}
          editor={
            <Input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              maxLength={MAX_NAME}
              autoFocus
            />
          }
        />

        <FieldRow
          label="Logo"
          helper={FILE_HELPER}
          actionLabel={savedLogo ? "Replace" : "Edit"}
          isEditing={editing === "logo"}
          onStartEdit={startEdit("logo", () =>
            setDraftLogo({
              file: null,
              preview: savedLogo,
            })
          )}
          onCancel={closeEdit}
          canSave={draftLogo.file !== null || draftLogo.preview !== null}
          onSave={() => {
            setSavedLogo(draftLogo.preview);
            toastSaved("Logo");
            closeEdit();
          }}
          display={
            // Fall back to the auto-resolved brand logo (Logo.dev → Google →
            // DuckDuckGo → initials) used by the page header, so the field
            // stays in sync with what an operator visually sees for the
            // merchant rather than reading "Not provided" for every record
            // that hasn't been manually overridden.
            savedLogo ? (
              <div className="flex items-center gap-2">
                <img
                  src={savedLogo}
                  alt="Custom logo"
                  className="h-10 w-10 rounded border border-gray-200 object-contain"
                />
                <span>Custom upload</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MerchantLogo merchant={merchant} size={40} />
                <span className="text-gray-500">
                  Auto-detected from {merchant.website || "merchant name"}
                </span>
              </div>
            )
          }
          editor={
            <>
              {draftLogo.preview ? (
                <div className="relative flex h-32 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                  <img
                    src={draftLogo.preview}
                    alt="Logo preview"
                    className="h-28 w-28 rounded-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setDraftLogo({ file: null, preview: null })}
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
                  className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <PhotoIcon
                    className="h-7 w-7 text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Upload file
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {FILE_HELPER}
                  </span>
                </button>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleLogoPick}
                className="hidden"
              />
            </>
          }
        />

        <FieldRow
          label="Source"
          actionLabel="Edit"
          isEditing={editing === "source"}
          onStartEdit={startEdit("source", () =>
            setDraftSource(
              SOURCE_OPTIONS.find(
                (o) =>
                  o.label.toLowerCase() ===
                  (merchant.source ?? "").toLowerCase()
              )?.value ?? ""
            )
          )}
          onCancel={closeEdit}
          canSave={draftSource.length > 0}
          onSave={() => {
            const label =
              SOURCE_OPTIONS.find((o) => o.value === draftSource)?.label ??
              draftSource;
            onMerchantChange({ source: label });
            toastSaved("Source");
            closeEdit();
          }}
          display={merchant.source || <NotProvided />}
          editor={
            <Select value={draftSource} onValueChange={setDraftSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />

        <FieldRow
          label="Categories"
          actionLabel="Edit"
          isEditing={editing === "categories"}
          onStartEdit={startEdit("categories", () => {
            // Merchant type stores `category` as a singular string; seed the
            // multi-select with whichever option matches the stored label.
            const match = merchant.category
              ? CATEGORY_OPTIONS.find(
                  (c) =>
                    c.label.toLowerCase() === merchant.category.toLowerCase()
                )
              : undefined;
            setDraftCategories(match ? [match.value] : []);
          })}
          onCancel={closeEdit}
          canSave={draftCategories.length > 0}
          onSave={() => {
            const labels = draftCategories
              .map(
                (v) => CATEGORY_OPTIONS.find((c) => c.value === v)?.label ?? v
              )
              .join(", ");
            onMerchantChange({ category: labels });
            toastSaved("Categories");
            closeEdit();
          }}
          display={merchant.category || <NotProvided />}
          editor={
            <ReactSelectMulti
              options={CATEGORY_OPTIONS}
              values={draftCategories}
              onChange={setDraftCategories}
              placeholder="Select one or more categories"
            />
          }
        />

        <FieldRow
          label="Locations"
          actionLabel={savedLocations ? "Edit" : "Add"}
          isEditing={editing === "locations"}
          onStartEdit={startEdit("locations", () => {
            if (savedLocations?.mode === "upload") {
              setDraftLocationsTab("upload");
              setDraftLocationsFile(null);
            } else if (savedLocations?.mode === "manual") {
              setDraftLocationsTab("manual");
              setDraftLocationsAddress(savedLocations.address);
              setDraftLocationsState(savedLocations.state);
            } else {
              setDraftLocationsTab("upload");
              setDraftLocationsFile(null);
              setDraftLocationsAddress("");
              setDraftLocationsState("");
            }
          })}
          onCancel={closeEdit}
          canSave={locationsDraftValid}
          onSave={() => {
            if (draftLocationsTab === "upload" && draftLocationsFile) {
              setSavedLocations({
                mode: "upload",
                fileName: draftLocationsFile.name,
              });
            } else if (draftLocationsTab === "manual") {
              setSavedLocations({
                mode: "manual",
                address: draftLocationsAddress.trim(),
                state: draftLocationsState.trim(),
              });
            }
            toastSaved("Locations");
            closeEdit();
          }}
          display={
            savedLocations ? (
              savedLocations.mode === "upload" ? (
                <span>{savedLocations.fileName} uploaded</span>
              ) : (
                <span>
                  {savedLocations.address}, {savedLocations.state}
                </span>
              )
            ) : (
              <NotProvided />
            )
          }
          editor={
            <Tabs
              value={draftLocationsTab}
              onValueChange={(v) => {
                setDraftLocationsTab(v as "upload" | "manual");
                setDraftLocationsFile(null);
                setDraftLocationsAddress("");
                setDraftLocationsState("");
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
                  className="flex min-h-[180px] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition-colors hover:bg-gray-100"
                >
                  {draftLocationsFile ? (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircleIcon
                        className="h-5 w-5 text-green-700"
                        aria-hidden="true"
                      />
                      <span className="font-medium">
                        {draftLocationsFile.name}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        ({Math.round(draftLocationsFile.size / 1024)} KB)
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
                  onChange={handleLocationsFilePick}
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
                      value={draftLocationsAddress}
                      onChange={(e) => setDraftLocationsAddress(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="w-1/4">
                    <Label htmlFor="manualState">State</Label>
                    <Input
                      id="manualState"
                      placeholder="e.g. CA"
                      value={draftLocationsState}
                      onChange={(e) => setDraftLocationsState(e.target.value)}
                      maxLength={100}
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          }
        />
      </dl>

      <SectionBreak
        id="merchant-additional-details"
        label="Additional details"
      />

      <dl
        aria-labelledby="merchant-additional-details"
        className="divide-y divide-gray-200 border-t border-gray-200"
      >
        <FieldRow
          label="Website"
          actionLabel={merchant.website ? "Edit" : "Add"}
          isEditing={editing === "website"}
          onStartEdit={startEdit("website", () =>
            setDraftWebsite(merchant.website ?? "")
          )}
          onCancel={closeEdit}
          canSave={websiteValid}
          onSave={() => {
            onMerchantChange({ website: draftWebsite.trim() });
            toastSaved("Website");
            closeEdit();
          }}
          display={
            merchant.website ? (
              <a
                href={
                  merchant.website.startsWith("http")
                    ? merchant.website
                    : `https://${merchant.website}`
                }
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary hover:underline"
              >
                {merchant.website}
              </a>
            ) : (
              <NotProvided />
            )
          }
          editor={
            <div>
              <Input
                type="url"
                value={draftWebsite}
                onChange={(e) => setDraftWebsite(e.target.value)}
                placeholder="https://www.example.com"
                autoFocus
                className={!websiteValid ? "border-destructive" : ""}
              />
              {!websiteValid && (
                <p className="mt-1.5 text-sm text-destructive">
                  URL must start with http:// or https://
                </p>
              )}
            </div>
          }
        />

        <FieldRow
          label="Primary contact"
          actionLabel={merchant.contact ? "Edit" : "Add"}
          isEditing={editing === "contact"}
          onStartEdit={startEdit("contact", () =>
            setDraftContact(merchant.contact ?? "")
          )}
          onCancel={closeEdit}
          onSave={() => {
            onMerchantChange({ contact: draftContact.trim() });
            toastSaved("Primary contact");
            closeEdit();
          }}
          display={merchant.contact || <NotProvided />}
          editor={
            <Input
              value={draftContact}
              onChange={(e) => setDraftContact(e.target.value)}
              placeholder="name@example.com"
              autoFocus
            />
          }
        />

        <FieldRow
          label="Corporation Name"
          helper={`${MIN_CORP_NAME}-${MAX_CORP_NAME} characters. Legal entity name (optional).`}
          actionLabel={savedCorpName ? "Edit" : "Add"}
          isEditing={editing === "corpName"}
          onStartEdit={startEdit("corpName", () =>
            setDraftCorpName(savedCorpName)
          )}
          onCancel={closeEdit}
          canSave={
            draftCorpName.trim().length === 0 ||
            (draftCorpName.trim().length >= MIN_CORP_NAME &&
              draftCorpName.trim().length <= MAX_CORP_NAME)
          }
          onSave={() => {
            setSavedCorpName(draftCorpName.trim());
            toastSaved("Corporation Name");
            closeEdit();
          }}
          display={savedCorpName || <NotProvided />}
          editor={
            <Input
              value={draftCorpName}
              onChange={(e) => setDraftCorpName(e.target.value)}
              placeholder="Legal entity name"
              maxLength={MAX_CORP_NAME}
              autoFocus
            />
          }
        />

        <FieldRow
          label="Banner Image"
          helper={FILE_HELPER}
          actionLabel={savedBanner ? "Edit" : "Add"}
          isEditing={editing === "banner"}
          onStartEdit={startEdit("banner", () =>
            setDraftBanner({
              file: null,
              preview: savedBanner,
            })
          )}
          onCancel={closeEdit}
          canSave={draftBanner.file !== null || draftBanner.preview !== null}
          onSave={() => {
            setSavedBanner(draftBanner.preview);
            toastSaved("Banner Image");
            closeEdit();
          }}
          display={
            savedBanner ? (
              <img
                src={savedBanner}
                alt="Banner"
                className="h-16 w-full max-w-xs rounded border border-gray-200 object-cover"
              />
            ) : (
              <NotProvided />
            )
          }
          editor={
            <>
              {draftBanner.preview ? (
                <div className="relative h-24 w-full">
                  <img
                    src={draftBanner.preview}
                    alt="Banner preview"
                    className="h-24 w-full rounded-lg border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraftBanner({ file: null, preview: null })
                    }
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
                  className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <PhotoIcon
                    className="h-6 w-6 text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Upload file
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {FILE_HELPER}
                  </span>
                </button>
              )}
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleBannerPick}
                className="hidden"
              />
            </>
          }
        />

        <FieldRow
          label="About"
          helper="Public-facing description shown to operators reviewing this merchant."
          actionLabel={merchant.merchantDetail ? "Edit" : "Add"}
          isEditing={editing === "about"}
          onStartEdit={startEdit("about", () =>
            setDraftDetail(merchant.merchantDetail ?? "")
          )}
          onCancel={closeEdit}
          onSave={() => {
            onMerchantChange({ merchantDetail: draftDetail });
            toastSaved("About");
            closeEdit();
          }}
          display={
            merchant.merchantDetail ? (
              <p className="max-w-prose text-sm leading-relaxed text-gray-700">
                {merchant.merchantDetail}
              </p>
            ) : (
              <NotProvided />
            )
          }
          editor={
            <div>
              <Textarea
                value={draftDetail}
                onChange={(e) => setDraftDetail(e.target.value)}
                rows={5}
                maxLength={MAX_DETAIL}
                autoFocus
              />
              <p className="mt-1.5 text-right text-sm font-medium text-gray-600">
                {draftDetail.length} / {MAX_DETAIL} characters
              </p>
            </div>
          }
        />
      </dl>
    </>
  );
}

function FieldRow({
  label,
  helper,
  display,
  editor,
  isEditing,
  onStartEdit,
  onCancel,
  onSave,
  canSave = true,
  actionLabel,
}: {
  label: string;
  helper?: string;
  display: React.ReactNode;
  editor: React.ReactNode;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  canSave?: boolean;
  actionLabel: "Edit" | "Add" | "Remove" | "Replace";
}) {
  return (
    <div className="py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <dt className="text-sm font-medium text-gray-900">{label}</dt>
          {!isEditing && (
            <dd className="mt-1 text-sm text-gray-600">{display}</dd>
          )}
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={onStartEdit}
            className="flex-shrink-0 text-sm font-medium text-gray-900 underline underline-offset-2 hover:text-primary"
          >
            {actionLabel}
          </button>
        )}
      </div>
      {isEditing && (
        <div className="mt-3 space-y-3">
          {editor}
          {helper && <p className="text-sm text-gray-500">{helper}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!canSave}
              onClick={onSave}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function NotProvided() {
  return <span className="italic text-gray-500">Not provided</span>;
}

// Subtle group marker between required and optional fields. Mirrors the
// MerchantForm's "Optional Fields" collapsible disclosure but stays flat — no
// click-to-expand, since the inline-edit pattern wants every field one click
// away. The extra top padding signals a structural break without a hard rule.
// Uses h4 to nest correctly under the page-header merchant name (h3); the id
// gets associated with the following <dl> via aria-labelledby so screen
// readers announce "Additional details, list" on entry.
function SectionBreak({ id, label }: { id: string; label: string }) {
  return (
    <div className="pb-2 pt-8">
      <h4
        id={id}
        className="text-sm font-semibold uppercase tracking-wide text-gray-700"
      >
        {label}
      </h4>
    </div>
  );
}
