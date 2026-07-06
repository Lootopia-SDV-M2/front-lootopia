"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { Download } from "lucide-react";

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showiOSTooltip, setShowiOSTooltip] = useState(false);

  useEffect(() => {
    // Detect iOS
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent;
      const isIOSDevice =
        /iPhone|iPad|iPod/i.test(userAgent);
      setIsIOS(isIOSDevice);
    };

    checkIOS();

    // Listen for beforeinstallprompt event (Chrome/Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.preventDefault();
      (deferredPrompt as any).prompt();
      const { outcome } = await (deferredPrompt as any).userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  // Show iOS tooltip
  if (isIOS) {
    return (
      <div className="fixed bottom-24 right-4 z-40 md:bottom-24 md:right-6">
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowiOSTooltip(!showiOSTooltip)}
            className="shadow-glow-sm"
          >
            <Download className="h-4 w-4" />
            Installer l&apos;app
          </Button>
          {showiOSTooltip && (
            <div className="absolute bottom-full right-0 mb-2 w-64 rounded-xl border border-black/[0.08] bg-background-surface p-3 text-xs text-text-body shadow-lg">
              <p className="font-medium text-text-heading">Pour installer :</p>
              <p className="mt-1">
                Appuyez sur{" "}
                <span className="inline-flex items-center rounded bg-black/5 px-1.5 py-0.5 font-mono text-text-muted">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 2l16 0M4 9h16M4 16h16M10 22l4-6 4 6" />
                  </svg>
                  Partager
                </span>{" "}
                puis{' '}
                <span className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-text-muted">
                  Sur l&apos;ecran d&apos;accueil
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show Android/Chrome install button
  if (deferredPrompt) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={handleInstall}
        className="fixed bottom-24 right-4 z-40 shadow-glow-sm md:bottom-24 md:right-6"
      >
        <Download className="h-4 w-4" />
        Installer l&apos;app
      </Button>
    );
  }

  return null;
}
