"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Map } from "lucide-react";
import { PageContainer, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui";
import { getRarityColor, getRarityLabel } from "@/lib/data/mock-artefacts";
import {
  participationApi,
  type ArtefactDTO,
} from "@/lib/api/participation-api";
import type { ArtefactRarity, Artefact } from "@/types";
import { cn } from "@/lib/utils";

const rarityFilters: { value: ArtefactRarity | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "common", label: "Commun" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epique" },
  { value: "legendary", label: "Legendaire" },
];

function mapDtoToArtefact(dto: ArtefactDTO): Artefact {
  return {
    id: String(dto.id),
    name: dto.name,
    imageUrl: dto.imageUrl,
    rarity: (dto.rarity as ArtefactRarity) || "common",
    huntTitle: "",
    obtainedAt: dto.obtainedAt,
  };
}

function ArtefactCard({ artefact }: { artefact: Artefact }) {
  return (
    <div className="group rounded-2xl border border-black/[0.06] bg-background-surface/60 p-4 transition-all duration-300 hover:border-primary/15 hover:shadow-glow-sm">
      <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-background-surface-alt">
        {artefact.imageUrl ? (
          <img
            src={artefact.imageUrl}
            alt={artefact.name}
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <Package className="h-10 w-10 text-text-muted/40" />
        )}
      </div>

      <h3 className="mb-1 text-sm font-semibold text-text-heading">
        {artefact.name}
      </h3>

      <span
        className={cn(
          "mb-2 inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium",
          getRarityColor(artefact.rarity)
        )}
      >
        {getRarityLabel(artefact.rarity)}
      </span>

      {artefact.huntTitle && (
        <p className="text-xs text-text-muted">{artefact.huntTitle}</p>
      )}
      <p className="mt-1 text-xs text-text-muted">
        {new Date(artefact.obtainedAt).toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
}

export default function InventoryPage() {
  const [filter, setFilter] = useState<ArtefactRarity | "all">("all");
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtefacts = async () => {
      try {
        const dtos = await participationApi.getMyArtefacts();
        setArtefacts(dtos.map(mapDtoToArtefact));
      } catch {
        setArtefacts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArtefacts();
  }, []);

  const filteredArtefacts =
    filter === "all" ? artefacts : artefacts.filter((a) => a.rarity === filter);

  return (
    <div className="min-h-screen pb-20 pt-20 md:pb-8">
      <PageContainer
        title="Mon Inventaire"
        subtitle="Vos artefacts collectes lors de vos chasses"
      >
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {rarityFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200",
                filter === f.value
                  ? "border border-primary/20 bg-primary/10 text-primary"
                  : "border border-black/[0.06] bg-black/[0.03] text-text-muted hover:bg-black/[0.06]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredArtefacts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredArtefacts.map((artefact) => (
              <ArtefactCard key={artefact.id} artefact={artefact} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Package className="h-8 w-8 text-text-muted" />}
            title="Aucun artefact"
            description="Partez a l'aventure pour collecter des artefacts !"
            action={
              <Link href="/map">
                <Button variant="primary" size="md">
                  <Map className="h-4 w-4" />
                  Explorer la carte
                </Button>
              </Link>
            }
          />
        )}
      </PageContainer>
    </div>
  );
}
