"use client";

import { useEffect, useState, useRef } from "react";
import { Store, Package, Plus, X, ShoppingCart, AlertCircle } from "lucide-react";
import { PageContainer, EmptyState } from "@/components/shared";
import { Button, Input, Card } from "@/components/ui";
import { useMarketplaceStore } from "@/lib/stores/marketplace-store";
import { useToastStore } from "@/lib/stores/toast-store";
import { marketplaceApi, type ArtefactDTO } from "@/lib/api/marketplace-api";
import { getRarityColor, getRarityLabel } from "@/lib/data/mock-artefacts";
import { cn } from "@/lib/utils";
import type { ArtefactRarity } from "@/types";

type Tab = "buy" | "sell";

// ─── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "default" }> = {
    ACTIF:   { label: "Actif",   variant: "success" },
    VENDU:   { label: "Vendu",   variant: "default" },
    EXPIRE:  { label: "Expire",  variant: "warning" },
    ANNULE:  { label: "Annule",  variant: "destructive" },
  };
  const { label, variant } = map[status] ?? { label: status, variant: "default" as const };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium",
        variant === "success"    && "bg-status-success/10 text-status-success border-status-success/20",
        variant === "warning"    && "bg-status-warning/10 text-status-warning border-status-warning/20",
        variant === "destructive"&& "bg-status-error/10 text-status-error border-status-error/20",
        variant === "default"    && "bg-black/[0.03] text-text-muted border-black/[0.06]"
      )}
    >
      {label}
    </span>
  );
}

// ─── Buy card (marketplace listing) ───────────────────────────────────────────

function BuyCard({ listing }: { listing: ReturnType<typeof useMarketplaceStore.getState>["listings"][number] }) {
  const buyListing = useMarketplaceStore((s) => s.buyListing);
  const [buying, setBuying] = useState(false);

  async function handleBuy() {
    if (buying || listing.status === "VENDU") return;
    setBuying(true);
    try {
      await buyListing(listing.id);
    } finally {
      setBuying(false);
    }
  }

  return (
    <div className="group rounded-2xl border border-black/[0.06] bg-background-surface/60 p-4 transition-all duration-300 hover:border-primary/15 hover:shadow-glow-sm">
      {/* Image */}
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
      <h3 className="mb-1 text-sm font-semibold text-text-heading">{listing.artefact.name}</h3>
      <span
        className={cn(
          "mb-2 inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium",
          getRarityColor(listing.artefact.rarity as ArtefactRarity)
        )}
      >
        {getRarityLabel(listing.artefact.rarity as ArtefactRarity)}
      </span>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-text-muted">par {listing.sellerName}</p>
        <p className="text-sm font-bold text-primary">{listing.price} XP</p>
      </div>

      {listing.status === "VENDU" ? (
        <div className="flex items-center gap-1.5 rounded-xl bg-status-success/10 px-3 py-2 text-xs font-medium text-status-success">
          Achat effectue !
        </div>
      ) : (
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          isLoading={buying}
          disabled={buying}
          onClick={handleBuy}
        >
          <ShoppingCart className="h-4 w-4" />
          Acheter
        </Button>
      )}
    </div>
  );
}

// ─── Sell card (my listing) ───────────────────────────────────────────────────

function SellCard({ listing }: { listing: ReturnType<typeof useMarketplaceStore.getState>["myListings"][number] }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-background-surface/60 p-4 transition-all duration-300">
      {/* Image */}
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
      <h3 className="mb-1 text-sm font-semibold text-text-heading">{listing.artefact.name}</h3>
      <span
        className={cn(
          "mb-2 inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium",
          getRarityColor(listing.artefact.rarity as ArtefactRarity)
        )}
      >
        {getRarityLabel(listing.artefact.rarity as ArtefactRarity)}
      </span>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-text-muted">
          {listing.type === "VENTE_DIRECTE" ? "Vente directe" : "Enchere"}
        </span>
        <p className="text-sm font-bold text-primary">{listing.price} XP</p>
      </div>

      <StatusBadge status={listing.status} />
    </div>
  );
}

// ─── Sell Modal ───────────────────────────────────────────────────────────────

interface SellModalProps {
  open: boolean;
  onClose: () => void;
}

