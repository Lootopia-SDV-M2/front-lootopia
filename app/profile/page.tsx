"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Settings,
  LogOut,
  Award,
  Target,
  Flame,
  Camera,
  ChevronRight,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Avatar, EmptyState } from "@/components/shared";
import { Card, Badge, Button } from "@/components/ui";
import { usePlayerStore, useAuthStore } from "@/lib/stores";
import { getDifficultyLabel } from "@/lib/data/mock-hunts";
import { cn } from "@/lib/utils";
import type { CompletedHunt } from "@/types";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function LevelBadge({ level }: { level: number }) {
  return (
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 animate-glow rounded-2xl bg-primary/20 blur-lg" />
      <div className="relative z-10 flex h-full w-full items-center justify-center rounded-2xl border border-primary/20 bg-background-surface font-heading text-3xl font-bold text-primary">
        {level}
      </div>
    </div>
  );
}

function HuntHistoryCard({ hunt }: { hunt: CompletedHunt }) {
  return (
    <Card variant="interactive" className="p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/10 bg-primary/[0.06]">
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading font-bold text-text-heading">
            {hunt.huntTitle}
          </p>
          <p className="text-xs text-text-muted">
            {formatDate(hunt.completedAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-heading font-bold text-primary">
            +{hunt.xpEarned} XP
          </p>
          <Badge variant="default" className="mt-1">
            {getDifficultyLabel(hunt.difficulty)}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { player, getXpProgress } = usePlayerStore();
  const { logout, isAuthenticated, user: authUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse px-4 py-6">
        <div className="mb-6 h-40 rounded-xl bg-background-surface" />
        <div className="mb-6 h-32 rounded-xl bg-background-surface" />
        <div className="h-64 rounded-xl bg-background-surface" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <EmptyState
          icon={<Award className="h-12 w-12 text-text-muted" />}
          title="Profil non trouvé"
          description="Connectez-vous pour voir votre progression."
          action={
            isAuthenticated ? (
              <Button
                variant="ghost"
                className="text-status-error"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="primary">Connexion</Button>
              </Link>
            )
          }
        />
      </div>
    );
  }

  const xpProgress = getXpProgress();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Profile header */}
      <Card variant="glass" className="mb-6 overflow-hidden">
        <div className="relative h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.08] via-transparent to-secondary/[0.06]" />
          <div className="bg-dots absolute inset-0 opacity-30" />
        </div>
        <div className="relative px-6 pb-6">
          <div className="-mt-12 flex items-end gap-4">
            <Avatar
              name={player.username}
              src={player.avatarUrl}
              size="xl"
              className="border-4 border-background-surface shadow-glow-sm"
            />
            <div className="flex-1 pb-1">
              <h1 className="font-heading text-2xl font-bold text-text-heading">
                {player.username}
              </h1>
              <p className="text-sm text-text-muted">{player.email}</p>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* XP Progress */}
      <Card variant="default" className="mb-6 p-6">
        <div className="flex items-center gap-6">
          <LevelBadge level={player.level} />
          <div className="flex-1">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-heading font-bold text-text-heading">
                Niveau {player.level}
              </span>
              <span className="text-xs text-text-muted">
                {xpProgress.current} / {xpProgress.required} XP
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-background-surface-alt">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-gold-500 transition-all duration-700 ease-spring"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          {
            icon: Trophy,
            value: player.huntsCompleted,
            label: "Terminées",
            color: "text-primary",
          },
          {
            icon: Flame,
            value: player.totalXp,
            label: "XP Total",
            color: "text-secondary",
          },
          {
            icon: Target,
            value: player.level,
            label: "Niveau",
            color: "text-status-success",
          },
        ].map((stat) => (
          <Card key={stat.label} variant="default" className="p-4 text-center">
            <stat.icon className={cn("mx-auto mb-2 h-5 w-5", stat.color)} />
            <p className="font-heading text-2xl font-bold text-text-heading">
              {stat.value}
            </p>
            <p className="text-[11px] tracking-wider text-text-muted">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Hunt history */}
      <div className="mb-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-text-heading">
          Historique des Chasses
        </h2>
        {player.completedHunts.length === 0 ? (
          <Card
            variant="default"
            className="border-2 border-dashed border-black/[0.06] p-8"
          >
            <EmptyState
              icon={<MapPin className="h-8 w-8 text-text-muted" />}
              title="Aucune chasse terminée"
              description="Partez à l'aventure pour compléter votre première chasse !"
              action={
                <Link href="/map">
                  <Button variant="primary" size="sm">
                    Explorer la carte
                  </Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {player.completedHunts.slice(0, 3).map((hunt) => (
              <HuntHistoryCard key={hunt.huntId} hunt={hunt} />
            ))}
            {player.completedHunts.length > 3 && (
              <Button variant="secondary" className="w-full">
                Voir tout l&apos;historique <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Link href="/ar">
          <Button variant="secondary" size="lg" className="w-full">
            <Camera className="h-5 w-5" />
            Test RA
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="md"
          className="w-full text-status-error hover:text-status-error"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
