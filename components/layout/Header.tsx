"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus, Map, Package, Store, History } from "lucide-react";
import { useAuthStore, usePlayerStore } from "@/lib/stores";
import { Button } from "@/components/ui";
import { Avatar } from "@/components/shared";
import { cn } from "@/lib/utils";

const playerNavItems = [
  { href: "/map", icon: Map, label: "Carte" },
  { href: "/inventory", icon: Package, label: "Inventaire" },
  { href: "/marketplace", icon: Store, label: "Marche" },
  { href: "/history", icon: History, label: "Historique" },
];

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const { player } = usePlayerStore();
  const pathname = usePathname();

  const displayName = user?.username || player?.username;
  const isPartner = user?.role === "partner";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 hidden h-16 border-b border-black/[0.04] bg-background/80 backdrop-blur-2xl md:flex">
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

        {/* Desktop nav links for authenticated players */}
        {isAuthenticated && !isPartner && (
          <nav className="flex items-center gap-1">
            {playerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-text-muted hover:bg-black/[0.03] hover:text-text-heading"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {isAuthenticated && displayName ? (
            <Link
              href="/profile"
              className="group flex items-center gap-3 rounded-xl border border-black/[0.04] bg-background-surface/60 p-1.5 pr-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/15 hover:shadow-glow-sm"
            >
              <Avatar src={player?.avatarUrl} name={displayName} size="sm" />
              <div className="text-left">
                <p className="text-sm font-semibold text-text-heading">
                  {displayName}
                </p>
                <p className="text-xs text-primary">
                  {isPartner ? "Organisateur" : `Niveau ${player?.level ?? 1}`}
                </p>
              </div>
            </Link>
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
