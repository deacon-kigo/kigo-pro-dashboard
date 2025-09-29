"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

// Use the working geography URL from the CodeSandbox example
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Coverage data mapped by state ID/code for better matching
const stateColors: { [key: string]: string } = {
  // High coverage states (90%+) - Green
  "06": "#10b981", // California
  "48": "#10b981", // Texas
  "36": "#10b981", // New York
  "17": "#10b981", // Illinois
  "12": "#059669", // Florida

  // Good coverage states (85%+) - Blue
  "42": "#3b82f6", // Pennsylvania
  "39": "#2563eb", // Ohio
  "13": "#3b82f6", // Georgia
  "37": "#2563eb", // North Carolina
  "26": "#3b82f6", // Michigan
  "51": "#2563eb", // Virginia
  "53": "#3b82f6", // Washington
  "04": "#2563eb", // Arizona
  "25": "#3b82f6", // Massachusetts
  "47": "#2563eb", // Tennessee
  "18": "#3b82f6", // Indiana
  "29": "#2563eb", // Missouri
  "24": "#3b82f6", // Maryland
  "55": "#2563eb", // Wisconsin
  "08": "#3b82f6", // Colorado
  "27": "#2563eb", // Minnesota

  // Standard coverage states - Light Blue
  "01": "#93c5fd", // Alabama
  "05": "#bfdbfe", // Arkansas
  "09": "#93c5fd", // Connecticut
  "10": "#bfdbfe", // Delaware
  "19": "#93c5fd", // Iowa
  "20": "#bfdbfe", // Kansas
  "21": "#93c5fd", // Kentucky
  "22": "#bfdbfe", // Louisiana
  "23": "#93c5fd", // Maine
  "28": "#bfdbfe", // Mississippi
  "30": "#93c5fd", // Montana
  "31": "#bfdbfe", // Nebraska
  "32": "#93c5fd", // Nevada
  "33": "#bfdbfe", // New Hampshire
  "34": "#93c5fd", // New Jersey
  "35": "#bfdbfe", // New Mexico
  "38": "#93c5fd", // North Dakota
  "40": "#bfdbfe", // Oklahoma
  "41": "#93c5fd", // Oregon
  "44": "#bfdbfe", // Rhode Island
  "45": "#93c5fd", // South Carolina
  "46": "#bfdbfe", // South Dakota
  "49": "#93c5fd", // Utah
  "50": "#bfdbfe", // Vermont
  "54": "#93c5fd", // West Virginia
  "56": "#bfdbfe", // Wyoming

  // Special cases
  "02": "#e5e7eb", // Alaska
  "15": "#e5e7eb", // Hawaii
  "16": "#93c5fd", // Idaho
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
  const getCoverageColor = (geo: any) => {
    // Use the geography ID for lookup, similar to the CodeSandbox example
    const stateId = geo.id;
    const color = stateColors[stateId];

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
                  fill={getCoverageColor(geo)}
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
