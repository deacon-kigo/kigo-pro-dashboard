"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import PageHeader from "@/components/molecules/PageHeader/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import { MemberCatalogTable } from "./components/MemberCatalogTable";
import MemberDetailView from "./MemberDetailView";
import { MemberWithPoints, PointsAdjustmentResponse } from "./types";
import { sampleMembers } from "./data";

/**
 * MemberCRMView component - Main orchestrator for Members feature
 * @classification template
 * @description Top-level component that manages member account state and layout
 */
export default function MemberCRMView() {
  const searchParams = useSearchParams();
  const [members] = useState<MemberWithPoints[]>(sampleMembers);
  const [selectedMember, setSelectedMember] = useState<MemberWithPoints | null>(
    null
  );

  const searchQuery = searchParams.get("searchQuery") ?? "";
  const statusFilter = searchParams.get("statusFilter") ?? "";

  // Filter and sort members - prioritize those needing review
  const filteredMembers = useMemo(() => {
    const filtered = members.filter((member) => {
      const matchesSearch =
        !searchQuery ||
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.accountId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || member.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort by review required status - those needing review come first
    return filtered.sort((a, b) => {
      const aHasReview = a.transactions.some(
        (txn) =>
          txn.receiptId && txn.metadata?.verificationStatus === "manual_review"
      );
      const bHasReview = b.transactions.some(
        (txn) =>
          txn.receiptId && txn.metadata?.verificationStatus === "manual_review"
      );

      // Review Required (true) comes before No Action Needed (false)
      if (aHasReview && !bHasReview) return -1;
      if (!aHasReview && bHasReview) return 1;
      return 0;
    });
  }, [members, searchQuery, statusFilter]);

  const handleSelectMember = useCallback((member: MemberWithPoints) => {
    setSelectedMember(member);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedMember(null);
  }, []);

  const handleAdjustmentSuccess = useCallback(
    (response: PointsAdjustmentResponse) => {
      // In production, this would update the member's balance and add transaction to history
      console.log("Adjustment successful:", response);

      // Show success notification (could use a toast library)
      alert(
        `Successfully adjusted points!\n\nNew Balance: ${response.newBalancePoints} points`
      );

      // Refresh member data (in production, refetch from API)
      if (selectedMember) {
        const updatedMember = { ...selectedMember };
        if (updatedMember.pointsBalances[0]) {
          updatedMember.pointsBalances[0].currentPoints =
            response.newBalancePoints;
          updatedMember.pointsBalances[0].currentUsdCents =
            response.newBalanceUsdCents;
        }
        setSelectedMember(updatedMember);
      }
    },
    [selectedMember]
  );

  const handleRowClick = useCallback((member: MemberWithPoints) => {
    setSelectedMember(member);
  }, []);

  // Build breadcrumbs based on selected member
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {selectedMember ? (
            <BreadcrumbLink href="/dashboard/members">Members</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Members</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {selectedMember && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedMember.fullName}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <div className="space-y-6">
        {!selectedMember ? (
          <>
            {/* Page Header */}
            <PageHeader
              emoji="👥"
              title="Members"
              description="Manage member accounts, view points balances, and adjust points"
              variant="aurora"
            />

            {/* Search Bar */}
            <SearchBar
              id="member-search"
              placeholder="Search members by name, email, or account ID..."
              debounceMs={300}
              minLength={2}
            />

            {/* Members Table */}
            <MemberCatalogTable
              members={filteredMembers}
              searchQuery={searchQuery}
              onViewMember={handleSelectMember}
              onRowClick={handleRowClick}
            />
          </>
        ) : (
          <MemberDetailView
            member={selectedMember}
            onBack={handleBackToList}
            onAdjustmentSuccess={handleAdjustmentSuccess}
          />
        )}
      </div>
    </AppLayout>
  );
}
