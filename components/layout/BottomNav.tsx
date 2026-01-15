"use client";

import Link from "next/link";
import { Home, Map, User, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/stores";

/**
 * Game-themed mobile bottom navigation bar.
 * Full-width, docked, with glowing active-state icons.
 */
export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  const navItems = [
    { id: "home" as const, href: "/", icon: Home, label: "Accueil" },
    { id: "map" as const, href: "/map", icon: Map, label: "Carte" },
    { id: "create" as const, href: "/create", icon: Rocket, label: "Créer" },
    { id: "profile" as const, href: "/profile", icon: User, label: "Profil" },
  ];

  return (
    <nav className="bg-brand-surface fixed bottom-0 left-0 right-0 z-50 h-20 border-t border-border md:hidden">
      <div className="grid h-full grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 transition-all duration-300",
                !isActive && "text-brand-muted hover:text-brand-light"
              )}
            >
              {/* Active indicator glow */}
              {isActive && (
                <div className="from-brand-primary/20 via-brand-primary/5 absolute inset-x-0 top-0 h-full bg-gradient-to-t to-transparent" />
              )}
              {/* Top line indicator */}
              {isActive && (
                <div className="bg-brand-primary absolute top-0 h-1 w-12 rounded-b-full" />
              )}

              <Icon
                className={cn(
                  "h-6 w-6 transition-colors duration-200",
                  isActive && "text-brand-primary"
                )}
              />

              <span
                className={cn(
                  "font-heading text-xs font-bold uppercase tracking-wider transition-colors duration-200",
                  isActive && "text-brand-primary"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
