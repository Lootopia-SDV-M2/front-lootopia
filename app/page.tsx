import Link from "next/link";
import {
  Map,
  Compass,
  Trophy,
  Sparkles,
  Users,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { mockHunts } from "@/lib/data/mock-hunts";
import { getDifficultyLabel } from "@/lib/data/mock-hunts";
import { cn } from "@/lib/utils";
import type { Hunt } from "@/types";

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background py-24">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-text-heading sm:text-6xl">
          L'Aventure Vous Attend
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted">
          Explorez votre monde, découvrez des trésors cachés et vivez des quêtes
          épiques grâce à la puissance de la réalité augmentée.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/map">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <Map className="mr-2 h-5 w-5" />
              Explorer les chasses
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <Rocket className="mr-2 h-5 w-5" />
              Devenir partenaire
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: Map,
      title: "Trouvez",
      description: "Choisissez une chasse au trésor sur la carte interactive.",
    },
    {
      icon: Compass,
      title: "Explorez",
      description: "Suivez les indices et résolvez des énigmes sur le terrain.",
    },
    {
      icon: Trophy,
      title: "Gagnez",
      description:
        "Débloquez le trésor final, gagnez de l'XP et des récompenses.",
    },
  ];

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center font-heading text-4xl font-bold text-text-heading">
          Comment Jouer ?
        </h2>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={index}
              variant="default"
              className="group border-border p-8 text-center transition-colors hover:border-secondary"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary shadow-lg transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-text-heading">
                {step.title}
              </h3>
              <p className="mt-2 text-text-muted">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HuntCard({ hunt }: { hunt: Hunt }) {
  return (
    <Card variant="interactive" className="group overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/10" />
        <div
          className={cn(
            "h-full w-full bg-gradient-to-br from-background-surface to-background transition-transform duration-300 group-hover:scale-105"
          )}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute right-4 top-4">
          <Badge variant="primary">{getDifficultyLabel(hunt.difficulty)}</Badge>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-heading text-lg font-bold text-text-heading transition-colors group-hover:text-secondary">
          {hunt.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-text-muted">
          {hunt.description}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <div className="font-heading text-lg font-bold text-secondary">
            {hunt.reward} XP
          </div>
          <Link href={`/hunt/${hunt.id}`}>
            <Button variant="secondary" size="sm">
              Jouer <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

function FeaturedHuntsSection() {
  const featured = mockHunts.slice(0, 3);
  return (
    <section className="bg-background-surface py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center font-heading text-4xl font-bold text-text-heading">
          Chasses à la Une
        </h2>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {featured.map((hunt) => (
            <HuntCard key={hunt.id} hunt={hunt} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/map">
            <Button variant="primary" size="lg">
              Voir toutes les chasses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PartnerCtaSection() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-4">
        <Card variant="glass" className="overflow-hidden p-8 sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 opacity-50" />
          <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
            <div className="text-center md:text-left">
              <h2 className="font-heading text-4xl font-bold text-text-heading">
                Devenez Partenaire
              </h2>
              <p className="mt-4 text-text-muted">
                Musées, villes, associations : créez des expériences
                interactives uniques pour vos visiteurs grâce à notre outil de
                création simple et puissant.
              </p>
              <div className="mt-8">
                <Link href="/create">
                  <Button variant="secondary" size="lg">
                    Créer une chasse
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden items-center justify-center md:flex">
              <div className="relative h-48 w-48 text-secondary">
                <Users className="absolute left-0 top-0 h-24 w-24 -rotate-12 opacity-40" />
                <Rocket className="absolute bottom-0 right-0 h-32 w-32 rotate-12 opacity-60" />
                <Sparkles className="absolute right-4 top-8 h-20 w-20 opacity-30" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="bg-background">
      <HeroSection />
      <HowItWorksSection />
      <FeaturedHuntsSection />
      <PartnerCtaSection />
    </div>
  );
}
