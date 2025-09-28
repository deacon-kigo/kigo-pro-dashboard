"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Clock } from "lucide-react";

interface MerchantLocationMapProps {
  homeAddress: string;
  homeCoordinates: { lat: number; lng: number };
  merchantName: string;
  merchantAddress: string;
  merchantCoordinates: { lat: number; lng: number };
  onMapShown?: () => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export function MerchantLocationMap({
  homeAddress,
  homeCoordinates,
  merchantName,
  merchantAddress,
  merchantCoordinates,
  onMapShown,
}: MerchantLocationMapProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const mapRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Animate in the component
    const timer1 = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Load map
    const timer2 = setTimeout(() => {
      loadGoogleMaps();
    }, 500);

    // Call completion callback only once
    const timer3 = setTimeout(() => {
      if (onMapShown) {
        onMapShown();
      }
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []); // Keep empty dependency array since we only want this to run once

  const loadGoogleMaps = () => {
    if (window.google) {
      initializeMap();
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.warn("Google Maps API key not found");
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    script.onerror = () => {
      console.warn("Google Maps failed to load");
      setMapLoaded(true);
    };

    // Only add script if it doesn't already exist
    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google || mapInstance.current) {
      setMapLoaded(true);
      return;
    }

    try {
      // Calculate bounds to fit both locations
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(homeCoordinates);
      bounds.extend(merchantCoordinates);

      const map = new window.google.maps.Map(mapRef.current, {
        center: bounds.getCenter(),
        zoom: 12,
        mapTypeId: "roadmap",
        disableDefaultUI: true,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      mapInstance.current = map;

      // Fit map to show both locations
      map.fitBounds(bounds);

      // Add home marker
      const homeMarker = new window.google.maps.Marker({
        position: homeCoordinates,
        map: map,
        title: "Your Home",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#10b981",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      // Add merchant marker
      const merchantMarker = new window.google.maps.Marker({
        position: merchantCoordinates,
        map: map,
        title: merchantName,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      // Add direction line
      const directionsLine = new window.google.maps.Polyline({
        path: [homeCoordinates, merchantCoordinates],
        geodesic: true,
        strokeColor: "#6366f1",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        icons: [
          {
            icon: {
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 3,
              fillColor: "#6366f1",
              fillOpacity: 1,
              strokeWeight: 0,
            },
            offset: "50%",
          },
        ],
      });
      directionsLine.setMap(map);

      // Calculate distance (rough estimate)
      const distance =
        window.google.maps.geometry?.spherical?.computeDistanceBetween(
          new window.google.maps.LatLng(
            homeCoordinates.lat,
            homeCoordinates.lng
          ),
          new window.google.maps.LatLng(
            merchantCoordinates.lat,
            merchantCoordinates.lng
          )
        );

      if (distance) {
        const miles = (distance * 0.000621371).toFixed(1);
        const minutes = Math.round(distance * 0.000621371 * 2.5); // Rough estimate: 2.5 min per mile
        setDistance(`${miles} miles`);
        setDuration(`${minutes} min drive`);
      }

      setMapLoaded(true);
    } catch (error) {
      console.warn("Error initializing map:", error);
      setMapLoaded(true);
    }
  };

  return (
    <div
      className={`bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 border border-gray-100 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <Navigation className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">
              Distance to {merchantName}
            </h4>
            <p className="text-xs text-gray-600">From your new home</p>
          </div>
        </div>
        {distance && (
          <div className="text-right">
            <p className="text-sm font-medium text-indigo-600">{distance}</p>
            <p className="text-xs text-gray-500">{duration}</p>
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="bg-white rounded-xl mb-3 relative overflow-hidden">
        {!mapLoaded && (
          <div className="flex items-center justify-center h-32 bg-gray-50">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-gray-600">Loading directions...</p>
            </div>
          </div>
        )}

        <div
          ref={mapRef}
          className={`w-full h-32 transition-opacity duration-500 ${
            mapLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ minHeight: "128px" }}
        />

        {/* Fallback */}
        {mapLoaded && !window.google && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🏠</span>
                </div>
                <div className="w-8 h-1 bg-indigo-400"></div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xs font-medium text-gray-700">
                Your Home → {merchantName}
              </p>
              <p className="text-xs text-gray-600">{merchantAddress}</p>
            </div>
          </div>
        )}
      </div>

      {/* Location Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <p className="text-xs text-gray-600">Your Home: {homeAddress}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <p className="text-xs text-gray-600">
            {merchantName}: {merchantAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
