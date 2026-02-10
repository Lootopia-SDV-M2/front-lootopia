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
      background: linear-gradient(135deg, #f5c542, #eab308);
      border-radius: 50%;
      border: 4px solid #ffffff;
      box-shadow: 0 0 12px rgba(200, 154, 14, 0.3);
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
            color: "#f5c542",
            fillColor: "#f5c542",
            fillOpacity: 0.08,
            weight: 1,
          }}
        />
      )}

      {/* User position marker */}
      <Marker position={position} icon={userIcon}>
        <Popup>
          <div className="p-1 text-center">
            <p className="font-medium text-text-heading">Vous êtes ici</p>
            {accuracy && (
              <p className="text-xs text-text-muted">
                Précision: ±{Math.round(accuracy)}m
              </p>
            )}
          </div>
        </Popup>
      </Marker>
    </>
  );
}
