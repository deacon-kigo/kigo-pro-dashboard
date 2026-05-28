# Loyalty Agent — MLP Scope, Module Breakdown & Delivery Sequence

**Date:** April 8, 2026 · **Source PRD:** v1.9 · **Author:** Ben Straley

---

## 1\. Minimum Lovable Product (MLP) Recommendation

The PRD describes a full-vision product with \~14 agent tools, ML personalization, multi-channel distribution, gamification, cross-program connections, and a comprehensive admin console. Shipping all of it as a monolith would take too long and delay learning. The MLP should instead answer a single strategic question: **can an AI conversational agent meaningfully lift redemption rates and session engagement for an enterprise loyalty program?**

### MLP Scope: What's In

| Area                                        | MLP Scope                                                                                                                                                   | Why It's Essential                                                                                                                                                  |
| :------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Embedded UI (web widget)**                | White-label chat widget deployed via JS snippet; program branding (logo, colors, name)                                                                      | This is the primary surface — no agent without a front door                                                                                                         |
| **Authentication**                          | SSO handoff (OAuth 2.0 / SAML 2.0) with JWT session management                                                                                              | Every transactional feature requires identity                                                                                                                       |
| **Core conversational agent**               | Natural language \+ tappable prompts for balance check, transaction history, catalog browse, reward/offer redemption, tier status, policy Q\&A              | These are the table-stakes loyalty actions members expect                                                                                                           |
| **Rewards & Offers Catalog**                | Catalog access with category/keyword browse and basic personalized ranking                                                                                  | Members need to find and redeem things — the core value loop                                                                                                        |
| **Reward & Offer Redemption \+ Earning**    | End-to-end redemption flow with confirmation and ledger write; points earning through affiliate, CLO, and transaction verification (KigoVerify) offer types | Redemption is the revenue event and earning-eligible offers (affiliate, CLO, KigoVerify) close the full engagement loop — members need to see points flow both ways |
| **Kigo Hub sync**                           | Bidirectional favorites; redemption state shared with Hub                                                                                                   | Programs already have Hub users — the agent can't create a parallel universe                                                                                        |
| **Points Engine & Ledger**                  | Balance lookup, transaction history, point posting confirmation                                                                                             | Members will ask "how many points do I have" in their first session                                                                                                 |
| **Session memory**                          | Full in-session context (not cross-session yet)                                                                                                             | Conversational coherence within a single visit                                                                                                                      |
| **Behavioral event tracking (core schema)** | Session, agent interaction, catalog, offer/reward events with the standard schema                                                                           | Without events from day one, ML has no training data and reporting is blind                                                                                         |
| **Basic admin console**                     | Program config (brand, catalog scope, policy rules, agent name/tone), member lookup, engagement dashboard                                                   | Operators need self-serve control to launch and monitor                                                                                                             |
| **Identity resolution**                     | Identity Lifegraph integration at session start                                                                                                             | Required for personalization and Hub sync                                                                                                                           |
| **Security baseline**                       | TLS 1.2+, JWT tokens, tenant isolation, server-side tool calls, MFA on admin                                                                                | Non-negotiable for enterprise clients                                                                                                                               |

### MLP Scope: What's Out (and why it's safe to defer)

| Deferred Feature                                                 | Rationale                                                                                                                                                                             |
| :--------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pre-auth experience / Activation Links**                       | Valuable for acquisition, but the MLP question is about authenticated member engagement. Add once the core loop proves out.                                                           |
| **Stacked onboarding**                                           | A "wow" moment, but depends on mature ML profiles. New members get a simplified orientation in MLP; Stacked layers on once behavioral data accumulates.                               |
| **Cross-session interaction memory**                             | High-value but architecturally complex (structured session summaries, retention policy, privacy controls). Session memory covers the MLP; interaction memory is Sprint 2\.            |
| **ML personalization engine (full)**                             | MLP uses rule-based ranking (recency, category affinity from transaction history, program merchandising rules). The ML engine trains on MLP event data and ships in the next phase.   |
| **Gamification layer**                                           | Progress bars and milestone alerts can be added once the base engagement pattern is established. Shipping gamification without behavioral data to optimize it risks annoying members. |
| **External channels (SMS, Slack, Teams, email)**                 | Each channel adapter is incremental. The embedded widget is the primary channel; external channels expand reach after product-market fit.                                             |
| **LLM passthrough**                                              | Depends on external channel architecture and unresolved open questions about which programs opt in.                                                                                   |
| **Program Connections**                                          | Read-only third-party program linking — blocked by legal/consent framework (flagged as high-priority open question).                                                                  |
| **A/B testing framework**                                        | Build-vs-buy decision is unresolved. Manual experiment tracking is sufficient for MLP.                                                                                                |
| **Advanced admin (ML controls, churn alerts, model governance)** | These controls have no purpose until the ML engine is live.                                                                                                                           |

