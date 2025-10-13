Product Requirements Document: Kigo PRO Offer Manager
Document Type: PRD
Product: Kigo PRO
Module: Offer Management
Feature: AI-Powered Offer Management Agent (Simplified Version)
Document Owner: Ben Straley (ben@kigo.io)
Product Manager: Ben Straley (ben@kigo.io)
Date: 2025-10-09
Version: 1.0 (Simplified)
Priority: P1 High
Initial Launch Target: December 2025 (John Deere & Yardi Pilot)

1. Executive Summary
   Problem Statement
   Merchants using Kigo PRO face significant friction in creating and managing offers at scale. The manual process lacks optimization for audience targeting and performance prediction, resulting in suboptimal offer relevance and slower merchant onboarding.
   Solution Overview
   The Kigo PRO Offer Management module is enhanced with an AI-powered agent that serves as a co-pilot integrated directly into the existing Kigo PRO web interface. This AI agent feature streamlines offer creation through intelligent automation and manages complete campaign lifecycles including scheduling, distribution, and performance monitoring.
   Initial Launch Strategy
   Target Date: December 2025
   Pilot Partners: John Deere (closed loop) and Yardi (open loop)
   Scope: Focus on "Above the Line" features for controlled pilot deployment
   Goal: Validate core workflows for both closed and open loop programs
   Key Success Metrics
   3x improvement in offers created per merchant per month
   25% improvement in offer redemption rates and revenue per campaign

   > 85% positive feedback on time savings and business outcomes from pilot partners
   > Successful pilot deployment with John Deere and Yardi by December 2025

2. Core User Stories
   Primary User Groups
   Kigo Team Members
   Role: Internal account managers, Partner Growth team, and platform specialists Goals: Help partners succeed, drive platform adoption, streamline client management Context: Managing multiple partner relationships across both closed and open loop programs

User Stories:

As a Kigo account manager, I want the agent to handle end-to-end campaign setup for both closed loop (John Deere) and open loop (Yardi) clients, so I can efficiently manage diverse program types
As a Kigo Partner Growth team member, I want the agent to automatically optimize offers based on program type (closed vs. open loop), so I can deliver appropriate results for each partner model
As a Kigo platform specialist, I want the agent to provide clear explanations for its recommendations specific to program structure, so I can educate partners on best practices for their model
As a Kigo Partner Growth team member, I want the agent to alert me when campaigns are underperforming with program-specific insights, so I can provide targeted support
John Deere Aftermarket Marketing Team Members
Role: Corporate marketing professionals managing dealer network promotions (closed loop) Goals: Create effective nationwide and regional campaigns, support dealer success, maintain brand consistency Context: Managing complex dealer network with first-party distribution only

User Stories:

As a John Deere aftermarket marketer, I want the agent to create dealer network-wide promotions that work across all participating locations within our closed loop program, so I can efficiently launch corporate campaigns
As a John Deere marketing team member, I want the agent to recommend optimal promotion timing based on seasonal patterns and parts inventory within our dealer network, so our campaigns drive maximum incremental sales
As a John Deere corporate marketer, I want the agent to ensure all dealer promotions maintain brand compliance and stay within our closed loop distribution, so our brand standards and program exclusivity are preserved
As a John Deere marketing specialist, I want the agent to track dealer participation in corporate promotions vs. local campaigns within our network, so I can optimize our closed loop strategy
John Deere Dealer Employees
Role: Local dealer staff responsible for parts and service promotions (closed loop participants) Goals: Drive local foot traffic, increase parts sales, compete effectively in local market Context: Limited marketing expertise, focused on local customer relationships within John Deere network

User Stories:

As a John Deere dealer employee, I want the agent to recommend promotions that work specifically for my local market within the John Deere customer base, so I don't waste time on ineffective campaigns
As a John Deere dealer marketer, I want the agent to automatically create promo codes that integrate with our dealer systems and work within the closed loop program, so customers can easily redeem offers without operational complexity
As a John Deere dealer team member, I want the agent to suggest promotion values that will drive incremental revenue from our existing customer base, so I can confidently approve campaigns
As a John Deere dealer employee, I want the agent to show me how my local promotions compare to corporate campaigns within our network, so I can decide when to participate vs. run independent dealer offers
Yardi Loyalty Marketing Team Members
Role: Property management marketing professionals creating tenant engagement campaigns (open loop) Goals: Increase tenant satisfaction, drive local business partnerships, manage diverse merchant catalog Context: Managing open loop loyalty programs with both Yardi-generated offers and approved merchant offers

