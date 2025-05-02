"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChartContainer as Chart } from "@/components/ui/chart";
import { Tooltip } from "@/components/atoms/Tooltip";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

// US map topojson
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// The component accepts the same data format as other coverage charts
interface CoverageMapChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  type?: "DMA" | "State" | "City";
  className?: string;
  height?: number;
}

// Map US regions to states for visualization
const regionToStates: Record<string, string[]> = {
  "New York": ["NY"],
  "Los Angeles": ["CA"],
  Chicago: ["IL"],
  Philadelphia: ["PA"],
  "Dallas-Ft. Worth": ["TX"],
  "San Francisco": ["CA"],
  Boston: ["MA"],
  Atlanta: ["GA"],
  "Washington, DC": ["DC", "MD", "VA"],
  Houston: ["TX"],
  Midwest: [
    "ND",
    "SD",
    "NE",
    "KS",
    "MN",
    "IA",
    "MO",
    "WI",
    "IL",
    "IN",
    "MI",
    "OH",
  ],
  Northeast: ["ME", "NH", "VT", "MA", "RI", "CT", "NY", "NJ", "PA"],
  Southeast: [
    "DE",
    "MD",
    "VA",
    "WV",
    "KY",
    "NC",
    "SC",
    "TN",
    "GA",
    "FL",
    "AL",
    "MS",
    "AR",
    "LA",
  ],
  Southwest: ["TX", "OK", "NM", "AZ"],
  West: ["CO", "WY", "MT", "ID", "WA", "OR", "NV", "CA", "AK", "HI", "UT"],
};

// DMA coordinates for markers
const dmaCenters: Record<string, [number, number]> = {
  "New York": [-74.006, 40.7128],
  "Los Angeles": [-118.2437, 34.0522],
  Chicago: [-87.6298, 41.8781],
  Philadelphia: [-75.1652, 39.9526],
  "Dallas-Ft. Worth": [-96.797, 32.7767],
  "San Francisco": [-122.4194, 37.7749],
  Boston: [-71.0589, 42.3601],
  Atlanta: [-84.388, 33.749],
  "Washington, DC": [-77.0369, 38.9072],
  Houston: [-95.3698, 29.7604],
};

export function CoverageMapChart({
  data,
  type = "DMA",
  className,
  height = 300,
  ...props
}: CoverageMapChartProps) {
  // Find the maximum percentage for normalization
  const maxPercentage = Math.max(...data.map((item) => item.percentage), 1);

  // Create a color scale from light to dark blue
  const getColorForPercentage = (percentage: number) => {
    const intensity = Math.max(0.2, Math.min(0.9, percentage / maxPercentage));
    return `hsla(216, 85%, 60%, ${intensity})`;
  };

  // Build a map of states to their color intensity based on data
  const stateColorMap: Record<string, string> = {};
  data.forEach((region) => {
    const states = regionToStates[region.name] || [];
    states.forEach((state) => {
      // If a state appears in multiple regions, take the higher percentage
      const currentPercentage = stateColorMap[state]
        ? parseFloat(stateColorMap[state].split(",")[3])
        : 0;

      if (
        !stateColorMap[state] ||
        region.percentage / maxPercentage > currentPercentage
      ) {
        stateColorMap[state] = getColorForPercentage(region.percentage);
      }
    });
  });

  // Chart configuration
  const chartConfig = {
    region: {
      theme: {
        light: "hsla(216, 85%, 60%, 0.9)",
        dark: "hsla(216, 85%, 60%, 0.9)",
      },
      label: `Offers by ${type}`,
    },
  };

  // Get tooltip content for a state
  const getStateTooltip = (stateCode: string) => {
    const matchingRegions = data.filter((region) =>
      (regionToStates[region.name] || []).includes(stateCode)
    );

    if (matchingRegions.length === 0) return "No data";

    return matchingRegions
      .map(
        (region) =>
          `${region.name}: ${region.count.toLocaleString()} offers (${region.percentage}%)`
      )
      .join("\n");
  };

  // Check if we have DMA data
  const dmaMarkers = data
    .filter((region) => dmaCenters[region.name])
    .map((region) => ({
      name: region.name,
      coordinates: dmaCenters[region.name],
      count: region.count,
      percentage: region.percentage,
      radius: 5 + (region.percentage / maxPercentage) * 10, // Scale marker radius by percentage
    }));

  return (
    <div
      className={cn("w-full overflow-hidden rounded-lg", className)}
      style={{ height }}
      {...props}
    >
      <Chart config={chartConfig}>
        <div className="relative w-full h-full">
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{
              scale: 950,
            }}
          >
            <ZoomableGroup center={[-97, 40]}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateCode = geo.properties.iso_3166_2;
                    return (
                      <Tooltip
                        key={geo.rsmKey}
                        content={getStateTooltip(stateCode)}
                      >
                        <g>
                          <Geography
                            geography={geo}
                            fill={
                              stateColorMap[stateCode] || "rgb(229, 231, 235)"
                            }
                            stroke="#ffffff"
                            strokeWidth={0.5}
                            className="outline-none transition-all duration-300 hover:stroke-blue-500 hover:stroke-[1.5px]"
                          />
                        </g>
                      </Tooltip>
                    );
                  })
                }
              </Geographies>

              {/* Add DMA markers */}
              {dmaMarkers.map(({ name, coordinates, radius }) => (
                <Marker key={name} coordinates={coordinates}>
                  <circle
                    r={radius}
                    fill="rgba(30, 64, 175, 0.7)"
                    stroke="#fff"
                    strokeWidth={1}
                    className="animate-pulse"
                  />
                  <text
                    textAnchor="middle"
                    y={radius + 10}
                    style={{
                      fontFamily: "system-ui",
                      fill: "#1e40af",
                      fontSize: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    {name}
                  </text>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Legend */}
          <div className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-md text-xs flex flex-col gap-1 border border-gray-200">
            <div className="font-medium">{type} Coverage</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <span>No data</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "hsla(216, 85%, 60%, 0.3)" }}
              ></div>
              <span>Low coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "hsla(216, 85%, 60%, 0.9)" }}
              ></div>
              <span>High coverage</span>
            </div>

            {dmaMarkers.length > 0 && (
              <div className="flex items-center gap-2 mt-1 pt-1 border-t border-gray-200">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                <span>DMA centers</span>
              </div>
            )}
          </div>
        </div>
      </Chart>
    </div>
  );
}
