# Loyalty Agent

## Product Requirements Document

|                   |                                                                                                          |
| :---------------- | :------------------------------------------------------------------------------------------------------- |
| **Document Name** | Loyalty Agent PRD                                                                                        |
| **Version**       | 1.9                                                                                                      |
| **Status**        | Draft                                                                                                    |
| **Owner**         | Ben Straley                                                                                              |
| **Last Updated**  | April 8, 2026                                                                                            |
| **Programs**      | Open and closed loop loyalty programs including: John Deere · Yardi · VW · Mazda · Floor & Decor · Optum |
| **Platform**      | LEO                                                                                                      |

---

### About This Document

This PRD defines the requirements for the Kigo Loyalty Agent — a multi-tenant, AI-powered conversational loyalty experience deployed across enterprise loyalty programs. It covers member experience, ML personalization, pre- and post-authentication flows, Kigo Hub integration, behavioral event tracking, agent memory, channel architecture, administration, and integration.

##

## Table of Contents

- [1\. Overview](#1-overview)
- [2\. Problems & Jobs to Be Done](#2-problems--jobs-to-be-done)
  - [2.1 The Problem](#21-the-problem)
  - [2.2 Jobs to Be Done](#22-jobs-to-be-done)
  - [2.3 Why Now](#23-why-now)
- [3\. Goals & Success Metrics](#3-goals--success-metrics)
- [4\. Fast Integration](#4-fast-integration)
  - [4.1 Integration Model](#41-integration-model)
  - [4.2 Launch Checklist](#42-launch-checklist-target--5-business-days)
  - [4.3 Security by Default](#43-security-by-default)
- [5\. Pre-Authentication Experience (Activation Links)](#5-pre-authentication-experience-activation-links)
  - [5.1 Activation Link Functionality](#51-activation-link-functionality)
  - [5.2 Pre-Auth Landing Page](#52-pre-auth-landing-page)
  - [5.3 Authentication Handoff](#53-authentication-handoff)
- [6\. User Experience](#6-user-experience)
  - [6.1 Personalized Onboarding — Stacked](#61-personalized-onboarding-first-login)
  - [6.2 Ongoing Conversational Interface](#62-ongoing-conversational-interface)
  - [6.3 Gamification Layer](#63-gamification-layer)
  - [6.4 Catalog Discovery & Recommendations](#64-catalog-discovery--recommendations)
- [7\. Kigo Hub Integration](#7-kigo-hub-integration)
  - [7.1 Shared Functionality](#71-shared-functionality)
  - [7.3 Notifications Inbox](#73-notifications-inbox)
  - [7.4 Integration Approach](#74-integration-approach)
- [8\. ML Personalization & Optimization](#8-ml-personalization--optimization)
  - [8.1 Core ML Capabilities](#81-core-ml-capabilities)
  - [8.2 Data Inputs](#82-data-inputs)
  - [8.3 Optimization Objectives](#83-optimization-objectives)
  - [8.4 Model Governance](#84-model-governance)
- [9\. Agent Memory](#9-agent-memory)
  - [9.1 Memory Model](#91-memory-model)
  - [9.2 What Memory Enables](#92-what-memory-enables)
  - [9.3 Memory Architecture](#93-memory-architecture)
  - [9.4 Memory Inputs](#94-memory-inputs)
  - [9.5 Memory & Privacy](#95-memory--privacy)
- [10\. Behavioral Event Tracking](#10-behavioral-event-tracking)
  - [10.1 Event Coverage](#101-event-coverage)
  - [10.2 Event Schema](#102-event-schema)
  - [10.3 Data Consumers](#103-data-consumers)
  - [10.4 Event Governance](#104-event-governance)
- [11\. Channel Architecture](#11-channel-architecture)
  - [11.1 Embedded UI](#111-embedded-ui-primary)
  - [11.2 External Channel Integrations](#112-external-channel-integrations)
- [12\. Program Connections](#12-program-connections)
- [13\. Agent Tools](#13-agent-tools)
- [14\. Program & Agent Administration](#14-program--agent-administration)
  - [14.1 Program Configuration](#141-program-configuration)
  - [14.2 Activation Link Management](#142-activation-link-management)
  - [14.3 Agent Behavior Configuration](#143-agent-behavior-configuration)
  - [14.4 ML & Optimization Controls](#144-ml--optimization-controls)
  - [14.5 Member Management](#145-member-management)
  - [14.6 Reporting & Observability](#146-reporting--observability)
  - [14.7 Platform Operator Controls (Kigo)](#147-platform-operator-controls-kigo)
- [15\. Identity & Security](#15-identity--security)
- [16\. Out of Scope (v1)](#16-out-of-scope-v1)
- [17\. Open Questions](#17-open-questions)

---

# Loyalty Agent — Product Requirements Document

**Version:** 1.9 | **Status:** Draft | **Owner:** Product  
**Last Updated:** April 8, 2026

---

## 1\. Overview

The Loyalty Agent is a multi-tenant AI agent deployed across enterprise loyalty programs (John Deere, Yardi, VW, Mazda, Floor & Decor, and others). It delivers a personalized, conversational loyalty experience — from first-touch onboarding through ongoing engagement, earning, and redemption — across embedded UI, web, app, and external communication channels.

Four principles govern the platform:

- **ML-first** — personalization and optimization are the intelligence layer beneath every interaction, not a feature layer on top
- **Fast integration** — any brand can launch the agent with minimal engineering effort through a standardized, configuration-driven onboarding path
- **Pre- and post-auth continuity** — the agent is accessible to unauthenticated users via public Activation Links and configurable landing pages, with a seamless transition into the full authenticated experience
- **Platform-connected** — the agent integrates natively with the Kigo Hub, supporting favoriting, offer and reward redemption, and a unified member experience across surfaces
- **Event-instrumented** — every member interaction generates a tagged, attributed event; this behavioral data stream is the shared foundation for analytics, ML personalization, optimization, and reporting
- **Memory-persistent** — the agent maintains a memory of past sessions, interactions, and events, enabling continuity and context across every conversation

Program and agent administration are managed through a dedicated admin console.

## 2\. Problems & Jobs to Be Done

### 2.1 The Problem

Loyalty programs are failing at the moment they matter most — the intersection of a customer's intent and a brand's ability to respond. Despite near-universal program adoption across enterprise brands, most loyalty experiences are static, siloed, and structurally disconnected from how people actually live and shop. The result is a loyalty paradox: brands are spending more to retain customers while getting less in return.

**The five core failure modes:**

| \#  | Problem                                    | Signal                                                                                                                                        |
| :-- | :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Low engagement frequency**               | Most programs achieve only monthly interactions; daily micro-engagement habit loops are never formed                                          |
| 2   | **Poor redemption rates**                  | Less than 30% of available rewards are redeemed due to friction, irrelevance, and lack of contextual discovery                                |
| 3   | **Generic, one-size-fits-all experiences** | Flat, transactional data profiles tell brands _what_ a customer bought but not _why_ — leading to undifferentiated, spammy outreach           |
| 4   | **Siloed data and broken UX**              | Loyalty lives in a separate portal disconnected from the customer's natural workflow — they must "do the math" on rewards, and usually don't  |
| 5   | **Loyalty as a cost center**               | Traditional points-only programs generate an average 1.9x ROI against a reachable benchmark of 5.3x for AI-optimized programs (Antavo, 2026\) |

Underlying all five is a structural shift: loyalty was built for a web-and-app era, and customer behavior has moved to an agentic one. Ambient AI assistants — embedded in browsers, cars, messaging platforms, and smart devices — are becoming the primary interface through which people discover and transact. Loyalty programs that remain destination-based will be systematically bypassed.

---

### 2.2 Jobs to Be Done

The Loyalty Agent is designed around three distinct customer types, each with a primary job they are trying to accomplish.

#### Member (End Consumer)

| Job                                                                                     | Current Failure                                                          | Agent Solution                                                                                                         |
| :-------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **"Show me rewards that are relevant to my life right now"**                            | Generic catalogs with no awareness of my context, preferences, or intent | ML behavioral model \+ LifeGraph identity graph surfaces hyper-personalized recommendations at the right moment        |
| **"Tell me what I've earned and what I can do with it — without making me think hard"** | Balance checks buried in portals; redemption math left to the member     | Conversational interface surfaces balance, progress, and next best action in plain language                            |
| **"Recognize me across sessions — don't make me start over every time"**                | Stateless sessions with no memory; member repeats preferences repeatedly | Cross-session memory with interaction history, preference recall, and unresolved intent tracking                       |
| **"Help me discover earning opportunities I didn't know about"**                        | Offers buried in tabs; no contextual surfacing at earning moments        | Proactive gamified nudges via agent and outbound channels, powered by Campaign Engine triggers                         |
| **"Let me engage with my loyalty program in the tools I already use"**                  | Separate app or website required; no presence in natural workflow        | Embedded widget, external channel integrations (SMS, Slack, Teams), and LLM passthrough for native AI assistant access |

#### Program Operator (Brand / Enterprise)

| Job                                                                             | Current Failure                                                                  | Agent Solution                                                                                                               |
| :------------------------------------------------------------------------------ | :------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **"Turn loyalty from a cost center into a measurable revenue driver"**          | Point liability accumulates with no clear attribution to business outcomes       | ML optimization balances member relevance against transactional revenue and LTV; merchant-funded offers shift cost structure |
| **"Increase active member rates without increasing acquisition spend"**         | Low single-digit active user rates despite large enrolled bases                  | Personalized onboarding (Stacked), gamification, proactive re-engagement triggered by churn prediction                       |
| **"Launch and iterate on loyalty experiences without long development cycles"** | Complex integrations requiring months of engineering; siloed vendor dependencies | \< 5-day launch via single embed \+ admin console configuration; no per-tenant code changes                                  |
| **"Understand what my members actually want and how they're engaging"**         | Fragmented reporting across siloed platforms; no behavioral signal granularity   | Full behavioral event stream with tagged, attributed events feeding admin dashboards and ML models                           |
| **"Reach my audience before they need to log in"**                              | Loyalty inaccessible to unauthenticated prospects; no acquisition funnel         | Activation Links and configurable pre-auth landing pages drive sign-up and authenticated session conversion                  |

#### Merchant / Offer Partner

| Job                                                                         | Current Failure                                                       | Agent Solution                                                                                               |
| :-------------------------------------------------------------------------- | :-------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **"Reach high-intent buyers at the moment they're most likely to convert"** | Bulk offer distribution with poor targeting and unclear attribution   | ML offer targeting matches merchant-funded offers to highest-propensity segments based on behavioral signals |
| **"Prove ROI on loyalty investment with clear attribution"**                | Impression-based metrics; redemption not directly tied to offer spend | Pay-per-redemption model with end-to-end event tracking from offer impression through confirmed redemption   |
| **"Integrate with loyalty programs without bespoke engineering work"**      | Complex, custom integration requirements per program                  | Standardized Kigo platform APIs; offer catalog managed centrally and exposed across all programs             |

---

### 2.3 Why Now

Three forces make the current moment the right time to build the Loyalty Agent:

**The agentic shift is here.** AI assistants are moving from novelty to infrastructure. Brands that don't have a loyalty presence in the agentic layer — embedded widgets, LLM passthrough, MCP-accessible tools — will be invisible in the primary channel through which their customers are increasingly transacting.

**The ROI gap is widening.** Legacy "points-only" programs are delivering 1.9x ROI while AI-optimized programs benchmark at 5.3x. Enterprise loyalty buyers now have both the data to see the gap and the C-suite pressure to close it. The pitch is no longer "upgrade your platform" — it's "your current program is leaving money on the table."

**The CAC crisis is forcing a retention mandate.** Customer acquisition costs have surged 222% over the last decade. Brands are actively reallocating budget from acquisition to retention. Loyalty is no longer a marketing line item — it's a strategic imperative.

---

## 3\. Goals & Success Metrics

| Goal                           | Metric                                                                       |
| :----------------------------- | :--------------------------------------------------------------------------- |
| Drive first-session activation | Onboarding completion rate \> 70%                                            |
| Increase earning engagement    | Offers claimed per active user / month                                       |
| Grow redemption revenue        | Redemption GMV; transactional revenue per session                            |
| Improve member retention       | 90-day active member rate; LTV trend                                         |
| Expand program connectivity    | \# of linked external programs per user                                      |
| ML model performance           | Recommendation CTR; offer-to-redemption conversion; revenue lift vs. control |
| Fast program launch            | Time from contract to live agent \< 5 business days                          |
| Admin efficiency               | Time to configure new program instance; issue resolution time                |

---

## 4\. Fast Integration

Reducing time-to-launch is a product requirement, not just an engineering goal. The agent is architected to be deployable by any brand with minimal engineering involvement.

### 4.1 Integration Model

| Layer               | Approach                                                                                                   |
| :------------------ | :--------------------------------------------------------------------------------------------------------- |
| **Authentication**  | SSO via SAML 2.0 or OAuth 2.0; pre-built connectors for common IdPs; API key fallback for simpler programs |
| **Data connection** | Kigo platform APIs are the primary data source; no custom data pipelines required for v1                   |
| **UI deployment**   | Single JavaScript snippet embed for web; React Native / WebView SDK for mobile                             |
| **Configuration**   | All program setup done through admin console; no code changes per tenant                                   |
| **Catalog**         | Program catalog activated from existing Kigo Rewards & Offers inventory; no new catalog build required     |

### 4.2 Launch Checklist (Target: \< 5 Business Days)

1. **Day 1** — Tenant provisioned; program admin credentials issued; SSO configuration started
2. **Day 2** — SSO validated; brand assets uploaded (logo, colors, font); catalog scope configured
3. **Day 3** — Policy rules configured (earning rates, tiers, expiration); onboarding content reviewed
4. **Day 4** — Widget embed tested on program site or app; Activation Link configured and tested
5. **Day 5** — QA sign-off; go-live

### 4.3 Security by Default

Integration security is non-negotiable and handled at the platform level so programs do not need to engineer it themselves:

- All API communication over TLS 1.2+
- JWT-based session tokens with short expiry; refresh token rotation
- Tool calls are server-side only; no credentials exposed to the client
- Tenant data isolation enforced at the infrastructure layer
- SSO tokens validated against program IdP on every session initiation; no session sharing across tenants
- Activation Link tokens are scoped and time-limited; token usage scope (single-use, session-scoped, or multi-use) is configured at link creation time in Kigo Offer Manager PRO
- Admin console access gated by MFA

---

## 5\. Pre-Authentication Experience (Activation Links)

The agent is not exclusively a post-login tool. Programs can expose a configurable, public-facing experience to unauthenticated users via **Kigo Activation Links** — shareable URLs that direct audiences to a branded landing page connected to the agent.

### 5.1 Activation Link Functionality

Kigo Activation Links are the distribution mechanism for pre-auth agent access. Programs generate and configure links through the admin console for use in marketing emails, social campaigns, QR codes, partner placements, and paid media.

Activation Links are created and configured through **Kigo Offer Manager in PRO**. Each link is tied to a configured landing page and can be:

- Scoped to a specific offer, reward category, or campaign
- Set with an expiration date
- Tracked for attribution (source, medium, campaign)
- Restricted by domain or referrer if needed
- Configured with a **token usage scope** at creation time:
  - **Single-use** — token is invalidated after the first authentication or redemption (e.g., exclusive invite links, one-time promotional offers)
  - **Session-scoped** — token is valid for the duration of the user's session and expires on session end or timeout
  - **Multi-use** — token remains active across multiple visits until the link's expiration date (e.g., evergreen campaign links, QR codes in physical materials)

### 5.2 Pre-Auth Landing Page

The landing page is configurable per program and serves as the entry point for unauthenticated users:

| Element                   | Configuration                                                                  |
| :------------------------ | :----------------------------------------------------------------------------- |
| Hero content              | Program brand, headline, value proposition copy                                |
| Featured offers / rewards | Curated preview from the catalog (no redemption until auth)                    |
| Program benefits overview | Tier structure, earning highlights, key rewards                                |
| Sign-up / sign-in CTA     | Connects to program SSO or registration flow                                   |
| Agent teaser              | Limited agent interaction available pre-auth (FAQs, program info, browse-only) |

The pre-auth agent can answer general questions about the program, surface catalog previews, and guide users toward registration — but cannot execute transactional functions (balance checks, redemption, offer claims) until authenticated.

### 5.3 Authentication Handoff

On sign-up or sign-in from the landing page:

1. Member authenticates via program SSO
2. Identity Lifegraph resolves member identity
3. If first login → Personalized Onboarding experience (Section 5.1)
4. If returning member → Full agent session resumes with history and context intact
5. Any pre-auth browsing context (viewed offers, expressed interest) is carried forward into the authenticated session as a personalization signal

---

## 6\. User Experience

### 6.1 Personalized Onboarding (First Login)

Immediately following authentication, the agent delivers **Stacked** — a Spotify Wrapped-style recap surfacing the member's history, earning patterns, and standing within the program. The experience name defaults to "Stacked" but is configurable per program.

**Content drawn from program data and ML profile:**

- Lifetime points earned and redeemed
- Top categories, merchants, or behaviors
- Tier status and progress toward next level
- Moments: first transaction, biggest earn, longest streak
- ML-generated personalized headline ("You've earned more than 84% of members this year")
- Predicted next best action, surfaced as the first post-onboarding prompt

**Flow:**

1. Auth → identity resolution via Identity Lifegraph
2. Agent surfaces onboarding narrative (animated card sequence or conversational)
3. Transition to first action: redeem, explore catalog, or link a program
4. Persistent agent UI activated for ongoing use

New members with no history receive a curated "Here's what's possible" orientation instead. ML cold-start logic uses segment-level signals and program vertical benchmarks to seed initial recommendations.

---

### 6.2 Ongoing Conversational Interface

After onboarding, the member engages the agent directly through natural language or tappable prompts to perform all standard loyalty functions:

- Check point balance and transaction history
- Browse and redeem rewards and offers
- Favorite rewards and offers (synced to Kigo Hub)
- Discover and claim offers
- Review tier status and progress
- Get personalized recommendations
- Link external loyalty programs
- View notifications and unread messages from the Hub inbox
- Ask policy questions (how points expire, earning rules, etc.)

The agent maintains within-session context and draws on cross-session memory to personalize every interaction — referencing past conversations, expressed preferences, prior redemptions, and unresolved intents without requiring the member to repeat themselves.

---

### 6.3 Gamification Layer

Gamification is embedded in the agent's communication style and surfaced contextually — not as a separate module. ML determines optimal mechanic type, timing, and frequency per member.

| Mechanic         | Implementation                                                       |
| :--------------- | :------------------------------------------------------------------- |
| Progress bars    | Tier advancement, streak tracking, offer completion                  |
| Milestone alerts | "You're 200 points from Gold" triggered proactively                  |
| Earning nudges   | "You have an active offer expiring in 3 days"                        |
| Streaks          | Consecutive engagement or purchase streaks with visual reinforcement |
| Challenges       | Program- or merchant-funded time-limited challenges                  |
| Leaderboards     | Optional; program-configurable for competitive programs              |

Gamification sequencing is optimized by the ML engine to maximize engagement without fatigue. Campaign Engine handles execution based on ML-generated triggers.

---

### 6.4 Catalog Discovery & Recommendations

The agent provides two modes of catalog access, backed by the Kigo Rewards & Offers Catalog and ML-powered ranking:

**Conversational recommendations** — agent proactively surfaces relevant rewards and offers based on:

- Member behavioral model (transaction history, category affinity, redemption patterns)
- ML-ranked relevance score balanced against business outcome optimization (revenue, margin, LTV)
- Offer urgency and inventory signals
- Program-defined merchandising rules (applied as constraints on ML output)

**Browse & search** — member-initiated exploration of the catalog through:

- Keyword search with ML-reranked results
- Category and filter navigation
- Personalized ranking and featured placements
- Program-specific catalog configuration

Each catalog instance is configured per program. ML ranking operates within program-defined catalog bounds.

---

## 7\. Kigo Hub Integration

The agent integrates natively with the Kigo Hub, ensuring a consistent and connected member experience across both surfaces. Actions taken in the agent are reflected immediately in the Hub, and Hub state is available to the agent.

### 7.1 Shared Functionality

| Function                | Agent Behavior                                                                                                                                    | Hub Sync                                                                                        |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------- |
| **Favorite rewards**    | Member can favorite any reward via agent interaction or catalog browse                                                                            | Favorites appear instantly in Hub; removable from either surface                                |
| **Favorite offers**     | Member can favorite any offer via agent interaction or catalog browse                                                                             | Favorites appear instantly in Hub; removable from either surface                                |
| **Redeem rewards**      | Full redemption flow executed by agent via Reward Redemption tool                                                                                 | Redemption reflected in Hub transaction history and point ledger                                |
| **Redeem offers**       | Offer claim and redemption flow executed by agent                                                                                                 | Offer status updated in Hub; used offers marked accordingly                                     |
| **Point balance**       | Agent surfaces live balance from Points Engine                                                                                                    | Consistent with Hub display                                                                     |
| **Transaction history** | Agent can surface history on request                                                                                                              | Consistent with Hub history view                                                                |
| **Notifications inbox** | Agent can surface recent notifications and unread count on request; agent-initiated messages (e.g., airdrop confirmation) also write to the inbox | Notifications appear in the Hub inbox in real time; read/dismissed state synced across surfaces |

### 7.3 Notifications Inbox

The Hub includes a **Notifications Inbox** — a persistent, in-product message center where members receive program-initiated communications. The inbox serves as the primary touchpoint for proactive, non-conversational messaging that doesn't require an active agent session.

**Message types:**

| Type                            | Description                                                                                                   | Example                                                                     |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------- |
| **Surprise & delight airdrops** | Unexpected point or reward grants issued by the program to drive engagement and goodwill                      | "You just received 500 bonus points — happy anniversary\!"                  |
| **Reward expiration notices**   | Alerts when a redeemed or available reward is approaching its expiration date                                 | "Your $10 Starbucks card expires in 5 days — use it before it's gone"       |
| **Offer expiration notices**    | Alerts when a claimed or eligible offer is approaching its expiration date                                    | "Your 3x points at Home Depot offer expires tomorrow"                       |
| **Earning confirmations**       | Confirmation that points have posted from an affiliate, CLO, or KigoVerify-verified transaction               | "You earned 150 points from your purchase at Nike — verified by KigoVerify" |
| **Tier status updates**         | Notifications when a member advances, is at risk of demotion, or has a tier change                            | "Congratulations — you've reached Gold status\!"                            |
| **Challenge updates**           | Progress milestones, completions, and new challenge invitations                                               | "You've completed 3 of 5 purchases in the Spring Challenge"                 |
| **Program announcements**       | General program communications configured by the program admin                                                | "New rewards just added to your catalog — check them out"                   |
| **New token alerts**            | Real-time notification when new tokens (points, rewards, or digital assets) are available in the member's Hub | "You have a new reward token available — tap to view it in your Hub"        |

**Inbox behavior:**

- Messages are delivered asynchronously and do not require the member to be in an active agent or Hub session
- Each message includes: title, body, timestamp, message type, read/unread state, and an optional CTA (deep link to agent action, catalog item, or Hub view)
- Unread count is surfaced as a badge on the Hub and is accessible to the agent on request
- Members can mark messages as read or dismiss them; dismissed messages are archived, not deleted
- The agent can reference inbox messages in conversation — e.g., "You have an unread notification about a reward expiring soon — want me to pull it up?"
- Message delivery is triggered by the Campaign Engine based on program rules, ML-generated triggers, or manual admin actions
- The existing **new token alert webhook** (used by Hub front-ends to notify members when new tokens are available) is consumed by the notifications inbox and the agent as a delivery trigger — when a new token event fires, it generates an inbox message and is available to the agent for proactive surfacing in conversation
- Notification preferences are configurable per member (opt-out of specific message types) and per program (which message types are enabled)

### 7.4 Integration Approach

- Agent calls Hub-connected APIs via the Rewards & Offers Catalog and Reward Redemption tools
- Favorites are written to a shared favorites store accessible by both agent and Hub
- No dual-write or sync delay; both surfaces read from the same underlying data layer
- Hub navigation shortcuts available within the agent UI (e.g., "View all your favorites in the Hub")
- The existing **new token alert webhook** is subscribed to by both the notifications inbox service and the agent — enabling real-time token availability alerts across all surfaces without requiring a new delivery mechanism

---

## 8\. ML Personalization & Optimization

ML is not a feature — it is the intelligence layer running beneath every member interaction and business outcome. Models operate at member, segment, and program levels.

### 8.1 Core ML Capabilities

| Capability                     | Description                                                                                                     |
| :----------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| **Member behavioral modeling** | Continuous model of each member's category affinities, earning patterns, redemption preferences, and churn risk |
| **Recommendation ranking**     | Real-time scoring of catalog items against member model, balanced against program business objectives           |
| **Next best action**           | Predicts the single highest-value action to surface at each session and trigger point                           |
| **Offer targeting**            | Matches program- and merchant-funded offers to highest-propensity member segments                               |
| **Gamification optimization**  | Selects mechanic type, frequency, and timing per member to maximize engagement without fatigue                  |
| **Churn prediction**           | Flags at-risk members for proactive re-engagement campaigns                                                     |
| **LTV optimization**           | Balances short-term redemption revenue against long-term retention value in recommendation scoring              |
| **Cold start**                 | Segment- and vertical-level priors seed recommendations for new members until individual signals accumulate     |
| **Pre-auth signal capture**    | Browse behavior and expressed interest on Activation Link landing pages feed into post-auth personalization     |

### 8.2 Data Inputs

- Transaction and earning history (Points Engine & Ledger)
- Redemption history and catalog interaction signals (including Hub interactions)
- Favorites signals from agent and Hub
- Session behavior (agent interactions, browse patterns, offer clicks)
- Pre-auth landing page behavior (via Activation Link session)
- Identity Lifegraph enrichment (cross-channel behavioral signals)
- Program Connections data (where member has linked external programs)
- Program-level performance benchmarks
- Behavioral event stream (all tagged interaction events across agent, Hub, pre-auth, and external channels)
- Interaction memory summaries (high-signal explicit preference and intent data from past sessions)

### 8.3 Optimization Objectives

ML models are multi-objective, balancing:

- **Member relevance** — predicted affinity and satisfaction
- **Transactional revenue** — redemption GMV and offer revenue
- **Customer LTV** — retention probability and long-term value
- **Program health** — point liability, tier distribution, engagement spread

Program admins can adjust objective weighting through the admin console (see Section 9).

### 8.4 Model Governance

- All ML outputs are observable and auditable in the admin console
- Program admins can inspect recommendation logic and override at the rule level
- A/B testing framework is built in; admins configure experiments and view lift results
- Models are retrained continuously; major version changes require admin review before promotion

---

## 9\. Agent Memory

The agent maintains a persistent memory of each member's sessions, interactions, and events. Memory enables the agent to behave like a knowledgeable, continuous relationship — not a stateless query tool that resets on every visit.

### 9.1 Memory Model

Agent memory operates across three scopes:

| Scope                  | What It Stores                                                                                                           | Retention                                   |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------- | :------------------------------------------ |
| **Session memory**     | Full context of the current conversation: messages, tool calls, intents, state                                           | Duration of session; cleared on session end |
| **Interaction memory** | Summarized record of past sessions: key intents, actions taken, outcomes, unresolved items                               | Configurable per program; default 12 months |
| **Behavioral memory**  | Aggregated signals from events: preferences, category affinities, redemption patterns, gamification responses, favorites | Continuous; feeds ML member model           |

### 9.2 What Memory Enables

**Cross-session continuity** — the agent opens each new session with awareness of where the member left off:

- "Last time you were looking at travel rewards — want to pick up where you left off?"
- "You claimed an offer for \[merchant\] two weeks ago — your points posted on \[date\]"
- "You're still 150 points away from Gold, same as last time — here's the fastest path"

**Preference recall** — expressed preferences and past behavior inform every interaction without the member needing to re-state them:

- Category and merchant preferences surfaced through past browsing and redemptions
- Communication preferences (channel, frequency, tone) observed and respected
- Catalog items previously dismissed are suppressed from future recommendations

**Unresolved intent tracking** — intents that were not completed in a prior session are recognized and re-surfaced appropriately:

- Rewards viewed but not redeemed
- Offers favorited but not claimed
- Questions asked but not fully answered

**Longitudinal personalization** — the ML engine uses interaction memory as a high-signal input alongside raw event data, giving more weight to explicit member expressions (stated preferences, direct requests) than inferred behavioral signals.

### 9.3 Memory Architecture

- Interaction memory is stored as structured summaries generated at session end, not as raw conversation logs
- Summaries capture: primary intents, tools invoked, outcomes, unresolved items, expressed preferences
- Raw conversation transcripts are not retained beyond the active session unless the program explicitly enables transcript storage (subject to member consent and data agreements)
- Memory is member- and program-scoped; no cross-tenant or cross-program memory sharing
- Members can request a summary of what the agent remembers about them via the agent interface
- Memory deletion is supported in compliance with data subject rights (GDPR, CCPA)

### 9.4 Memory Inputs

Memory is populated from multiple sources:

| Source              | Memory Contribution                                                           |
| :------------------ | :---------------------------------------------------------------------------- |
| Agent conversation  | Explicit statements, expressed preferences, questions asked, intents declared |
| Tool call outcomes  | Redemptions completed, offers claimed, balance checks, tier changes           |
| Behavioral events   | Browse history, favorites, gamification interactions, channel engagement      |
| ML behavioral model | Inferred affinities and preferences passed back as soft memory signals        |
| Pre-auth session    | Activation Link browse behavior carried forward on authentication             |

### 9.5 Memory & Privacy

- Memory storage and use is disclosed in program terms of service
- Members can view a plain-language summary of stored memory on request via the agent
- Opt-out of interaction memory is supported; members who opt out receive a stateless experience
- Memory retention periods are configurable per program within platform-defined maximums
- All memory data is subject to the same tenant isolation and PII separation as the event stream

---

## 10\. Behavioral Event Tracking

Every member interaction — across every channel, surface, and session state — generates a tagged, structured event. This event stream is the shared data foundation for analytics, ML training, optimization, A/B testing, and program reporting. Event tracking is not an analytics add-on; it is a core platform capability.

### 10.1 Event Coverage

Events are captured across all interaction types and surfaces:

| Category                | Event Examples                                                                                                                                            |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Session**             | Session start, session end, channel source, auth method, referral source (Activation Link, direct, external LLM)                                          |
| **Onboarding**          | Onboarding started, card viewed, card dismissed, CTA clicked, onboarding completed, step abandoned                                                        |
| **Agent interaction**   | Message sent, intent resolved, intent unresolved, tool invoked, fallback triggered, escalation initiated                                                  |
| **Catalog**             | Search query, category browsed, item viewed, item favorited, item unfavorited, recommendation surfaced, recommendation clicked                            |
| **Offers**              | Offer viewed, offer clicked, offer claimed, offer redeemed, offer expired unclaimed                                                                       |
| **Rewards**             | Reward viewed, reward clicked, reward favorited, reward redeemed, redemption confirmed, redemption failed                                                 |
| **Gamification**        | Milestone surfaced, challenge viewed, challenge joined, challenge completed, streak extended, leaderboard viewed                                          |
| **Pre-auth**            | Activation Link visited, landing page viewed, catalog preview viewed, sign-up CTA clicked, sign-in CTA clicked                                            |
| **Hub**                 | Hub opened from agent, favorite synced, cross-surface redemption initiated                                                                                |
| **Program Connections** | External program linked, external program balance viewed, cross-program recommendation clicked                                                            |
| **Notifications inbox** | Message delivered, message viewed, message read, message dismissed, CTA clicked, notification preference changed, unread count surfaced (by agent or Hub) |

### 10.2 Event Schema

All events share a common schema with standard and contextual attributes:

**Standard attributes (all events):**

- `event_id` — unique identifier
- `event_type` — canonical event name (e.g., `offer.claimed`, `catalog.item_viewed`)
- `timestamp` — UTC
- `session_id` — links events within a session
- `member_id` — authenticated member (null for pre-auth events)
- `program_id` — tenant identifier
- `channel` — surface where event occurred (embedded_ui, email, sms, slack, teams, llm_passthrough, hub)
- `auth_state` — authenticated or pre-auth

**Contextual attributes (event-type specific):**

- Catalog events: `item_id`, `item_type` (reward/offer), `category`, `rank_position`, `recommendation_source` (ml_ranked, merchandised, search)
- Offer/reward events: `offer_id` / `reward_id`, `funding_type` (program/merchant), `points_value`, `redemption_method`
- Agent events: `intent_label`, `tool_called`, `response_latency_ms`, `model_version`
- Gamification events: `mechanic_type`, `challenge_id`, `milestone_label`, `points_delta`
- Session events: `entry_source`, `activation_link_id`, `referral_campaign`
- Notification events: `notification_id`, `message_type` (airdrop, reward_expiration, offer_expiration, earning_confirmation, tier_update, challenge_update, announcement, new_token_alert), `cta_target`, `delivery_trigger` (campaign_engine, ml_trigger, admin_manual, webhook_new_token)

### 10.3 Data Consumers

The event stream feeds multiple downstream systems:

| Consumer                      | Usage                                                                                              |
| :---------------------------- | :------------------------------------------------------------------------------------------------- |
| **ML Personalization Engine** | Behavioral signals for member modeling, recommendation ranking, next best action, churn prediction |
| **Campaign Engine**           | Trigger conditions for proactive messaging and gamification                                        |
| **Admin Reporting**           | Program dashboards, offer performance, agent quality, funnel analytics                             |
| **A/B Testing Framework**     | Exposure and conversion tracking for experiments                                                   |
| **Identity Lifegraph**        | Cross-channel behavioral enrichment                                                                |
| **Program Connections**       | Cross-program behavioral context                                                                   |

### 10.4 Event Governance

- Events are immutable once written; corrections are made via compensating events, not updates
- PII is separated from behavioral data at ingestion; events reference `member_id` only
- Pre-auth events use a session-scoped anonymous ID that is resolved to `member_id` upon authentication
- Programs have access to their own event data only; no cross-tenant event visibility
- Event retention policy is configurable per program (subject to data agreement minimums)
- All event collection is disclosed in program terms; member opt-out applies to marketing use cases, not core platform functions

---

## 11\. Channel Architecture

### 11.1 Embedded UI (Primary)

- White-label chat widget, fully skinnable per program brand
- Deployed via single JS snippet (web) or React Native / WebView SDK (mobile)
- Supports web, iOS, and Android
- Seamless SSO handoff post-authentication

### 11.2 External Channel Integrations

The agent can be securely connected to additional touchpoints:

| Channel                          | Use Case                                                            |
| :------------------------------- | :------------------------------------------------------------------ |
| Email                            | Proactive summaries, offer alerts, onboarding nudges                |
| SMS                              | High-urgency alerts, milestone notifications                        |
| Slack                            | B2B programs (e.g., Yardi dealer/agent networks)                    |
| Microsoft Teams                  | Enterprise-facing programs                                          |
| Gemini / ChatGPT / Claude / Grok | LLM pass-through; member interacts via their preferred AI assistant |

All external channels use the same agent logic, tool access, and ML layer; channel adapters handle formatting and delivery.

---

## 12\. Program Connections

Members can link third-party loyalty program accounts (subject to program owner permissions). The agent provides read-only visibility into linked programs to:

- Surface consolidated point balances across programs
- Highlight earning opportunities across the member's loyalty portfolio
- Feed linked program data into ML behavioral models for richer personalization
- Enable cross-program context in recommendations

Connections require explicit member consent and program-level permission configuration. Write access and cross-program redemption are out of scope for v1.

---

## 13\. Agent Tools

| Tool                            | Function                                                                                            |
| :------------------------------ | :-------------------------------------------------------------------------------------------------- |
| **Points Engine & Ledger**      | Balance lookup, transaction history, point adjustments                                              |
| **Campaign Engine**             | Offer eligibility, challenge status, proactive trigger logic                                        |
| **Authentication**              | Session validation, SSO integration, token management                                               |
| **Identity Lifegraph**          | Cross-channel identity resolution, member profile enrichment                                        |
| **Program Policy & Governance** | Earning rules, expiration logic, tier definitions, compliance guardrails                            |
| **Rewards & Offers Catalog**    | Catalog access, ML-ranked recommendations, redemption eligibility, favorites                        |
| **Reward Redemption**           | End-to-end redemption flow, confirmation, ledger write                                              |
| **Outbound Communications**     | Triggered messaging across email, SMS, Slack, Teams                                                 |
| **Program Connections**         | Read-only access to linked third-party loyalty program data                                         |
| **ML Personalization Engine**   | Member modeling, recommendation scoring, next best action, churn signals                            |
| **Kigo Hub Connector**          | Favorites sync, Hub state reads, cross-surface navigation, notifications inbox access               |
| **Notifications Inbox**         | Inbox message retrieval, unread count, read/dismiss state management, notification preference reads |
| **Activation Link Manager**     | Landing page configuration, link generation, pre-auth session context                               |
| **Event Tracking**              | Structured event capture, tagging, and routing across all surfaces and channels                     |
| **Agent Memory**                | Cross-session interaction memory, preference recall, unresolved intent tracking                     |

The agent orchestrates these tools in response to member intent, with governance rules enforced at the tool layer — not the prompt layer.

---

## 14\. Program & Agent Administration

Program and agent administration is managed through a dedicated admin console accessible to authorized program administrators and Kigo platform operators.

### 14.1 Program Configuration

- Agent name and description (displayed to members in the UI; defaults to "Kigo Agent" with a generic program description)
- Brand and UI settings (logo, colors, font, voice/tone, widget placement)
- Catalog composition: visible rewards/offers, category visibility, featured placement slots
- Policy rules: earning rates, tier thresholds, point expiration rules
- Onboarding content: Stacked experience name (default: "Stacked"), narrative templates, welcome offers, new member orientation flow
- Gamification settings: active mechanics, challenge frequency caps, leaderboard enablement
- Channel enablement: which external channels are active per program
- Notifications inbox: enabled message types, default notification preferences, airdrop approval workflow
- Program Connections: which third-party programs members may link

### 14.2 Activation Link Management

- Activation Links are created and managed through **Kigo Offer Manager in PRO**; the admin console provides visibility and reporting on link performance
- Configure landing page content: hero, featured catalog items, program benefits, CTA copy
- Set link expiration, domain restrictions, and campaign attribution parameters
- Set token usage scope at creation: single-use, session-scoped, or multi-use
- View link performance: visits, sign-ups, conversion to authenticated session

### 14.3 Agent Behavior Configuration

- Tone and persona settings (formal vs. conversational; program-specific voice guidelines)
- Guardrails: topics the agent will and will not engage with per program context
- Fallback behavior: escalation paths, unsupported query handling
- Prompt and response template management for key flows (onboarding, milestone alerts, offers)
- Tool access controls: which tools are enabled per program instance

### 14.4 ML & Optimization Controls

- Objective weighting: adjust balance between member relevance, revenue, and LTV
- Merchandising overrides: pin, boost, or suppress specific catalog items independent of ML ranking
- A/B test management: configure experiments, define control/treatment splits, view lift results
- Model performance dashboard: recommendation CTR, conversion rates, revenue attribution by model version
- Churn alert thresholds: configure when at-risk members trigger re-engagement campaigns

### 14.5 Member Management

- Member search and profile lookup
- Manual point adjustments (with audit trail)
- Tier override and status correction
- Offer and challenge enrollment/removal
- Session and interaction history review

### 14.6 Reporting & Observability

- Program-level engagement dashboard: DAU/MAU, session depth, channel breakdown
- Activation Link funnel: visits → sign-ups → first session → 30-day retention
- Earning and redemption summary: GMV, point liability, redemption rate by category
- Offer performance: impressions, claims, conversions, revenue by offer and segment
- Hub integration health: favorites activity, Hub → agent sessions, cross-surface redemptions
- Notifications inbox: delivery volume, open rate, CTA click-through, message type breakdown, opt-out rate by message type
- ML model health: recommendation coverage, ranking quality, A/B experiment results
- Agent quality: top intents, unresolved queries, fallback rate
- Event stream health: ingestion volume, schema validation errors, consumer lag
- Memory health: summary generation rate, opt-out rate, deletion requests

### 14.7 Platform Operator Controls (Kigo)

- Tenant provisioning and deprovisioning
- Cross-tenant performance benchmarking (anonymized)
- Global model governance: promote/rollback ML model versions across tenants
- System health and tool availability monitoring

---

## 15\. Identity & Security

- Authentication via existing program SSO (SAML 2.0, OAuth 2.0); API key fallback for lighter integrations
- Identity resolution via Identity Lifegraph at session start
- All API communication over TLS 1.2+; JWT session tokens with short expiry and refresh rotation
- Tool calls are server-side only; no credentials or tokens exposed to the client
- Tenant data isolation enforced at the infrastructure layer
- Admin console access is role-based (program admin, Kigo operator); all actions are audit-logged; MFA required
- Activation Link tokens are scoped and time-limited; token usage scope is configured at link creation; pre-auth sessions are sandboxed from authenticated data
- ML training data is tenant-scoped; no cross-tenant model contamination
- PII handling governed by program-level data agreements
- Interaction memory is subject to data subject rights; deletion requests processed within platform SLA

---

## 16\. Out of Scope (v1)

- Cross-program point transfers or redemption
- Agent-initiated outbound campaigns (agent responds to triggers; campaign authoring remains in Campaign Engine UI)
- Voice interface
- Write access to third-party connected programs

---

## 17\. Open Questions

| Question                                                                                                              | Owner                  | Priority |
| :-------------------------------------------------------------------------------------------------------------------- | :--------------------- | :------- |
| Which programs will enable external LLM passthrough at launch?                                                        | Program leads          | High     |
| Consent and data sharing framework for Program Connections                                                            | Legal / Platform       | High     |
| ML objective weighting defaults by vertical (auto vs. equipment vs. home improvement)                                 | Product / Data Science | High     |
| Activation Link: confirm token scope enforcement behavior at edge cases (e.g., multi-use link expiration mid-session) | Platform / Security    | Medium   |
| Admin console access model: self-serve vs. Kigo-assisted for v1?                                                      | Product                | Medium   |
| Gamification mechanic defaults by vertical                                                                            | Product                | Medium   |
| A/B testing framework: build vs. integrate (e.g., Statsig, LaunchDarkly)                                              | Engineering            | Medium   |
| Hub favorites: bidirectional sync or agent-write / Hub-read in v1?                                                    | Platform               | Medium   |