User Stories:

As a Yardi loyalty marketing team member, I want the agent to help me create both Yardi-generated offers and coordinate with approved merchants in our marketplace catalog, so I can provide comprehensive value to tenants
As a Yardi marketing specialist, I want the agent to recommend offers that work across different property types while leveraging both our direct offers and merchant partner catalog, so I can efficiently manage diverse portfolio needs
As a Yardi loyalty marketer, I want the agent to optimize tenant engagement by balancing Yardi-created offers with approved merchant offers based on tenant demographics, so our open loop program delivers maximum value
As a Yardi team member, I want the agent to coordinate campaigns across multiple properties while managing both direct offers and merchant catalog integration, so I can scale our open loop program efficiently
As a Yardi program manager, I want the agent to help me evaluate and optimize the performance of Yardi-generated offers vs. merchant catalog offers, so I can make data-driven decisions about our open loop strategy

3. Offer Creation and Management Workflows
   3.1 Offer Creation Workflow (Above the Line)
   Note: The offer creation process will follow a similar workflow to the current manual process, enhanced with AI-powered automation and recommendations.
   Step 1: Business Goal Setting and Context
   Purpose: Establish campaign objectives and gather essential context Data Required:

Business Objective (User Input): Natural language description (e.g., "Increase parts sales for Q4")
Program Context (System Detected): Closed loop (John Deere) or Open loop (Yardi)
User Role (System Detected): Corporate marketer, dealer employee, Yardi team member, or Kigo team member
Target Audience (User Input): Basic audience description (e.g., "existing customers," "new prospects")
Budget Constraints (User Input): Maximum discount budget or campaign spend limit
Timeline (User Input): Desired campaign start and end dates

Agent Guidance:

"What's your main goal for this offer?" (business objective capture)
Program-Specific Callouts:
John Deere (Closed Loop): "Is this for the entire dealer network or specific dealers?"
Yardi (Open Loop): "Will this be a Yardi-generated offer or coordinate with merchant partners?"
Step 2: Offer Type and Value Recommendation
Purpose: AI recommends optimal offer types and values based on goals and context Data Required:

Historical Performance Data (System Provided): Similar campaign performance for context
Program Type Constraints (System Applied): Closed vs. open loop limitations
Merchant Capabilities (System Provided): Available redemption methods for selected locations
Competitive Analysis (System Provided): Market benchmarks for offer values

Available Offer Types (All Programs):

Discount Percentage: X% off purchase
Discount Fixed: $X off purchase
BOGO: Buy One Get One (free or discounted)
Cashback: Earn $X back after purchase
Loyalty Points: Earn X points/tokens
Spend & Get: Spend $X, get reward (requires receipt scan via KigoVerify)
Lightning Offers: Time-limited or quantity-limited versions of above offer types

Agent Recommendations Include:

Suggested offer type with rationale
Recommended offer value range
Expected performance metrics (redemption rate, revenue impact)
Program-Specific Callouts:
John Deere: Focus on parts/service categories, seasonal considerations
Yardi: Consider tenant demographics and property type relevance
Step 3: Redemption Method Selection
Purpose: Choose appropriate redemption method based on merchant capabilities Data Required:

Merchant Location Capabilities (System Provided): Supported redemption methods per location
Operational Constraints (User Input): Staff training level, system integration preferences
Customer Experience Preferences (User Input): Desired customer journey complexity

Available Redemption Methods (All Programs):

Promo Code: Customer provides merchant-supplied code (online, phone, or in-store)
Show and Save: Customer displays QR code, barcode, or text code to staff
Barcode Scan: Customer scans barcode at merchant location
Online Link: Customer clicks link that redirects to merchant website with discount applied

Agent Method Selection Guidance:

Validates merchant location compatibility
Explains operational requirements for each method
Program-Specific Callouts:
John Deere: Promo codes integrate with dealer POS systems
Yardi: Multiple methods may be needed for diverse merchant catalog
Step 4: Promo Code Management (When Applicable)
Purpose: Configure promo code setup and validation Data Required:

Code Type (User Selection): Single universal code vs. multiple unique codes
Promo Codes (User Upload): Merchant-provided codes in approved format
Location Scope (User Selection): Which locations can accept the codes
Usage Limits (User Input): Per-customer and total usage restrictions

Program-Specific Promo Code Requirements:

John Deere (Closed Loop) - Two-Tier Hierarchy:

Corporate Network Codes:
Data Required: Corporate-provided codes, participating dealer list (including all dealer locations)
Validation: Codes work at all selected dealer locations across the network
Agent Questions: "Is this a corporate promotion for the dealer network?"
Individual Dealer Codes:
Data Required: Dealer-specific codes, individual dealer/location validation
Validation: Codes restricted to specific dealer locations only (dealers may have multiple locations)
Agent Questions: "Is this specific to your dealer locations?"

Yardi (Open Loop):

Yardi-Generated Codes:
Data Required: Yardi-provided codes for direct offers
Validation: Property-specific or portfolio-wide availability (property managers may have multiple locations)
Approved Merchant Codes:
Data Required: Merchant partner codes, integration validation
Validation: Merchant catalog compatibility and location availability (merchants may have multiple locations)
Step 5: Offer Customization and Brand Compliance
Purpose: Finalize offer details and ensure brand compliance Data Required:

Offer Title (User Input): Customer-facing offer headline
Offer Description (User Input): Detailed terms and customer messaging
Brand Assets (System Provided/User Upload): Logos, colors, approved imagery
Terms and Conditions (User Input/Template): Legal terms and restrictions
Exclusions (User Input): Products/services not included in offer

Brand Compliance Validation:

John Deere: Strict brand guidelines enforcement, dealer customization within limits
Yardi: Brand consistency with merchant catalog integration flexibility
Agent Validation: Automatic brand compliance checking and suggestions
3.2 Campaign Management Workflow (Above the Line)
Note: Campaign creation supports both newly created offers and existing offers from the program catalog, including affiliate offers, card-linked offers, and discounted product offers.
Step 0: Offer Selection and Confirmation
Purpose: Select or confirm the offer for campaign creation Data Required:

Offer Source Selection (User Input): Create new offer OR select from existing program catalog
Session Context (System Aware): Newly created offers from current session
Catalog Offer Types (System Provided): Available existing offers including:
Affiliate Offers: Third-party partner offers in catalog
Card-Linked Offers: Credit/debit card-linked promotional offers
Discounted Product Offers: Physical product offers with discounted pricing
Previously Created Offers: User's existing offers in the system

Agent Workflow:

New Offer Context: If user just created an offer, agent pre-selects it and confirms: "I see you just created [Offer Name]. Would you like to create a campaign for this offer?"
Catalog Selection: If starting fresh, agent asks: "Would you like to select an existing offer from your catalog or create a new one first?"
Offer Validation: Agent confirms offer compatibility with chosen delivery methods and program constraints
Step 1: Campaign Targeting - Partners and Programs
Purpose: Define distribution scope and target audience Data Required:

Partner Selection (User Input): Which programs will receive the offers
Geographic Scope (User Input): Regional, national, or location-specific targeting
Audience Targeting (User Selection): Specific customer targeting methods
Program Participation (System Validation): Partner coverage and capability confirmation

Audience Targeting Methods for Pilot:

Customer List Upload: Upload CSV/Excel file with customer account IDs and email addresses for targeted airdrops
Basic Audience Segmentation: Utilize available engagement and redemption data for audience selection
Engagement-Based: Target based on app usage, loyalty program activity, transaction frequency
Redemption-Based: Target based on past offer redemption behavior, category preferences
Combined Segmentation: Blend engagement and redemption data for refined targeting

Program-Specific Targeting:

