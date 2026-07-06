"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn, Package, UserPlus } from "lucide-react";
import { useAuthStore, usePlayerStore } from "@/lib/stores";
import { Button } from "@/components/ui";
import { Avatar } from "@/components/shared";

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const { player } = usePlayerStore();

  const displayName = user?.username || player?.username;
  const isPartner = user?.role === "partner";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 hidden h-16 border-b border-black/[0.06] bg-background/95 backdrop-blur md:flex">
      <div className="container mx-auto flex h-full items-center justify-between px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/icons/favicon.png"
            alt="Lootopia"
            width={36}
            height={36}
            className="rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-heading text-lg font-bold tracking-[0.2em] text-text-heading">
            LOOTOPIA
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated && displayName ? (
            <>
              <Link href="/inventory">
                <Button variant="secondary" size="sm">
                  <Package className="h-4 w-4" />
                  Inventaire
                </Button>
              </Link>
              <Link
                href="/profile"
                className="group flex items-center gap-3 rounded-lg border border-black/[0.06] bg-background-surface p-1.5 pr-4 transition-colors duration-200 hover:border-primary/20"
              >
                <Avatar src={player?.avatarUrl} name={displayName} size="sm" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-text-heading">
                    {displayName}
                  </p>
                  <p className="text-xs text-primary">
                    {isPartner
                      ? "Organisateur"
                      : `Niveau ${player?.level ?? 1}`}
                  </p>
                </div>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="h-4 w-4" />
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  <UserPlus className="h-4 w-4" />
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
