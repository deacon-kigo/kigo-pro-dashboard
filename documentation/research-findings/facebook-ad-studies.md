# Kigo Pro: Architectural Development Reference

## Executive Summary

This document provides architectural guidance for developing Kigo Pro's campaign management interface by analyzing Facebook Ad Manager's proven patterns and adapting them to Kigo's unique business model. The analysis reveals that no single architectural approach will serve all user types, requiring a multi-modal system that presents different interfaces over shared underlying architecture.

---

## Facebook Ad Manager: Architectural Analysis

### Core Architectural Principles

#### 1. Hierarchical Mental Model

Facebook's success stems from mapping complex advertising concepts to a simple three-tier hierarchy that mirrors strategic thinking:

```
Campaign (Strategic Intent)
├── "What business objective am I trying to achieve?"
├── "What is my overall strategy and budget?"
└── "How do I want to measure success?"

Ad Set (Tactical Execution)
├── "Who do I want to reach?"
├── "Where should my ads appear?"
├── "How much am I willing to spend?"
└── "How should the system optimize delivery?"

Ad (Creative Expression)
├── "What message do I want to convey?"
├── "What visual assets will I use?"
├── "What action do I want users to take?"
└── "How will I track performance?"
```

#### 2. Progressive Disclosure Pattern

Facebook manages complexity through layered revelation:

- **Entry Level**: 6 simplified campaign objectives
- **Intermediate**: Detailed targeting and placement options
- **Advanced**: Custom audiences, bidding strategies, automated rules
- **Expert**: API access, bulk operations, advanced attribution

#### 3. Separation of Concerns

Each tier has distinct responsibilities that don't overlap:

- **Campaign**: Strategy and budget framework
- **Ad Set**: Delivery methodology and audience
- **Ad**: Creative execution and messaging

#### 4. Optimization Boundaries

Machine learning operates within clearly defined scopes:

- **Campaign Budget Optimization**: Distributes budget across ad sets
- **Ad Set Optimization**: Finds best audience segments within targeting parameters
- **Ad Delivery**: Rotates creatives based on performance

### Interaction Patterns That Work

#### 1. Wizard-Based Creation Flow

- Linear progression through complex decisions
- Contextual help and real-time validation
- Save-draft functionality at each step
- Clear progress indicators

#### 2. Bulk Operations

- Multi-select operations across hierarchy levels
- Consistent action patterns (pause, duplicate, edit)
- Batch status changes with confirmation dialogs
- Preserved context when switching between levels

#### 3. Contextual Data Display

- Metrics aggregate appropriately at each level
- Drill-down functionality maintains filter context
- Customizable column sets for different workflow needs
- Real-time performance indicators

---

## Kigo's Architectural Reality

### Business Model Constraints

#### 1. Two-Sided Marketplace Structure

Unlike Facebook's single-sided advertising model, Kigo operates a marketplace connecting:

- **Publisher Side**: Partners → Programs → Distribution channels
- **Advertiser Side**: Merchants → Offers → Promotional content

#### 2. Network-Based Distribution

Targeting in Kigo means selecting distribution pathways rather than defining audiences:

- **Geographic**: State, MSA, ZIP code constraints
- **Network**: Partner and program selection
- **Placement**: Premium positioning within network

#### 3. Performance-Based Economics

Kigo's pricing model differs fundamentally from Facebook's auction system:

- **Campaign Weight**: Fixed resource allocation (Small/Medium/Large)
- **Performance Costs**: Cost per activation, cost per redemption
- **Network Effects**: Value increases with network participation

#### 4. Content-Distribution Coupling

Offers and targeting are interconnected through:

- **Merchant Catalogs**: Product-based filtering possibilities
- **Business Categories**: Industry-specific distribution rules
- **Compliance Requirements**: IAB standards and network policies

### Unique Capabilities Not Present in Facebook

#### 1. Direct Merchant Integration

- Business profile and location management
- Asset collection and validation workflows
- Multi-location coordination capabilities
- Industry-specific offer templates

#### 2. Network Effect Optimization

- Premium placement within loyalty networks
- Cross-program distribution strategies
- Partner-specific customization options
- Loyalty member engagement tracking

#### 3. Performance Transparency

- Direct activation and redemption tracking
- Clear ROI calculation based on actual transactions
- Network-specific performance comparisons
- Real-time inventory and placement availability

---

## Persona-Driven Architectural Requirements

### Local Merchant Needs

#### Mental Model Expectations

