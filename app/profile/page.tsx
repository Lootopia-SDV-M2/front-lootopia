"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Star,
  MapPin,
  Settings,
  LogOut,
  Award,
  Target,
  Flame,
  Camera,
  ChevronRight,
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
      <div
        className="bg-brand-accent absolute inset-0 animate-pulse blur-md"
        style={{
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      />
      <div
        className="bg-brand-surface text-brand-light relative z-10 flex h-full w-full items-center justify-center text-3xl font-bold"
        style={{
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        {level}
      </div>
    </div>
  );
}

function HuntHistoryCard({ hunt }: { hunt: CompletedHunt }) {
  return (
    <Card variant="interactive">
      <div className="flex items-center gap-4 p-4">
        <div className="bg-brand-primary/10 text-brand-primary flex h-12 w-12 items-center justify-center rounded-lg">
          <Trophy className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-brand-light truncate font-heading font-bold">
            {hunt.huntTitle}
          </p>
          <p className="text-brand-muted text-sm">
            {formatDate(hunt.completedAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-brand-primary font-heading font-bold">
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
    // Render a skeleton loader to avoid hydration mismatch and layout shift
    return (
      <div className="mx-auto max-w-2xl animate-pulse px-4 py-6">
        <div className="bg-brand-surface mb-6 h-40 rounded-2xl" />
        <div className="bg-brand-surface mb-6 h-32 rounded-2xl" />
        <div className="bg-brand-surface h-64 rounded-2xl" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <EmptyState
          icon={<Award className="text-brand-muted h-12 w-12" />}
          title="Profil non trouvé"
          description="Connectez-vous pour voir votre progression."
          action={
            isAuthenticated ? (
              <Button
                variant="ghost"
                className="text-brand-danger"
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
      <Card variant="glass" className="mb-6 overflow-hidden">
        <div className="bg-brand-accent/5 relative h-28">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        </div>
        <div className="relative px-6 pb-6">
          <div className="-mt-16 flex items-end gap-4">
            <Avatar
              name={player.username}
              src={player.avatarUrl}
              size="xl"
              className="border-brand-surface border-4"
            />
            <div className="flex-1">
              <h1 className="text-brand-light font-heading text-2xl font-bold">
                {player.username}
              </h1>
              <p className="text-brand-muted text-sm">{player.email}</p>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

      <Card variant="default" className="mb-6 p-6">
        <div className="flex items-center gap-6">
          <LevelBadge level={player.level} />
          <div className="flex-1">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-brand-light font-heading font-bold">
                Niveau {player.level}
              </span>
              <span className="text-brand-muted text-sm">
                {xpProgress.current} / {xpProgress.required} XP
              </span>
            </div>
            <div className="bg-brand-dark h-4 w-full rounded-full">
              <div
                className="bg-brand-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card variant="default" className="p-4 text-center">
          <Trophy className="text-brand-primary mx-auto mb-2 h-6 w-6" />
          <p className="text-brand-light font-heading text-2xl font-bold">
            {player.huntsCompleted}
          </p>
          <p className="text-brand-muted text-xs uppercase">Terminées</p>
        </Card>
        <Card variant="default" className="p-4 text-center">
          <Flame className="text-brand-primary mx-auto mb-2 h-6 w-6" />
          <p className="text-brand-light font-heading text-2xl font-bold">
            {player.totalXp}
          </p>
          <p className="text-brand-muted text-xs uppercase">XP Total</p>
        </Card>
        <Card variant="default" className="p-4 text-center">
          <Target className="text-brand-primary mx-auto mb-2 h-6 w-6" />
          <p className="text-brand-light font-heading text-2xl font-bold">
            {player.level}
          </p>
          <p className="text-brand-muted text-xs uppercase">Niveau</p>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-brand-light mb-4 font-heading text-xl font-bold">
          Historique des Chasses
        </h2>
        {player.completedHunts.length === 0 ? (
          <Card
            variant="default"
            className="border-2 border-dashed border-border p-8"
          >
            <EmptyState
              icon={<MapPin className="text-brand-muted h-8 w-8" />}
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
                Voir tout l'historique <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Link href="/ar">
          <Button variant="secondary" size="lg" className="w-full">
            <Camera className="h-5 w-5" />
            Test RA
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="md"
          className="text-brand-danger w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
