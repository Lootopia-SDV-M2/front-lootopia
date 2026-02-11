"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import type { Hunt } from "@/types";

interface HuntMarkerProps {
  hunt: Hunt;
  onClick?: (hunt: Hunt) => void;
}

function createHuntIcon(difficulty: Hunt["difficulty"]): L.DivIcon {
  const colors = {
    easy: "#22c55e",
    medium: "#f59e0b",
    hard: "#ef4444",
    expert: "#8b5cf6",
  };

  const color = colors[difficulty];

  return L.divIcon({
    className: "hunt-marker",
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, ${color}, ${color}dd);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 16px;
        ">💎</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

export function HuntMarker({ hunt, onClick }: HuntMarkerProps) {
  const icon = createHuntIcon(hunt.difficulty);

  return (
    <Marker
      position={[hunt.latitude, hunt.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(hunt),
      }}
    />
  );
}
