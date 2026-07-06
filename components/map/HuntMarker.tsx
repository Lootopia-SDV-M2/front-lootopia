"use client";

import Link from "next/link";
import { Clock, Trophy, Users } from "lucide-react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Hunt } from "@/types";
import { getDifficultyLabel } from "@/lib/data/mock-hunts";

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
          color: white;
          font-size: 18px;
          line-height: 1;
        ">◆</span>
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
    >
      <Popup
        className="lootopia-hunt-popup"
        minWidth={260}
        maxWidth={320}
        autoPanPaddingTopLeft={[24, 104]}
        autoPanPaddingBottomRight={[24, 96]}
      >
        <div className="w-[260px] max-w-[72vw]">
          <h3 className="line-clamp-2 pr-6 text-base font-bold leading-snug text-text-heading">
            {hunt.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted">
            {hunt.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
              {getDifficultyLabel(hunt.difficulty)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-text-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {hunt.duration}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              {hunt.reward} XP
            </span>
            <span className="inline-flex items-center gap-1.5 text-text-muted">
              <Users className="h-4 w-4" aria-hidden="true" />
              {hunt.participantsCount}/{hunt.maxParticipants}
            </span>
          </div>

          <Link
            href={`/hunt/${hunt.id}`}
            className="lootopia-popup-link mt-4 block w-full rounded-md border border-[#3a2a0a] bg-[#2a2418] px-4 py-2.5 text-center text-sm font-semibold text-[#fff8e6] shadow-[0_1px_2px_rgba(42,36,24,0.18)] transition-colors duration-200 hover:border-[#4a3710] hover:bg-[#3a2d14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2"
          >
            Commencer la chasse
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
