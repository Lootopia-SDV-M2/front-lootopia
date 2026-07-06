import type {
  Artefact,
  BuyListingResult,
  CreateListingInput,
  MarketListing,
  MarketplaceFilters,
  MarketplaceTransaction,
  Wallet,
} from "@/types";

const MOCK_USER_ID = "user-demo-001";

const initialArtefacts: Artefact[] = [
  {
    id: "artefact-001",
    name: "Boussole du Marais",
    description:
      "Une boussole ancienne qui aurait guide les premiers explorateurs du quartier.",
    rarity: "rare",
    category: "history",
    imageUrl: "/images/artefacts/compass.jpg",
    xpBonus: 25,
    originHuntId: "hunt-001",
    ownerId: MOCK_USER_ID,
    acquiredAt: "2026-01-20T16:00:00Z",
    isTradable: true,
  },
  {
    id: "artefact-002",
    name: "Jeton des Catacombes",
    description:
      "Un jeton grave d'un symbole discret, trouve au bout d'un parcours souterrain.",
    rarity: "epic",
    category: "mystery",
    imageUrl: "/images/artefacts/token.jpg",
    xpBonus: 60,
    originHuntId: "hunt-004",
    ownerId: MOCK_USER_ID,
    acquiredAt: "2026-01-28T13:30:00Z",
    isTradable: true,
  },
  {
    id: "artefact-003",
    name: "Croquis de Montmartre",
    description:
      "Un croquis inspire des ateliers de la butte, parfait pour les collectionneurs.",
    rarity: "common",
    category: "art",
    imageUrl: "/images/artefacts/sketch.jpg",
    xpBonus: 10,
    originHuntId: "hunt-002",
    ownerId: MOCK_USER_ID,
    acquiredAt: "2026-01-22T12:00:00Z",
    isTradable: true,
  },
];

const marketplaceArtefacts: Artefact[] = [
  {
    id: "artefact-101",
    name: "Cle doree du Luxembourg",
    description:
      "Une petite cle ceremonielle associee aux enigmes du jardin royal.",
    rarity: "legendary",
    category: "culture",
    imageUrl: "/images/artefacts/golden-key.jpg",
    xpBonus: 120,
    originHuntId: "hunt-005",
    ownerId: "seller-001",
    acquiredAt: "2026-01-24T10:00:00Z",
    isTradable: true,
  },
  {
    id: "artefact-102",
    name: "Fragment Eiffel",
    description:
      "Un fragment symbolique inspire des structures metalliques parisiennes.",
    rarity: "epic",
    category: "technology",
    imageUrl: "/images/artefacts/eiffel-fragment.jpg",
    xpBonus: 75,
    originHuntId: "hunt-003",
    ownerId: "seller-002",
    acquiredAt: "2026-01-25T15:45:00Z",
    isTradable: true,
  },
  {
    id: "artefact-103",
    name: "Feuille de l'Orangerie",
    description:
      "Une feuille preservee qui rappelle les parcours calmes et botaniques.",
    rarity: "common",
    category: "nature",
    imageUrl: "/images/artefacts/leaf.jpg",
    xpBonus: 8,
    originHuntId: "hunt-005",
    ownerId: "seller-003",
    acquiredAt: "2026-01-26T09:15:00Z",
    isTradable: true,
  },
];

let mockWallet: Wallet = {
  userId: MOCK_USER_ID,
  balancePol: 850,
  updatedAt: "2026-01-30T08:00:00Z",
};

let mockInventory: Artefact[] = [...initialArtefacts];

let mockListings: MarketListing[] = [
  {
    id: "listing-001",
    artefact: marketplaceArtefacts[0],
    sellerId: "seller-001",
    sellerName: "Atelier Royal",
    type: "fixed_price",
    status: "active",
    pricePol: 520,
    createdAt: "2026-01-30T09:00:00Z",
    updatedAt: "2026-01-30T09:00:00Z",
  },
  {
    id: "listing-002",
    artefact: marketplaceArtefacts[1],
    sellerId: "seller-002",
    sellerName: "Gustave_75",
    type: "auction",
    status: "active",
    pricePol: 300,
    currentBidPol: 340,
    endsAt: "2026-02-05T18:00:00Z",
    createdAt: "2026-01-29T11:20:00Z",
    updatedAt: "2026-01-31T14:10:00Z",
  },
  {
    id: "listing-003",
    artefact: marketplaceArtefacts[2],
    sellerId: "seller-003",
    sellerName: "JardinierCurieux",
    type: "fixed_price",
    status: "active",
    pricePol: 90,
    createdAt: "2026-01-28T16:45:00Z",
    updatedAt: "2026-01-28T16:45:00Z",
  },
];