### MLP Success Criteria

The MLP should be evaluated against a tight set of metrics that directly test the core hypothesis:

- **Onboarding completion rate \> 60%** (relaxed from 70% given simplified onboarding)
- **Redemption rate lift vs. Hub-only baseline** (target: \+15% within 60 days)
- **Session depth \> 3 interactions/session** (members are using the conversational interface, not bouncing)
- **Time to first redemption via agent \< 2 sessions**
- **\< 5 business day launch** for the first program (validates fast-integration promise)

---

## 2\. Core Functional Modules

The system decomposes into 10 modules. Each module is classified as **Build New** (net-new capability for the Loyalty Agent), **Extend** (existing Kigo platform capability that needs an agent-specific integration layer or API surface), or **Reuse** (existing Kigo platform capability consumed as-is through existing APIs). The default posture is reuse — we build new only when the agent introduces functionality that doesn't exist elsewhere in the Kigo portfolio (Marketplace, Hub, PRO).

| Module                          | Classification | Rationale                                                                                                                                                    |
| :------------------------------ | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1\. Conversational Agent Core   | **Build New**  | Net-new capability — no existing conversational orchestration layer in the portfolio                                                                         |
| 2\. Authentication & Identity   | **Extend**     | SSO connectors and Identity Lifegraph exist; agent needs a session management layer and auth handoff flow on top                                             |
| 3\. Catalog & Discovery         | **Extend**     | Rewards & Offers Catalog exists across Marketplace/Hub; agent needs a conversational query interface and recommendation ranking layer                        |
| 4\. Redemption & Earning Engine | **Extend**     | Redemption, affiliate, CLO, and KigoVerify flows exist in Marketplace/Hub/PRO; agent needs tool wrappers for conversational execution and confirmation       |
| 5\. Points Engine & Ledger      | **Reuse**      | Existing platform service — agent consumes via existing APIs for balance, history, and ledger operations                                                     |
| 6\. Kigo Hub Connector          | **Extend**     | Hub exists; agent needs a sync layer for favorites and cross-surface state awareness                                                                         |
| 7\. Behavioral Event Tracking   | **Extend**     | Event infrastructure exists; agent introduces new event types, the agent-specific schema, and new capture points                                             |
| 8\. Admin Console               | **Extend**     | PRO admin tooling exists; agent-specific config (tone, persona, guardrails, tool access, onboarding content) is new surface area within the existing console |
| 9\. Embedded UI (Widget)        | **Build New**  | Net-new conversational widget — no existing chat UI in the portfolio                                                                                         |
| 10\. ML Personalization Engine  | **Build New**  | Net-new ML capability — recommendation scoring, behavioral modeling, and optimization don't exist as a shared service today                                  |

### Module 1: Conversational Agent Core · Build New

**Responsibility:** Orchestrate member intent through natural language, route to the correct tool, maintain session context, enforce governance guardrails.

- Intent recognition and routing
- Session context management (conversation state, tool call history)
- Tappable prompt generation (quick-action UI elements)
- Governance layer (topic guardrails, fallback behavior, escalation paths)
- Prompt/response template engine (configurable per program)
- Agent persona and tone application

**Key interfaces:** Calls all tool modules; receives config from Admin module; emits events to Event Tracking.

### Module 2: Authentication & Identity · Extend

**Responsibility:** Establish trusted member identity at session start; manage session lifecycle.

**Reuse from platform:** SSO connectors (OAuth 2.0 / SAML 2.0), Identity Lifegraph resolution, API key authentication.

