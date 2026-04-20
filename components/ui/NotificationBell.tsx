"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useAuthStore } from "@/lib/stores";
import { notificationsApi, type NotificationItem } from "@/lib/api/notifications-api";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotifications = async () => {
      try {
        const data = await notificationsApi.getNotifications();
        setNotifications(data);
        setHasUnread(data.some((n) => !n.isRead));
      } catch {
        // Silently fail - notifications are non-critical
      }
    };

    fetchNotifications();

    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Link
      href="/notifications"
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
        hasUnread
          ? "bg-primary/10 text-primary hover:bg-primary/15"
          : "text-text-muted hover:bg-black/[0.03] hover:text-text-heading"
      )}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-status-error px-1 text-[10px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
