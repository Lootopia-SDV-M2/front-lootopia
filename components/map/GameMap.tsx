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
  hunts?: Hunt[];
  isPartner?: boolean;
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
export function GameMap({
  onHuntSelect,
  className,
  hunts,
  isPartner,
}: GameMapProps) {
  const {
    position,
    isLoading,
    error,
    watchPosition,
    clearWatch,
    requestGeolocation,
  } = useGeolocationStore();
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [selectedHunt, setSelectedHunt] = useState<Hunt | null>(null);

  const displayedHunts = hunts ?? mockHunts;

  // Use watchPosition for continuous GPS tracking
  useEffect(() => {
    const watchId = watchPosition();
    return () => {
      if (watchId !== null) {
        clearWatch(watchId);
      }
    };
  }, [watchPosition, clearWatch]);

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
        {displayedHunts.map((hunt) => (
          <HuntMarker key={hunt.id} hunt={hunt} onClick={handleHuntClick} />
        ))}
      </MapContainer>

      {/* Map controls overlay */}
      <MapControls
        onCenterUser={handleCenterOnUser}
        isLoading={isLoading}
        error={error}
        hasPosition={!!position}
        huntCount={displayedHunts.length}
        label={isPartner ? "Mes chasses" : "Chasses disponibles"}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/40 backdrop-blur-sm">
          <div className="rounded-2xl border border-black/[0.06] bg-background-surface/90 px-6 py-4 shadow-glass backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm font-medium text-text-heading">
                Localisation en cours...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
