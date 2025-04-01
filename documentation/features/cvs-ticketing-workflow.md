# CVS Token Management System Integration with External Ticketing

## Overview

This document outlines the integration between CVS's primary ticketing system (ServiceNow) and Kigo Pro's token management capabilities. Rather than implementing a full ticketing system within Kigo Pro, this workflow focuses on lightweight integration with existing ticketing platforms, allowing agents to perform specialized token management actions and synchronize the results back to the primary ticketing system.

## User Personas

- **CVS Support Agent**: Primary user who works primarily in ServiceNow but requires Kigo Pro for token management
- **Kigo Pro Administrator**: Manages the integration between systems and ensures proper data flow

## System Integration Context

- **ServiceNow**: Primary ticketing system used by CVS for customer support
- **Kigo Pro**: Specialized token management platform with lightweight ticketing integration
- **Integration Layer**: APIs and SSO mechanisms connecting the two systems

## Detailed User Flow Diagram

```mermaid
flowchart TD
    %% System Boundaries
    subgraph ServiceNow["ServiceNow (External Ticketing System)"]
        %% Initial ticket handling
        Start([CVS Agent receives customer inquiry]) --> CheckServiceNow{Check ServiceNow\nfor existing ticket}
        CheckServiceNow -->|No ticket exists| CreateServiceNowTicket[Create new ticket in ServiceNow]
        CheckServiceNow -->|Ticket exists| ReviewServiceNowTicket[Review ticket details in ServiceNow]
        
        %% Initial triage in ServiceNow
        CreateServiceNowTicket --> AssessIssue{Assess issue complexity}
        ReviewServiceNowTicket --> AssessIssue
        
        %% Decision point - Can resolve in ServiceNow?
        AssessIssue -->|Basic issue| AttemptServiceNowResolution[Attempt resolution using ServiceNow tools]
        AssessIssue -->|Token-related issue| NeedTokenAccess{Needs token\nmanagement?}
        
        %% Basic resolution flow in ServiceNow
        AttemptServiceNowResolution --> CanResolveInServiceNow{Can resolve\nin ServiceNow?}
        CanResolveInServiceNow -->|Yes| ResolveServiceNow[Resolve ticket in ServiceNow]
        CanResolveInServiceNow -->|No| NeedTokenAccess
        ResolveServiceNow --> UpdateServiceNowTicket[Update ticket with resolution details]
        UpdateServiceNowTicket --> CloseServiceNowTicket[Close ticket in ServiceNow]
        CloseServiceNowTicket --> End([End of workflow])
        
        %% Return from Kigo Pro and complete resolution in ServiceNow
        ReceiveKigoUpdate[Receive token action updates from Kigo Pro] --> UpdateServiceNowWithKigoInfo
        UpdateServiceNowWithKigoInfo[Update ServiceNow ticket with token actions] --> NotifyCustomer[Notify customer of resolution]
        NotifyCustomer --> CloseServiceNowTokenTicket[Close ServiceNow ticket]
        CloseServiceNowTokenTicket --> End
    end
    
    %% Integration Layer
    subgraph Integration["Integration Layer"]
        NeedTokenAccess -->|Yes| LaunchKigoPro[Launch Kigo Pro via SSO with ticket context]
        SendTicketData[Send ticket data to Kigo Pro] --> KigoProDashboard
        
        ReturnToServiceNow[Return to ServiceNow with action summary] --> ReceiveKigoUpdate
    end
    
    %% Kigo Pro System
    subgraph KigoPro["Kigo Pro (Token Management System)"]
        %% Kigo Pro authentication and context
        LaunchKigoPro --> OktaSSO[Authenticate via Okta SSO]
        OktaSSO --> KigoProDashboard[View Kigo Pro dashboard with ticket context banner]
        SendTicketData
        
        %% Customer lookup in Kigo Pro
        KigoProDashboard --> SearchCustomer[Search for customer in Kigo Pro]
        SearchCustomer --> CustomerFound{Customer found?}
        CustomerFound -->|Yes| ReviewCustomerDetails[Review customer details and tokens]
        CustomerFound -->|No| CreateCustomerRecord[Create customer record]
        CreateCustomerRecord --> ReviewCustomerDetails
        
        %% Token management actions
        ReviewCustomerDetails --> IdentifyTokenIssue{Identify specific\ntoken issue}
        
        IdentifyTokenIssue -->|Missing token| AddToken[Add token to customer account]
        IdentifyTokenIssue -->|Invalid token| RemoveToken[Remove problematic token]
        IdentifyTokenIssue -->|Expired token| ReissueToken[Reissue token with new date]
        IdentifyTokenIssue -->|Token not honored| DisputeToken[Mark token as disputed]
        IdentifyTokenIssue -->|Other issue| OtherTokenAction[Perform other token action]
        
        AddToken --> DocumentAction[Document action in activity log]
        RemoveToken --> DocumentAction
        ReissueToken --> DocumentAction
        DisputeToken --> DocumentAction
        OtherTokenAction --> DocumentAction
        
        %% Resolution in Kigo Pro
        DocumentAction --> CompleteTokenAction[Complete token management task]
        CompleteTokenAction --> SyncToServiceNow[Prepare action summary for ServiceNow]
        SyncToServiceNow --> ReturnToServiceNow
    end
    
    %% External escalation from ServiceNow
    NeedTokenAccess -->|No| EscalateOther[Escalate via standard ServiceNow process]
    EscalateOther --> End
    
    %% Styling for clarity
    classDef servicenow fill:#6666FF,color:white,stroke:#333,stroke-width:2px;
    classDef kigopro fill:#FF6666,color:white,stroke:#333,stroke-width:2px;
    classDef integration fill:#CCCCFF,color:black,stroke:#333,stroke-width:2px;
    classDef decision fill:#FFCC00,color:black,stroke:#333,stroke-width:1px;
    classDef endpoint fill:#66CC66,color:white,stroke:#333,stroke-width:1px;
    
    class Start,End endpoint;
    class CheckServiceNow,CreateServiceNowTicket,ReviewServiceNowTicket,AttemptServiceNowResolution,ResolveServiceNow,UpdateServiceNowTicket,CloseServiceNowTicket,EscalateOther,ReceiveKigoUpdate,UpdateServiceNowWithKigoInfo,NotifyCustomer,CloseServiceNowTokenTicket servicenow;
    class LaunchKigoPro,SendTicketData,ReturnToServiceNow integration;
    class OktaSSO,KigoProDashboard,SearchCustomer,ReviewCustomerDetails,CreateCustomerRecord,AddToken,RemoveToken,ReissueToken,DisputeToken,OtherTokenAction,DocumentAction,CompleteTokenAction,SyncToServiceNow kigopro;
    class AssessIssue,CanResolveInServiceNow,NeedTokenAccess,CustomerFound,IdentifyTokenIssue decision;
    class ServiceNow servicenow;
    class Integration integration;
    class KigoPro kigopro;
```

