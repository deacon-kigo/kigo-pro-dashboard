# Kigo Pro Complete Context Guide

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Requirements & Vision](#business-requirements--vision)
3. [Product Architecture](#product-architecture)
4. [Core Modules](#core-modules)
5. [User Types & Roles](#user-types--roles)
6. [Key Terminology](#key-terminology)
7. [Technical Architecture](#technical-architecture)
8. [User Research Insights](#user-research-insights)
9. [Success Metrics](#success-metrics)
10. [Implementation Timeline](#implementation-timeline)

## Executive Summary

Kigo Pro is a self-service enterprise platform that empowers 40,000+ brands to create, manage, target, and measure offer-based marketing campaigns across Kigo's loyalty media network of 130M+ engaged members. The platform aims to transform Kigo from a managed service model to a scalable self-service platform with AI-driven optimization.

### Vision Statement

Create a nearly autonomous and self-optimizing promotion engine where brands can describe their business, set objectives, define budgets, and activate "auto-pilot" mode for intelligent campaign management.

### Core Value Proposition

- **Free platform access** for authorized brand users
- **Revenue generated exclusively** through advertising activities (Promoted Offers, performance fees)
- **AI-powered optimization** and recommendations
- **Real-time analytics** with 15-minute data freshness
- **Self-service capabilities** reducing time-to-market from days to minutes

## Business Requirements & Vision

### Primary Problems Solved

#### For Brands/Advertisers

- **Lack of Control & Efficiency**: Direct campaign control without managed service friction
- **Poor Attribution & ROI**: Precise, performance-based attribution
- **Ineffective Targeting**: Sophisticated audience segmentation tools

#### For Publishers (T-Mobile, Optum, etc.)

- **Program Stagnation**: Loyalty programs as cost centers with "reward fatigue"
- **Untapped Revenue Stream**: Monetize engaged audiences through advertising

#### For End-Users/Consumers

- **Offer Irrelevance**: Personalized, high-value, targeted offers

### Core User Stories

1. **Campaign Manager**: Upload 500+ store locations, organize into regional groups for hyper-local BOGO offers
2. **Media Planner**: Create "Promoted Offer" campaigns with guaranteed premium placement for 3x ROAS
3. **Local Merchant**: AI-guided offer creation to increase foot traffic without marketing expertise
4. **Publisher VP**: Robust platform attracting thousands of advertisers for loyalty program engagement

### Success Metrics

- **Business**: X% of 40,000+ brands using platform within 12 months, $Y incremental ad revenue
- **User Engagement**: <30-minute onboarding, <5-minute offer creation, X% AI recommendation adoption
- **Satisfaction**: >90% retention rate, high NPS scores

## Product Architecture

### Core Components

1. **Central Dashboard**: Unified control interface with role-specific views
2. **Business Management Module**: Account creation, location management, user permissions
3. **Campaign & Offer Management Module**: Create/manage offers, targeting, optimization
4. **Analytics & Reporting Module**: Real-time performance tracking, customer behavior analysis
5. **Business Success Manager (AI-Agent)**: Automated optimization recommendations

### Module Integration

- **Unified API Layer**: Standardized endpoints across all modules
- **Real-time Data Sync**: Consistent data across devices and platforms
- **Role-based Access**: Permission-based feature visibility
- **Cross-module Analytics**: Integrated performance tracking

## Core Modules

### 1. Authentication & User Management

- **Internal Users**: Okta SSO integration with role mapping
- **External Users**: Social sign-in, email/password, mobile verification
- **Multi-Factor Authentication**: SMS verification, email codes
- **Role-Based Permissions**: Super Admin, Merchant Admin, Campaign Manager, Viewer

### 2. Business Management Module

- **Business Profile Management**: Complete business information, location management
- **Multi-location Support**: Bulk upload via Excel/CSV, automated validation
- **User Administration**: Granular roles, permission management
- **Account Hierarchy**: Enterprise → Programs → Brands → Locations

### 3. Campaign & Offer Management Module

- **Offer Types**: Show & Save, Card-Linked Offers (CLO), BOGO, Threshold-Based, Bundle Deals
- **Campaign Types**: Promoted Offers, Airdrops, Free Offers
- **Targeting Capabilities**: Geographic, demographic, behavioral, competitive conquesting
- **Distribution Channels**: TOP (The Offers Platform), Local+, Signals

### 4. Analytics & Reporting Module

- **Real-time Dashboards**: Performance metrics, revenue tracking, user engagement
- **Power BI Integration**: Embedded dashboards with custom visualizations
- **Custom Reporting**: Flexible report builder, data export capabilities
- **Performance Metrics**: Impressions, clicks, activations, redemptions, ROI/ROAS

### 5. Business Success Manager (AI-Agent)

- **Automated Optimization**: Campaign performance monitoring, targeting improvements
- **Predictive Analytics**: Performance forecasting, ROI predictions
- **Intelligent Recommendations**: Budget allocation, offer optimization, timing suggestions
- **Natural Language Interface**: LLM integration for data queries

## User Types & Roles

### Internal Users (Kigo Employees)

- **Super Admin**: Full platform access, system configuration, global user management
- **Merchant Admin**: Business profile, location management, offer creation, analytics access
- **Campaign Manager**: Campaign creation, performance monitoring, offer management
- **Viewer**: Read-only analytics access

### External Users (Partners, Merchants, Advertisers)

- **Partner-Agency Admin**: Manage multiple Merchant Admins, broader permissions
- **Merchant Admin**: Full business access, location management, user management
- **Advertiser Admin**: Advertising campaign focus, merchant admin subset
- **Campaign Manager**: Limited campaign creation and monitoring

### Account Hierarchy

```
Partners (Top-level)
├── Programs (Mid-level)
│   ├── Campaigns (Program-specific)
│   └── Users (Program-scoped)
└── Analytics (Aggregated view)

Merchants/Brands
├── Locations (Geographic distribution)
├── Offers (Product/service promotions)
├── Advertisers (Paid campaign management)
└── Catalogs (Offer collections)
```

## Key Terminology

### Core Concepts

- **Advertising Campaign**: Delivers offers to premium ad placements, merchant-paid
- **Airdrop**: Delivers boosts/offers to user wallets across publisher programs
- **Campaign Manager**: User role for campaign creation and performance monitoring
- **Catalog**: Collection of available offers for publisher programs
- **Enterprise Account**: Top-level organizational account with multiple programs/brands
- **Item-level Offer**: Specific product offers (e.g., "$2.00 off New Chapter Multivitamin")
- **Kigo Loyalty Media Network**: 130M+ engaged members across loyalty programs
- **LOCAL+**: Premium ad placement distribution channel
- **Merchant**: Entity creating offers and potentially running campaigns
- **MOM Database**: Merchant and Offer Management database repository
- **Offer**: Discount, deal, or promotion created by merchants
- **Partner**: Top-tier account managing multiple programs, branding, analytics
- **Premium Ad Placement**: High-visibility locations for promoted offers
- **Program**: Managed under partners, controls settings, users, analytics, campaigns
- **Promoted Offers**: Premium ad placement campaigns across TOP, Local+, etc.
- **Publisher**: Entity distributing offers through loyalty programs
- **TOP (The Offers Platform)**: Core Kigo distribution channel
- **Transaction-level Offer**: Entire transaction offers (e.g., "20% off $20+ purchase")

### Token Types

- Transaction-level Offers
- Item-level Offers
- Gift Cards
- Offer Bundles (Boosts)
- Achievements
- Badges
- Promotion Codes

## Technical Architecture

### Current System Architecture

```
MCM (Merchant Content Management)
├── Oracle Database
├── MOM Database
└── MCM Dashboard

Modern Entertainment
├── MOM → Microservices API
├── D2C Mobile App
├── D2C Member Site
└── B2B Data Feeds

Kigo Core Server
├── Offers API
├── Wallet API (Boosts)
├── Local+
└── TOP (The Offers Platform)

Legacy Systems
├── Endeca → Legacy B2B API
├── Oracle → B2B Data Feeds
└── DynamoDB → T-Mobile Tuesday codes
```

### Target Architecture

- **Consolidated Database**: Single source of truth replacing fragmented systems
- **API-First Design**: Standardized endpoints for all modules
- **Real-time Processing**: Sub-second response times, 15-minute data freshness
- **Scalable Infrastructure**: 100K+ concurrent users, 99.99% uptime
- **Security Compliance**: SOC 2 Type II, PCI DSS, GDPR readiness

### Integration Points

- **Power BI**: Embedded analytics dashboards
- **Google Integration**: Merchant validation, asset collection
- **CRM Systems**: HubSpot, Salesforce integration
- **Payment Processing**: Performance-based fee management
- **Mobile Verification**: SMS-based authentication

## User Research Insights

### Key Pain Points Identified

1. **Data Fragmentation**: Multiple disconnected systems (MCM, Salesforce, Excel)
2. **Manual Processes**: Time-consuming offer entry, asset collection, validation
3. **Limited Visibility**: Missing full-funnel customer journey tracking
4. **Inconsistent Communication**: ETL failures, database change notifications
5. **System Limitations**: Legacy MCM system described as "terrible" and "clunky"

### Critical User Needs

1. **Unified Data Architecture**: Single source of truth for merchant information
2. **Automated Workflows**: Reduce manual data entry and validation
3. **Real-time Notifications**: Alert system for campaign issues/failures
4. **Enhanced Analytics**: Complete customer journey visibility
5. **Self-service Capabilities**: Reduce human touchpoints in campaign creation

### AI Opportunities Prioritized by Users

1. **Predictive Analytics**: Campaign performance forecasting (High Priority)
2. **Automated Data Processing**: Merchant validation, asset collection (High Priority)
3. **Optimization Recommendations**: Performance-based suggestions (High Priority)
4. **Natural Language Queries**: LLM integration for data analysis (Medium Priority)
5. **Competitive Analysis**: Market performance comparisons (Medium Priority)

### Role-Specific Requirements

#### Sales & Business Development

- Simplified demo capabilities for presentations
- ROI comparisons with other advertising platforms
- Self-service onboarding to reduce manual processes
- Market penetration reporting by category/location

#### Account Management

- Unified merchant database eliminating duplication
- Notification system for campaign issues
- Automated asset collection from web sources
- Performance reporting for merchant discussions

#### Analytics Teams

- Centralized data architecture
- Better communication about database changes
- Complete user journey tracking capabilities
- Cross-platform performance analysis

## Success Metrics

### Business/Monetization Metrics

- **Platform Adoption**: Target percentage of 40,000+ brand partners actively using platform
- **Revenue Generation**: Incremental advertising revenue from Promoted Offers
- **Self-Service Adoption**: Percentage of non-free offers created via platform
- **Customer Retention**: >90% retention rate for active platform users

### User Engagement Metrics

- **Onboarding Efficiency**: <30-minute average onboarding time
- **Campaign Creation Speed**: <5-minute average offer creation
- **AI Adoption**: Percentage of users implementing AI recommendations
- **Platform Usage**: Daily/monthly active users, session duration

### Performance Metrics

- **System Reliability**: 99.99% platform availability
- **Response Times**: Sub-second for critical interactions
- **Data Freshness**: 15-minute analytics updates
- **User Satisfaction**: High Net Promoter Score (NPS)

### Competitive Differentiators

- **Network Scale**: 130M+ engaged members across 250+ publishers
- **Direct Relationships**: 94% direct merchant relationships, 9+ year retention
- **Performance-Based Pricing**: Pay-for-results model reduces advertiser risk
- **AI Integration**: Automated optimization beyond manual competitor approaches

## Implementation Timeline

### Phase 1: Authentication & Dashboard (March 2025)

- Okta SSO integration for internal users
- Primary navigation and performance overview
- Real-time metrics and priority actions
- Role-based dashboard views

### Phase 2: Campaign Management - Promoted Offers (April 2025)

- Self-service campaign creation tools
- Advanced audience targeting
- Real-time campaign controls
- A/B testing capabilities
- Initial Google Ad Manager integration

### Phase 3: Analytics Module (May 2025)

- Real-time performance tracking
- Customer behavior analytics
- Revenue and ROI analysis
- Custom reporting capabilities
- Power BI dashboard embedding

### Phase 4: Offer Management - Free Offers (June 2025)

- Complete offer type support
- Distribution across all Kigo products
- Advanced targeting capabilities
- Campaign optimization tools

### Phase 5: Business Success Manager AI Integration (June 2025)

- AI assistance across core modules
- Intelligent workflow monitoring
- Cross-module performance analysis
- Automated merchant guidance

### Future Phases (Post-1.0)

- External user authentication
- Advanced enterprise tools
- POS system integrations
- CPG clearinghouse integrations
- Fully autonomous campaign management

## Development Considerations

### Technical Requirements

- **Frontend**: React-based with responsive design
- **Backend**: API-first architecture with standardized endpoints
- **Database**: Consolidated PostgreSQL replacing fragmented systems
- **Analytics**: Real-time processing with Power BI integration
- **Security**: SOC 2 Type II, PCI DSS compliance
- **Performance**: Sub-second response times, infinite horizontal scaling

### Integration Challenges

- **Legacy System Migration**: Transitioning from MCM and fragmented databases
- **Data Standardization**: Unifying data models across Entertainment and Kigo systems
- **Real-time Processing**: Implementing 15-minute data freshness requirements
- **Multi-tenant Architecture**: Supporting different client configurations

### Risk Mitigation

- **Phased Rollout**: Internal teams first, then external users
- **Backward Compatibility**: Maintaining existing integrations during transition
- **Performance Monitoring**: Comprehensive system health tracking
- **User Training**: Change management for new self-service model

## Key Success Factors

1. **User Experience**: Intuitive interface reducing learning curve
2. **Data Quality**: Accurate, real-time insights driving user confidence
3. **Platform Stability**: Enterprise-grade reliability and performance
4. **AI Effectiveness**: Meaningful optimization recommendations
5. **Competitive Differentiation**: Superior analytics and automation capabilities

This comprehensive context provides the foundation for developing Kigo Pro as a transformative self-service platform that bridges the gap between current managed services and the future vision of autonomous promotional campaigns.
