import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Gem,
  Map,
  MapPin,
  Rocket,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { getDifficultyLabel, mockHunts } from "@/lib/data/mock-hunts";
import type { Hunt } from "@/types";

function HeroSection() {
  return (
    <section className="border-b border-black/[0.06] bg-background py-14 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-[1fr_420px]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wide text-primary">
              Chasse au trésor géolocalisée
            </span>
          </div>

          <h1 className="max-w-3xl font-heading text-4xl font-bold text-text-heading sm:text-5xl md:text-6xl">
            Explorez, jouez, collectez.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
            Trouvez des chasses proches de vous, suivez les indices sur la
            carte, puis gardez vos artefacts dans l'inventaire.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/map">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <Map className="h-5 w-5" />
                Explorer
              </Button>
            </Link>
            <Link href="/register?role=organisateur">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Rocket className="h-5 w-5" />
                Créer une chasse
              </Button>
            </Link>
          </div>
        </div>

        <Card variant="default" className="p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-heading">
                Chasses disponibles
              </p>
              <p className="text-xs text-text-muted">
                Apercu de votre prochaine sortie
              </p>
            </div>
            <Badge variant="success">Local</Badge>
          </div>

          <div className="space-y-3">
            {mockHunts.slice(0, 3).map((hunt) => (
              <Link
                key={hunt.id}
                href={`/hunt/${hunt.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-black/[0.06] bg-background-surface-alt p-3 transition-colors hover:border-primary/20"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-heading">
                    {hunt.title}
                  </p>
                  <p className="text-xs text-text-muted">{hunt.duration}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-primary">
                  {hunt.reward} XP
                </span>
              </Link>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3 md:col-span-2">
          {[
            { value: "500+", label: "Chasses" },
            { value: "10k+", label: "Joueurs" },
            { value: "50+", label: "Villes" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-black/[0.06] bg-background-surface p-4 text-center"
            >
              <p className="font-heading text-2xl font-bold text-text-heading sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs tracking-wider text-text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: MapPin,
      title: "Trouvez",
      description: "Choisissez une chasse sur la carte ou dans la liste.",
    },
    {
      icon: Compass,
      title: "Explorez",
      description: "Suivez les indices et validez les étapes sur le terrain.",
    },
    {
      icon: Gem,
      title: "Gagnez",
      description: "Débloquez XP, récompenses et artefacts de collection.",
    },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-text-heading sm:text-3xl">
            Comment jouer
          </h2>
          <p className="mt-2 text-text-muted">
            Un parcours simple, pense pour le mobile.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} variant="interactive" className="p-5">
              <span className="mb-4 inline-block text-xs font-bold text-primary/60">
                0{index + 1}
              </span>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-black/[0.06] bg-background-surface-alt">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-bold text-text-heading">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {step.description}
              </p>
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
      <div className="relative h-44 overflow-hidden">
        {hunt.imageUrl ? (
          <img
            src={hunt.imageUrl}
            alt={hunt.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 bg-background-surface-alt" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute right-3 top-3">
          <Badge variant="primary">{getDifficultyLabel(hunt.difficulty)}</Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-heading text-lg font-bold text-text-heading transition-colors duration-200 group-hover:text-primary">
          {hunt.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-text-muted">
          {hunt.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="font-heading text-lg font-bold text-primary">
            {hunt.reward} XP
          </span>
          <Link href={`/hunt/${hunt.id}`}>
            <Button variant="secondary" size="sm">
              Jouer <ArrowRight className="h-3.5 w-3.5" />
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
    <section className="border-t border-black/[0.06] bg-background-surface-alt/40 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-text-heading sm:text-3xl">
              Chasses a la une
            </h2>
            <p className="mt-2 text-text-muted">
              Les aventures les plus populaires du moment.
            </p>
          </div>
          <Link href="/map">
            <Button variant="secondary">
              Voir la carte
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((hunt) => (
            <HuntCard key={hunt.id} hunt={hunt} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerCtaSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <Card variant="default" className="p-6 sm:p-8">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-heading sm:text-3xl">
                Devenez partenaire
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-text-muted">
                Musées, villes, associations : créez des expériences
                géolocalisées et suivez les participations depuis l'app.
              </p>
            </div>
            <Link href="/register?role=organisateur">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Créer une chasse
                <Trophy className="h-4 w-4" />
              </Button>
            </Link>
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