Local merchants think in terms of:

- **Business Problems**: "I need more customers during lunch hour"
- **Offer Creation**: "20% off sandwiches"
- **Geographic Scope**: "Within 3 miles of my restaurant"
- **Simple Metrics**: "How many people used my offer?"

#### Architectural Implications

- **Offer-First Creation Flow**: Start with what merchants want to promote
- **Geographic Abstraction**: Hide partner/program complexity behind location selection
- **Template-Driven**: Pre-configured campaign settings for common business types
- **Simplified Metrics**: Focus on activations and redemptions, not intermediate metrics

#### Required Abstractions

```
Merchant Mental Model → Kigo Architecture Mapping
"20% off lunch special" → Offer creation + media type selection
"Near my restaurant" → Geographic targeting + partner auto-selection
"During slow hours" → Schedule + campaign weight configuration
"Track how it performs" → Activation/redemption analytics
```

### National/Chain Account Manager Needs

#### Mental Model Expectations

Chain managers think strategically:

- **Campaign Orchestration**: Multi-location coordination
- **Brand Consistency**: Standardized messaging with local relevance
- **Performance Analysis**: Comparative analytics across locations/regions
- **Integration Requirements**: Compatibility with existing marketing technology

#### Architectural Implications

- **Facebook-Style Hierarchy**: Familiar campaign → ad set → ad structure works well
- **Multi-Location Operations**: Bulk location management and campaign deployment
- **Advanced Targeting**: Full access to partner/program selection capabilities
- **Detailed Analytics**: Comprehensive performance breakdowns and comparisons

#### Enhanced Capabilities Beyond Facebook

```
Facebook Equivalent → Kigo Enhancement
Campaign objectives → Campaign types + network-specific optimization
Audience targeting → Geographic + partner program + catalog filtering
Creative management → Media compliance + brand asset management
Performance tracking → Activation/redemption + loyalty network analytics
```

### Internal Account Manager Needs

#### Workflow Requirements

Internal users manage merchant relationships, not just campaigns:

- **Merchant Onboarding**: Business setup and validation
- **Campaign Oversight**: Multi-merchant campaign management
- **Asset Collection**: Gathering and validating creative materials
- **Performance Reporting**: Client-facing analytics and insights

#### Architectural Implications

- **Administrative Layer**: Operations that transcend campaign structure
- **Cross-Merchant Views**: Aggregate performance and bulk operations
- **Workflow Management**: Approval processes and asset collection tracking
- **Client Communication**: Export-ready reports and performance summaries

#### Hybrid Architecture Requirements

```
Administrative Overlay
├── Merchant Management (Business profiles, locations, users)
├── Campaign Oversight (Approval workflows, performance monitoring)
├── Asset Management (Collection, validation, organization)
└── Client Relations (Reporting, insights, optimization recommendations)

Campaign Management (Facebook-style when needed)
├── Multi-merchant campaign creation
├── Bulk operations across merchant accounts
├── Cross-campaign performance analysis
└── Advanced targeting and optimization
```

---

## Multi-Modal Architecture Design Framework

### Core Architectural Principle

Build a flexible foundation that can present different interfaces to different user types while maintaining data consistency and shared business logic.

### Mode Definitions

#### 1. Simple Mode (Local Merchants)

**Entry Point**: Offer creation
**Complexity Level**: Minimal, guided workflow
**Hidden Concepts**: Partner selection, campaign weights, optimization settings

```
Simplified Flow:
Offer Details → Geographic Area → Schedule → Launch
├── Auto-select appropriate partners based on geography
├── Apply default campaign weight based on business size
├── Use standard media types with compliance validation
└── Present simplified performance metrics
```

#### 2. Advanced Mode (Chain Managers)

**Entry Point**: Campaign creation
**Complexity Level**: Full feature access
**Exposed Concepts**: All targeting options, optimization controls, detailed analytics

```
Facebook-Inspired Flow:
Campaign Strategy → Targeting & Distribution → Creative Assets → Optimization
├── Full partner/program selection
├── Advanced geographic and demographic targeting
├── Custom campaign weights and bidding strategies
└── Comprehensive performance analysis tools
```

#### 3. Administrative Mode (Internal Users)

**Entry Point**: Merchant dashboard
**Complexity Level**: Cross-system operations
**Unique Concepts**: Merchant management, approval workflows, bulk operations