## System Boundaries and Integration Points

### ServiceNow (Primary Ticketing System)
- Maintains complete ticket lifecycle management
- Stores all customer communications
- Tracks ticket status, priority, and history
- Serves as the system of record for support cases

### Kigo Pro (Token Management System)
- Provides specialized token management capabilities
- Maintains minimal ticket context (not a full ticketing system)
- Focuses on token actions rather than ticket workflow management
- Logs activities performed on tokens

### Integration Layer
- Single Sign-On (SSO) via Okta allows seamless transition between systems
- Ticket context passed to Kigo Pro through URL parameters or API calls
- Token actions synchronized back to ServiceNow through API endpoints
- Maintains reference IDs between systems for traceability

## Detailed Workflow Description

### 1. Ticket Management in ServiceNow

**Initial Ticket Handling:**
- CVS agent receives customer inquiry via phone, email, or chat
- Agent creates or updates a ticket in ServiceNow with customer information
- Basic customer identification and issue categorization occurs in ServiceNow

**Ticket Triage:**
- Agent reviews ticket details and assesses issue complexity
- For basic issues (account access, general questions), agent resolves directly in ServiceNow
- For token-related issues (missing tokens, expired tokens, token not honored), agent determines Kigo Pro is needed

### 2. Transition to Kigo Pro