let mockTransactions: MarketplaceTransaction[] = [
  {
    id: "transaction-001",
    type: "reward",
    status: "completed",
    listingId: null,
    artefactId: "artefact-001",
    buyerId: MOCK_USER_ID,
    sellerId: null,
    amountPol: 150,
    createdAt: "2026-01-20T16:00:00Z",
    completedAt: "2026-01-20T16:00:00Z",
  },
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nowIso(): string {
  return new Date().toISOString();
}

function applyFilters(
  listings: MarketListing[],
  filters: MarketplaceFilters = {}
): MarketListing[] {
  return listings.filter((listing) => {
    if (filters.status && listing.status !== filters.status) return false;
    if (filters.type && listing.type !== filters.type) return false;
    if (filters.rarity && listing.artefact.rarity !== filters.rarity) {
      return false;
    }
    if (filters.category && listing.artefact.category !== filters.category) {
      return false;
    }
    if (filters.maxPricePol && listing.pricePol > filters.maxPricePol) {
      return false;
    }
    return true;
  });
}

export function getMockInventory(): Artefact[] {
  return clone(mockInventory);
}

export function getMockArtefactById(id: string): Artefact | null {
  const artefact =
    mockInventory.find((item) => item.id === id) ??
    mockListings.find((listing) => listing.artefact.id === id)?.artefact;

  return artefact ? clone(artefact) : null;
}

export function getMockWallet(): Wallet {
  return clone(mockWallet);
}

export function getMockListings(filters?: MarketplaceFilters): MarketListing[] {
  return clone(applyFilters(mockListings, filters));
}

export function getMockListingById(id: string): MarketListing | null {
  const listing = mockListings.find((item) => item.id === id);
  return listing ? clone(listing) : null;
}

export function createMockListing(input: CreateListingInput): MarketListing {
  const artefact = mockInventory.find((item) => item.id === input.artefactId);

  if (!artefact) {
    throw new Error("Artefact introuvable dans l'inventaire mock");
  }

  if (!artefact.isTradable) {
    throw new Error("Cet artefact ne peut pas etre mis en vente");
  }

  const createdAt = nowIso();
  const listing: MarketListing = {
    id: `listing-${Date.now()}`,
    artefact: { ...artefact, ownerId: MOCK_USER_ID },
    sellerId: MOCK_USER_ID,
    sellerName: "Aventurier",
    type: input.type,
    status: "active",
    pricePol: input.pricePol,
    endsAt: input.endsAt,
    createdAt,
    updatedAt: createdAt,
  };

  mockListings = [listing, ...mockListings];
  return clone(listing);
}

export function buyMockListing(id: string): BuyListingResult {
  const listingIndex = mockListings.findIndex((item) => item.id === id);
  const listing = mockListings[listingIndex];

  if (!listing || listing.status !== "active") {
    throw new Error("Annonce indisponible");
  }

  if (listing.sellerId === MOCK_USER_ID) {
    throw new Error("Impossible d'acheter votre propre artefact");
  }

  if (mockWallet.balancePol < listing.pricePol) {
    throw new Error("Solde POL insuffisant");
  }

  const completedAt = nowIso();
  const purchasedArtefact: Artefact = {
    ...listing.artefact,
    ownerId: MOCK_USER_ID,
    acquiredAt: completedAt,
  };

  const updatedListing: MarketListing = {
    ...listing,
    status: "sold",
    artefact: purchasedArtefact,
    updatedAt: completedAt,
  };

  const transaction: MarketplaceTransaction = {
    id: `transaction-${Date.now()}`,
    type: "purchase",
    status: "completed",
    listingId: listing.id,
    artefactId: purchasedArtefact.id,
    buyerId: MOCK_USER_ID,
    sellerId: listing.sellerId,
    amountPol: listing.pricePol,
    createdAt: completedAt,
    completedAt,
  };

  mockWallet = {
    ...mockWallet,
    balancePol: mockWallet.balancePol - listing.pricePol,
    updatedAt: completedAt,
  };
  mockListings[listingIndex] = updatedListing;
  mockInventory = [purchasedArtefact, ...mockInventory];
  mockTransactions = [transaction, ...mockTransactions];

  return clone({
    listing: updatedListing,
    transaction,
    wallet: mockWallet,
    artefact: purchasedArtefact,
  });
}

export function getMockTransactions(): MarketplaceTransaction[] {
  return clone(mockTransactions);
}

export function getMockTransactionById(
  id: string
): MarketplaceTransaction | null {
  const transaction = mockTransactions.find((item) => item.id === id);
  return transaction ? clone(transaction) : null;
}
