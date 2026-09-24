import { PageHeader } from "@/components/prod/page-header";
import { SearchBar } from "@/components/prod/search-bar";

/*
 * First real /pro screen. Header copy and search placeholder are copied from
 * SOURCE src/app/(protected)/support-manager/{page.tsx,constants.ts}. Results
 * need the production API, so the search is presentational here.
 */
export default function SupportManager() {
  return (
    <>
      <PageHeader
        description="Look up customer accounts by email to view account details, membership, and program information."
        emoji="🛟"
        title="Support Manager"
        variant="aurora"
      />

      <div className="space-y-6">
        <SearchBar
          id="account-search"
          placeholder="Search by email (e.g., user@example.com)"
        />
      </div>
    </>
  );
}
