```md
# Kigo Pro Glossary of Terms

Welcome to the Kigo Pro Glossary of Terms! This glossary serves as a comprehensive resource for understanding the key terminology associated with the Kigo Pro platform. It is designed to provide clarity on various product-related terms, ensuring that team members can onboard the project effectively. Please note that this is a live document, meaning it will be continuously updated to reflect new terms and concepts as the product evolves. We encourage you to refer back regularly for the most current information.

## Core Terminology

| Term                                   | Description                                                                                                                                                                                       | Notes                                                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Advertising Campaign**               | A specific campaign type that delivers offers to premium ad placements across the Kigo loyalty media network. Only merchants who are advertisers will have advertising campaigns.                 | Merchants who are advertisers can create and manage advertising campaigns through Kigo Pro.                                                  |
| **Airdrop**                            | A campaign type that delivers boosts and/or offers to users' wallets within and across specific publisher programs.                                                                               | Airdrops require a wallet to deliver the offer(s) to.                                                                                        |
| **Analytics & Reporting Module**       | A comprehensive analytics platform delivering real-time insights into campaign performance, revenue tracking, and user engagement.                                                                | The module provides interactive visualizations, a flexible report builder, and Power BI integration.                                         |
| **Business Management Agent**          | An AI-powered assistant that provides automated optimization recommendations and predictive insights across the platform.                                                                         | The module monitors campaign performance, suggests targeting improvements, automates routine tasks, and identifies opportunities for growth. |
| **Campaign & Offer Management Module** | A unified workspace for creating and managing both free and promoted offers across the Kigo network.                                                                                              | Enables users to design campaigns, configure targeting, manage distribution, and optimize performance.                                       |
| **Campaign Manager**                   | User role responsible for campaign creation, performance monitoring, and offer management.                                                                                                        | Can create and manage campaigns but has limited administrative permissions.                                                                  |
| **Catalog**                            | The collection of available offers that can be added to publisher programs.                                                                                                                       | Merchants/brands create offers that get added to catalogs.                                                                                   |
| **Dashboard**                          | The primary landing page after authentication, providing users with immediate access to key features and real-time performance metrics.                                                           | Includes performance overview, quick actions, and role-specific views.                                                                       |
| **Enterprise Account**                 | Top-level organizational account in Kigo Pro that can have multiple programs, brands, and user accounts beneath it.                                                                               | Example: John Deere as an enterprise with dealer partners                                                                                    |
| **External Users**                     | Partners, merchants, advertisers, and other non-Kigo employees who access the platform.                                                                                                           | Access is provided through social sign-in or email/password combinations with mobile verification.                                           |
| **Internal Users**                     | Kigo employees who access the platform through Okta SSO.                                                                                                                                          | Includes roles such as Super Admin, Merchant Admin, Campaign Manager, and Viewer.                                                            |
| **Item-level Offer**                   | Kigo Pro offer type that applies to specific items (e.g., "$2.00 off New Chapter Men's Multivitamin").                                                                                            | Contrasts with transaction-level offers                                                                                                      |
| **Kigo Loyalty Media Network**         | Kigo's network of 130M+ engaged members across various loyalty programs.                                                                                                                          | Offers can be promoted across this network through campaigns.                                                                                |
| **LOCAL+**                             | A specific distribution channel within the Kigo network where premium ad placements are available.                                                                                                | Used for Promoted Offers campaigns                                                                                                           |
| **Merchant**                           | The entity responsible for creating offers and potentially running campaigns to promote these offers.                                                                                             | Some merchants will also be advertisers, while others will not.                                                                              |
| **Merchant Admin**                     | User role with full access to business profile, location management, offer creation/editing, campaign creation and management, analytics and reporting access, and user management for locations. | Can have only one Agency.                                                                                                                    |
| **MOM Database**                       | The merchant and offer management database that serves as the repository of merchants and offer objects.                                                                                          | Campaign managers select offers from this database                                                                                           |
| **MyPerks**                            | Example implementation of promo code token type in Kigo Pro.                                                                                                                                      | Used in specific client implementations                                                                                                      |
| **Offer**                              | A discount, deal, or promotion created by a merchant that can be delivered to users.                                                                                                              | Different types of offers include promo codes, show-and-save offers, vouchers, etc.                                                          |
| **Partner**                            | Top tier of account hierarchy that manages multiple programs, controls branding and settings, administers partner-wide users, and views aggregated analytics.                                     | Examples include Augeo, ampliFI, etc.                                                                                                        |
| **Partner-Agency Admin**               | User role with the ability to manage multiple Merchant Admins and access Merchant Admin features.                                                                                                 | Has broader permissions than individual Merchant Admins.                                                                                     |
| **Power BI Integration**               | Embedded analytics dashboards that provide real-time performance visibility.                                                                                                                      | Updated multiple times per day with custom visualizations potentially being developed internally in the future.                              |
| **Premium Ad Placement**               | Specific high-visibility locations across TOP, Local+, and other platforms where promoted offers are displayed.                                                                                   | Part of the Promoted Offers campaign type.                                                                                                   |
| **Program**                            | Managed under partner accounts, controls program-specific settings, manages program users, views program analytics, and creates/manages campaigns.                                                | Examples include LexisNexis or any of Augeo's clients. A partner can have multiple programs.                                                 |
| **Program Administrator**              | Kigo Pro user role that manages program access, rules, campaigns, tokens, budgets, and reporting.                                                                                                 | Higher level of access than Campaign Manager                                                                                                 |
| **Program Campaign**                   | Targeted initiatives designed for clients, such as the oil promotion campaign for John Deere.                                                                                                     | Linked to publishers in the Partner > Programs > Campaigns hierarchy.                                                                        |
| **Program Partner Administrator**      | Kigo Pro role for managing partner program access for an invited participant of the business account.                                                                                             | Example: Independent John Deere dealer administrators                                                                                        |
| **Promoted Offers**                    | A specific campaign type that delivers offers to specific premium ad placements across TOP, Local+, etc.                                                                                          | One of the primary campaign types in Kigo Pro.                                                                                               |
| **Publisher**                          | Entity that distributes offers to users, typically through a loyalty program.                                                                                                                     | In the Publisher world, the hierarchy is Partners > Programs > Campaigns.                                                                    |
| **Sponsored Offers**                   | Kigo Pro advertising feature allowing merchants to promote offers to targeted customers.                                                                                                          | Similar to Promoted Offers                                                                                                                   |
| **Super Admin**                        | User role with full platform access, system configuration capabilities, global user management, and full control over features.                                                                   | Assigned through Okta permissions for internal users.                                                                                        |
| **Token Types in Kigo Pro**            | The various digital asset types supported in the platform, including: Transaction-level Offers, Item-level Offers, Gift Cards, Offer Bundles (Boosts), Achievements, Badges, Promotion Codes      | Campaign managers can select and organize different token types                                                                              |
| **TOP**                                | "The Offers Platform" – One of Kigo's distribution channels for offers.                                                                                                                           | Premium ad placements include positions in TOP.                                                                                              |
| **Transaction-level Offer**            | Kigo Pro offer type that applies to entire transactions (e.g., "20% off purchase of $20+").                                                                                                       | Contrasts with item-level offers                                                                                                             |
| **Viewer**                             | User role with read-only analytics access.                                                                                                                                                        | Limited to viewing data without making changes.                                                                                              |

## Product Hierarchy Summary

### User Types

#### Internal Users

- Super Admin
- Merchant Admin
- Campaign Manager
- Viewer

#### External Users

- Partner-Agency Admin
- Merchant Admin
- Advertiser Admin
- Campaign Manager

### Core Modules

- **Campaign & Offer Management**
  - Promoted Offers
  - Free Offers
- **Analytics & Reporting**
- **Business Management Agent (AI)**
- **Account Settings**
- **Help Center**

### Business Hierarchy in the Publisher Side

- **Partners**
  - Programs
    - Campaigns

### Business Hierarchy in the Advertiser Side

- **Merchants/Brands**
  - Offers
    - Advertisers
      - Advertising Campaigns
  - Catalogs

### Advertisement Campaign Types

- Promoted Offers
- Airdrops

## Related Documents

- Kigo Pro Requirements Overview.docx
- Kigo PRO Suite Brief - 20250120.docx
- Wallet Product Glossary.docx
```
