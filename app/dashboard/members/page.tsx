import MemberCRMView from "@/components/features/member-crm/MemberCRMView";

export const metadata = {
  title: "Members | Kigo PRO",
  description:
    "Manage member accounts, view points balances, and adjust points",
};

/**
 * Members page - Main entry point for member account management
 * Route: /dashboard/members
 */
export default function MembersPage() {
  return <MemberCRMView />;
}