**Build for agent:** Agent-specific session token management (JWT issuance/validation/refresh for the widget context), pre-auth → post-auth session handoff (carrying forward browse context into authenticated session).

**Key interfaces:** Gates access for all transactional modules; provides member_id to Event Tracking.

### Module 3: Catalog & Discovery · Extend

**Responsibility:** Surface rewards and offers to members through browse, search, and recommendations.

**Reuse from platform:** Kigo Rewards & Offers Catalog (inventory, eligibility, program-scoped configuration), category taxonomy, merchandising rules.

**Build for agent:** Conversational query interface over the catalog, keyword search with agent-context ranking, recommendation engine interface (rule-based in MLP; ML-ranked in Phase 2), favorites write path synced with Hub.

**Key interfaces:** Reads from Kigo Rewards & Offers inventory; feeds Redemption module; reads ranking from ML module (when live); writes favorites to Hub Connector.

### Module 4: Redemption & Earning Engine · Extend

**Responsibility:** Execute end-to-end reward/offer redemption and points earning with transactional integrity. This module handles both the "points out" (redemption) and "points in" (earning) sides of offer engagement.

**Reuse from platform:** Reward redemption flows (Marketplace/Hub), offer claim and redemption flows, affiliate offer processing, CLO infrastructure, KigoVerify transaction verification, Points Engine ledger write APIs.

**Build for agent:** Conversational tool wrappers that translate agent intent into existing redemption/earning API calls, agent-native confirmation and failure UX, session-context-aware eligibility surfacing.

**Key interfaces:** Reads eligibility from Catalog; writes to Points Engine & Ledger (both deductions and credits); emits redemption and earning events; updates Hub state; integrates with KigoVerify for transaction verification.

### Module 5: Points Engine & Ledger · Reuse

**Responsibility:** Source of truth for member point balances, earning, and transaction history.

**Reuse from platform (as-is):** Balance lookup, transaction history retrieval, point posting (earning events), point deduction (redemption events), tier status calculation and progress. All consumed via existing Kigo platform APIs — no agent-specific modifications required.

**Key interfaces:** Read by Agent Core (balance checks), Redemption & Earning Engine (deductions and credits), Catalog (eligibility); emits events.

### Module 6: Kigo Hub Connector · Extend

**Responsibility:** Maintain consistency between the agent and the existing Kigo Hub.

**Reuse from platform:** Hub data layer (favorites store, redemption state, transaction history).

**Build for agent:** Agent read/write path to the shared favorites store, cross-surface state sync (so actions in the agent reflect immediately in Hub and vice versa), Hub navigation shortcuts within the agent UI.

**Key interfaces:** Bidirectional with Catalog (favorites), Redemption & Earning Engine (state), Points Engine (balance consistency).

### Module 7: Behavioral Event Tracking · Extend

**Responsibility:** Capture, structure, and route every member interaction as a tagged event.

**Reuse from platform:** Event ingestion infrastructure, storage, PII separation patterns (if existing across Marketplace/Hub).

**Build for agent:** Agent-specific event types and schema (session, agent interaction, onboarding, gamification events), client-side and server-side capture SDK for the widget, contextual attribute enrichment, pre-auth anonymous ID → member_id resolution, routing to new downstream consumers (ML pipeline, agent-specific reporting).

**Key interfaces:** Receives events from every module; feeds Admin Reporting, future ML Engine, future Campaign Engine.

### Module 8: Admin Console · Extend

**Responsibility:** Program configuration, member management, and operational observability for program administrators.

**Reuse from platform:** PRO admin console shell (authentication, RBAC, audit logging), member search and profile lookup, manual point adjustments, offer/challenge management.

**Build for agent:** Agent-specific configuration surfaces — agent name/tone/persona, governance guardrails, tool access controls, onboarding content management, agent engagement dashboard (DAU/MAU, session depth, intent analytics), event stream health monitoring.

**Key interfaces:** Writes config consumed by Agent Core, Catalog, Redemption; reads from Event Tracking for reporting.

### Module 9: Embedded UI (Widget) · Build New

**Responsibility:** The member-facing chat interface deployed on program web properties and apps.

