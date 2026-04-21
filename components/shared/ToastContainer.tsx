"use client";

import { useToastStore } from "@/lib/stores/toast-store";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[9999] flex flex-col gap-2 md:bottom-6 md:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm min-w-64 max-w-80",
            "animate-in slide-in-from-right-full duration-300",
            toast.type === "success" &&
              "border-status-success/20 bg-status-success/10 text-status-success",
            toast.type === "error" &&
              "border-status-error/20 bg-status-error/10 text-status-error",
            toast.type === "info" &&
              "border-primary/20 bg-primary/10 text-primary"
          )}
        >
          {toast.type === "success" && <CheckCircle className="h-4 w-4 shrink-0" />}
          {toast.type === "error" && <XCircle className="h-4 w-4 shrink-0" />}
          {toast.type === "info" && <Info className="h-4 w-4 shrink-0" />}
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
