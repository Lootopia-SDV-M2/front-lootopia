"use client";

import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/shared";
import type { Hunt } from "@/types";

/**
 * Dynamically imported GameMap component.
 * Leaflet requires client-side rendering only.
 */
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
}) {
  return <GameMap {...props} />;
}
