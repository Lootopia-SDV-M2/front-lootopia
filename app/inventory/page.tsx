"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Map } from "lucide-react";
import { PageContainer, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui";
import {
  mockArtefacts,
  getRarityColor,
  getRarityLabel,
} from "@/lib/data/mock-artefacts";
import type { ArtefactRarity, Artefact } from "@/types";
import { cn } from "@/lib/utils";

const rarityFilters: { value: ArtefactRarity | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "common", label: "Commun" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epique" },
  { value: "legendary", label: "Legendaire" },
];

function ArtefactCard({ artefact }: { artefact: Artefact }) {
  return (
    <div className="group rounded-2xl border border-black/[0.06] bg-background-surface/60 p-4 transition-all duration-300 hover:border-primary/15 hover:shadow-glow-sm">
      {/* Image placeholder */}
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

      {/* Info */}
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

      <p className="text-xs text-text-muted">{artefact.huntTitle}</p>
      <p className="mt-1 text-xs text-text-muted">
        {new Date(artefact.obtainedAt).toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
}

export default function InventoryPage() {
  const [filter, setFilter] = useState<ArtefactRarity | "all">("all");

  const filteredArtefacts =
    filter === "all"
      ? mockArtefacts
      : mockArtefacts.filter((a) => a.rarity === filter);

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
        {filteredArtefacts.length > 0 ? (
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