John Deere (Closed Loop):
Data Required: Dealer network participation selection (dealers can have multiple locations), customer account lists for airdrops
Targeting Options: Dealer-specific customer lists, location-specific targeting, parts purchase history, service engagement data
Validation: Customer lists match John Deere program membership, participating dealer locations can support chosen redemption methods
Agent Guidance: "Which dealers and locations will participate? Do you have customer lists for targeted airdrops?"
Yardi (Open Loop):
Data Required: Property portfolio selection (property managers may have multiple locations), tenant account lists, merchant catalog coordination
Targeting Options: Property-specific tenant lists, location-specific targeting, engagement-based segmentation, merchant partner customer overlap
Validation: Property types align with offer relevance, customer lists match tenant databases, merchant locations support chosen redemption methods
Agent Guidance: "Which properties and locations should be included? Which merchant partners and their locations will participate? Do you have tenant lists for targeted campaigns?"
Step 2: Campaign Schedule and Timing
Purpose: Optimize campaign timing for maximum impact Data Required:

Start Date (User Input): Desired campaign launch date
End Date (User Input): Campaign conclusion date
Time Zone (System Detected): Primary operational timezone
Seasonal Considerations (User Input): Holiday periods, inventory cycles, property events
Competitive Calendar (System Provided): Conflicting promotions or market events

Agent Timing Optimization:

Analyzes historical performance for similar campaigns
Identifies optimal duration based on offer type and audience
Program-Specific Callouts:
John Deere: Parts inventory cycles, seasonal equipment demand
Yardi: Property events, tenant payment cycles, local market conditions
Step 3: Delivery Channel Configuration
Purpose: Configure how offers reach target audiences Data Required for Pilot:

Campaign URL Structure (System Generated): Partner-branded domain and tracking parameters for activation campaigns
Landing Page Content (User Input): Campaign-specific messaging and branding
Tracking Parameters (System Applied): Campaign attribution and performance measurement
Distribution Methods (User Selection): Channel-appropriate distribution methods

Available Campaign Types for Pilot:

1. Activation Campaigns (Activation Links)

Channel Description: Partner-branded shareable URLs for trackable user acquisition
Use Cases: QR codes, print materials, email, social media, offline-to-online bridge
Data Required: Campaign messaging, distribution methods, tracking preferences

2. Hub Airdrops

Channel Description: Direct delivery of offers to users' Kigo Hub digital wallets
Use Cases: Targeted delivery to specific user segments, immediate offer availability
Data Required: Target audience selection, delivery timing, personalization preferences

3. Promoted Offers on Kigo Marketplace

Channel Description: Paid promotion of offers within Kigo Marketplace for enhanced visibility
Use Cases: Competitive markets, new merchant launches, time-sensitive campaigns
Data Required: Promotion budget, targeting criteria, bid strategy preferences

4. Organic Kigo Marketplace

Channel Description: Offers appear in Kigo Marketplace for natural discovery without paid promotion
Use Cases: Budget-conscious campaigns, evergreen promotions, longer redemption windows
Data Required: Category placement, search optimization keywords, organic visibility preferences

Program-Specific Campaign Type Availability:

John Deere (Closed Loop):
Available: Activation Campaigns and Hub Airdrops
Restrictions: No Marketplace distribution (Promoted or Organic)
Focus: Dealer network distribution and direct customer engagement
Yardi (Open Loop):
Available: All four campaign types
Flexibility: Can combine multiple campaign types for comprehensive reach
Coordination: Merchant catalog integration across all channels
Step 4: Campaign Review and Approval
Purpose: Final validation before production deployment Data Required:

Campaign Summary (System Generated): Complete configuration overview
Performance Projections (System Calculated): Expected reach, engagement, redemption rates
Budget Impact (System Calculated): Total discount liability and operational costs
Compliance Validation (System Verified): Brand standards, legal requirements, operational capability
Approval Confirmation (User Input): Final go/no-go decision

Review Process Validation:

All required data fields completed and validated
Redemption methods confirmed operational at all selected locations
Brand compliance verified for program type
Program-Specific Checks:
John Deere: Dealer network coordination conflicts resolved
Yardi: Merchant catalog integration validated and tested
Step 5: Production Deployment and Monitoring
Purpose: Launch campaign and initialize tracking Data Required:

Deployment Confirmation (System Generated): Campaign activation timestamp
Tracking Initialization (System Applied): Performance monitoring setup
Alert Configuration (System Applied): Performance threshold monitoring
Support Contact (System Provided): Campaign management and troubleshooting resources

