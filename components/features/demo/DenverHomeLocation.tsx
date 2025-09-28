"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Home, Navigation } from "lucide-react";

interface DenverHomeLocationProps {
  address: string;
  neighborhood: string;
  onLocationShown?: () => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function DenverHomeLocation({
  address,
  neighborhood,
  onLocationShown,
}: DenverHomeLocationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Coordinates for 4988 Valentia Ct, Denver, CO 80238
  const homeCoordinates = { lat: 39.7817, lng: -104.8897 };

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.warn(
          "Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local"
        );
        setMapLoaded(true); // Show fallback
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        console.warn("Google Maps failed to load, using fallback");
        setMapLoaded(true); // Show fallback
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: homeCoordinates,
          zoom: 15,
          mapTypeId: "roadmap",
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        // Add home marker
        const marker = new window.google.maps.Marker({
          position: homeCoordinates,
          map: map,
          title: address,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#10b981",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: system-ui;">
              <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">🏠 Your New Home</div>
              <div style="font-size: 14px; color: #6b7280;">${address}</div>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (error) {
        console.warn("Error initializing Google Maps:", error);
        setMapLoaded(true); // Show fallback
      }
    };

    loadGoogleMaps();
  }, [address]);

  useEffect(() => {
    // Animate in the component
    const timer1 = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Show details after animation
    const timer2 = setTimeout(() => {
      setShowDetails(true);
    }, 800);

    // Call completion callback
    const timer3 = setTimeout(() => {
      onLocationShown?.();
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []); // Remove onLocationShown dependency to prevent infinite loop

  return (
    <div
      className={`bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-4 border border-gray-100 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <Home className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">
            Your New Denver Home
          </h4>
          <p className="text-xs text-gray-600">{neighborhood}</p>
        </div>
      </div>

      {/* Google Maps Area */}
      <div className="bg-white rounded-xl mb-3 relative overflow-hidden">
        {!mapLoaded && (
          <div className="flex items-center justify-center h-32 bg-gray-50">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        {/* Google Maps Container */}
        <div
          ref={mapRef}
          className={`w-full h-32 transition-opacity duration-500 ${
            mapLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ minHeight: "128px" }}
        />

        {/* Fallback if Google Maps fails */}
        {mapLoaded && !window.google && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white mx-auto mb-2">
                <Home className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs font-medium text-gray-700 mb-1">
                Your New Home
              </p>
              <p className="text-xs text-gray-600">{address}</p>
              <p className="text-xs text-gray-500 mt-1">Map requires API key</p>
            </div>
          </div>
        )}
      </div>

      {/* Address Details */}
      <div
        className={`transition-all duration-500 delay-700 ${
          showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{address}</p>
            <p className="text-xs text-gray-600 mt-1">
              Premium location near shopping, dining, and entertainment
            </p>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Navigation className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mt-3 text-center">
        <p
          className={`text-xs transition-all duration-500 ${
            !showDetails ? "text-blue-600" : "text-green-600"
          }`}
        >
          {!showDetails
            ? "Locating your new home..."
            : "Location confirmed! Finding nearby offers..."}
        </p>
      </div>
    </div>
  );
}
