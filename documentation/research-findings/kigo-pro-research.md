Kigo Pro UX Research - Interview Summary
Executive Summary
The Kigo Pro UX Research interviews captured valuable insights from 9 key stakeholders representing various roles within the organization. The research aimed to validate existing specifications, identify gaps, and discover stakeholder insights to inform the design of Kigo Pro's Campaign Management module and Business Success Manager (AI agent).
Key findings include:

Data Integration Challenges: Current systems are fragmented, with multiple databases (MCM, Salesforce, MOM) causing data duplication and ETL issues.
Analytics Limitations: Existing data collection primarily captures "last chapters" of the customer journey (redemption data), missing critical earlier touchpoints.
Standardization vs. Customization: There's significant tension between creating customized solutions for each client and building standardized, scalable products.
Self-Service Aspirations: A self-service platform is viewed as critical for scaling the business, though higher-paying clients may still expect white-glove service.
AI Opportunities: Substantial interest in AI for performance prediction, data analysis, merchant validation, and optimization recommendations.

Overview of Participants
NameTitleDepartmentFocus AreasBrandon BranthooverVP of Offers and AnalyticsAnalytics & DTCAnalytics, reporting, dashboard development, offers productsJohn BellerBusiness Development LeadSalesBusiness development, sales strategy, advertiser relationshipsDiane WerreVP of Client OperationsAccount ManagementMerchant relationships, onboarding, campaign operationsTony TaronnoVP of Merchant PartnershipsSalesMerchant acquisition, local sales, offer consistencyJohn KeoughVP of Strategic AccountsStrategic AccountsStrategic account management, John Deere account leadMary Beth & EricVP, Program Delivery & DTCCustomer SupportCustomer support, legacy client management, DTC communicationsRisa KleinProduct ManagerTeam OxideEnd-to-end product management, John Deere campaignsDenise MoilanenSenior Account ManagerAccount ManagementManaging national paid/non-paid merchants, client relationshipsJustin BuhlTechnical LeadEngineeringCore server architecture, technical leadership
Key Findings by Theme
Current Workflows & Pain Points
System Fragmentation

Multiple Systems: Data is split between MCM, MOM, Salesforce, and Excel, causing duplication and inefficiency.
Manual Processes: Offer entry, asset collection, and merchant validation are largely manual processes.
No Preview Capability: Teams can't preview how offers will appear before going live, requiring daily manual verification.
ETL Failures: Data synchronization issues between systems cause reporting inaccuracies.

Campaign Management Challenges

Verification Bottlenecks: No notification system for failed uploads or errors; team must manually verify daily.
Limited Visibility: Current tools provide incomplete view of the customer journey.
Merchant Communication: Reduced frequency of merchant communication may correlate with "not honoring" issues.
Legacy Systems: MCM described as "very, very clunky... terrible platform" with limited ability to make changes.

Business Development Concerns

Human Interaction Bottlenecks: "What slows us down is human interaction" during client onboarding and campaign setup.
Failed Self-Service Attempts: Previous attempts at merchant self-service saw high abandonment rates due to complexity.
Custom vs. Standardized: Tension between entrepreneurs' "sell what the market wants" approach and the need for standardized products.

Data & Analytics Needs
Critical Metrics

Full-Funnel Metrics: Total audience, impressions, clicks/activations, and redemptions.
Financial Indicators: Total revenue, campaign ROI/ROAS, cost per acquisition.
Merchant-Specific Data: Offer participation rates, wallet retention time, conversion rates.
Competitive Insights: Comparison with other advertising channels (Google, Meta, DoorDash).
Geographic & Seasonal: Performance across regions and seasonal trends.

Analytics Gaps

Incomplete Journey: "Dealing with chapters 18 through 20 and trying to tell the whole story with the last two chapters."
Entry Point Tracking: Can't see how many users had the opportunity but didn't engage.
Cross-Platform Visibility: Missing data from partner sites and entry points.
Purchase Verification: Limited ability to verify actual purchases after redemption.
Context for Metrics: Numbers without clear, digestible insights for clients.

Dashboard Requirements

Hierarchy Filtering: Partner → Program → Campaign drill-down capabilities.
Digestible Summaries: Clear explanations of what metrics mean.
Comparative Views: Benchmarks and competitive analysis.
Visual Representations: Funnel visualization, geographic performance.
Clean Design: Modern interface inspired by consumer apps like Starbucks and Uber.