Post-Launch Data Collection:

Real-time redemption tracking and campaign performance
User engagement metrics and conversion funnel analysis
Program-Specific Monitoring:
John Deere: Dealer-level performance and network coordination effectiveness
Yardi: Property-specific engagement and merchant catalog performance
3.3 Data Flow and Context Propagation
Session Context Data (Automatically Carried Through Workflows)
User Identity: Role, permissions, program access level
Program Type: Closed loop vs. open loop context and constraints
Partner Branding: Visual identity, compliance requirements, customization options
Historical Performance: Past campaign data for AI recommendations
Location Capabilities: Supported redemption methods and operational constraints
Current Campaigns: Active promotions to avoid conflicts and coordinate timing
Required User Input Summary by Workflow Stage
Offer Creation:

Business objective and target audience
Budget constraints and timeline preferences
Promo codes (when using promo code redemption)
Offer title, description, and terms
Brand asset preferences and customizations

Campaign Management:

Partner/program targeting selection
Geographic and demographic scope
Campaign timing and duration
Distribution method preferences
Final approval and deployment authorization
System-Provided Data and AI Recommendations
Historical performance benchmarks and predictions
Optimal offer values and types for objectives
Best timing recommendations based on seasonal patterns
Redemption method compatibility validation
Brand compliance checking and suggestions
Performance forecasting and budget impact analysis

This workflow structure ensures all necessary data is captured while minimizing user input requirements through intelligent defaults, system context, and AI-powered recommendations appropriate to each program type.

4. Functional Requirements
   Above the Line - Initial Launch (December 2025)
   Must Have for Pilot Launch
1. AI-Powered Offer Creation (Core)
   Intelligent offer type recommendation based on business goals and audience data
   Automated offer value calibration for maximum incremental revenue impact
   Program Type Awareness: Agent recognizes closed loop (John Deere) vs. open loop (Yardi) context
   Integration with supported Kigo offer types:
   Discount Percentage: X% off purchase
   Discount Fixed: $X off purchase
   BOGO: Buy One Get One (free or discounted)
   Cashback: Earn $X back after purchase
   Loyalty Points: Earn X points/tokens
   Spend & Get: Spend $X, get reward (requires receipt scan via KigoVerify)
   Lightning Offers: Time-limited or quantity-limited versions of above offer types
   Basic brand compliance and asset management
1. Essential Redemption Methods
   The AI agent must support all redemption methods for both program types:

All Redemption Methods Available:

Promo Code: Customer provides merchant-supplied code (online, phone, or in-store)
Show and Save: Customer displays QR code, barcode, or text code to staff
Barcode Scan: Customer scans barcode at merchant location
Online Link: Customer clicks link that redirects to merchant website with discount applied

Promo Code Management for Pilot:

John Deere (Closed Loop):
Corporate Network Codes: Work at participating dealers within network only
Individual Dealer Codes: Location-specific codes for individual dealers
No third-party merchant integration
Yardi (Open Loop):
Yardi-Generated Codes: For direct Yardi offers and promotions
Approved Merchant Codes: Integration with merchant partners in Yardi marketplace catalog
Multi-merchant campaign coordination capability
Basic code format validation for both program types 3. Campaign Management and Lifecycle Control
Complete workflow from targeting through deployment as outlined in Section 3.2
Program-specific delivery channel configuration
Campaign review and approval processes
Campaign States and Controls:
Schedule: Set future start/end dates for campaigns
Publish: Deploy draft campaigns to active status
Start: Immediately activate scheduled campaigns
Pause: Temporarily halt active campaigns (can be reactivated)
Stop/End: Permanently end campaigns (requires confirmation, cannot be reactivated)
Campaign-Offer Relationship: Every offer must be assigned to one or more campaigns to appear on publisher sites
Save Progress: Users can save incomplete offer/campaign creation to return later
Campaign Duplication: Copy existing campaigns to streamline creation of similar campaigns
Offer Duplication: Copy existing offers to simplify creation process 4. Program-Aware Kigo PRO Integration and Access Control
Agent co-pilot interface with program type recognition
Simple conversational interface with context-aware recommendations
Role-Based Access Control: Kigo PRO role-based permissions determine access to Offer Manager module
Program Type Display: Clear indication of closed vs. open loop context
User role-based recommendations appropriate to program structure
Integration with existing Kigo PRO user management and authentication systems 5. Program-Specific Partner Branding
John Deere (Closed Loop): John Deere brand elements with dealer customization options
Yardi (Open Loop): Yardi brand elements with merchant catalog integration display
Simple partner login capabilities for both program types
Program-appropriate visual identity maintenance

