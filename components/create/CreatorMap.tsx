"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPoint {
  id: string;
  latitude: number;
  longitude: number;
  order: number;
}

interface CreatorMapProps {
  points: MapPoint[];
  onAddPoint: (lat: number, lng: number) => void;
  onSelectPoint?: (id: string) => void;
  selectedPointId?: string | null;
  className?: string;
}

function createNumberedIcon(number: number, isSelected: boolean): L.DivIcon {
  const bgColor = isSelected ? "#e879a5" : "#f5c542";
  const borderColor = "#ffffff";

  return L.divIcon({
    className: "creator-marker",
    html: `
      <div style="
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: ${bgColor};
        color: #1c1b18;
        border: 3px solid ${borderColor};
        box-shadow: 0 0 15px ${isSelected ? "rgba(232,121,165,0.4)" : "rgba(245,197,66,0.3)"};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-family: 'Outfit', sans-serif;
        font-size: 14px;
        cursor: pointer;
      ">
        ${number}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function MapClickHandler({
  onAddPoint,
}: {
  onAddPoint: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onAddPoint(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function CreatorMap({
  points,
  onAddPoint,
  onSelectPoint,
  selectedPointId,
  className,
}: CreatorMapProps) {
  useEffect(() => {
    // Fix Leaflet default marker icon issue inside useEffect
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
  }, []);

  const defaultCenter: [number, number] = [48.8566, 2.3522];
  const center: [number, number] =
    points.length > 0
      ? [
          points.reduce((sum, p) => sum + p.latitude, 0) / points.length,
          points.reduce((sum, p) => sum + p.longitude, 0) / points.length,
        ]
      : defaultCenter;

  return (
    <div className={`relative ${className} overflow-hidden rounded-2xl`}>
      <MapContainer
        center={center}
        zoom={14}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onAddPoint={onAddPoint} />

        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            icon={createNumberedIcon(point.order, selectedPointId === point.id)}
            eventHandlers={{ click: () => onSelectPoint?.(point.id) }}
          >
            {selectedPointId === point.id && (
              <Circle
                center={[point.latitude, point.longitude]}
                radius={20} // This should come from the step data
                pathOptions={{
                  color: "#f5c542",
                  fillColor: "#f5c542",
                  fillOpacity: 0.08,
                  weight: 2,
                }}
              />
            )}
          </Marker>
        ))}
      </MapContainer>
      <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2">
        <div className="rounded-2xl border border-black/[0.06] bg-background-surface/80 px-4 py-2 text-sm text-text-heading backdrop-blur-xl">
          Cliquez sur la carte pour ajouter un point
        </div>
      </div>
    </div>
  );
}