AI Opportunities
Predictive Insights

Campaign Performance: Predict reach, impressions, activations, and redemptions based on budget and targeting.
ROI Comparison: Compare potential performance against other advertising channels.
Seasonal Analysis: Identify busy/slow periods for merchants to suggest timely promotions.
Regional Variations: Analyze why offers perform differently by region.

Automation Opportunities

Merchant Validation: Verify merchant information against Google listings.
Asset Collection: Automatically gather logos and images from web sources.
Report Generation: Create digestible data summaries for clients.
Quality Filtering: Filter merchants based on Google ratings (e.g., exclude below 3.5 stars).

Optimization Suggestions

Competitive Analysis: Compare merchant performance with competitors to suggest better offers.
Budget Allocation: Recommend optimal distribution of budget across publishers and programs.
Offer Structure: Identify which offer types work best for different business categories.

Decision Support

Natural Language Queries: "What drove the increase in traffic on March 9th?"
Data Summarization: Transform complex data into digestible insights.
Meeting Notes: Generate summaries and action items from client meetings.

Role-Specific Insights
Sales & Business Development

Local merchants often lack technical sophistication and marketing bandwidth.
Clear ROI comparisons with other advertising platforms are critical.
Self-service onboarding could dramatically reduce sales friction.
Previous self-service attempts failed due to complexity and high abandonment.
Customization options are important as "merchants want to make their offer feel like them."

Account Management

Different merchant types require different service levels (white-glove vs. self-service).
Higher-paying clients expect personalized service with direct account manager contact.
Notification systems for campaign issues are critical for account managers.
Retail merchants prefer percentage-based offers over dollar amounts.
Regional and seasonal variations significantly impact offer performance.

Product & Engineering

Tension between immediate client needs and long-term product scalability.
Preference for monolithic architecture over microservices for core functionality.
Collecting business context data is crucial for future AI use cases.
TurboTax cited as inspiration for making complex processes intuitive.
Balance needed between self-service and white-glove approaches.

John Deere Campaign Insights

Started with online-only redemption for simplicity, now moving to in-dealer redemption.
Independently owned dealerships have different systems and technical capabilities.
Many John Deere customers (farmers) are not tech-savvy.
Already caught instances of fraud attempts (dealer employee putting sticky notes over receipt fields).
Limited test data for receipt scanning before launch led to post-launch iterations.

Product Requirements & Recommendations
Technical Infrastructure

Unified Database: Eliminate data duplication across systems with a centralized architecture.
ETL Monitoring: Implement better monitoring and communication for data pipelines.
MCM Replacement: Transition from legacy systems to modern, flexible platform.
Full-Journey Tracking: Implement comprehensive user journey tracking from impressions to redemptions.

User Experience

Preview Capability: Allow viewing how offers will look before going live.
Notification System: Alert users about campaign issues, failed uploads, or status changes.
Self-Service with Guidance: Simplified onboarding with clear step-by-step guidance.
Tiered Experience: Different interfaces for white-glove vs. self-service merchants.
Brand Customization: Allow merchants to customize their offers while maintaining platform consistency.

Analytics & Reporting

Digestible Insights: Transform complex data into clear, actionable insights.
Comparative Analysis: Benchmarking against similar merchants and other advertising channels.
Regional & Seasonal Analysis: Tools to understand performance variations by location and time.
Full-Funnel Visibility: Connect pre-platform entry points with in-platform engagement.
Internal Tool Tracking: Implement analytics to identify friction points in internal tools.

AI Integration

Predictive Campaign Performance: AI-powered forecasting based on budget and targeting.
Merchant Information Auto-Fill: Populate details from Google and other sources.
Data Summarization: Generate digestible reports from complex data.
Natural Language Queries: Allow simple questions about performance data.
Optimization Recommendations: AI-suggested improvements based on performance data.

Next Steps

Prototype Development: Create initial prototypes incorporating key requirements.
Technical Architecture Planning: Map out unified database architecture and integration approach.
Usability Testing: Test self-service workflows with both local and chain merchants.
Analytics Framework: Design comprehensive analytics system capturing full user journey.
AI Capability Roadmap: Plan phased implementation of AI features, starting with internal tools.
Stakeholder Reviews: Conduct follow-up sessions with key stakeholders to validate designs.

This research provides a strong foundation for the development of Kigo Pro's Campaign Management module and Business Success Manager (AI agent), with clear priorities and requirements identified across different user roles.