Below the Line - Future Releases (Post-Pilot)
Should Have for Broader Rollout

1. Advanced Program-Specific AI Features
   Closed Loop Optimization: Advanced dealer network performance analysis and coordination
   Open Loop Optimization: Merchant catalog performance analysis and cross-merchant campaign coordination
   Performance prediction based on program type and historical data
   Advanced audience segmentation for both program models
2. Complete Multi-Program Distribution
   Closed Loop Enhancement: Advanced dealer network campaign coordination
   Open Loop Enhancement: Full marketplace integration with merchant catalog
   Kigo Marketplace Delivery: Open loop program marketplace discovery
   Kigo Hub Direct Delivery: Targeted delivery for both program types
   Promoted Offer Campaign: Paid advertising appropriate to program structure
   Boost Delivery Method: Campaign delivery method that includes offers in a bundle delivered to customers after checkout (leverages existing platform feature)
3. Advanced Program Management
   Closed Loop Dashboard: Dealer network performance and coordination tools
   Open Loop Dashboard: Merchant catalog management and performance analytics
   Cross-program performance comparison and optimization
   Automated campaign optimization appropriate to program type
   Could Have for Enterprise Features
4. Advanced Program Coordination
   Multi-program management for partners with both closed and open loop offerings
   Cross-program performance benchmarking and optimization
   Advanced approval workflows for different program types
   Enterprise-level program analytics and reporting
5. Advanced Merchant Integration (Open Loop)
   Automated merchant onboarding for open loop programs
   Advanced merchant catalog management and optimization
   Third-party merchant platform integration
   Merchant performance analytics and coordination tools

6. User Experience Requirements
   Program-Aware Agent Interface (Pilot Version)
   +------------------------------------------+
   | Kigo PRO Navigation (Program Branded) |
   | [John Deere - Closed Loop] OR |
   | [Yardi - Open Loop + Merchant Catalog] |
   +------------------------------------------+
   | Main Dashboard Content Area |
   | |
   | +------------------+ +---------------+ |
   | | Campaign Cards | | [Agent Panel] | |
   | | +-------------+ | | 💬 Hi! I see | |
   | | |Campaign 1 | | | you're in | |
   | | |Program Type | | | [Program] | |
   | | +-------------+ | | mode. How | |
   | +------------------+ | can I help?| |
   | | [Input Box] | |
   | | [Send Button] | |
   | +---------------+ |
   +------------------------------------------+
   Program-Specific User Flows
   For John Deere (Closed Loop):
   Network Context: Agent identifies dealer network scope
   Closed Loop Optimization: AI focuses on dealer network performance
   Brand Compliance: Strict John Deere brand standards enforcement
   Network Coordination: Dealer participation and conflict management
   For Yardi (Open Loop):
   Program Scope Selection: Choose Yardi-generated vs. merchant catalog offers
   Multi-Source Coordination: Balance direct offers with merchant partner integration
   Property Portfolio: Coordinate across diverse property types and locations
   Merchant Catalog Integration: Leverage approved merchant offers in tenant campaigns

7. Success Metrics
   Pilot Success Criteria (December 2025)
   Successful Deployment: Agent successfully deployed for both program types
   Program-Specific User Adoption:
   John Deere (Closed Loop): >80% adoption for dealer network campaigns
   Yardi (Open Loop): >80% adoption for both direct offers and merchant catalog integration
   Program-Appropriate Performance: Metrics tailored to closed vs. open loop structure
   User Satisfaction: >85% positive feedback from each program type
   System Stability: >99% uptime during pilot period
   Program-Specific Success Metrics
   Closed Loop (John Deere): Dealer network engagement and corporate campaign efficiency
   Open Loop (Yardi): Tenant engagement and merchant catalog utilization rates

