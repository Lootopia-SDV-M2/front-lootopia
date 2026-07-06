import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
        <Compass className="h-12 w-12 text-primary" />
      </div>
      <h1 className="font-heading text-6xl font-bold text-text-heading">404</h1>
      <p className="mt-4 text-lg text-text-muted">
        Oups&nbsp;! Cette page s&apos;est perdue en chemin...
      </p>
      <p className="mt-2 text-sm text-text-muted">
        Le trésor que vous cherchez n&apos;existe pas ou a été déplacé.
      </p>
      <div className="mt-10">
        <Link href="/map">
          <Button variant="primary" size="lg">
            <ArrowLeft className="h-5 w-5" />
            Retour à la carte
          </Button>
        </Link>
      </div>
    </div>
  );
}
