"use client";

import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/shared";
import type { Hunt, Participation } from "@/types";

const GameMap = dynamic(
  () => import("@/components/map/GameMap").then((mod) => mod.GameMap),
  {
    ssr: false,
    loading: () => <LoadingScreen message="Chargement de la carte..." />,
  }
);

export default function DynamicMap(props: {
  className?: string;
  hunts?: Hunt[];
  isPartner?: boolean;
  mode?: "discovery" | "participation";
  activeParticipation?: Participation | null;
  onHuntSelect?: (hunt: Hunt) => void;
}) {
  return <GameMap {...props} />;
}
