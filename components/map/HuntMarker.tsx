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
          <h3 className="mb-1 font-heading text-base font-bold text-text-heading">
            {hunt.title}
          </h3>
          <p className="mb-2 line-clamp-2 text-sm text-text-muted">
            {hunt.description}
          </p>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full bg-gradient-to-r px-2 py-0.5 text-xs font-medium text-white ${difficultyColor}`}
            >
              {getDifficultyLabel(hunt.difficulty)}
            </span>
            <span className="text-xs text-text-muted">⏱ {hunt.duration}</span>
          </div>
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-primary">
              🏆 {hunt.reward} XP
            </span>
            <span className="text-text-muted">
              👥 {hunt.participantsCount}/{hunt.maxParticipants}
            </span>
          </div>
          <Link
            href={`/hunt/${hunt.id}`}
            className="block w-full rounded-xl bg-gradient-to-r from-primary to-gold-600 px-4 py-2 text-center font-heading text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-glow-sm"
          >
            Commencer la chasse
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
