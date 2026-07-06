"use client";

import { Gem, Lock, Package, Sparkles } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Artefact, ArtefactCategory, ArtefactRarity } from "@/types";

const rarityLabels: Record<ArtefactRarity, string> = {
  common: "Commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
};

const rarityBadgeVariants: Record<
  ArtefactRarity,
  "default" | "primary" | "success" | "warning"
> = {
  common: "default",
  rare: "success",
  epic: "primary",
  legendary: "warning",
};

const categoryLabels: Record<ArtefactCategory, string> = {
  history: "Histoire",
  art: "Art",
  nature: "Nature",
  mystery: "Mystère",
  technology: "Technologie",
  culture: "Culture",
};

interface ArtefactCardProps {
  artefact: Artefact;
  className?: string;
}

export function ArtefactCard({ artefact, className }: ArtefactCardProps) {
  return (
    <Card
      variant="interactive"
      className={cn("h-full overflow-hidden", className)}
    >
      <div className="flex gap-4 p-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/[0.06]">
          <Gem className="h-9 w-9 text-primary" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate font-heading text-base font-bold text-text-heading">
                {artefact.name}
              </h2>
              <p className="text-xs text-text-muted">
                {categoryLabels[artefact.category]}
              </p>
            </div>
            <Badge variant={rarityBadgeVariants[artefact.rarity]}>
              {rarityLabels[artefact.rarity]}
            </Badge>
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-text-muted">
            {artefact.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="primary" className="gap-1">
              <Sparkles className="h-3 w-3" aria-hidden="true" />+
              {artefact.xpBonus} XP
            </Badge>
            <Badge
              variant={artefact.isTradable ? "default" : "destructive"}
              className="gap-1"
            >
              {artefact.isTradable ? (
                <Package className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Lock className="h-3 w-3" aria-hidden="true" />
              )}
              {artefact.isTradable ? "Échangeable" : "Lié"}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
