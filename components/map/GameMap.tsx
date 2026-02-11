"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useGeolocationStore } from "@/lib/stores";
import { mockHunts } from "@/lib/data/mock-hunts";
import { HuntMarker } from "./HuntMarker";
import { StepMarker } from "./StepMarker";
import { UserMarker } from "./UserMarker";
import { MapControls } from "./MapControls";
import type { Hunt, Participation } from "@/types";
import "leaflet/dist/leaflet.css";

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
  mode?: "discovery" | "participation";
  activeParticipation?: Participation | null;
}

const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];
const DEFAULT_ZOOM = 13;

function MapCenterController({ center }: { center: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);

  return null;
}

export function GameMap({
  onHuntSelect,
  className,
  hunts,
  isPartner,
  mode = "discovery",
  activeParticipation,
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

  const displayedHunts = hunts ?? mockHunts;

  useEffect(() => {
    const watchId = watchPosition();
    return () => {
      if (watchId !== null) {
        clearWatch(watchId);
      }
    };
  }, [watchPosition, clearWatch]);

  useEffect(() => {
    if (position && !mapCenter) {
      setMapCenter([position.latitude, position.longitude]);
    }
  }, [position, mapCenter]);

  const handleHuntClick = (hunt: Hunt) => {
    onHuntSelect?.(hunt);
  };

  const handleCenterOnUser = () => {
    if (position) {
      setMapCenter([position.latitude, position.longitude]);
    } else {
      requestGeolocation();
    }
  };

  const getLabel = () => {
    if (mode === "participation") return "Chasse en cours";
    if (isPartner) return "Mes chasses";
    return "Chasses disponibles";
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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenterController center={mapCenter} />

        {position && (
          <UserMarker
            position={[position.latitude, position.longitude]}
            accuracy={position.accuracy}
          />
        )}

        {/* Discovery mode: show hunt markers */}
        {mode === "discovery" &&
          displayedHunts.map((hunt) => (
            <HuntMarker key={hunt.id} hunt={hunt} onClick={handleHuntClick} />
          ))}

        {/* Participation mode: show step markers */}
        {mode === "participation" &&
          activeParticipation &&
          activeParticipation.steps.map((step, index) => {
            let status: "completed" | "current" | "locked";
            if (index < activeParticipation.currentStepIndex) {
              status = "completed";
            } else if (index === activeParticipation.currentStepIndex) {
              status = "current";
            } else {
              status = "locked";
            }
            return (
              <StepMarker
                key={step.id}
                step={step}
                index={index}
                status={status}
              />
            );
          })}
      </MapContainer>

      <MapControls
        onCenterUser={handleCenterOnUser}
        isLoading={isLoading}
        error={error}
        hasPosition={!!position}
        huntCount={mode === "participation" ? undefined : displayedHunts.length}
        label={getLabel()}
      />

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