function SellModal({ open, onClose }: SellModalProps) {
  const listArtefact = useMarketplaceStore((s) => s.listArtefact);
  const toast = useToastStore((s) => s.addToast);
  const [artefacts, setArtefacts] = useState<ArtefactDTO[]>([]);
  const [loadingArtefacts, setLoadingArtefacts] = useState(false);
  const [artefactError, setArtefactError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"VENTE_DIRECTE" | "ENCHERE">("VENTE_DIRECTE");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingArtefacts(true);
    setArtefactError(null);
    marketplaceApi
      .getMyArtefacts()
      .then(setArtefacts)
      .catch(() => setArtefactError("Impossible de charger vos artefacts."))
      .finally(() => setLoadingArtefacts(false));
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !price) return;
    setSubmitting(true);
    try {
      await listArtefact(selectedId, Number(price), type);
      toast("Artefact mis en vente !", "success");
      onClose();
      setSelectedId(null);
      setPrice("");
      setType("VENTE_DIRECTE");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur lors de la mise en vente.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="relative w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted hover:bg-black/[0.04] hover:text-text-heading transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 font-heading text-xl font-bold text-text-heading">
          Vendre un Artefact
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Artefact select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-heading">Artefact</label>
            {loadingArtefacts ? (
              <div className="flex h-11 items-center justify-center rounded-xl bg-background-surface-alt text-sm text-text-muted">
                Chargement...
              </div>
            ) : artefactError ? (
              <p className="text-sm text-status-error">{artefactError}</p>
            ) : (
              <select
                value={selectedId ?? ""}
                onChange={(e) => setSelectedId(Number(e.target.value) || null)}
                className="flex h-11 w-full cursor-pointer rounded-xl border border-black/[0.06] bg-background-surface-alt px-4 py-2 text-sm text-text-heading transition-all hover:border-black/[0.08] focus-visible:border-primary/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
                required
              >
                <option value="">Choisir un artefact...</option>
                {artefacts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({getRarityLabel(a.rarity as ArtefactRarity)})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-heading">Prix (XP)</label>
            <Input
              type="number"
              min={1}
              placeholder="Ex: 250"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-heading">Type de vente</label>
            <div className="flex gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-black/[0.06] bg-background-surface-alt px-4 py-3 text-sm transition-all hover:border-primary/20 has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="sellType"
                  value="VENTE_DIRECTE"
                  checked={type === "VENTE_DIRECTE"}
                  onChange={() => setType("VENTE_DIRECTE")}
                  className="accent-primary"
                />
                Vente directe
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-black/[0.06] bg-background-surface-alt px-4 py-3 text-sm transition-all hover:border-primary/20 has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="sellType"
                  value="ENCHERE"
                  checked={type === "ENCHERE"}
                  onChange={() => setType("ENCHERE")}
                  className="accent-primary"
                />
                Enchere
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={submitting} disabled={submitting}>
            Mettre en vente
          </Button>
        </form>
      </Card>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ListingSkeleton() {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-background-surface/60 p-4 animate-pulse">
      <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-background-surface-alt" />
      <div className="mb-1 h-4 w-3/4 rounded-lg bg-background-surface-alt" />
      <div className="mb-2 h-3 w-1/2 rounded-lg bg-background-surface-alt" />
      <div className="mb-3 h-3 w-2/3 rounded-lg bg-background-surface-alt" />
      <div className="h-9 w-full rounded-xl bg-background-surface-alt" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<Tab>("buy");
  const [sellModalOpen, setSellModalOpen] = useState(false);

  const { listings, myListings, loading, error, fetchListings, fetchMyListings } =
    useMarketplaceStore();

  const fetchListsRef = useRef(false);

  useEffect(() => {
    if (fetchListsRef.current) return;
    fetchListsRef.current = true;
    if (activeTab === "buy") fetchListings();
    else if (activeTab === "sell") fetchMyListings();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const isBuyLoading = activeTab === "buy" && loading;
  const isSellLoading = activeTab === "sell" && loading;

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

        {/* Buy tab */}
        {activeTab === "buy" && (
          <>
            {isBuyLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ListingSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <EmptyState
                icon={<AlertCircle className="h-8 w-8 text-status-error" />}
                title="Erreur de chargement"
                description={error}
                action={
                  <Button variant="secondary" onClick={fetchListings}>
                    Reessayer
                  </Button>
                }
              />
            ) : listings.length === 0 ? (
              <EmptyState
                icon={<Store className="h-8 w-8 text-text-muted" />}
                title="Aucune offre"
                description="Le marche est vide pour le moment."
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {listings.map((listing) => (
                  <BuyCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Sell tab */}
        {activeTab === "sell" && (
          <>
            <div className="mb-4 flex justify-end">
              <Button size="sm" onClick={() => setSellModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Vendre un artefact
              </Button>
            </div>

            {isSellLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ListingSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <EmptyState
                icon={<AlertCircle className="h-8 w-8 text-status-error" />}
                title="Erreur de chargement"
                description={error}
                action={
                  <Button variant="secondary" onClick={fetchMyListings}>
                    Reessayer
                  </Button>
                }
              />
            ) : myListings.length === 0 ? (
              <EmptyState
                icon={<Store className="h-8 w-8 text-text-muted" />}
                title="Aucune vente en cours"
                description="Mettez en vente un artefact depuis votre inventaire."
                action={
                  <Button onClick={() => setSellModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Vendre un artefact
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {myListings.map((listing) => (
                  <SellCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </>
        )}
      </PageContainer>

      <SellModal open={sellModalOpen} onClose={() => setSellModalOpen(false)} />
    </div>
  );
}
