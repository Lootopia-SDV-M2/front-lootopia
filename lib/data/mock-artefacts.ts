import type { Artefact, ArtefactRarity, MarketListing } from "@/types";

export const mockArtefacts: Artefact[] = [
  {
    id: "artefact-001",
    name: "Boussole Ancienne",
    imageUrl: null,
    rarity: "common",
    huntTitle: "Le Tresor du Marais",
    obtainedAt: "2026-01-20T15:30:00Z",
  },
  {
    id: "artefact-002",
    name: "Carte du Pirate",
    imageUrl: null,
    rarity: "rare",
    huntTitle: "Mysteres de Montmartre",
    obtainedAt: "2026-01-22T12:00:00Z",
  },
  {
    id: "artefact-003",
    name: "Sceptre Royal",
    imageUrl: null,
    rarity: "epic",
    huntTitle: "L'Enigme de la Tour Eiffel",
    obtainedAt: "2026-01-25T14:00:00Z",
  },
  {
    id: "artefact-004",
    name: "Couronne des Catacombes",
    imageUrl: null,
    rarity: "legendary",
    huntTitle: "Les Catacombes Secretes",
    obtainedAt: "2026-01-28T11:00:00Z",
  },
  {
    id: "artefact-005",
    name: "Pierre de Lune",
    imageUrl: null,
    rarity: "rare",
    huntTitle: "Jardin du Luxembourg",
    obtainedAt: "2026-01-30T16:00:00Z",
  },
];

export const mockMarketListings: MarketListing[] = [
  {
    id: "listing-001",
    artefact: {
      id: "market-art-001",
      name: "Pendentif Mystique",
      imageUrl: null,
      rarity: "rare",
      huntTitle: "Mysteres de Montmartre",
      obtainedAt: "2026-01-15T10:00:00Z",
    },
    sellerName: "Explorer42",
    price: 250,
    listedAt: "2026-02-01T09:00:00Z",
  },
  {
    id: "listing-002",
    artefact: {
      id: "market-art-002",
      name: "Grimoire Ancien",
      imageUrl: null,
      rarity: "epic",
      huntTitle: "L'Enigme de la Tour Eiffel",
      obtainedAt: "2026-01-20T14:00:00Z",
    },
    sellerName: "TreasureHunter",
    price: 500,
    listedAt: "2026-02-02T11:00:00Z",
  },
  {
    id: "listing-003",
    artefact: {
      id: "market-art-003",
      name: "Cle en Or",
      imageUrl: null,
      rarity: "legendary",
      huntTitle: "Les Catacombes Secretes",
      obtainedAt: "2026-01-28T16:00:00Z",
    },
    sellerName: "ParisRaider",
    price: 1000,
    listedAt: "2026-02-05T14:00:00Z",
  },
  {
    id: "listing-004",
    artefact: {
      id: "market-art-004",
      name: "Fiole d'Elixir",
      imageUrl: null,
      rarity: "common",
      huntTitle: "Jardin du Luxembourg",
      obtainedAt: "2026-01-30T10:00:00Z",
    },
    sellerName: "NovicePlayer",
    price: 50,
    listedAt: "2026-02-06T08:00:00Z",
  },
];

export function getRarityColor(rarity: ArtefactRarity): string {
  const colors: Record<ArtefactRarity, string> = {
    common: "bg-gray-100 text-gray-600 border-gray-200",
    rare: "bg-blue-50 text-blue-600 border-blue-200",
    epic: "bg-purple-50 text-purple-600 border-purple-200",
    legendary: "bg-amber-50 text-amber-600 border-amber-200",
  };
  return colors[rarity];
}

export function getRarityLabel(rarity: ArtefactRarity): string {
  const labels: Record<ArtefactRarity, string> = {
    common: "Commun",
    rare: "Rare",
    epic: "Epique",
    legendary: "Legendaire",
  };
  return labels[rarity];
}
