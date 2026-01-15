import type { Hunt, HuntStep } from "@/types";

/**
 * Create steps for a hunt
 */
function createSteps(
  huntId: string,
  baseLatitude: number,
  baseLongitude: number
): HuntStep[] {
  return [
    {
      id: `${huntId}-step-1`,
      order: 1,
      title: "Point de départ",
      description: "Rendez-vous au point de départ pour commencer l'aventure.",
      latitude: baseLatitude + 0.001,
      longitude: baseLongitude + 0.001,
      radius: 20,
      completed: false,
      clues: [
        {
          id: `${huntId}-clue-1-1`,
          order: 1,
          text: "Cherchez près de la fontaine",
          unlocked: true,
        },
        {
          id: `${huntId}-clue-1-2`,
          order: 2,
          text: "Le chiffre sur la plaque vous guidera",
          unlocked: false,
        },
      ],
    },
    {
      id: `${huntId}-step-2`,
      order: 2,
      title: "L'indice caché",
      description: "Trouvez le prochain indice pour avancer dans la quête.",
      latitude: baseLatitude + 0.002,
      longitude: baseLongitude - 0.001,
      radius: 20,
      completed: false,
      clues: [
        {
          id: `${huntId}-clue-2-1`,
          order: 1,
          text: "Regardez vers le nord",
          unlocked: true,
        },
        {
          id: `${huntId}-clue-2-2`,
          order: 2,
          text: "Le banc vert cache un secret",
          unlocked: false,
        },
      ],
    },
    {
      id: `${huntId}-step-3`,
      order: 3,
      title: "Le trésor final",
      description: "Le trésor vous attend ! Creusez pour le découvrir.",
      latitude: baseLatitude,
      longitude: baseLongitude,
      radius: 20,
      completed: false,
      clues: [
        {
          id: `${huntId}-clue-3-1`,
          order: 1,
          text: "Vous y êtes presque !",
          unlocked: true,
        },
        {
          id: `${huntId}-clue-3-2`,
          order: 2,
          text: "Sous le grand arbre...",
          unlocked: false,
        },
      ],
    },
  ];
}

/**
 * Mock hunt data for development and testing.
 * Simulates treasure hunts around Paris area.
 */
export const mockHunts: Hunt[] = [
  {
    id: "hunt-001",
    title: "Le Trésor du Marais",
    description:
      "Explorez les ruelles historiques du Marais à la recherche d'un trésor caché depuis le 17ème siècle. Cette aventure vous fera découvrir les secrets les mieux gardés de ce quartier emblématique de Paris.",
    difficulty: "easy",
    latitude: 48.8566,
    longitude: 2.3522,
    reward: 150,
    duration: "1h30",
    participantsCount: 12,
    maxParticipants: 20,
    createdAt: "2026-01-10T10:00:00Z",
    startsAt: "2026-01-20T14:00:00Z",
    steps: createSteps("hunt-001", 48.8566, 2.3522),
  },
  {
    id: "hunt-002",
    title: "Mystères de Montmartre",
    description:
      "Gravissez la butte Montmartre et découvrez les secrets des artistes qui y ont vécu. De Picasso à Van Gogh, suivez leurs traces dans ce parcours artistique unique.",
    difficulty: "medium",
    latitude: 48.8867,
    longitude: 2.3431,
    reward: 250,
    duration: "2h00",
    participantsCount: 8,
    maxParticipants: 15,
    createdAt: "2026-01-08T14:30:00Z",
    startsAt: "2026-01-22T10:00:00Z",
    steps: createSteps("hunt-002", 48.8867, 2.3431),
  },
  {
    id: "hunt-003",
    title: "L'Énigme de la Tour Eiffel",
    description:
      "Une chasse au trésor épique autour du monument le plus célèbre de Paris. Résolvez les énigmes de Gustave Eiffel lui-même pour découvrir le trésor.",
    difficulty: "hard",
    latitude: 48.8584,
    longitude: 2.2945,
    reward: 500,
    duration: "3h00",
    participantsCount: 5,
    maxParticipants: 10,
    createdAt: "2026-01-05T09:00:00Z",
    startsAt: "2026-01-25T11:00:00Z",
    steps: createSteps("hunt-003", 48.8584, 2.2945),
  },
  {
    id: "hunt-004",
    title: "Les Catacombes Secrètes",
    description:
      "Plongez dans les profondeurs de Paris pour une aventure souterraine inoubliable. Attention, cette chasse n'est pas pour les âmes sensibles !",
    difficulty: "expert",
    latitude: 48.8339,
    longitude: 2.3324,
    reward: 1000,
    duration: "4h00",
    participantsCount: 3,
    maxParticipants: 8,
    createdAt: "2026-01-12T16:00:00Z",
    startsAt: "2026-01-28T09:00:00Z",
    steps: createSteps("hunt-004", 48.8339, 2.3324),
  },
  {
    id: "hunt-005",
    title: "Jardin du Luxembourg",
    description:
      "Une balade ludique à travers les allées du jardin royal préféré des Parisiens. Parfait pour une sortie en famille !",
    difficulty: "easy",
    latitude: 48.8462,
    longitude: 2.3372,
    reward: 100,
    duration: "1h00",
    participantsCount: 18,
    maxParticipants: 25,
    createdAt: "2026-01-14T11:00:00Z",
    steps: createSteps("hunt-005", 48.8462, 2.3372),
  },
  {
    id: "hunt-006",
    title: "La Défense Futuriste",
    description:
      "Découvrez les trésors cachés du quartier d'affaires le plus moderne de Paris. Architecture et technologie au rendez-vous !",
    difficulty: "medium",
    latitude: 48.8918,
    longitude: 2.2362,
    reward: 300,
    duration: "2h30",
    participantsCount: 6,
    maxParticipants: 12,
    createdAt: "2026-01-13T13:00:00Z",
    startsAt: "2026-01-30T15:00:00Z",
    steps: createSteps("hunt-006", 48.8918, 2.2362),
  },
];

/**
 * Get a hunt by ID
 */
export function getHuntById(id: string): Hunt | undefined {
  return mockHunts.find((hunt) => hunt.id === id);
}

/**
 * Get difficulty color for UI display
 */
export function getDifficultyColor(difficulty: Hunt["difficulty"]): string {
  const colors = {
    easy: "from-emerald-400 to-green-500",
    medium: "from-amber-400 to-orange-500",
    hard: "from-red-400 to-rose-500",
    expert: "from-purple-400 to-violet-500",
  };
  return colors[difficulty];
}

/**
 * Get difficulty label in French
 */
export function getDifficultyLabel(difficulty: Hunt["difficulty"]): string {
  const labels = {
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
    expert: "Expert",
  };
  return labels[difficulty];
}

/**
 * Calculate distance between two coordinates in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
