# Kigo Technical Architecture

## Current Architecture Overview

Kigo's current technical infrastructure involves multiple systems that have evolved over time, particularly after the Entertainment acquisition. The architecture includes:

### Core Systems

1. **Kigo Core Server**
   - Monolithic architecture built in Rust
   - Handles authentication, authorization, and core business logic
   - Provides API endpoints for client applications
   - Manages wallet functionality and token operations

2. **Entertainment Legacy Systems**
   - Oracle Database storing historical merchant and offer data
   - Endeca for search and offer discovery
   - Legacy B2B API serving multiple client applications
   - DynamoDB for specific use cases (e.g., T-Mobile Tuesdays codes)

3. **MCM (Merchant Content Management)**
   - Legacy system for merchant and offer data entry
   - Described as "clunky" and difficult to modify
   - Used by operations team for offer creation and management
   - Limited reporting capabilities

4. **MOM (Merchant and Offer Management) Database**
   - Repository of merchant and offer objects
   - Used by campaign managers to select offers
   - Connected to both legacy systems and newer platforms

### Integration Layer

- **API Facades** connecting legacy systems to modern applications
- **ETL Processes** moving data between different databases
- **Microservices** handling specific functions via AWS Lambda

### Client Applications

- **D2C Mobile App** for direct-to-consumer interaction
- **Member Sites** for web-based offer access
- **B2B Clients** accessing offers through legacy APIs
- **Merchant Websites** integrated with Kigo offers

## Data Flow Architecture

The current data architecture involves multiple database systems with ETL jobs transferring information between them:

1. **Merchant Data Flow**:
   - Merchant information entered via Wufoo forms
   - Data stored in Salesforce for CRM purposes
   - Information manually transferred to MCM
   - Offer data synchronized to MOM database
   - Data eventually propagated to various client-facing systems

2. **Offer Distribution Flow**:
   - Offers created in MCM
   - Distributed through TOP, Local+, and Signals
   - Made available via various APIs
   - Delivered to end users through partner platforms
   - Redemption data collected and analyzed

3. **Analytics Data Flow**:
   - Event data collected from multiple sources
   - Stored in data lake infrastructure
   - Processed for analytics dashboards in Power BI
   - Made available for reporting and insights

## Architecture Challenges

1. **System Fragmentation**:
   - Multiple disconnected databases
   - Manual data transfer between systems
   - Inconsistent data models across platforms

2. **ETL Reliability**:
   - Failures in data synchronization jobs
   - Limited monitoring and notification capabilities
   - Inconsistent data across systems

3. **Legacy Integration**:
   - Technical debt from Entertainment acquisition
   - Limited ability to modify core legacy systems
   - Complex relationships between old and new systems

## Future Architecture Vision

The vision for Kigo Pro includes:
- Consolidated data architecture with a single source of truth
- Monolithic core server approach rather than microservices
- API-first design for all functionality
- Real-time data processing and analytics
- Enhanced monitoring and reliability
- Simplified integration points for partners and merchants