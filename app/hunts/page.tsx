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
          <h1 className="font-heading text-3xl font-bold text-text-heading">
            Chasses au Trésor
          </h1>
          <p className="mt-1 text-text-muted">
            {mockHunts.length} chasses disponibles
          </p>
        </div>
        <Link href="/create">
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            Créer
          </Button>
        </Link>
      </div>

      <Card variant="glass" className="mb-8 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm">
            <Filter className="h-3.5 w-3.5" />
            Filtres
          </Button>
          <Badge variant="primary">Toutes</Badge>
          <Badge variant="default">Facile</Badge>
          <Badge variant="default">Moyen</Badge>
          <Badge variant="default">Difficile</Badge>
          <Badge variant="default">Expert</Badge>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockHunts.map((hunt) => (
          <Link key={hunt.id} href={`/hunt/${hunt.id}`} className="group">
            <Card variant="interactive" className="h-full overflow-hidden p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="font-heading text-lg font-bold text-text-heading transition-colors duration-300 group-hover:text-primary">
                  {hunt.title}
                </h3>
                <Badge variant="primary" className="shrink-0">
                  {getDifficultyLabel(hunt.difficulty)}
                </Badge>
              </div>
              <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-text-muted">
                {hunt.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs text-text-muted">Récompense</span>
                  <p className="font-heading text-lg font-bold text-primary">
                    {hunt.reward} XP
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-muted">Durée</span>
                  <p className="font-semibold text-text-heading">
                    {hunt.duration}
                  </p>
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
