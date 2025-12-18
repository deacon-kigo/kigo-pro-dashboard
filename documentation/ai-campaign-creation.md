# Kigo Pro AI Campaign Creation Feature

## Overview

This document outlines the requirements for the AI-assisted campaign creation feature in Kigo Pro. The feature provides a guided workflow for Advertiser Admins to create and manage promotional campaigns.

## Key Updates from Refinement Sessions

1. Campaign creation and ad configuration will be separate processes
2. Multiple ads can be associated with a single campaign
3. Merchant ID and Offer ID selection should be part of the Ad flow, not Campaign Creation
4. Campaign Type selection will be available (only "Advertising" in V1)
5. Simplified targeting approach without geographic or demographic targeting in V1

## User Persona

- **Advertiser Admin**: Responsible for creating and managing advertising campaigns

## Feature Structure

The campaign creation process has three main components:

1. **Campaign Setup** - Core campaign parameters
2. **Ad Configuration** - Create ads that can be linked to campaigns
3. **Campaign-Ad Linking** - Associate ads with campaigns

## Campaign Setup Flow

### Step 1: Basic Information

- Campaign Name (required)
  - Text field, max 50 characters
  - Supports letters, symbols, and characters

- Campaign Description (optional)
  - Text field, max 100 characters
  - Supports letters, symbols, and characters

- Campaign Type (required)
  - Dropdown, only "Advertising" available in V1

### Step 2: Targeting

- No targeting options in V1

### Step 3: Distribution

- Channels/Editions
  - All selected by default

- Programs
  - List from Kigo Core Server
  - Multiple selection

### Step 4: Budget

- Max budget allocation (required)
  - Currency field (USD)

### Step 5: Review & Publish

- Summary of campaign details
- Options:
  - Publish Campaign
  - Save as Draft
  - Go Back to Edit

## Ad Configuration Flow

### Step 1: Merchant & Offer Selection

- Merchant ID (required)
  - Input field

- Merchant Name
  - Auto-populated based on Merchant ID (DBA Name)

- Offer ID (required)
  - Dropdown selection
  - Format: mcm_offer_id - offer_short_text

### Step 2: Media & Creative

- Media type selection (required)
  - Multiple options: display banner, double decker, native, etc.
  - Multiple selections allowed

- Media upload (required)
  - Must follow Kigo Banner Guide specifications
  - Different sizes required for different devices
  - Must be IAB compliant

### Step 3: Performance Parameters

- Cost per activation
  - Currency field (USD)

- Cost per redemption
  - Currency field (USD)

### Step 4: Review & Save

- Summary of ad details
- Save option

## Campaign-Ad Linking

- Interface to associate existing ads with campaigns
- Ability to remove ads from campaigns

## Validation Rules

- Campaign name and description must not contain prohibited characters
- Start date must be today or in the future
- End date must be after start date (minimum 1-day duration)
- Media uploads must comply with Kigo Banner Guide specifications
- Each selected media type requires at least one media upload

## Error Messages

- Media upload issues: "Sorry, we could not upload the file. Please check its format and size."
- Missing mandatory fields: "Sorry we could not save the changes. Please check mandatory fields."
- General save errors: "Sorry, we could not save your changes. Please try again."

## AI Agent Integration

### Guided Workflow

- Step-by-step guidance through the campaign creation process
- Clear instructions at each stage
- Contextual help based on user selections

### Smart Suggestions

- Recommend next steps during each stage
- Provide budget recommendations based on campaign type
- Suggest media types based on campaign goals

### Customization Assistance

- Help users understand available customization options
- Explain the impact of different selections
- Offer alternatives when users encounter limitations

### Fallback to Manual Process

- If AI-assisted flow encounters issues, seamlessly transition to manual process
- Preserve user inputs when switching to manual mode
- Provide clear explanation of why the transition occurred

## Design Guidelines

### Layout & Structure

- Design for desktop implementation with responsive capabilities
- Follow Kigo library style guidelines
- Use progressive disclosure to manage complexity
- Provide clear step indicators and navigation

### Visual Elements

- Use consistent form elements and styling
- Include help text for complex fields
- Provide visual feedback for validation results
- Include preview capabilities for media assets

### AI Interface

- Design conversational UI elements for AI interaction
- Create clear visual distinction between AI suggestions and user inputs
- Include opt-out option for users who prefer manual flow

## Technical Considerations

### Data Sources

- Merchant data retrieved from MCM based on Merchant ID
- Program and Program Campaign data retrieved from Kigo Core Server
- Offer data retrieved based on Merchant ID

### Integration Points

- Kigo Core Server for program data
- MCM for merchant and offer data
- Media asset validation and storage system
