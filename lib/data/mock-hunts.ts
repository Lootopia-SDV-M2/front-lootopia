import type { Hunt, HuntDifficulty, HuntStep } from "@/types";

const DIFFICULTIES: HuntDifficulty[] = ["easy", "medium", "hard", "expert"];

const CITY_ANCHORS = [
  ["Paris", 48.8566, 2.3522],
  ["Marseille", 43.2965, 5.3698],
  ["Lyon", 45.764, 4.8357],
  ["Toulouse", 43.6047, 1.4442],
  ["Nice", 43.7102, 7.262],
  ["Nantes", 47.2184, -1.5536],
  ["Strasbourg", 48.5734, 7.7521],
  ["Montpellier", 43.6119, 3.8772],
  ["Bordeaux", 44.8378, -0.5792],
  ["Lille", 50.6292, 3.0573],
  ["Rennes", 48.1173, -1.6778],
  ["Reims", 49.2583, 4.0317],
  ["Le Havre", 49.4944, 0.1079],
  ["Saint-Etienne", 45.4397, 4.3872],
  ["Toulon", 43.1242, 5.928],
  ["Grenoble", 45.1885, 5.7245],
  ["Dijon", 47.322, 5.0415],
  ["Angers", 47.4784, -0.5632],
  ["Nimes", 43.8367, 4.3601],
  ["Villeurbanne", 45.7719, 4.8902],
  ["Clermont-Ferrand", 45.7772, 3.087],
  ["Le Mans", 48.0061, 0.1996],
  ["Aix-en-Provence", 43.5297, 5.4474],
  ["Brest", 48.3904, -4.4861],
  ["Tours", 47.3941, 0.6848],
  ["Amiens", 49.8941, 2.2958],
  ["Limoges", 45.8336, 1.2611],
  ["Annecy", 45.8992, 6.1294],
  ["Perpignan", 42.6887, 2.8948],
  ["Metz", 49.1193, 6.1757],
  ["Besancon", 47.2378, 6.0241],
  ["Orleans", 47.9029, 1.9093],
  ["Rouen", 49.4431, 1.0993],
  ["Mulhouse", 47.7508, 7.3359],
  ["Caen", 49.1829, -0.3707],
  ["Nancy", 48.6921, 6.1844],
  ["Pau", 43.2951, -0.3708],
  ["La Rochelle", 46.1603, -1.1511],
  ["Avignon", 43.9493, 4.8055],
  ["Poitiers", 46.5802, 0.3404],
  ["Bayonne", 43.4929, -1.4748],
  ["Saint-Malo", 48.6493, -2.0257],
  ["Quimper", 47.996, -4.1025],
  ["Vannes", 47.6582, -2.7608],
  ["Ajaccio", 41.9192, 8.7386],
  ["Bastia", 42.6973, 9.4509],
  ["Chambery", 45.5646, 5.9178],
  ["Valence", 44.9334, 4.8924],
  ["Laon", 49.5639, 3.6244],
  ["Biarritz", 43.4832, -1.5586],
] as const;

const THEMES = [
  "Tresor urbain",
  "Mystere historique",
  "Parcours gourmand",
  "Legende locale",
  "Defi photo",
  "Secret de quartier",
  "Balade nature",
  "Enigme patrimoine",
  "Mission famille",
  "Route des artisans",
] as const;

