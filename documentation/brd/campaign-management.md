# Campaign Creation and Management in KigoPro

## Product Requirements Document (PRD)

**Document Owner:** Risa Klein
**Status:** Draft
**Last Updated:** 2025-11-04
**Target Release:** TBD

---

## Summary

KigoPRO to introduce a self-service UI module within the existing admin experience to allow internal teams to manage campaign configurations. This UI is designed as a dedicated campaign management tool, not just a form overlay, and will be structured to support future partner-facing access.

---

## Problems with Current Workflow

Campaigns are currently created using API calls via Postman, resulting in:

- **Slow setup**
- **High error risk**
- **Limited access** (only technical users or users with Postman access can execute)
- **Lack of visibility** (no centralized view or audit trail)

This setup creates significant bottlenecks:

- Product and Account Managers depend on engineers for basic changes
- Errors delay launches and require rework
- Time-to-market is slower as partner programs scale

---

## Goals & Success Metrics

### Goals

1. Enable self-service campaign creation and updates for internal teams
2. Minimize time and effort required to set up a campaign
3. Prevent common errors with built-in validations and UI guardrails
4. Establish a scalable system to support eventual partner access

### Success Metrics

- **Campaign setup time:** <5 minutes
- **Error rate:** <5%
- **UI adoption:** 100% (% of campaigns created via KigoPro UX vs API/Postman)
- **User success:** 90% (user testing and feedback surveys)

---

## Users

This tool is initially intended for internal use by **Product Managers**, **Account Managers**, and **Support team members** who need to create, view, and update campaigns without relying on engineering.

### Permission Levels (V1)

Ideally, V1 would support different permission levels — such as **read-only** vs. **read/write** access. If that's not feasible right away, we can launch with all users having full access and layer in permission controls in a future phase. It's a **nice-to-have** for now.

### Future Partner Access

In later versions, the tool will be extended to **external partner users**, who should only be able to access campaigns tied to their own partner account. So as we set up user permissions and access, it's worth keeping future flexibility in mind.

---

## Functional Requirements

### Campaign List View

- **Paginated table** (25 rows per page)
- **Key fields:** Name, Partner, Program, Type, Dates, Status
- **Filters:** Active status, Partner, Program
- **Sorting:** Start/End/Creation date
- **Search** by campaign name
- **Visual warning** if no products are linked to the created campaign
- **Click row to edit**
- **Export to CSV** (nice to have)

### Create Campaign

- **Partner & Program dropdowns** (Program filtered by Partner, needs to be pre-created)
- **Campaign Name** (unique within program)
  - _Note: This campaign name is currently internal-facing only and does not appear in any end-user views._
- **Type:** Promotional, Targeted, Seasonal
- **Description** (max 256 chars)
  - _Note: This description is currently internal-facing only and does not appear in any end-user views._
- **Start & End Dates** (timezone default: CST)
- **Active status toggle**
- **Auto-activate and auto-deactivate checkboxes**
- **Real-time form validation**
- **Confirmation message on success**

### Edit Campaign

- **All fields editable** except Partner and Program
- **Real-time validation**
- **Track updated_by and updated_at**
  - _The updated_by and updated_at fields should be tracked and visible in the backend. Display in the UI is optional in V1 but should be considered for future audit or change history views._

### Warnings & Safeguards

- **Warn if no products are linked to campaign**
- **Confirm before activating and deactivating a campaign:** When activating or deactivating a campaign, show a confirmation modal with a clear message and Cancel/Confirm buttons. This ensures users don't accidentally enable or disable live campaigns.

---

## User Stories

### Campaign List View

- **As a Product Manager,** I want to view all existing campaigns in one place so that I can track what's active across programs.
- **As an Account Manager,** I want to filter campaigns by partner so that I can focus on just the clients I support.
- **As a user,** I want to search and sort campaigns so that I can find and edit them quickly.

### Create Campaign

- **As a Product Manager,** I want to create a new campaign in under 5 minutes so that I can quickly launch seasonal promotions.
- **As an Account Manager,** I want inline validation in the form so that I can catch mistakes before submission.
- **As a user,** I want a clear confirmation after creating a campaign so that I know it was successful and can share the ID.

### Edit Campaign

- **As an Account Manager,** I want to update campaign dates so that I can extend or shorten promotions based on partner needs.
- **As a Product Manager,** I want to immediately deactivate a campaign so that I can stop a live promotion without delay.
- **As a user,** I want to see a history of changes so that I can audit who changed what and when.

### Campaign Warnings

- **As a user,** I want to see a warning if a campaign has no products linked so that I can take action before going live.
- **As a user,** I want to confirm before deactivating an active campaign so that I don't make changes by accident.

---

## Non-Functional Requirements

### Performance

- **Page load:** < 2s
- **Save operation:** < 1s
- **Filter/search:** < 500ms

### Security & Access Control

- **Authenticated sessions only**
- All internal users will have either **read-only** or **read/write** access in V1, depending on their role
  - _Example situation: support team members could view live campaigns without the ability to create or edit. If that level of permission-ing isn't feasible for V1, we can launch with all internal users having full access and treat role-based controls as a future enhancement._
- **Track created_by / updated_by IDs**
- **Future state:** we need to support external partner users, who should only have access to campaigns tied to their specific partner account — something to keep in mind when designing the access model if we can set ourselves up for success

### Usability

- **Desktop-first, mobile-friendly**
- **WCAG 2.1 AA accessibility**
- **Consistent with KigoPRO design system**

---

## UX Flows

### View, Search & Filter Campaigns

1. Navigate to Campaigns list view
2. Use search bar to find campaigns by name
3. Use filters to narrow by Partner, Program, and Active status
4. Sort by Creation Date, Start Date, or End Date
5. Click a campaign row to view or edit details

### Create Campaign

1. Navigate to Campaigns > Create New
2. Select Partner & Program
3. Enter campaign metadata
4. Set active toggle or auto-activate option
5. Click Create
6. System validates and saves
7. Confirmation shown with link to Edit

### Edit Campaign

1. Navigate to Campaigns > Select Campaign
2. Edit allowed fields
3. Save changes
4. System updates record and logs history

---

## Out of Scope (V1)

- Product associations (warnings only, no config)
- Product creation
- Program campaign targeting rules
- Partner-facing access or permissions
- Campaign analytics
- Campaign duplication
- Advanced filtering or templates

---

## Document Version History

| Date       | Version | Changes                                                    | Author     |
| ---------- | ------- | ---------------------------------------------------------- | ---------- |
| 2025-11-04 | 1.0     | Initial draft                                              | Risa Klein |
| 2025-11-06 | 1.1     | Converted to markdown and added to kigo-pro-dashboard repo | System     |
