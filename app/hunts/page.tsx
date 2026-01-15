import Link from "next/link";
import { Plus, Map, Filter } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { mockHunts, getDifficultyLabel } from "@/lib/data/mock-hunts";

export const metadata = {
  title: "Chasses au trésor | Lootopia",
  description: "Découvrez toutes les chasses au trésor disponibles",
};

export default function HuntsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-brand-light font-heading text-3xl font-bold">
            Chasses au Trésor
          </h1>
          <p className="text-brand-muted mt-1">
            {mockHunts.length} chasses disponibles à l'exploration
          </p>
        </div>
        <Link href="/create">
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            Créer une chasse
          </Button>
        </Link>
      </div>

      <Card variant="glass" className="mb-8 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
          <Badge variant="primary">Toutes</Badge>
          <Badge variant="default">Facile</Badge>
          <Badge variant="default">Moyen</Badge>
          <Badge variant="default">Difficile</Badge>
          <Badge variant="default">Expert</Badge>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockHunts.map((hunt) => (
          <Link key={hunt.id} href={`/hunt/${hunt.id}`} className="group">
            <Card variant="interactive" className="h-full overflow-hidden">
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-brand-light group-hover:text-brand-primary font-heading text-xl font-bold transition-colors">
                    {hunt.title}
                  </h3>
                  <Badge>{getDifficultyLabel(hunt.difficulty)}</Badge>
                </div>
                <p className="text-brand-muted mb-6 line-clamp-3 text-sm">
                  {hunt.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-brand-muted flex flex-col">
                    <span className="text-brand-light font-bold">
                      {" "}
                      récompense
                    </span>
                    <span className="text-brand-primary font-heading text-lg font-bold">
                      {hunt.reward} XP
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-brand-light font-bold">Durée</span>
                    <p className="text-brand-muted font-semibold">
                      {hunt.duration}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/map">
          <Button variant="secondary" size="lg">
            <Map className="h-4 w-4" />
            Voir sur la carte
          </Button>
        </Link>
      </div>
    </div>
  );
}
