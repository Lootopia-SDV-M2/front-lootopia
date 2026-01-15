"use client";

import { Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";

interface UserMarkerProps {
  position: [number, number];
  accuracy?: number;
}

/**
 * Create the user location icon
 */
const userIcon = L.divIcon({
  className: "user-marker",
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
      animation: pulse 2s infinite;
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

/**
 * Marker component showing the user's current location.
 * Includes an accuracy circle when accuracy data is available.
 */
export function UserMarker({ position, accuracy }: UserMarkerProps) {
  return (
    <>
      {/* Accuracy circle */}
      {accuracy && (
        <Circle
          center={position}
          radius={accuracy}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.1,
            weight: 1,
          }}
        />
      )}

      {/* User position marker */}
      <Marker position={position} icon={userIcon}>
        <Popup>
          <div className="p-1 text-center">
            <p className="font-medium text-gray-900">Vous êtes ici</p>
            {accuracy && (
              <p className="text-xs text-gray-500">
                Précision: ±{Math.round(accuracy)}m
              </p>
            )}
          </div>
        </Popup>
      </Marker>
    </>
  );
}
