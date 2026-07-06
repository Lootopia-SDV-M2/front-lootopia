import Link from "next/link";
import {
  Map,
  Compass,
  Trophy,
  Users,
  ArrowRight,
  Rocket,
  Sparkles,
  MapPin,
  Gem,
} from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { mockHunts } from "@/lib/data/mock-hunts";
import { getDifficultyLabel } from "@/lib/data/mock-hunts";
import type { Hunt } from "@/types";

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.06] py-32 md:py-40">
      {/* Background effects */}
      <div className="bg-dots absolute inset-0 opacity-40" />
      <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-secondary/[0.03] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Tagline badge */}
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium tracking-wide text-primary">
            La chasse au trésor nouvelle génération
          </span>
        </div>

        <h1 className="font-heading text-5xl font-bold tracking-tight text-text-heading sm:text-7xl md:text-8xl">
          L&apos;Aventure
          <br />
          <span className="text-gradient-gold">Vous Attend</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-muted">
          Explorez votre monde, découvrez des trésors cachés et vivez des quêtes
          épiques dans votre ville.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/map">
            <Button variant="primary" size="lg">
              <Map className="h-5 w-5" />
              Explorer les chasses
            </Button>
          </Link>
          <Link href="/register?role=organisateur">
            <Button variant="secondary" size="lg">
              <Rocket className="h-5 w-5" />
              Devenir partenaire
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-lg grid-cols-3 gap-8">
          {[
            { value: "500+", label: "Chasses" },
            { value: "10k+", label: "Joueurs" },
            { value: "50+", label: "Villes" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
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
      description: "Choisissez une chasse au trésor sur la carte interactive.",
      gradient: "from-primary/20 to-gold-600/10",
    },
    {
      icon: Compass,
      title: "Explorez",
      description: "Suivez les indices et résolvez des énigmes sur le terrain.",
      gradient: "from-secondary/20 to-secondary/5",
    },
    {
      icon: Gem,
      title: "Gagnez",
      description:
        "Débloquez le trésor final, gagnez de l'XP et des récompenses.",
      gradient: "from-status-success/20 to-status-success/5",
    },
  ];

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-4xl font-bold text-text-heading sm:text-5xl">
            Comment <span className="text-gradient-gold">Jouer</span> ?
          </h2>
          <p className="mt-4 text-text-muted">
            Trois étapes pour vivre l&apos;aventure
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={index}
              variant="interactive"
              className="group relative overflow-hidden p-8 text-center"
            >
              {/* Gradient bg on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div className="relative z-10">
                {/* Step number */}
                <span className="mb-4 inline-block font-heading text-sm font-bold text-primary/40">
                  0{index + 1}
                </span>

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-black/[0.06] bg-background-surface-alt transition-all duration-500 group-hover:border-primary/20 group-hover:shadow-glow-sm">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>

                <h3 className="font-heading text-xl font-bold text-text-heading">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {step.description}
                </p>
              </div>
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
      {/* Image area */}
      <div className="relative h-44 overflow-hidden">
        {hunt.imageUrl ? (
          <img
            src={hunt.imageUrl}
            alt={hunt.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background-surface via-transparent to-transparent" />
        <div className="absolute right-3 top-3">
          <Badge variant="primary">{getDifficultyLabel(hunt.difficulty)}</Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-heading text-lg font-bold text-text-heading transition-colors duration-300 group-hover:text-primary">
          {hunt.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-text-muted">
          {hunt.description}
        </p>
        <div className="mt-5 flex items-center justify-between">
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
    <section className="relative border-t border-black/[0.06] py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background-surface/50 to-background" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-4xl font-bold text-text-heading sm:text-5xl">
            Chasses à la <span className="text-gradient-gold">Une</span>
          </h2>
          <p className="mt-4 text-text-muted">
            Les aventures les plus populaires du moment
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((hunt) => (
            <HuntCard key={hunt.id} hunt={hunt} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/map">
            <Button variant="secondary" size="lg">
              Voir toutes les chasses
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PartnerCtaSection() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-5xl px-4">
        <Card variant="glass" className="relative overflow-hidden p-10 sm:p-14">
          {/* Gradient orbs */}
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/[0.06] blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/[0.04] blur-[80px]" />

          <div className="relative z-10 grid items-center gap-10 md:grid-cols-2">
            <div className="text-center md:text-left">
              <h2 className="font-heading text-4xl font-bold text-text-heading">
                Devenez <span className="text-gradient-gold">Partenaire</span>
              </h2>
              <p className="mt-5 leading-relaxed text-text-muted">
                Musées, villes, associations : créez des expériences
                interactives uniques pour vos visiteurs grâce à notre outil de
                création simple et puissant.
              </p>
              <div className="mt-8">
                <Link href="/register?role=organisateur">
                  <Button variant="primary" size="lg">
                    Créer une chasse
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden items-center justify-center md:flex">
              <div className="relative h-48 w-48">
                <div className="absolute inset-0 animate-float">
                  <Users className="absolute left-2 top-2 h-20 w-20 -rotate-12 text-primary/20" />
                  <Rocket className="absolute bottom-2 right-2 h-24 w-24 rotate-12 text-primary/30" />
                  <Trophy className="absolute right-6 top-8 h-16 w-16 text-secondary/20" />
                </div>
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
