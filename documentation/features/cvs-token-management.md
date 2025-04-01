# CVS Token Management Feature

## Summary

A dedicated customer support function within Kigo PRO that allows CVS Extra Care support agents to manage offer tokens for specific customer accounts through a secure, comprehensive interface, with an integrated ticketing system for issue tracking and resolution. Support is accessible through role-based permissions with Okta SSO integration.

## Description

This feature enables CVS customer support agents to access and manage users' offer tokens directly from within a co-branded Kigo PRO interface, either through SSO from partner sites or native access. The function provides comprehensive account lookup capabilities, detailed token information, and support actions to address customer inquiries and issues related to offer tokens, with a robust ticketing system to track and resolve customer issues.

## Core Capabilities

### Access & Authentication

- Okta Single Sign-On (SSO) integration from CVS support portals to Kigo PRO 
- Role-based access control for support functions
- Personalized welcome experience showing rep name/ID upon login
- Audit logging of all support actions
- Persistent session management with search state preservation

### Interface Branding

- Co-branded interface with CVS Extra Care elements for visual consistency
- Clear indication of both Kigo and CVS Extra Care environments
- Support for future full white-labeling if required
- Responsive design with optimized UI elements

### Navigation & User Experience

- Intuitive breadcrumb navigation for customer detail pages
- Persistent search results when navigating between views
- Static, accessible action buttons consistently positioned in headers
- Clear, descriptive button labels for improved usability
- Multiple paths to common actions for efficient workflows

### Account Lookup

Multiple search parameters:
- Email address
- First name + last name combination
- Mobile phone number
- Partner-specific unique identifier (user_id)
- Search results validation and verification
- Clear error handling for invalid or not-found searches
- **Search state preservation** when navigating between views

### Account Information Display

Basic account details:
- First name
- Last name
- Email address
- Mobile number
- **Complete Address** (street, city, state, zip)
- Account creation date
- Privacy considerations and data masking options

### Token Management

Comprehensive token inventory display (active and historical):
- Token Name
- Token Description
- Token Image
- Token State (Active, Shared, Used, Expired)
- Token Claim Date (date added to wallet)
- Token Use Date (date of redemption, if applicable)
- Token Share Date (date of transfer, if applicable)
- Token Expiration Date
- Merchant Name (if applicable)
- Merchant Location (if applicable)
- **External URL Button** to view token in Extra Care system

### Advanced Filtering System

Robust filtering capabilities for token management:
- Filter by token status (Active, Expired, Redeemed, etc.)
- Filter by date ranges (creation, expiration, redemption)
- Filter by token type (Promotion, Coupon, Reward, etc.)
- Filter by value or discount amount
- Filter by merchant or location
- Filter by token source or campaign
- Multi-filter support for complex queries
- Saved filter presets for common scenarios
- Sort options (alphabetical, newest/oldest, value)

### Support Actions

- **Token Search**: Find specific tokens in the system to add to a user's account
- **Add Token**: Add selected token to user's account
- **Remove Token**: Remove token from user's account
- **Reissue Token**: Create a new instance of an expired or used token
- **View in Extra Care**: Direct link to view token in native Extra Care environment
- Action confirmation and result notification
- Case notes/comments for tracking support actions

### Integrated Ticketing System

Comprehensive ticket management:
- Create, view, update, and resolve support tickets
- Link tickets to specific customers and/or tokens
- Assign priority levels (Low, Medium, High)
- Track ticket status (Open, In Progress, Escalated, Resolved, Closed)
- Support tiered escalation (Tier 1 CVS to Tier 2 Kigo PRO)
- Add support notes and resolution summaries
- Filter and search tickets by various criteria
- Multiple access points for ticket creation throughout the interface

## User Flow

### Access Flow:

1. CVS support agent accesses their support portal
2. Agent navigates to customer support section requiring token management
3. Agent clicks SSO link to launch Okta authentication
4. Okta authenticates agent with appropriate permissions
5. Support interface loads with personalized greeting showing rep name/ID
6. Co-branded dashboard appears with account lookup form

### Account Lookup Flow:

1. Agent enters search criteria (email, name, phone, or ID)
2. System processes search request
3. Results display with account verification information
4. Agent confirms correct account
5. System displays comprehensive account information including complete address and creation date
6. System displays token information
7. **When returning to search, previous search results are preserved**

### Token Inventory Review:

1. Agent views all tokens associated with the account
2. Agent uses advanced filtering options to narrow token list as needed
3. Agent can apply multiple filters simultaneously (e.g., Active status + specific date range)
4. Agent sorts tokens based on relevant criteria
5. Agent selects specific token for detailed view
6. System displays comprehensive token details
7. Agent can click "View in Extra Care" to see token in native system if needed

### Support Action Flow:

#### Token Search & Add:

