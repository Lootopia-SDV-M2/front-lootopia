"use client";

import Link from "next/link";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Hunt } from "@/types";
import { getDifficultyLabel, getDifficultyColor } from "@/lib/data/mock-hunts";

interface HuntMarkerProps {
  hunt: Hunt;
  onClick?: (hunt: Hunt) => void;
}

/**
 * Create a custom icon for hunt markers based on difficulty
 */
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
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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

/**
 * Custom marker component for displaying hunts on the map.
 * Shows a popup with hunt details on click.
 */
export function HuntMarker({ hunt, onClick }: HuntMarkerProps) {
  const icon = createHuntIcon(hunt.difficulty);
  const difficultyColor = getDifficultyColor(hunt.difficulty);

  return (
    <Marker
      position={[hunt.latitude, hunt.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(hunt),
      }}
    >
      <Popup>
        <div className="min-w-[220px] p-1">
          <h3 className="mb-1 text-base font-bold text-gray-900">
            {hunt.title}
          </h3>
          <p className="mb-2 line-clamp-2 text-sm text-gray-600">
            {hunt.description}
          </p>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full bg-gradient-to-r px-2 py-0.5 text-xs font-medium text-white ${difficultyColor}`}
            >
              {getDifficultyLabel(hunt.difficulty)}
            </span>
            <span className="text-xs text-gray-500">⏱ {hunt.duration}</span>
          </div>
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-amber-600">
              🏆 {hunt.reward} XP
            </span>
            <span className="text-gray-500">
              👥 {hunt.participantsCount}/{hunt.maxParticipants}
            </span>
          </div>
          <Link
            href={`/hunt/${hunt.id}`}
            className="block w-full rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-center text-sm font-medium text-white transition-all hover:from-amber-500 hover:to-orange-600"
          >
            Commencer la chasse
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
