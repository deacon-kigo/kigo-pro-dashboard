# Chart Components

This directory contains various chart components used throughout the Kigo Pro Dashboard application.

## Coverage Charts

The coverage charts are designed to visualize filter coverage statistics:

### CoverageBarChart

A horizontal bar chart for visualizing coverage data by regions, showing both the count and percentage.

### CoverageDonutChart

A donut chart for visualizing overall coverage percentage with color-coded feedback (green, yellow, or red).

### CategoryPieChart

A pie chart for visualizing category distribution with customizable legend.

### CoverageMapChart

A map-based visualization for geographic data. This component displays US states as circles with varying intensities of color based on the coverage percentage. States are grouped by region according to the data provided.

#### Usage:

```tsx
import { CoverageMapChart } from "@/components/molecules/charts/coverage-charts";

// Example data
const geographicData = [
  { name: "New York", count: 1200, percentage: 35 },
  { name: "Los Angeles", count: 800, percentage: 25 },
  // ...more regions
];

// Component usage
<CoverageMapChart
  data={geographicData}
  type="DMA" // Can be "DMA", "State", or "City"
  height={220} // Optional height
/>;
```

#### Features:

- Interactive tooltips showing region data when hovering over states
- Color intensity corresponds to coverage percentage
- Legend explaining the color scale
- Support for different types of geographic data (DMA, State, City)
- Responsive design that works in different container sizes

## Integration with FilterCoveragePanel

The FilterCoveragePanel component allows toggling between different visualizations (bar chart, donut chart, and map) for geographic data. Users can cycle through these visualizations to get different perspectives on the same data.
