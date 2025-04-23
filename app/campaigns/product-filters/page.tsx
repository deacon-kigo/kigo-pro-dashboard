"use client";

import React from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import { Button } from "@/components/atoms/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import Card from "@/components/atoms/Card/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function ProductFiltersPage() {
  const router = useRouter();

  // Navigate to the new product filter page
  const handleCreateFilter = () => {
    router.push("/campaigns/product-filters/new");
  };

  // Breadcrumb showing the navigation path
  const productFilterBreadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Product Filters</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  // Mock data for the table
  const mockFilters = [
    {
      id: "1",
      name: "Pizza Edition",
      queryView: "pizza_view",
      createdBy: "admin",
      createdDate: "2023-10-15",
      expiryDate: "2024-10-15",
      status: "Active",
    },
    {
      id: "2",
      name: "Coffee & Treats",
      queryView: "coffee_treats_view",
      createdBy: "admin",
      createdDate: "2023-11-05",
      expiryDate: "2024-11-05",
      status: "Active",
    },
    {
      id: "3",
      name: "Health & Wellness",
      queryView: "health_wellness_view",
      createdBy: "admin",
      createdDate: "2023-09-20",
      expiryDate: "2024-09-20",
      status: "Active",
    },
    {
      id: "4",
      name: "T-Mobile Tuesdays",
      queryView: "tmobile_tuesdays_view",
      createdBy: "admin",
      createdDate: "2023-08-01",
      expiryDate: "2024-08-01",
      status: "Active",
    },
  ];

  return (
    <AppLayout customBreadcrumb={productFilterBreadcrumb}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Product Filters
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage product filters to control offer display in the TOP
              platform.
            </p>
          </div>
          <Button
            onClick={handleCreateFilter}
            className="flex items-center gap-1"
          >
            <PlusIcon className="h-4 w-4" />
            Create Filter
          </Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Filters</TabsTrigger>
            <TabsTrigger value="expired">Expired Filters</TabsTrigger>
            <TabsTrigger value="all">All Filters</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <Card>
              <div className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filter Name</TableHead>
                      <TableHead>Query View</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFilters.map((filter) => (
                      <TableRow key={filter.id}>
                        <TableCell className="font-medium">
                          {filter.name}
                        </TableCell>
                        <TableCell>{filter.queryView}</TableCell>
                        <TableCell>{filter.createdBy}</TableCell>
                        <TableCell>{filter.createdDate}</TableCell>
                        <TableCell>{filter.expiryDate}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {filter.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/campaigns/product-filters/${filter.id}`
                              )
                            }
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="expired" className="mt-4">
            <Card>
              <div className="p-6 flex justify-center items-center text-center">
                <div>
                  <p className="text-muted-foreground">
                    No expired product filters
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <Card>
              <div className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filter Name</TableHead>
                      <TableHead>Query View</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFilters.map((filter) => (
                      <TableRow key={filter.id}>
                        <TableCell className="font-medium">
                          {filter.name}
                        </TableCell>
                        <TableCell>{filter.queryView}</TableCell>
                        <TableCell>{filter.createdBy}</TableCell>
                        <TableCell>{filter.createdDate}</TableCell>
                        <TableCell>{filter.expiryDate}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {filter.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/campaigns/product-filters/${filter.id}`
                              )
                            }
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