- White-label chat widget (JS snippet for web; React Native / WebView SDK for mobile)
- Program brand skinning (logo, colors, font, widget placement)
- Tappable prompt rendering
- Rich content display (catalog cards, progress bars, confirmations)
- SSO handoff integration
- Responsive design across web, iOS, Android

**Key interfaces:** Renders output from Agent Core; captures input routed to Agent Core; triggers Auth module for SSO.

### Module 10: ML Personalization Engine · Build New (Phase 2\)

**Responsibility:** Member modeling, recommendation ranking, next-best-action prediction, and optimization.

- Member behavioral model (category affinity, redemption patterns, churn risk)
- Recommendation scoring (multi-objective: relevance × revenue × LTV)
- Next-best-action prediction
- Offer targeting (propensity-based segment matching)
- Cold-start logic (segment/vertical priors for new members)
- Gamification optimization (mechanic selection, timing, frequency)
- Model training pipeline (continuous, tenant-scoped)
- Model governance (versioning, A/B testing, admin review)

**Key interfaces:** Reads from Event Tracking (training data) and Interaction Memory; writes scores consumed by Catalog and Agent Core; controlled via Admin Console.

---

## 3\. Design & Development Sequence

The sequence is organized into four phases. Each phase delivers a shippable increment and lays the foundation the next phase builds on. Design leads development by one phase — while engineers build Phase N, designers work on Phase N+1.

### Phase 0: Foundation

**Goal:** Infrastructure, contracts, and scaffolding. Nothing user-facing ships, but everything that follows depends on this.

| Stream                       | Work                                                                                                          |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **Architecture**             | Tenant isolation model, API gateway setup, service scaffolding for Agent Core, event pipeline                 |
| **Auth & Identity**          | SSO connector framework (OAuth 2.0 \+ SAML 2.0), JWT issuance/validation, Identity Lifegraph integration      |
| **Event Tracking**           | Event schema definition, ingestion pipeline, storage, PII separation layer                                    |
| **Admin Console (scaffold)** | Tenant provisioning, program config data model, role-based access, MFA                                        |
| **Design (Phase 1 ahead)**   | Widget UX (conversation patterns, tappable prompts, catalog cards, redemption flow), admin console wireframes |

**Exit criteria:** A program can be provisioned, an SSO login completes, events can be written and read, admin can set program config.

---

### Phase 1: Core Agent \+ Embedded Widget

**Goal:** A member can log in, talk to the agent, browse the catalog, redeem a reward, and check their balance — all through the embedded widget. This is the MLP.

| Stream                     | Work                                                                                                      |
| :------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **Agent Core**             | Intent routing, session context, tool orchestration, governance guardrails, prompt templates              |
| **Embedded UI**            | White-label widget (web JS snippet), brand skinning, chat rendering, tappable prompts, rich catalog cards |
| **Catalog & Discovery**    | Catalog data access, keyword search, category browse, rule-based ranking, favorites                       |
| **Redemption Engine**      | Reward \+ offer redemption flows, eligibility checks, ledger writes, confirmation UX                      |
| **Points Engine**          | Balance lookup, transaction history, tier status                                                          |
| **Hub Connector**          | Shared favorites store, redemption state sync                                                             |
| **Admin Console (v1)**     | Brand config, catalog scope, policy rules, agent tone, member lookup, basic engagement dashboard          |
| **Design (Phase 2 ahead)** | Stacked onboarding experience, cross-session memory UX, pre-auth landing page, gamification mechanics     |

**Exit criteria:** First program live on production; member can complete a full earn-browse-redeem loop via the widget; events flowing to pipeline; admin can configure and monitor.

**Target: \< 5 business days from Phase 1 complete to second program launch** (validates fast-integration model).

---

### Phase 2: Memory, Onboarding & Personalization Foundation

**Goal:** The agent becomes persistent and personal. Members experience continuity across sessions. ML begins training on accumulated event data. Stacked onboarding goes live.

