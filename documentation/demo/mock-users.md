# Mock Users for Demo Instances

This document defines mock user profiles that align with the user personas defined in our documentation. These profiles are used to create dynamic, personalized experiences in each demo instance.

## Merchant Users

### Local Merchant (Deacon's Pizza)

#### Marco Deacon
- **Role:** Owner, Deacon's Pizza
- **Business Size:** Small, single location
- **Technical Proficiency:** Moderate
- **Age:** 42
- **Background:**
  - Second-generation restaurant owner
  - Took over the family business 8 years ago
  - Trying to modernize operations to compete with chain restaurants
- **Pain Points:**
  - Limited time for marketing activities
  - Struggles to compete with bigger chains' marketing budgets
  - Wants to focus on making great pizza, not complex marketing
- **Goals:**
  - Increase weekday dinner business
  - Build customer loyalty program
  - Target families in the neighborhood
- **Usage Pattern:**
  - Uses mobile app mostly in the evenings after dinner service
  - Prefers simple, guided interfaces
  - Values visualizations over raw data

### National Chain (CVS)

#### Jennifer Williams
- **Role:** Regional Marketing Director, CVS
- **Business Size:** National chain, 500+ locations
- **Technical Proficiency:** High
- **Age:** 36
- **Background:**
  - MBA in Marketing
  - 12 years experience in retail marketing
  - Manages marketing for 75 store locations
- **Pain Points:**
  - Coordinating campaigns across multiple locations
  - Maintaining brand consistency while allowing regional customization
  - Tracking ROI across different marketing channels
- **Goals:**
  - Increase prescription refill rates
  - Drive foot traffic to in-store health services
  - Improve customer retention metrics
- **Usage Pattern:**
  - Uses desktop application during business hours
  - Regularly exports data to build custom reports
  - Needs detailed analytics and segmentation capabilities

## Support Agents

### Tier 1 Support

#### Alex Chen
- **Role:** Customer Support Agent
- **Team:** Merchant Support
- **Technical Proficiency:** High
- **Age:** 28
- **Background:**
  - 3 years at the company
  - Previously worked in retail customer service
  - Specializes in merchant onboarding and troubleshooting
- **Responsibilities:**
  - Handling merchant inquiries about campaign setup
  - Resolving token redemption issues
  - Assisting with merchant account management
- **Pain Points:**
  - Toggling between multiple systems to find information
  - Limited visibility into customer journey
  - Manual processes for token management
- **Usage Pattern:**
  - Works with the system 8+ hours daily
  - Often needs to respond quickly while on calls
  - Frequently searches for merchant and customer information

### Tier 2 Support

#### Sarah Johnson
- **Role:** Senior Support Specialist
- **Team:** Technical Support
- **Technical Proficiency:** Very High
- **Age:** 34
- **Background:**
  - 5 years at the company
  - Technical degree in computer science
  - Handles escalated and complex issues
- **Responsibilities:**
  - Resolving complex technical issues
  - Handling escalated merchant concerns
  - Creating support documentation
- **Pain Points:**
  - Lack of detailed technical logs
  - Limited administrative capabilities
  - Complex multi-party issues
- **Usage Pattern:**
  - Focuses on fewer, more complex tickets
  - Needs advanced troubleshooting tools
  - Often collaborates with development and product teams

## Admin Users

### Platform Administrator

#### David Garcia
- **Role:** Platform Operations Manager
- **Team:** Technical Operations
- **Technical Proficiency:** Expert
- **Age:** 39
- **Background:**
  - 7 years at the company
  - Previous experience as a systems administrator
  - Responsible for platform health and merchant oversight
- **Responsibilities:**
  - Monitoring system performance
  - Managing merchant account statuses
  - Overseeing campaign approvals
- **Pain Points:**
  - Lack of proactive monitoring tools
  - Manual verification processes
  - Limited bulk operation capabilities
- **Usage Pattern:**
  - Regularly reviews system dashboards
  - Needs powerful search and filtering capabilities
  - Performs both routine checks and investigative work

### Analytics Administrator

#### Jane Foster
- **Role:** Marketing Analytics Director
- **Team:** Business Intelligence
- **Technical Proficiency:** Expert
- **Age:** 41
- **Background:**
  - Background in data science
  - 10+ years experience in analytics
  - Leads a team of data analysts
- **Responsibilities:**
  - Analyzing platform-wide performance metrics
  - Identifying growth opportunities
  - Producing executive reports
- **Pain Points:**
  - Data consistency across sources
  - Limited customization in reporting
  - Difficulty tracking customer journeys
- **Usage Pattern:**
  - Heavy focus on dashboards and reports
  - Needs data export and integration capabilities
  - Creates and shares custom visualizations

## Implementation Notes

When implementing these mock users in the demo:

1. **Dynamic Greetings:**
   - Use time of day for appropriate greetings (Good morning/afternoon/evening)
   - Include the user's first name: "Good afternoon, Marco!"

2. **Role-Based Content:**
   - Customize dashboard metrics and visualizations based on role
   - Show appropriate action buttons and navigation options

3. **Contextual Hints:**
   - Create tooltips and guidance based on user's technical proficiency
   - Reference their specific pain points in examples

4. **Personalized Recommendations:**
   - Suggest actions based on the user's goals and pain points
   - Reference their specific business context in recommendations 