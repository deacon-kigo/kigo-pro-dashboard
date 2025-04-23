# Product Filter Management

## Overview

The Product Filter Management feature enables administrators (and publishers in the future) to create, view, and manage product filters (also known as "editions"). These filters allow offers to be displayed based on specific criteria, creating specialized collections of offers (for example, a "Pizza Edition" that includes all pizza-related offers).

## Business Context

Editions are filters for offers that group related content together. While traditionally an "edition" referred to a book for a specific city in Entertainment's legacy business model, in the digital context, it refers to a grouping of offers that meet specific criteria.

Currently, the process for creating and managing product filters is manual, requiring direct database manipulation and multiple handoffs between teams. This feature aims to streamline this process through a dedicated UI.

## Current Process (Legacy)

The current process involves multiple technical steps:

1. **Setup**:

   - Retrieve AWS credentials and access tokens
   - Manually start the C# microservice locally
   - Create edition records directly in the MOM Postgres database

2. **Data Handling**:

   - Provide a spreadsheet for edition_criteria
   - Convert spreadsheet data into a request body
   - Update records in the database
   - Link the edition_id to program_campaigns

3. **Handoff**:

   - Test the implementation
   - Hand off to production team for replication in the production environment

4. **Updates**:
   - Follow similar steps for criteria updates

## User Journey

1. Admin navigates to the Product Filter Management section
2. Admin creates a new product filter by filling out required information
3. Admin adds product filter criteria for the newly created filter
4. Admin saves the product filter and receives confirmation
5. Admin can view and manage the list of product filters

## UI Requirements

### Product Filter Creation Page

The page should include the following required fields:

- **edition**: Input field for product filter name
- **queryview**: Input field for query view name
- **description**: Text area for description
- **created_by**: UUID (auto-populated from user)
- **created_date**: Auto-populated with current date
- **expired_date**: Expiry date selector
- Save button

**Important Notes:**

- No fields should have maximum length restrictions
- The system currently does not support saving draft product filters (either with or without criteria)
- If draft functionality is needed, it should be implemented using client-side storage (e.g., localStorage)

### Product Filter Criteria Section

After creating a product filter, the admin should be able to add criteria:

#### Mandatory Criteria

- MerchantKeyword
- MerchantName
- OfferCommodity
- OfferKeyword

#### Optional Criteria

- Client
- MerchantId
- OfferCategory
- OfferExpiry
- OfferId
- OfferRedemptionControlLimit
- OfferRedemptionType
- OfferType

### Product Filter Management List

A list view showing all product filters with:

- Filter name
- Creation date
- Expiry date
- Actions (edit, view details)

## Technical Requirements

### Data Model

The feature interacts with the following tables in the MOM Postgres Database:

- `editions.edition`
- `editions.edition_criteria`
- `editions.editions_view` (materialized view)

### API Requirements

New endpoints need to be implemented in the kigo-core-server:

- GET `/api/product-filters` - List all product filters
- POST `/api/product-filters` - Create a new product filter
- GET `/api/product-filters/{id}` - Get a single product filter
- PUT `/api/product-filters/{id}` - Update a product filter
- GET `/api/product-filters/{id}/criteria` - Get criteria for a product filter
- POST `/api/product-filters/{id}/criteria` - Add criteria to a product filter
- PUT `/api/product-filters/{id}/criteria/{criteriaId}` - Update criteria
- DELETE `/api/product-filters/{id}/criteria/{criteriaId}` - Remove criteria

## Acceptance Criteria

1. Admins can access a dedicated UI page for product filter management
2. Admins can create new product filters with all required information
3. Admins can add and configure product filter criteria (both mandatory and optional)
4. The system validates that all required fields are completed before saving
5. Users receive confirmation messages after successful operations
6. Users can view a list of all product filters
7. Error messages are displayed clearly when issues occur
8. The UI is accessible and responsive

## Implementation Notes

- Product filters are not publisher-specific by default, but publishers can create exclusive filters
- Input fields should not have maximum length restrictions
- The system does not currently support saving draft product filters
- All product filter creation must include all required fields in a single operation
- Criteria must be added after the product filter is created
- The UI must follow established design patterns and accessibility standards
- Consider implementing batch operations for criteria to improve usability

## Future Considerations

- Role-based access control for publishers to manage their own product filters
- Analytics on product filter performance and usage
- Bulk import/export functionality for product filters
- Preview functionality to see which offers would be included in a filter
- Draft saving functionality for product filters
