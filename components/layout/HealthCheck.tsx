"use client";

import { useEffect, useState } from "react";

export function HealthCheck() {
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("[Lootopia] NEXT_PUBLIC_API_URL is not defined");
      setBackendDown(true);
      return;
    }

    fetch(`${apiUrl}/actuator/health`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.status !== "UP") setBackendDown(true);
      })
      .catch(() => {
        setBackendDown(true);
      });
  }, []);

  if (!backendDown) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[100] bg-red-600 px-4 py-2 text-center text-sm font-medium text-white">
      Le serveur backend est actuellement indisponible. Certaines
      fonctionnalités peuvent ne pas fonctionner.
    </div>
  );
}