```
Administrative Flow:
Merchant Overview → Campaign Portfolio → Performance Analysis → Client Relations
├── Multi-merchant account management
├── Campaign approval and oversight
├── Asset collection and validation
└── Client-facing reporting and insights
```

### Shared Architectural Components

#### 1. Data Model Flexibility

Design data structures that support multiple interaction patterns:

- **Campaign Objects**: Can be created through simple or advanced flows
- **Targeting Rules**: Abstract network complexity for simple users, expose for advanced
- **Performance Metrics**: Aggregate appropriately for each user mode
- **Asset Management**: Handle both guided upload and sophisticated creative workflows

#### 2. Business Logic Abstraction

Core business rules that work regardless of interface:

- **Compliance Validation**: IAB standards and network requirements
- **Performance Optimization**: Network-specific delivery optimization
- **Cost Calculation**: Campaign weight and performance-based pricing
- **Geographic Constraints**: Location-based targeting and availability

#### 3. Progressive Enhancement

Start with simple capabilities and enhance based on user sophistication:

- **Default Behaviors**: Smart defaults that work for most use cases
- **Advanced Controls**: Optional settings that don't interfere with basic use
- **Expert Features**: API access, bulk operations, custom integrations
- **Administrative Tools**: Cross-user management and oversight capabilities

---

## Key Architectural Decisions

### 1. Hierarchy Flexibility

**Decision Point**: How strictly to enforce Facebook's 1:Many:Many hierarchy
**Considerations**:

- Simple users benefit from hidden complexity
- Advanced users expect familiar campaign structure
- Administrative users need cross-cutting operations
- Technical implementation must support multiple relationship patterns

### 2. Targeting Abstraction

**Decision Point**: How to present Kigo's network-based targeting as familiar audience selection
**Considerations**:

- Geographic selection is universally understood
- Partner/program concepts are Kigo-specific
- Advanced users may want direct network control
- Simple users need targeting without technical complexity

### 3. Performance Metrics Presentation

**Decision Point**: How to present Kigo's unique performance model (activations/redemptions) alongside familiar advertising metrics
**Considerations**:

- Traditional advertisers expect reach, impressions, click-through rates
- Kigo's strength is in demonstrable business impact (transactions)
- Different user types care about different metrics
- Reporting needs vary from simple summaries to detailed analysis

### 4. Creative Asset Management

**Decision Point**: How to balance creative flexibility with technical compliance requirements
**Considerations**:

- Simple users need guided asset creation
- Advanced users want creative testing capabilities
- Compliance requirements are non-negotiable
- Asset reuse and management efficiency

---

## Development Principles

### 1. Start Simple, Scale Complexity

- Begin with the simplest user flow (local merchant offer creation)
- Ensure each complexity layer builds naturally on previous functionality
- Avoid feature creep that compromises simple user experience
- Maintain clear boundaries between modes

### 2. Respect Mental Models

- Use terminology that matches user expectations for their sophistication level
- Present information architecture that aligns with user workflow
- Minimize cognitive load by hiding irrelevant complexity
- Provide contextual help that matches user knowledge level

### 3. Maintain Data Integrity

- Ensure all modes operate on consistent underlying data
- Support mode switching without data loss
- Maintain audit trails across all user interactions
- Enable administrative oversight regardless of creation method

### 4. Enable Growth Paths

- Allow users to graduate from simple to advanced modes
- Provide learning opportunities without forcing complexity
- Support team collaboration across different sophistication levels
- Enable integration with existing tools and workflows

---

## Success Metrics and Validation

### User Experience Metrics

- **Task Completion Rate**: Can users successfully complete their intended actions?
- **Time to Completion**: How quickly can users accomplish their goals?
- **Error Recovery**: How easily can users recover from mistakes?
- **Feature Discovery**: Do users find relevant capabilities when needed?

### Business Impact Metrics

- **Adoption Rate**: What percentage of users actively use the platform?
- **Retention Rate**: Do users continue using the platform over time?
- **Feature Utilization**: Which capabilities provide the most value?
- **Support Burden**: How much assistance do users require?

### Technical Performance Metrics

- **System Responsiveness**: Page load times and interaction responsiveness
- **Data Accuracy**: Consistency across different user interfaces
- **Integration Reliability**: Stability of connections to backend systems
- **Scalability**: Performance under increasing user load

---

This architectural framework provides the foundation for building a campaign management system that honors proven UX patterns while accommodating Kigo's unique business model and diverse user needs. The key insight is that architectural flexibility enables user experience optimization across different use cases and sophistication levels.
