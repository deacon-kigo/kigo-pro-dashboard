Offer & Merchant Manager - Product Requirements Document (PRD)

Product: Kigo PRO

Modules: Offer Manager V1 & Merchant Manager V1

Audience: Internal Users Only

Version: V1

Date: October 21, 2025

1. Executive Summary

Objective

To build internal-facing modules—Offer Manager and Merchant Manager—within Kigo PRO that fully replace Wufoo forms, MCM and manual creations. These modules will centralize and automate merchant onboarding and offer creation workflows for internal teams.

Scope

Internal-only access for V1
End-to-end merchant onboarding and offer creation
Bulk and manual data entry support
Image/logo management
Reporting

2. Modules Overview

Merchant Manager V1

Purpose

To onboard and manage merchant data, locations, and contracts entirely within Kigo PRO.

Features

Merchant Profile Fields:

- Corporation Name
- DBA Name (auto-check via Google – nice to have w/AI)
- Status: Open (P), Closed (C), Cancelled (U) - TBV with/Koua
- CRM ID (Salesforce replacement)
- Merchant URL (auto-suggested from Google – nice to have w/AI)
- Highlights/About Us (auto-scraped from Google, editable w/AI)
- Classification: Local, National Chain, Regional Chain – (sales territory - TBV w/Koua)
- Sub-classification: Franchisee, All Locations (editable, expandable)

Location Management:

- Manual entry for local merchants
- Bulk upload support for chains (Excel, CSV, Word)
- Auto-formatting of location lists
- Duplicate detection during upload
- Address validation via Google/MapQuest
- Auto-apply Lat/Long coordinates
- Closure detection via automated Google checks
- Closure report generation:
  - Option to close merchant entirely (single-location)
  - Option to remove closed locations (multi-location)

Image/Logo Management:

- Auto-scraping from Google, Facebook, merchant websites
- Ranking-based image selection
- Approval workflow for final image/logo
- AWS link generation for storage

Contract & Communication:

- Welcome email generation with Terms & Conditions
- Email bounce detection and resolution
- All merchant communication handled within Kigo PRO (Salesforce eliminated)

Offer Manager V1

Purpose

To create, manage, and track merchant offers with full lifecycle control.

Features

Offer Fields:

- Short Text (listing view)

- Long Text (detail view)

- Offer Start and End Date (for short-term or non-renewing offers)
- Max Discount (optional)
- Terms/Qualifiers (merchant-supplied)
- Redemption Type: Mobile, Online Print, External URL
- Promo Code / Barcode / QR Code:
  - Support for static and unique codes
  - Notification system when unique codes run low

Search & Classification:

- Offer Type: BOGO, % Off, Free
- Discount Value: Auto-calculated from merchant menu/website - nice to have, not required field
- Cuisine Type (used for search)
- Keywords (used for search)
- First Category / Second Category:
  - Editable list
  - Ability to add new second categories

Offer Lifecycle Controls:

- Publish, Pause, End
- Offer duplication

3. User Roles and Access

Internal Users Only (V1):

- Admins

Access Control:

- No external merchant login or visibility
- Integration with Kigo PRO authentication – SSO via okta

4. Workflow Overview

Merchant Onboarding Workflow:

1. Internal user enters merchant data manually
2. System validates address and URL – nice to have
3. Logo/image pulled and approved – nice to have leveraging internal existing algorithm
4. Merchant profile saved and linked to CRM ID
5. Closure detection and reporting enabled – TBC feasibility

Offer Creation Workflow:

1. Internal user selects merchant
2. Enters offer details (short/long text, terms, dates)
3. Chooses redemption method
4. Uploads promo codes or configures QR/barcode
5. Offer saved and linked to merchant
6. System monitors code inventory - using different labels and filters

7. Success Metrics

- 100% replacement of Wufoo, MCM, and workflows
- 50% reduction in onboarding time per merchant
- 90% accuracy in auto-suggested merchant data
- Internal user satisfaction >85%
- Zero reliance on external tools for merchant communication

6. Limitations (V1)

- No external merchant access
- No AI-powered recommendations yet (planned for future release)

7. Future Considerations (V2+)

- Merchant self-service onboarding
- Campaign lifecycle management
- External partner branding and distribution
- Advanced reporting and analytics
- Full CRM migration and deprecation of Salesforce

8. Additional Questions

Should we display only offers that have MCM as a source?

Which should be the source options listed in kigo pro?
