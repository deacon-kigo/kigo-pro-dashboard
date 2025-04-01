# Kigo Pro Dashboard Demos

## Overview

This directory contains documentation and specifications for the various demos that can be run in the Kigo Pro Dashboard. The demo system is designed to be flexible and extensible, allowing for quick creation of new demo scenarios and client configurations.

## Demo System

The Kigo Pro Dashboard uses a sophisticated demo system that allows users to:

1. **Switch between user roles**: Merchant, Support, Admin
2. **Select different clients**: Deacon's Pizza, CVS, etc.
3. **Navigate through scenarios**: AI Campaign Creation, Support Flow, etc.
4. **Toggle theme modes**: Light or Dark

For technical details about the demo system architecture, see [../features/demo-architecture.md](../features/demo-architecture.md).

## Accessing Demo Controls

There are two ways to access and control demo settings:

1. **Demo Spotlight**: Press `⌘+K` (Command+K) to open the spotlight search interface, which allows quick filtering and switching between demo instances.

2. **Demo Settings Panel**: Click the gear icon in the bottom right corner of the screen to open the traditional settings panel.

## Available Demos

### Merchant Demos

- **[Deacon's Pizza AI Campaign Creation](./merchant-deacon-pizza-demo.md)**: Showcases the AI-assisted campaign creation flow for a local pizza restaurant.

### Support Demos

- *Coming soon*

### Admin Demos

- *Coming soon*

## Creating New Demos

To create a new demo:

1. **Update Config**: Add your client and/or scenario to `config/demoConfigs.ts`
2. **Create Documentation**: Add a new markdown file in this directory explaining the demo
3. **Implement Components**: Create any necessary components or flows
4. **Test**: Ensure your demo works across different devices and browsers

See the [Demo Architecture documentation](../features/demo-architecture.md) for more technical details on extending the demo system.

## URL Sharing

Demo instances can be shared via URLs with query parameters:

```
/dashboard?role=merchant&client=deacons-pizza&scenario=campaign-creation&theme=dark
```

This makes it easy to direct someone to a specific demo configuration.

## Best Practices

1. **Document thoroughly**: Each demo should have detailed documentation explaining the scenario, user journey, and technical implementation.

2. **Use realistic data**: Make demos as realistic as possible with plausible data and scenarios.

3. **Design for clarity**: Demos should clearly illustrate the product features and benefits.

4. **Cross-reference features**: Link demos to relevant features and technical implementations.

5. **Keep updated**: Update demos when product features or designs change. 