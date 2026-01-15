"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn, UserPlus } from "lucide-react";
import { useAuthStore, usePlayerStore } from "@/lib/stores";
import { Button } from "@/components/ui";
import { Avatar } from "@/components/shared";

/**
 * A simplified, game-themed header for desktop.
 * Dynamically shows user info or login/register buttons.
 */
export function Header() {
  // Note: In a real app, you'd likely have a single hook combining these.
  const { isAuthenticated } = useAuthStore();
  const { player } = usePlayerStore();

  return (
    <header className="bg-brand-surface/80 fixed left-0 right-0 top-0 z-50 hidden h-20 border-b border-border backdrop-blur-lg md:flex">
      <div className="container mx-auto flex h-full items-center justify-between px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/icons/favicon.png"
            alt="Lootopia"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-brand-light font-heading text-2xl font-bold tracking-widest">
            LOOTOPIA
          </span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && player ? (
            <Link
              href="/profile"
              className="bg-brand-dark flex items-center gap-4 rounded-full p-1 pr-4 transition-colors hover:bg-border"
            >
              <Avatar src={player.avatarUrl} name={player.username} size="md" />
              <div className="text-left">
                <p className="text-brand-light font-heading text-sm font-bold">
                  {player.username}
                </p>
                <p className="text-brand-primary text-xs">
                  Niveau {player.level}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="secondary" size="md">
                  <LogIn className="h-4 w-4" />
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="md">
                  <UserPlus className="h-4 w-4" />
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
