"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import Card from "@/components/atoms/Card/Card";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Layers,
  PlayIcon,
  PauseIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AdGroup {
  id: string;
  name: string;
  description: string;
  adsCount: number;
  merchantsCount: number;
  programsCount: number;
  status: "active" | "paused" | "draft";
  createdAt: string;
  lastModified: string;
  isNew?: boolean; // Flag for newly created ad groups
}

// Mock data
const mockAdGroups: AdGroup[] = [
  {
    id: "ag1",
    name: "Holiday Promotions 2024",
    description: "Seasonal holiday campaigns across multiple merchants",
    adsCount: 12,
    merchantsCount: 4,
    programsCount: 3,
    status: "active",
    createdAt: "2024-01-15",
    lastModified: "2024-01-20",
  },
  {
    id: "ag2",
    name: "Back to School Campaign",
    description: "Educational and school supply promotions",
    adsCount: 8,
    merchantsCount: 2,
    programsCount: 2,
    status: "paused",
    createdAt: "2024-01-10",
    lastModified: "2024-01-18",
  },
  {
    id: "ag3",
    name: "Electronics Flash Sale",
    description: "Limited time electronics deals",
    adsCount: 15,
    merchantsCount: 3,
    programsCount: 4,
    status: "active",
    createdAt: "2024-01-08",
    lastModified: "2024-01-16",
  },
];

export default function AdGroupsPage() {
  const searchParams = useSearchParams();
  const [adGroups, setAdGroups] = useState<AdGroup[]>(mockAdGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "paused" | "draft"
  >("all");

  // Check if there's a new ad group to highlight
  useEffect(() => {
    const newAdGroupId = searchParams.get("newAdGroup");
    if (newAdGroupId) {
      // Mark the ad group as new for highlighting
      setAdGroups((prev) =>
        prev.map((ag) => (ag.id === newAdGroupId ? { ...ag, isNew: true } : ag))
      );

      // Remove the highlight after 3 seconds
      setTimeout(() => {
        setAdGroups((prev) => prev.map((ag) => ({ ...ag, isNew: false })));
      }, 3000);
    }
  }, [searchParams]);

  const handleStatusToggle = (
    adGroupId: string,
    newStatus: "active" | "paused"
  ) => {
    setAdGroups((prev) =>
      prev.map((ag) =>
        ag.id === adGroupId
          ? {
              ...ag,
              status: newStatus,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : ag
      )
    );
  };

  const filteredAdGroups = adGroups.filter((ag) => {
    const matchesSearch =
      ag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ag.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaign-manager">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaigns">Ad Manager</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Ad Groups</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ad Groups</h1>
            <p className="text-gray-600 mt-1">
              Manage and organize your advertising campaigns into groups
            </p>
          </div>
          <Button
            onClick={() =>
              (window.location.href =
                "/campaign-manager/ads-create?tab=adgroup")
            }
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Ad Group
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search ad groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Ad Groups List */}
        <div className="space-y-4">
          {filteredAdGroups.length === 0 ? (
            <Card className="p-8 text-center">
              <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Ad Groups Found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "No ad groups match your current filters."
                  : "Create your first ad group to get started."}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button
                  onClick={() =>
                    (window.location.href =
                      "/campaign-manager/ads-create?tab=adgroup")
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ad Group
                </Button>
              )}
            </Card>
          ) : (
            filteredAdGroups.map((adGroup) => (
              <Card
                key={adGroup.id}
                className={`p-6 transition-all duration-300 ${
                  adGroup.isNew ? "ring-2 ring-green-500 bg-green-50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {adGroup.name}
                      </h3>
                      <Badge
                        className={`text-xs ${getStatusColor(adGroup.status)}`}
                      >
                        {adGroup.status.charAt(0).toUpperCase() +
                          adGroup.status.slice(1)}
                      </Badge>
                      {adGroup.isNew && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          New
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">{adGroup.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>{adGroup.adsCount} ads</span>
                      <span>{adGroup.merchantsCount} merchants</span>
                      <span>{adGroup.programsCount} programs</span>
                      <span>Modified {adGroup.lastModified}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Toggle */}
                    <div className="flex items-center gap-2">
                      <PauseIcon className="w-4 h-4 text-gray-400" />
                      <Switch
                        checked={adGroup.status === "active"}
                        onCheckedChange={(checked) =>
                          handleStatusToggle(
                            adGroup.id,
                            checked ? "active" : "paused"
                          )
                        }
                        disabled={adGroup.status === "draft"}
                      />
                      <PlayIcon className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