**System Handoff:**
- Agent initiates Kigo Pro access through:
  - SSO link within ServiceNow ticket
  - "Manage Tokens" button that passes ticket context via URL parameters
- Ticket information (customer details, issue description, ticket ID) is passed to Kigo Pro
- Kigo Pro shows a persistent "Ticket Context" banner with ServiceNow reference ID

### 3. Token Management in Kigo Pro

**Customer Identification:**
- Agent searches for customer using information from the ticket
- System displays customer profile and token inventory
- If customer doesn't exist, agent can create a new customer record

**Token Actions:**
- Agent performs necessary token management actions:
  - View token details and status
  - Add new tokens from catalog
  - Remove problematic tokens
  - Reissue expired tokens with new dates
  - Mark tokens as disputed
- Each action is logged in Kigo Pro's activity history

**Action Documentation:**
- Agent documents token actions taken
- System captures before/after state of tokens
- Action summary is prepared for synchronization back to ServiceNow

### 4. Return to ServiceNow

**Data Synchronization:**
- Agent completes token management tasks in Kigo Pro
- Agent clicks "Return to ServiceNow" button
- Token actions summary is transferred to ServiceNow via API
- ServiceNow ticket is updated with token management details

**Ticket Resolution:**
- Agent adds any additional notes in ServiceNow
- Agent updates ticket status based on resolution
- Customer is notified of resolution through ServiceNow
- Ticket is closed in ServiceNow when fully resolved

## Integration Touchpoints

### ServiceNow to Kigo Pro
- **Authentication**: SSO via Okta
- **Data Transfer**: Ticket ID, customer information, issue description
- **Context Preservation**: ServiceNow ticket reference displayed in Kigo Pro

### Kigo Pro to ServiceNow
- **Action Summary**: List of token actions taken (add, remove, reissue, etc.)
- **Token Details**: Before/after state of affected tokens
- **Reference IDs**: Links to affected tokens in Kigo Pro

## Minimal Ticketing Elements in Kigo Pro

Instead of implementing a full ticketing system in Kigo Pro, the following minimal elements support the workflow:

1. **Ticket Context Banner**: Persistent UI element showing ServiceNow ticket information
2. **Activity Log**: Record of token actions taken during the session
3. **Action Summary**: Compiled list of changes to synchronize back to ServiceNow
4. **Return Button**: Direct link back to the originating ServiceNow ticket

## Key Decision Points

1. **Token Management Need**: Does the issue require specialized token management capabilities?
2. **Customer Identification**: Can the customer be located in Kigo Pro system?
3. **Action Type**: What specific token manipulation is needed to resolve the issue?
4. **Resolution Status**: Is the issue fully resolved or does it require additional steps?

## Implementation Considerations

1. **API Integration**:
   - ServiceNow API endpoints for ticket updates
   - Kigo Pro API for token action details
   - Webhook notifications for status changes

2. **Authentication Flow**:
   - SSO configuration with proper permissions
   - Session management between systems
   - Security token validation

3. **Data Synchronization**:
   - Real-time vs. batch updates
   - Conflict resolution strategy
   - Fallback mechanisms for connectivity issues

4. **User Experience**:
   - Clear system boundary indicators
   - Consistent UI patterns across systems
   - Minimized context switching

## Success Metrics

- Time spent on token management tasks
- Successful synchronization rate between systems
- Customer resolution satisfaction scores
- Token action volume by category
- System transition time (ServiceNow to Kigo Pro and back) 