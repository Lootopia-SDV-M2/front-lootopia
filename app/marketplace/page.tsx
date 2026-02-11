"use client";

import { useState } from "react";
import { Store, Package, Eye } from "lucide-react";
import { PageContainer, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui";
import {
  mockMarketListings,
  getRarityColor,
  getRarityLabel,
} from "@/lib/data/mock-artefacts";
import type { MarketListing } from "@/types";
import { cn } from "@/lib/utils";

type Tab = "buy" | "sell";

function ListingCard({ listing }: { listing: MarketListing }) {
  return (
    <div className="group rounded-2xl border border-black/[0.06] bg-background-surface/60 p-4 transition-all duration-300 hover:border-primary/15 hover:shadow-glow-sm">
      {/* Image placeholder */}
      <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-background-surface-alt">
        {listing.artefact.imageUrl ? (
          <img
            src={listing.artefact.imageUrl}
            alt={listing.artefact.name}
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <Package className="h-10 w-10 text-text-muted/40" />
        )}
      </div>

      {/* Info */}
      <h3 className="mb-1 text-sm font-semibold text-text-heading">
        {listing.artefact.name}
      </h3>

      <span
        className={cn(
          "mb-2 inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium",
          getRarityColor(listing.artefact.rarity)
        )}
      >
        {getRarityLabel(listing.artefact.rarity)}
      </span>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-text-muted">par {listing.sellerName}</p>
        <p className="text-sm font-bold text-primary">{listing.price} XP</p>
      </div>

      <Button variant="ghost" size="sm" className="w-full">
        <Eye className="h-4 w-4" />
        Voir
      </Button>
    </div>
  );
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<Tab>("buy");

  return (
    <div className="min-h-screen pb-20 pt-20 md:pb-8">
      <PageContainer
        title="Marche aux Artefacts"
        subtitle="Achetez et vendez vos artefacts"
      >
        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-black/[0.06] bg-black/[0.02] p-1">
          <button
            onClick={() => setActiveTab("buy")}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              activeTab === "buy"
                ? "bg-background text-text-heading shadow-sm"
                : "text-text-muted hover:text-text-body"
            )}
          >
            Acheter
          </button>
          <button
            onClick={() => setActiveTab("sell")}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              activeTab === "sell"
                ? "bg-background text-text-heading shadow-sm"
                : "text-text-muted hover:text-text-body"
            )}
          >
            Mes Ventes
          </button>
        </div>

        {/* Content */}
        {activeTab === "buy" ? (
          mockMarketListings.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {mockMarketListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Store className="h-8 w-8 text-text-muted" />}
              title="Aucune offre"
              description="Le marche est vide pour le moment."
            />
          )
        ) : (
          <EmptyState
            icon={<Store className="h-8 w-8 text-text-muted" />}
            title="Aucune vente en cours"
            description="Mettez en vente un artefact depuis votre inventaire."
          />
        )}
      </PageContainer>
    </div>
  );
}
