import { ARView } from "@/components/ar/ARView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Caméra | Lootopia",
  description: "Simulation de réalité augmentée pour la chasse au trésor",
};

export default function ARPage() {
  return (
    <div className="fixed inset-0 pb-20 pt-16 md:pb-4 md:pt-20">
      <ARView />
    </div>
  );
}
