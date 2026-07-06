"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Coins,
  PackageOpen,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { EmptyState } from "@/components/shared";
import { ArtefactCard } from "@/components/marketplace/ArtefactCard";
import { Badge, Button, Card, Spinner } from "@/components/ui";
import { useAuthStore, useInventoryStore } from "@/lib/stores";

export default function InventoryPage() {
  const {
    artefacts,
    wallet,
    isLoading,
    error,
    loadInventory,
    getBalancePol,
    clearInventory,
    clearError,
  } = useInventoryStore();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      clearInventory();
      return;
    }
    void loadInventory();
  }, [clearInventory, isAuthenticated, loadInventory]);

  const balancePol = isAuthenticated
    ? (wallet?.balancePol ?? getBalancePol())
    : 0;
  const visibleArtefacts = isAuthenticated ? artefacts : [];

  if (!mounted) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 h-32 animate-pulse rounded-xl bg-background-surface" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-40 animate-pulse rounded-xl bg-background-surface" />
          <div className="h-40 animate-pulse rounded-xl bg-background-surface" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <Badge variant="primary" className="mb-3 gap-1">
          <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
          Inventaire
        </Badge>
        <h1 className="font-heading text-3xl font-bold text-text-heading">
          Mes artefacts
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Retrouvez vos objets collectés et votre solde POL.
        </p>
      </div>

      <Card variant="glass" className="mb-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted">
              Solde disponible
            </p>
            <p className="mt-1 font-heading text-3xl font-bold text-primary">
              {balancePol.toLocaleString("fr-FR")} POL
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10">
            <Coins className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
        </div>
      </Card>

      {error && (
        <Card
          variant="default"
          className="mb-6 border-status-error/20 bg-status-error/5 p-4"
          role="alert"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-status-error" />
              <div>
                <p className="font-semibold text-text-heading">
                  Inventaire indisponible
                </p>
                <p className="text-sm text-text-muted">{error}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                clearError();
                void loadInventory();
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
          </div>
        </Card>
      )}

      {!isAuthenticated ? (
        <Card
          variant="default"
          className="border-2 border-dashed border-black/[0.06]"
        >
          <EmptyState
            icon={<PackageOpen className="h-8 w-8 text-text-muted" />}
            title="Sac vide"
            description="Connectez-vous pour retrouver vos artefacts et votre solde POL."
            action={
              <Link href="/login?redirect=/inventory">
                <Button variant="primary" size="sm">
                  Se connecter
                </Button>
              </Link>
            }
          />
        </Card>
      ) : isLoading && visibleArtefacts.length === 0 ? (
        <Card
          variant="default"
          className="flex min-h-56 items-center justify-center p-8"
        >
          <div className="flex flex-col items-center gap-3 text-sm text-text-muted">
            <Spinner size="lg" />
            Chargement de l&apos;inventaire...
          </div>
        </Card>
      ) : visibleArtefacts.length === 0 ? (
        <Card
          variant="default"
          className="border-2 border-dashed border-black/[0.06]"
        >
          <EmptyState
            icon={<PackageOpen className="h-8 w-8 text-text-muted" />}
            title="Aucun artefact pour le moment"
            description="Terminez une chasse pour ajouter votre premier objet à l'inventaire."
            action={
              <Link href="/hunts">
                <Button variant="primary" size="sm">
                  Voir les chasses
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-text-heading">
              Collection
            </h2>
            <span className="text-sm text-text-muted">
              {visibleArtefacts.length} artefact
              {visibleArtefacts.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {visibleArtefacts.map((artefact) => (
              <ArtefactCard key={artefact.id} artefact={artefact} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