8. Implementation Plan
   Pilot Development Timeline (Q4 2025)
   Phase 1: Foundation (September - October 2025)
   Basic AI agent infrastructure with program type awareness
   Simple co-pilot UI integration with program recognition
   John Deere and Yardi brand integration setup
   Core promo code and activation link functionality for both program types
   Phase 2: Pilot Preparation (November 2025)
   Program-specific customizations for closed loop (John Deere) and open loop (Yardi)
   User training materials tailored to each pilot group and program type
   Pilot deployment and testing environment
   User acceptance testing with representatives from both program types
   Phase 3: Pilot Launch (December 2025)
   Controlled deployment to all user groups across both program types
   Program-specific onboarding and training sessions
   Weekly feedback collection from each user type and program
   Real-time monitoring and support
   Phase 4: Pilot Refinement (January 2026)
   Program-specific feedback integration and improvements
   Scope refinement for broader rollout based on closed vs. open loop learnings
   Planning for "Below the Line" feature development

9. Key Dependencies
   Critical Dependencies for Pilot
   User Group Access: Confirmed participation from representatives of all user groups across both program types
   Program-Specific Design: UX/UI design tailored to closed loop vs. open loop workflows
   Partner Integration: John Deere dealer network and Yardi merchant catalog integration requirements
   Training Development: Program-specific training materials and support processes
   Pilot Success Prerequisites
   Clear program-specific requirements and expectations for each user group
   Dedicated support resources familiar with both closed and open loop program workflows
   Performance monitoring tailored to different program types and use cases

10. Risk Assessment
    Program-Specific Risks
    Program Model Confusion: Risk of users applying wrong workflows to their program type
    Mitigation: Clear program type identification, context-aware interface design
    John Deere Network Coordination: Risk of conflicts between corporate and dealer campaigns
    Mitigation: Closed loop hierarchy rules, automated conflict detection
    Yardi Multi-Source Complexity: Risk of confusion between Yardi-generated and merchant catalog offers
    Mitigation: Clear offer source identification, streamlined coordination workflows
    Cross-Program Learning: Risk of insights from one program type not applying to the other
    Mitigation: Program-specific analytics, careful cross-program insight validation
    Technical Risks
    Program-Aware Permissions: Risk of users accessing inappropriate functionality for their program type
    Mitigation: Careful program-based permissions design, thorough access control testing
    Performance Under Mixed Load: Risk of poor performance with diverse program types and user scenarios
    Mitigation: Load testing with both closed and open loop scenarios, scalable infrastructure

11. Pilot Partnership Requirements
    Kigo Team Pilot Scope
    Focus: Internal productivity across both closed and open loop program management
    Participants: 3-5 account managers and Partner Growth team members
    Success Criteria: Improved client campaign performance and time savings across program types
    John Deere Pilot Scope (Closed Loop)
    Aftermarket Marketing Team: 2-3 corporate marketing professionals
    Dealer Network: 5-8 dealer locations
    Focus: Corporate campaign deployment and dealer coordination within closed network
    Success Criteria: Improved network-wide campaign efficiency
    Yardi Pilot Scope (Open Loop)
    Loyalty Marketing Team: 2-3 marketing professionals
    Program Components: Both Yardi-generated offers and approved merchant catalog integration
    Property Portfolio: 3-5 diverse property types
    Focus: Tenant engagement through both direct offers and merchant partnerships
    Success Criteria: Improved tenant satisfaction and merchant catalog utilization
    Program-Specific Collaboration
    Closed Loop Learning: Focus on dealer network optimization and corporate coordination
    Open Loop Learning: Focus on multi-source offer coordination and merchant catalog management
    Cross-Program Insights: Identify learnings applicable across program types for future enterprise clients

Document History
Version
Date
Changes
Author
1.0
2025-10-09
Program-aware version with comprehensive workflows section
Ben Straley

Note: This PRD accurately reflects John Deere as a closed loop program (dealer network only) and Yardi as an open loop program (both Yardi-generated offers and approved merchant catalog integration). The workflows section provides detailed guidance on data requirements and process flows for the December 2025 pilot launch.
