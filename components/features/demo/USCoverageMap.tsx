"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-110m.json";

// Sample coverage data - states with high coverage
const coverageData = [
  { state: "CA", coverage: 98, color: "#10b981" },
  { state: "TX", coverage: 95, color: "#10b981" },
  { state: "FL", coverage: 92, color: "#3b82f6" },
  { state: "NY", coverage: 97, color: "#10b981" },
  { state: "PA", coverage: 89, color: "#3b82f6" },
  { state: "IL", coverage: 94, color: "#10b981" },
  { state: "OH", coverage: 87, color: "#3b82f6" },
  { state: "GA", coverage: 91, color: "#3b82f6" },
  { state: "NC", coverage: 88, color: "#3b82f6" },
  { state: "MI", coverage: 86, color: "#3b82f6" },
];

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
    // Simple logic to assign colors based on state
    const stateAbbr = getStateAbbreviation(stateName);
    const coverageInfo = coverageData.find((d) => d.state === stateAbbr);

    if (coverageInfo) {
      return coverageInfo.color;
    }

    // Default colors for states not in our data
    return "#e5e7eb"; // Light gray for lower coverage
  };

  const getStateAbbreviation = (stateName: string): string => {
    const stateMap: { [key: string]: string } = {
      California: "CA",
      Texas: "TX",
      Florida: "FL",
      "New York": "NY",
      Pennsylvania: "PA",
      Illinois: "IL",
      Ohio: "OH",
      Georgia: "GA",
      "North Carolina": "NC",
      Michigan: "MI",
    };
    return stateMap[stateName] || "";
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
                r={Math.sqrt(city.partners) / 8}
                fill="#ef4444"
                fillOpacity={0.7}
                stroke="#ffffff"
                strokeWidth={1}
              />
            </Marker>
          ))}
        </ComposableMap>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 border border-gray-200 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-700">High Coverage (90%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-700">Good Coverage (85%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
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
