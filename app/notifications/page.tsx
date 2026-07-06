"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, MapPin, Trophy, Users, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/stores";
import { notificationsApi, type NotificationItem } from "@/lib/api/notifications-api";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

function getNotificationIcon(type: string) {
  switch (type) {
    case "hunt_completed":
      return <Trophy className="h-5 w-5 text-primary" />;
    case "new_participant":
      return <Users className="h-5 w-5 text-primary" />;
    case "hunt_nearby":
      return <MapPin className="h-5 w-5 text-primary" />;
    default:
      return <Bell className="h-5 w-5 text-primary" />;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "A l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  if (diffDays < 7) return `Il y a ${diffDays} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchNotifications = async () => {
      try {
        const data = await notificationsApi.getNotifications();
        setNotifications(data);
      } catch {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, router]);

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      try {
        await notificationsApi.markRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
        );
      } catch {
        // Handle error silently
      }
    }

    // Navigate to relevant page
    if (notification.huntId) {
      router.push(`/hunt/${notification.huntId}`);
    }
  };

  const isPartner = user?.role === "partner";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-heading">
          Notifications
        </h1>
        {isPartner && (
          <p className="mt-1 text-sm text-text-muted">
            Vos notifications en tant qu&apos;organisateur
          </p>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8 text-text-muted" />}
          title="Aucune notification"
          description="Vous n'avez pas encore de notification. Completez des chasses au tresor pour en recevoir !"
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-all duration-200",
                notification.isRead
                  ? "border-black/[0.06] bg-background-surface/50"
                  : "border-primary/20 bg-primary/[0.03]"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm",
                        notification.isRead
                          ? "text-text-muted"
                          : "font-medium text-text-heading"
                      )}
                    >
                      {notification.message}
                    </p>
                    <span className="whitespace-nowrap text-xs text-text-muted">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  {notification.huntTitle && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{notification.huntTitle}</span>
                      <ArrowRight className="h-3 w-3 shrink-0" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
