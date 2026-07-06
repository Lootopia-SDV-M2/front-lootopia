"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, User, Rocket, Compass, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore, useAuthStore } from "@/lib/stores";

type BottomNavTab =
  | "home"
  | "map"
  | "profile"
  | "create"
  | "hunts"
  | "inventory";

function getTabFromPathname(
  pathname: string,
  isPartner: boolean
): BottomNavTab {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/map")) return "map";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/inventory")) return "inventory";
  if (pathname.startsWith("/create")) return "create";
  if (pathname.startsWith("/hunt") || pathname.startsWith("/hunts")) {
    return isPartner ? "create" : "hunts";
  }
  return "home";
}

export function BottomNav() {
  const { setActiveTab } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();

  const isPartner = user?.role === "partner";
  const currentTab = getTabFromPathname(pathname, isPartner);

  const navItems = [
    { id: "home" as const, href: "/", icon: Home, label: "Accueil" },
    { id: "map" as const, href: "/map", icon: Map, label: "Carte" },
    isPartner
      ? { id: "create" as const, href: "/create", icon: Rocket, label: "Créer" }
      : {
          id: "hunts" as const,
          href: "/hunts",
          icon: Compass,
          label: "Chasses",
        },
    {
      id: "inventory" as const,
      href: "/inventory",
      icon: Package,
      label: "Sac",
    },
    { id: "profile" as const, href: "/profile", icon: User, label: "Profil" },
  ];

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-black/[0.06] bg-background/95 backdrop-blur md:hidden">
      <div className="grid h-16 grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 transition-colors duration-200",
                isActive ? "text-primary" : "text-text-muted"
              )}
            >
              {isActive && (
                <div className="absolute top-0 h-0.5 w-8 rounded-b-full bg-primary" />
              )}

              <Icon
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  isActive && "text-primary"
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