1. Agent searches for a specific token in system
2. Agent selects token from search results
3. Agent confirms addition to customer account
4. System adds token and displays confirmation
5. Token appears in customer's wallet

#### Token Removal:

1. Agent selects token to remove
2. Agent confirms removal action
3. System processes removal
4. System displays confirmation
5. Token no longer appears in customer's wallet

#### Token Reissue:

1. Agent selects expired/used token to reissue
2. Agent confirms reissue action
3. System generates new token instance
4. System adds new token to customer's wallet
5. System displays confirmation

### Ticket Management Flow:

#### Creating a Ticket:

1. Agent can create a ticket from multiple points in the interface:
   - From the ticket list header via the "New Ticket" button
   - From the ticket detail panel header when viewing another ticket
   - From a token's detail view when an issue is identified
2. Agent fills out the ticket form with:
   - Subject and description
   - Priority level
   - Associated customer (if not already selected)
   - Associated token (if applicable)
3. Agent submits the ticket
4. System assigns a ticket ID and sets initial status to "Open"

#### Managing Tickets:

1. Agent can view tickets filtered by status, tier, or search criteria
2. Agent selects a ticket to view details
3. Agent can add notes to document progress
4. Agent can take several actions:
   - Add token actions directly from the ticket
   - Escalate the ticket to Tier 2 support with reason
   - Close the ticket with resolution summary
5. System tracks all ticket activities and maintains status

### Case Resolution:

1. Agent adds notes about actions taken
2. Agent confirms case resolution
3. System logs all actions for audit purposes
4. Agent returns to CVS support portal or continues to next case

## Example Use Case: Customer Claims Missing Extra Care Offer

### User Flow:

#### Initiation:

1. Customer contacts CVS support claiming they never received an Extra Care offer they were entitled to
2. Support agent accesses CVS support portal
3. Agent clicks SSO link to launch Okta authentication
4. Agent is authenticated and greeted by name in the co-branded interface
5. **Agent creates a new ticket by clicking the "New Ticket" button**

#### Account Identification:

1. Agent enters customer's email address
2. System displays account details for verification, including complete address and when the account was created
3. Agent confirms correct customer account
4. System displays all tokens associated with the account
5. **If agent navigates away and returns, the search results are preserved**

#### Issue Investigation:

1. Agent applies filters to view only Extra Care offers of the specific type
2. Agent can further filter by date range when the offer should have been received
3. Agent confirms the specific offer is not in customer's wallet or history
4. Agent uses Token Search to locate the specific Extra Care offer

#### Resolution:

1. Agent selects "Add Token to Account" for the Extra Care offer
2. Agent enters reason for manual addition in notes field
3. Agent confirms action
4. System adds token to customer's wallet
5. System generates notification to customer
6. System logs action for audit purposes
7. **Agent updates the ticket with action taken**
8. **Agent closes the ticket with resolution summary**

#### Follow-up:

1. Agent receives confirmation of successful token addition
2. Agent adds notes to customer case
3. Agent can click "View in Extra Care" to verify token appears correctly in the native system
4. Agent informs customer that offer is now available in their wallet

## Technical Considerations

- Okta SSO integration standards and security requirements
- Co-branding implementation with CVS Extra Care visual elements
- Role-based permission management
- Audit logging requirements
- Token database integration
- Customer notification system integration
- Performance considerations for token searches and complex filtering
- External URL generation and security for Extra Care system integration
- Security measures for sensitive customer data including address information
- Data masking and privacy requirements
- Responsive design for various agent workstations
- Support for future full white-labeling if required
- **State persistence between view transitions**
- **Integrated ticketing system data management**
- **Optimized UI layout for concurrent ticket and token management**

## Acceptance Criteria

- Support agents can securely access the function through Okta SSO from CVS sites
- Interface displays personalized greeting with agent name/ID upon login
- Co-branded interface incorporates appropriate CVS Extra Care visual elements
- Agents can successfully lookup customer accounts using any of the specified identifiers
- Account information displays complete, accurate, and properly formatted, including full address and creation date
- Token inventory displays all relevant tokens with correct status information
- Advanced filtering system allows agents to quickly locate specific tokens
- External URL linking to Extra Care system functions correctly
- All supported actions (search, add, remove, reissue) function correctly
- All actions are properly logged for audit purposes
- Appropriate notifications are generated for token changes
- Interface is intuitive and efficient for support workflows
- Error handling provides clear guidance for resolution
- Performance meets standards (account lookup <2 seconds, token actions <5 seconds)
- All designs meet accessibility standards (WCAG 2.1 AA)
- **Search state is preserved when navigating between views**
- **Ticketing system allows creation, tracking, and resolution of support issues**
- **Multiple access points for ticket creation provide efficient workflows**
- **Ticket status, notes, and resolution are properly tracked and displayed**
- **Buttons and UI elements are consistently placed and clearly labeled**