| Stream                     | Work                                                                                                                                    |
| :------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Interaction Memory**     | Session summary generation, structured storage, preference recall, unresolved intent tracking, privacy controls (view, opt-out, delete) |
| **Stacked Onboarding**     | Animated card sequence / conversational recap, ML-generated headlines, new-member orientation, configurable experience name             |
| **ML Engine (v1)**         | Member behavioral model training on event data, recommendation scoring (replace rule-based), cold-start logic, model versioning         |
| **Gamification (basic)**   | Progress bars (tier advancement), milestone alerts, earning nudges — triggered by rule engine initially, ML-optimized later             |
| **Admin Console (v2)**     | Memory health dashboard, onboarding content config, ML model performance dashboard, gamification settings                               |
| **Design (Phase 3 ahead)** | Pre-auth landing pages, Activation Link flows, external channel UX (email/SMS templates, Slack/Teams adapters), advanced admin controls |

**Exit criteria:** Returning members experience contextual continuity ("Last time you were looking at…"); Stacked onboarding live for at least one program; ML-ranked recommendations replacing rule-based; gamification mechanics active.

---

### Phase 3: Reach & Scale

**Goal:** Expand the agent's surface area beyond the authenticated embedded widget. Pre-auth acquisition, external channels, and advanced optimization.

| Stream                          | Work                                                                                                                                                                                                            |
| :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pre-Auth / Activation Links** | Landing page framework (configurable hero, catalog preview, program benefits, CTA), link generation in Offer Manager PRO, token scoping (single-use, session, multi-use), pre-auth → post-auth session bridging |
| **External Channels**           | Channel adapter framework, email (proactive summaries, offer alerts), SMS (milestone notifications), Slack \+ Teams (B2B programs)                                                                              |
| **ML Engine (v2)**              | Next-best-action model, offer targeting (propensity scoring), churn prediction, gamification optimization, LTV balancing                                                                                        |
| **A/B Testing Framework**       | Experiment configuration, control/treatment splits, exposure tracking, lift reporting (build or integrate based on resolved open question)                                                                      |
| **Program Connections**         | Third-party program linking (read-only), consolidated balance view, cross-program context in recommendations (pending legal framework)                                                                          |
| **Admin Console (v3)**          | Activation Link reporting, ML objective weighting controls, A/B test management, churn alert thresholds, cross-channel reporting                                                                                |
| **LLM Passthrough**             | MCP/API integration for Gemini, ChatGPT, Claude, Grok access (pending program opt-in decisions)                                                                                                                 |

**Exit criteria:** Pre-auth landing pages driving sign-up conversion; at least one external channel live; ML churn prediction triggering re-engagement; A/B tests running.

---

### Sequencing Rationale

The phasing is driven by three principles:

**1\. Event data compounds.** The event tracking pipeline ships in Phase 0 and captures data from the very first member session. By the time the ML engine arrives in Phase 2, it has 6–10 weeks of behavioral data to train on. Delaying events to Phase 2 would mean ML launches cold.

**2\. Authenticated value before unauthenticated reach.** Pre-auth and external channels are acquisition multipliers — but they multiply the value of what's already working. Shipping them before the core redemption loop is proven risks scaling a mediocre experience.

**3\. Design stays one phase ahead.** While engineers build Phase 1 (core agent \+ widget), designers finalize Phase 2 (memory, onboarding, gamification). This eliminates the design-to-dev handoff bottleneck and gives design time to validate patterns with users before engineering commits.

---

### Risk Watchlist

| Risk                                                                           | Mitigation                                                                                                                 |
| :----------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| SSO integration variability across 6 programs                                  | Pre-built connectors for common IdPs; budget extra time for first 2 integrations; standardize on OAuth 2.0 as primary path |
| Identity Lifegraph readiness                                                   | Confirm Lifegraph API stability in Phase 0; define fallback if Lifegraph is delayed (direct member profile lookup)         |
| Hub favorites sync — bidirectional vs. agent-write/Hub-read (open question)    | Design for bidirectional from Phase 1; if Hub team can't support it, ship agent-write/Hub-read and upgrade later           |
| ML cold-start quality                                                          | Rule-based ranking in Phase 1 is the fallback; ML in Phase 2 must demonstrably outperform rules before promotion           |
| Legal/consent framework for Program Connections (open question, high priority) | Phase 3 dependency; if unresolved by Week 14, Program Connections slips to a Phase 4                                       |
| Admin console: self-serve vs. Kigo-assisted (open question)                    | Build for self-serve from Phase 1; offer white-glove onboarding as a service layer, not a product constraint               |
