"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import DynamicMap from "@/components/map/DynamicMap";
import { useAuthStore } from "@/lib/stores";
import { huntApi, type HuntSummaryDTO } from "@/lib/api/hunt-api";
import type { Hunt, HuntDifficulty } from "@/types";

function mapSummaryToHunt(dto: HuntSummaryDTO): Hunt {
  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description,
    difficulty: (dto.difficulty?.toLowerCase() as HuntDifficulty) || "medium",
    latitude: dto.latitude ?? 0,
    longitude: dto.longitude ?? 0,
    reward: dto.rewardsCount,
    duration: dto.duration,
    participantsCount: 0,
    maxParticipants: dto.maxParticipants,
    createdAt: dto.createdAt,
  };
}

export default function MapPage() {
  const user = useAuthStore((s) => s.user);
  const isPartner = user?.role === "partner";
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHunts = async () => {
      try {
        const data = isPartner
          ? await huntApi.getMyHunts()
          : await huntApi.getPublishedHunts();
        setHunts(data.map(mapSummaryToHunt));
      } catch {
        setHunts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHunts();
  }, [isPartner]);

  return (
    <div className="fixed inset-0 pb-16 pt-16 md:pb-0 md:pt-16">
      <div className="h-full w-full p-3">
        <DynamicMap
          className="shadow-2xl"
          hunts={loading ? undefined : hunts}
          isPartner={isPartner}
        />
      </div>

      {/* Floating create button for partners */}
      {isPartner && (
        <Link
          href="/create"
          className="absolute bottom-20 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-gradient-to-r from-primary via-gold-500 to-primary px-6 py-3 font-heading font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-strong active:translate-y-0 md:bottom-6"
        >
          <Plus className="h-5 w-5" />
          Créer une chasse
        </Link>
      )}
    </div>
  );
}
