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
  // This function now uses the new color palette
  const bgColor = isSelected ? "bg-brand-accent" : "bg-brand-primary";
  const textColor = isSelected ? "text-brand-dark" : "text-brand-dark";

  return L.divIcon({
    className: "creator-marker",
    html: `
      <div class="${bgColor} ${textColor}" style="
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid #0D0F19; /* brand-dark */
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-family: 'Orbitron', sans-serif;
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
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
                  color: "#00F2FF", // brand-accent
                  fillColor: "#00F2FF",
                  fillOpacity: 0.1,
                  weight: 2,
                }}
              />
            )}
          </Marker>
        ))}
      </MapContainer>
      <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2">
        <div className="bg-brand-dark/70 text-brand-light rounded-full px-4 py-2 text-sm backdrop-blur-sm">
          Cliquez sur la carte pour ajouter un point
        </div>
      </div>
    </div>
  );
}
