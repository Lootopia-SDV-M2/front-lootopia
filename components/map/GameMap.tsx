"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useGeolocationStore } from "@/lib/stores";
import { mockHunts } from "@/lib/data/mock-hunts";
import { HuntMarker } from "./HuntMarker";
import { UserMarker } from "./UserMarker";
import { MapControls } from "./MapControls";
import type { Hunt } from "@/types";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon issue
import L from "leaflet";
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface GameMapProps {
  onHuntSelect?: (hunt: Hunt) => void;
  className?: string;
}

// Default center (Paris)
const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];
const DEFAULT_ZOOM = 13;

/**
 * Component to handle map centering on user position
 */
function MapCenterController({ center }: { center: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);

  return null;
}

/**
 * Main game map component displaying hunts and user location.
 * Uses Leaflet with OpenStreetMap tiles.
 */
export function GameMap({ onHuntSelect, className }: GameMapProps) {
  const { position, isLoading, error, requestGeolocation } =
    useGeolocationStore();
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [selectedHunt, setSelectedHunt] = useState<Hunt | null>(null);

  // Request geolocation on mount
  useEffect(() => {
    requestGeolocation();
  }, [requestGeolocation]);

  // Update map center when position changes
  useEffect(() => {
    if (position && !mapCenter) {
      setMapCenter([position.latitude, position.longitude]);
    }
  }, [position, mapCenter]);

  const handleHuntClick = (hunt: Hunt) => {
    setSelectedHunt(hunt);
    onHuntSelect?.(hunt);
  };

  const handleCenterOnUser = () => {
    if (position) {
      setMapCenter([position.latitude, position.longitude]);
    } else {
      requestGeolocation();
    }
  };

  return (
    <div className={`relative h-full w-full ${className || ""}`}>
      <MapContainer
        center={
          position ? [position.latitude, position.longitude] : DEFAULT_CENTER
        }
        zoom={DEFAULT_ZOOM}
        className="h-full w-full rounded-2xl"
        zoomControl={false}
      >
        {/* Map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Center controller */}
        <MapCenterController center={mapCenter} />

        {/* User location marker */}
        {position && (
          <UserMarker
            position={[position.latitude, position.longitude]}
            accuracy={position.accuracy}
          />
        )}

        {/* Hunt markers */}
        {mockHunts.map((hunt) => (
          <HuntMarker key={hunt.id} hunt={hunt} onClick={handleHuntClick} />
        ))}
      </MapContainer>

      {/* Map controls overlay */}
      <MapControls
        onCenterUser={handleCenterOnUser}
        isLoading={isLoading}
        error={error}
        hasPosition={!!position}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 backdrop-blur-sm">
          <div className="rounded-xl bg-white px-6 py-4 shadow-xl dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              <span className="text-sm font-medium">
                Localisation en cours...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
