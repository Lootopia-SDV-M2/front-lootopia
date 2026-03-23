"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2 } from "lucide-react";

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

function FlyToPoint({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 17, { duration: 1.2 });
  }, [map, lat, lng]);
  return null;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

function AddressSearch({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`,
        { headers: { "Accept-Language": "fr" } }
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
      setShowResults(true);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 400);
  };

  const handleSelect = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setQuery(result.display_name);
    setShowResults(false);
    onSelect(lat, lng);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="absolute left-3 right-3 top-3 z-[1000]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Rechercher une adresse..."
          className="w-full rounded-xl border border-black/[0.06] bg-background-surface/90 py-2.5 pl-10 pr-10 text-sm text-text-heading placeholder-text-muted backdrop-blur-xl focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-text-muted" />
        )}
      </div>
      {showResults && results.length > 0 && (
        <ul className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-black/[0.06] bg-background-surface/95 py-1 backdrop-blur-xl">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className="cursor-pointer px-3 py-2 text-sm text-text-body transition-colors hover:bg-primary/[0.06] hover:text-text-heading"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CreatorMap({
  points,
  onAddPoint,
  onSelectPoint,
  selectedPointId,
  className,
}: CreatorMapProps) {
  const [flyTarget, setFlyTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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

  const handleAddressSelect = (lat: number, lng: number) => {
    setFlyTarget({ lat, lng });
  };

  return (
    <div className={`relative ${className} overflow-hidden rounded-2xl`}>
      <AddressSearch onSelect={handleAddressSelect} />
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
        {flyTarget && <FlyToPoint lat={flyTarget.lat} lng={flyTarget.lng} />}

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