function createSteps(
  huntId: string,
  baseLatitude: number,
  baseLongitude: number
): HuntStep[] {
  return [
    {
      id: `${huntId}-step-1`,
      order: 1,
      title: "Point de depart",
      description: "Rendez-vous au point de depart pour commencer l'aventure.",
      latitude: baseLatitude + 0.001,
      longitude: baseLongitude + 0.001,
      radius: 20,
      completed: false,
      clues: [
        {
          id: `${huntId}-clue-1-1`,
          order: 1,
          text: "Cherchez pres du lieu le plus anime.",
          unlocked: true,
        },
        {
          id: `${huntId}-clue-1-2`,
          order: 2,
          text: "Un detail grave vous donnera la suite.",
          unlocked: false,
        },
      ],
    },
    {
      id: `${huntId}-step-2`,
      order: 2,
      title: "Indice cache",
      description: "Trouvez le prochain indice pour avancer dans la quete.",
      latitude: baseLatitude + 0.002,
      longitude: baseLongitude - 0.001,
      radius: 20,
      completed: false,
      clues: [
        {
          id: `${huntId}-clue-2-1`,
          order: 1,
          text: "Regardez vers le nord.",
          unlocked: true,
        },
        {
          id: `${huntId}-clue-2-2`,
          order: 2,
          text: "Le mobilier urbain cache souvent un secret.",
          unlocked: false,
        },
      ],
    },
    {
      id: `${huntId}-step-3`,
      order: 3,
      title: "Tresor final",
      description: "Le tresor vous attend a la derniere etape.",
      latitude: baseLatitude,
      longitude: baseLongitude,
      radius: 20,
      completed: false,
      clues: [
        {
          id: `${huntId}-clue-3-1`,
          order: 1,
          text: "Vous y etes presque.",
          unlocked: true,
        },
        {
          id: `${huntId}-clue-3-2`,
          order: 2,
          text: "Cherchez le point de vue le plus calme.",
          unlocked: false,
        },
      ],
    },
  ];
}

function seededNoise(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function offsetCoordinate(base: number, seed: number, spread: number): number {
  return Number((base + (seededNoise(seed) - 0.5) * spread).toFixed(5));
}

function createMockHunt(index: number): Hunt {
  const anchor = CITY_ANCHORS[index % CITY_ANCHORS.length];
  const localIndex = Math.floor(index / CITY_ANCHORS.length);
  const id = `hunt-${String(index + 1).padStart(3, "0")}`;
  const city = anchor[0];
  const difficulty = DIFFICULTIES[index % DIFFICULTIES.length];
  const theme = THEMES[index % THEMES.length];
  const rewardBase =
    difficulty === "expert"
      ? 650
      : difficulty === "hard"
        ? 420
        : difficulty === "medium"
          ? 260
          : 140;
  const latitude = offsetCoordinate(anchor[1], index + 11, 0.34);
  const longitude = offsetCoordinate(anchor[2], index + 29, 0.42);

  return {
    id,
    title: `${theme} - ${city} #${localIndex + 1}`,
    description: `Une chasse ${getDifficultyLabel(difficulty).toLowerCase()} autour de ${city}, avec indices geolocalises, observation et recompense XP.`,
    difficulty,
    latitude,
    longitude,
    reward: rewardBase + (index % 7) * 25,
    duration: `${1 + (index % 4)}h${index % 2 === 0 ? "00" : "30"}`,
    participantsCount: 3 + (index % 38),
    maxParticipants: 12 + (index % 24),
    createdAt: new Date(
      Date.UTC(2026, index % 12, (index % 27) + 1)
    ).toISOString(),
    startsAt: new Date(
      Date.UTC(2026, (index + 1) % 12, (index % 27) + 1, 10)
    ).toISOString(),
    imageUrl: `/images/hunts/hunt-${String((index % 6) + 1).padStart(3, "0")}.jpg`,
    steps: createSteps(id, latitude, longitude),
  };
}

export const mockHunts: Hunt[] = Array.from({ length: 500 }, (_, index) =>
  createMockHunt(index)
);

export function getHuntById(id: string): Hunt | undefined {
  return mockHunts.find((hunt) => hunt.id === id);
}

export function getDifficultyColor(difficulty: Hunt["difficulty"]): string {
  const colors = {
    easy: "from-emerald-400 to-green-500",
    medium: "from-amber-400 to-orange-500",
    hard: "from-red-400 to-rose-500",
    expert: "from-purple-400 to-violet-500",
  };
  return colors[difficulty];
}

export function getDifficultyLabel(difficulty: Hunt["difficulty"]): string {
  const labels = {
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
    expert: "Expert",
  };
  return labels[difficulty];
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadiusMeters = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
}
