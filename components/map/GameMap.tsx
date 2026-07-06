"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
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

// Default center over mainland France.
const DEFAULT_CENTER: [number, number] = [46.6034, 1.8883];
const DEFAULT_ZOOM = 6;

interface HuntCluster {
  id: string;
  position: [number, number];
  hunts: Hunt[];
}

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

function getClusterCellSize(zoom: number): number {
  if (zoom <= 5) return 96;
  if (zoom <= 7) return 76;
  if (zoom <= 9) return 58;
  if (zoom <= 11) return 42;
  return 1;
}

function createClusterIcon(count: number): L.DivIcon {
  const size = count >= 100 ? 54 : count >= 25 ? 48 : 42;

  return L.divIcon({
    className: "hunt-cluster-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 999px;
        background: #2a2418;
        border: 3px solid #fff8e6;
        box-shadow: 0 6px 18px rgba(28,27,24,0.2);
        color: #fff8e6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 13px;
      ">
        ${count}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function ClusteredHuntMarkers({
  hunts,
  onHuntClick,
}: {
  hunts: Hunt[];
  onHuntClick: (hunt: Hunt) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      setView({ zoom: map.getZoom(), bounds: map.getBounds() });
    },
    zoomend: () => {
      setView({ zoom: map.getZoom(), bounds: map.getBounds() });
    },
  });
  const [view, setView] = useState(() => ({
    zoom: map.getZoom(),
    bounds: map.getBounds(),
  }));

  const clusters = useMemo<HuntCluster[]>(() => {
    const paddedBounds = view.bounds.pad(0.25);
    const visibleHunts = hunts.filter((hunt) =>
      paddedBounds.contains([hunt.latitude, hunt.longitude])
    );
    const cellSize = getClusterCellSize(view.zoom);

    if (cellSize <= 1) {
      return visibleHunts.map((hunt) => ({
        id: hunt.id,
        position: [hunt.latitude, hunt.longitude],
        hunts: [hunt],
      }));
    }

    const buckets = new Map<string, Hunt[]>();

    visibleHunts.forEach((hunt) => {
      const point = map.project([hunt.latitude, hunt.longitude], view.zoom);
      const key = `${Math.floor(point.x / cellSize)}:${Math.floor(
        point.y / cellSize
      )}`;
      buckets.set(key, [...(buckets.get(key) ?? []), hunt]);
    });

    return Array.from(buckets.entries()).map(([key, bucket]) => {
      const latitude =
        bucket.reduce((sum, hunt) => sum + hunt.latitude, 0) / bucket.length;
      const longitude =
        bucket.reduce((sum, hunt) => sum + hunt.longitude, 0) / bucket.length;

      return {
        id: `${key}:${bucket.length}`,
        position: [latitude, longitude],
        hunts: bucket,
      };
    });
  }, [hunts, map, view.bounds, view.zoom]);

  return (
    <>
      {clusters.map((cluster) =>
        cluster.hunts.length === 1 ? (
          <HuntMarker
            key={cluster.hunts[0].id}
            hunt={cluster.hunts[0]}
            onClick={onHuntClick}
          />
        ) : (
          <Marker
            key={cluster.id}
            position={cluster.position}
            icon={createClusterIcon(cluster.hunts.length)}
            eventHandlers={{
              click: () => {
                const bounds = L.latLngBounds(
                  cluster.hunts.map((hunt) => [hunt.latitude, hunt.longitude])
                );
                map.fitBounds(bounds.pad(0.35), { maxZoom: 12 });
              },
            }}
          />
        )
      )}
    </>
  );
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

        <ClusteredHuntMarkers
          hunts={displayedHunts}
          onHuntClick={handleHuntClick}
        />
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
