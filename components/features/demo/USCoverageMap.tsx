"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-110m.json";

// Coverage data with direct hex colors
const stateColors: { [key: string]: string } = {
  // High coverage states (90%+) - Green
  California: "#10b981",
  Texas: "#10b981",
  "New York": "#10b981",
  Illinois: "#10b981",
  Florida: "#059669",

  // Good coverage states (85%+) - Blue
  Pennsylvania: "#3b82f6",
  Ohio: "#2563eb",
  Georgia: "#3b82f6",
  "North Carolina": "#2563eb",
  Michigan: "#3b82f6",
  Virginia: "#2563eb",
  Washington: "#3b82f6",
  Arizona: "#2563eb",
  Massachusetts: "#3b82f6",
  Tennessee: "#2563eb",
  Indiana: "#3b82f6",
  Missouri: "#2563eb",
  Maryland: "#3b82f6",
  Wisconsin: "#2563eb",
  Colorado: "#3b82f6",
  Minnesota: "#2563eb",

  // Standard coverage states - Light Blue
  Alabama: "#93c5fd",
  Arkansas: "#bfdbfe",
  Connecticut: "#93c5fd",
  Delaware: "#bfdbfe",
  Iowa: "#93c5fd",
  Kansas: "#bfdbfe",
  Kentucky: "#93c5fd",
  Louisiana: "#bfdbfe",
  Maine: "#93c5fd",
  Mississippi: "#bfdbfe",
  Montana: "#93c5fd",
  Nebraska: "#bfdbfe",
  Nevada: "#93c5fd",
  "New Hampshire": "#bfdbfe",
  "New Jersey": "#93c5fd",
  "New Mexico": "#bfdbfe",
  "North Dakota": "#93c5fd",
  Oklahoma: "#bfdbfe",
  Oregon: "#93c5fd",
  "Rhode Island": "#bfdbfe",
  "South Carolina": "#93c5fd",
  "South Dakota": "#bfdbfe",
  Utah: "#93c5fd",
  Vermont: "#bfdbfe",
  "West Virginia": "#93c5fd",
  Wyoming: "#bfdbfe",

  // Special cases
  Alaska: "#e5e7eb",
  Hawaii: "#e5e7eb",
  Idaho: "#93c5fd",
};

// Major cities with partner presence
const majorCities = [
  { name: "New York", coordinates: [-74.006, 40.7128], partners: 1200 },
  { name: "Los Angeles", coordinates: [-118.2437, 34.0522], partners: 980 },
  { name: "Chicago", coordinates: [-87.6298, 41.8781], partners: 750 },
  { name: "Houston", coordinates: [-95.3698, 29.7604], partners: 650 },
  { name: "Phoenix", coordinates: [-112.074, 33.4484], partners: 420 },
  { name: "Philadelphia", coordinates: [-75.1652, 39.9526], partners: 580 },
  { name: "San Antonio", coordinates: [-98.4936, 29.4241], partners: 380 },
  { name: "San Diego", coordinates: [-117.1611, 32.7157], partners: 450 },
  { name: "Dallas", coordinates: [-96.797, 32.7767], partners: 520 },
  { name: "San Jose", coordinates: [-121.8863, 37.3382], partners: 340 },
];

interface USCoverageMapProps {
  className?: string;
}

export function USCoverageMap({ className = "" }: USCoverageMapProps) {
  const getCoverageColor = (stateName: string) => {
    // Direct lookup using state name from geography data
    const color = stateColors[stateName];

    if (color) {
      return color;
    }

    // Default color for any states not explicitly defined
    return "#f3f4f6"; // Light gray for minimal coverage
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}
    >
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-900 mb-1">
          Nationwide Coverage Map
        </h4>
        <p className="text-xs text-gray-600">
          Partner network density across major markets
        </p>
      </div>

      <div className="relative">
        <ComposableMap
          projection="geoAlbersUsa"
          width={400}
          height={250}
          projectionConfig={{
            scale: 500,
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getCoverageColor(geo.properties.name)}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      fill: "#6366f1",
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Major city markers */}
          {majorCities.map((city) => (
            <Marker key={city.name} coordinates={city.coordinates}>
              <circle
                r={Math.max(3, Math.sqrt(city.partners) / 12)}
                fill="#ef4444"
                fillOpacity={0.8}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
            </Marker>
          ))}
        </ComposableMap>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 border border-gray-200 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#10b981" }}
              ></div>
              <span className="text-gray-700">High Coverage (90%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#3b82f6" }}
              ></div>
              <span className="text-gray-700">Good Coverage (85%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: "#93c5fd" }}
              ></div>
              <span className="text-gray-700">Standard Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#ef4444" }}
              ></div>
              <span className="text-gray-700">Partner Hubs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded p-2">
          <div className="text-sm font-bold text-gray-900">98%</div>
          <div className="text-xs text-gray-600">US Coverage</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-sm font-bold text-gray-900">50</div>
          <div className="text-xs text-gray-600">States</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-sm font-bold text-gray-900">30K+</div>
          <div className="text-xs text-gray-600">Locations</div>
        </div>
      </div>
    </div>
  );
}
