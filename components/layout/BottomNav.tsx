"use client";

import Link from "next/link";
import { Home, Map, User, Rocket, Package, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore, useAuthStore } from "@/lib/stores";

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();
  const user = useAuthStore((s) => s.user);

  const isPartner = user?.role === "partner";

  const navItems = isPartner
    ? [
        { id: "home" as const, href: "/", icon: Home, label: "Accueil" },
        { id: "map" as const, href: "/map", icon: Map, label: "Carte" },
        {
          id: "create" as const,
          href: "/create",
          icon: Rocket,
          label: "Creer",
        },
        {
          id: "profile" as const,
          href: "/profile",
          icon: User,
          label: "Profil",
        },
      ]
    : [
        { id: "map" as const, href: "/map", icon: Map, label: "Carte" },
        {
          id: "inventory" as const,
          href: "/inventory",
          icon: Package,
          label: "Inventaire",
        },
        {
          id: "marketplace" as const,
          href: "/marketplace",
          icon: Store,
          label: "Marche",
        },
        {
          id: "profile" as const,
          href: "/profile",
          icon: User,
          label: "Profil",
        },
      ];

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-black/[0.04] bg-background/90 backdrop-blur-2xl md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 transition-all duration-300",
                !isActive && "text-text-muted"
              )}
            >
              {isActive && (
                <div className="absolute top-0 h-0.5 w-8 rounded-b-full bg-gradient-to-r from-primary to-gold-500" />
              )}

              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive &&
                    "text-primary drop-shadow-[0_0_6px_rgba(200,154,14,0.3)]"
                )}
              />

              <span
                className={cn(
                  "text-[10px] font-medium tracking-wider transition-colors duration-300",
                  isActive && "text-primary"
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
