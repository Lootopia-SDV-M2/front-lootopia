# Agent Context — front-lootopia

> Fichier de contexte destiné aux agents IA (Codex, Claude Code, OpenCode, etc.) travaillant sur le frontend de Lootopia.
> Ce fichier est situé dans le dossier `front-lootopia/` du repo parent non versionné.

---

## 1. Vue d'ensemble

`front-lootopia` est une **Progressive Web App (PWA)** de chasse au trésor géolocalisée, construite avec :

| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 15.5.9 (App Router) | Framework React full-stack |
| React | 19.2.3 | UI library |
| TypeScript | 5.9.3 | Typage statique |
| Tailwind CSS | 3.4.17 | Styles utilitaires |
| Zustand | 5.0.10 | Gestion d'état globale |
| Zod | 4.3.5 | Validation de formulaires / schémas |
| Leaflet + react-leaflet | 1.9.4 / 5.0.0 | Carte interactive |
| Framer Motion | 12.26.2 | Animations React |
| GSAP | 3.14.2 | Animations avancées |
| Lucide React | 0.562.0 | Icônes |
| next-pwa | 10.2.9 | Service worker / PWA |

Le frontend communique avec le backend Java/Spring Boot situé dans `../back-lootopia` via une API REST sur `NEXT_PUBLIC_API_URL` (par défaut `http://localhost:8080`).

> **Mise à jour design/local** : le repo racine contient `PRODUCT.md` et `DESIGN.md` pour cadrer les décisions UI. Les composants partagés doivent privilégier une UI produit mobile-first, sobre, avec surfaces solides, rayons modérés et focus states visibles.

---

## 2. Architecture des dossiers

```
front-lootopia/
├── app/                    # App Router Next.js
│   ├── layout.tsx          # Layout racine (fonts, Header, BottomNav, HealthCheck)
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Styles globaux + Tailwind + custom components
│   ├── middleware.ts       # Protection des routes (cookie JWT)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── map/page.tsx
│   ├── hunts/page.tsx
│   ├── hunt/[id]/page.tsx
│   ├── create/page.tsx
│   ├── profile/page.tsx
│   ├── inventory/page.tsx
│   ├── vouchers/page.tsx
│   ├── history/page.tsx
│   ├── notifications/page.tsx
│   ├── scan/page.tsx
│   └── ar/page.tsx
├── components/
│   ├── ui/                 # Primitives (Button, Card, Input, Badge, Spinner, ...)
│   ├── shared/             # Composants réutilisables (Avatar, Alert, Modal, Toast, ...)
│   ├── layout/             # Header, BottomNav, HealthCheck
│   ├── map/                # Leaflet wrappers (DynamicMap, GameMap, markers, ...)
│   ├── hunt/               # Détail d'une chasse / jeu
│   ├── create/             # Wizard de création (StepOneForm, StepTwoForm, StepThreeForm, CreatorMap)
│   └── ar/                 # Vue réalité augmentée
├── lib/
│   ├── api/                # Client API + modules typés
│   ├── stores/             # Zustand stores
│   ├── data/               # Mock data (hunts, artefacts)
│   ├── utils/              # Utilitaires (cn, ...)
│   └── validations/        # Schémas Zod
├── types/                  # Types TypeScript globaux
├── public/                 # Assets statiques, manifest PWA, icônes
├── tailwind.config.ts      # Thème custom (couleurs, animations, ombres)
├── next.config.ts          # Config Next.js + PWA
├── eslint.config.mjs       # Config ESLint flat config
├── package.json            # Scripts + dépendances
└── pnpm-lock.yaml          # Lockfile pnpm
```

---

## 3. Conventions de code

### 3.1 Général

- **Langue** : code et commentaires en anglais, texte utilisateur en français.
- **TypeScript strict activé** (`strict: true`). Aucun `any` implicite.
- **Composants** : préférer des composants nommés exportés, avec `forwardRef` pour les primitives UI.
- **Imports** : utiliser les alias `@/` définis dans `tsconfig.json` (`@/components/ui`, `@/lib/stores`, etc.).
- **Pages Next.js** : les pages interactives utilisent `"use client"`. Le layout racine est serveur.
- **Mobile-first** : l'application est pensée mobile ; les styles desktop sont des overrides `md:` / `lg:`.

### 3.2 Styles / Tailwind

- **Ne pas utiliser** de classes arbitraires `[...]` sauf si nécessaire.
- **Couleurs du design system** (voir `tailwind.config.ts`) :
  - Or primaire : `primary` (`#c89a0e`)
  - Rose secondaire : `secondary` (`#c95f84`)
  - Fond : `background` (`#faf8f4`)
  - Surface : `background-surface` (`#ffffff`)
  - Texte : `text-heading` (`#1c1b18`), `text-body` (`#4d4b47`), `text-muted` (`#908e88`)
  - Statuts : `status-success`, `status-warning`, `status-error`
- **Utiliser `cn()`** (`@/lib/utils/cn.ts`) pour composer les classes conditionnelles. Il combine `clsx` + `tailwind-merge`.
- **Composants de carte** : utiliser `Card` avec les variants `default`, `glass`, `interactive`.
- **Ombres / glow** : `shadow-card`, `shadow-hover`, `shadow-glow`, `shadow-glow-sm`, `shadow-glow-strong`.
- **Typographie** : `font-heading` pour les titres, `font-sans` pour le corps, `font-mono` pour le code.

### 3.3 Composants UI

- Tous les composants UI sont dans `components/ui/`.
- Exemples clés :
  - `Button` : variants `primary | secondary | ghost | destructive`, sizes `sm | md | lg | icon`, prop `isLoading`.
  - `Input` : prop `error` pour l'état invalide.
  - `Card` : variants `default | glass | interactive`.
  - `Badge` : variants `default | primary | secondary | outline`.

### 3.4 Formulaires

- Validation côté client avec **Zod** (`lib/validations/`).
- Gestion d'état locale avec `useState` + `onChange`.
- Affichage des erreurs sous chaque champ avec `text-status-error`.
- Schémas existants : `auth-schemas.ts`, `hunt-schemas.ts`.

---

## 4. Gestion d'état (Zustand)

Les stores sont dans `lib/stores/`. Certains sont persistés dans `localStorage`.

| Store | Fichier | Persisté | Rôle |
|-------|---------|----------|------|
| `useAuthStore` | `auth-store.ts` | Oui (`lootopia-auth`) | Authentification, token JWT, user, mock fallback |
| `usePlayerStore` | `player-store.ts` | Oui (`lootopia-player`) | Profil, niveau, XP, historique |
| `useParticipationStore` | `participation-store.ts` | Oui | Participations actives |
| `useGeolocationStore` | `geolocation-store.ts` | Non | Position GPS en temps réel |
| `useCreateHuntStore` | `create-hunt-store.ts` | Non | Wizard de création de chasse (3 étapes) |
| `useToastStore` | `toast-store.ts` | Non | Notifications toast |
| `useAppStore` | `app-store.ts` | Non | Onglet actif de la bottom nav |
| `useInventoryStore` | `inventory-store.ts` | Oui (`lootopia-inventory`) | Artefacts du joueur + wallet POL |

### Règles importantes

- Les stores persistés utilisent `createJSONStorage` avec un `dummyStorage` côté SSR pour éviter les erreurs d'hydratation.
- Le token JWT est stocké à la fois dans `localStorage` (Zustand persist) et dans un cookie `lootopia-auth-token` (SameSite=Strict, 7 jours) pour le middleware Next.js.
- Le middleware lit le rôle depuis le token JWT (payload `role`).

---

## 5. Authentification & routes protégées

### Middleware (`middleware.ts`)

- Protège les routes : `/profile`, `/create`, `/hunts`, `/hunt/*`
- Redirige vers `/login` si pas de cookie `lootopia-auth-token`.
- Redirige les utilisateurs authentifiés loin des routes d'auth (`/login`, `/register`).
- Seuls les utilisateurs avec le rôle `ORGANISATEUR` peuvent accéder à `/create`.
- Les rôles backend sont : `CHERCHEUR` (joueur), `ORGANISATEUR` (partenaire), `ADMIN`.
- Les rôles frontend (`AuthUser.role`) sont mappés : `ORGANISATEUR` → `partner`, `ADMIN` → `admin`, sinon `player`.

### Connexion

- Endpoint : `POST /api/auth/login` avec `{ username: email, password }`.
- Fallback mock si backend indisponible :
  - `demo@lootopia.fr` / `Demo123!` → rôle player
  - `partenaire@lootopia.fr` / `Partner123!` → rôle partner

### Inscription

- Endpoint : `POST /api/auth/register` avec `{ username, email, password, role }`.
- Fallback mock si backend indisponible.

---

## 6. API client

Le client API est dans `lib/api/api-client.ts`.

- Base URL : `process.env.NEXT_PUBLIC_API_URL` (définir dans `.env.local`).
- Le token est lu depuis `localStorage` (`lootopia-auth` → `state.token`) et envoyé en header `Authorization: Bearer <token>`.
- Méthodes disponibles : `get`, `post`, `postMultipart`, `put`, `delete`.
- `postMultipart` est utilisé pour l'upload d'images (création de chasse).
- Si la réponse n'est pas OK, une `Error` est levée avec le corps de la réponse.

Modules API existants :

- `lib/api/hunt-api.ts` : création, liste, détail, publication de chasses.
- `lib/api/artefact-api.ts` : inventaire joueur, wallet POL, fallback mock si backend indisponible.
- `lib/api/marketplace-api.ts` : annonces marketplace, création d'annonce, achat, fallback mock.
- `lib/api/transaction-api.ts` : historique des transactions marketplace, fallback mock.

Pages / composants inventaire :

- `app/inventory/page.tsx` : page inventaire client, affiche solde POL, artefacts, états loading/error/empty.
- `components/marketplace/ArtefactCard.tsx` : carte artefact réutilisable.

---

## 7. Carte (Leaflet)

- Le composant `DynamicMap` charge Leaflet côté client (`next/dynamic` avec `ssr: false`).
- Les composants Leaflet sont dans `components/map/`.
- La carte utilise un thème clair personnalisé.
- Attention : Leaflet n'est pas SSR-safe. Toujours utiliser `DynamicMap` ou un `dynamic(..., { ssr: false })`.

---

## 8. PWA

- Manifest : `public/manifest.json`.
- Service worker généré par `next-pwa` dans `public/`.
- `next.config.ts` applique `withPWA`.
- L'application s'installe en mode `standalone`, orientation `portrait`.
- Safe-area insets gérées via les classes utilitaires `safe-bottom`, `safe-top`.

---

## 9. Commandes utiles

```bash
# Installer les dépendances (pnpm obligatoire en dev)
pnpm install

# Démarrer le serveur de développement
pnpm dev

# Build production
pnpm build

# Linter
pnpm lint

# Formater
pnpm format
```

### Variables d'environnement

Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Environnement frontend déployé

- Vercel : https://vercel.com/lootopiasam1euorgs-projects/front-lootopia
- Compte d'accès : `lootopia@sam1.eu.org`
- Ne pas stocker le mot de passe Vercel dans ce fichier. Le récupérer via le propriétaire du projet, un canal sûr ou un gestionnaire de secrets.

Pour diagnostiquer un problème front/back, comparer :

1. La configuration `NEXT_PUBLIC_API_URL` du projet Vercel.
2. L'URL du backend déployé sur Koyeb.
3. Le contrat exposé par Swagger : https://absolute-deny-lootopia-sdv-24cb1826.koyeb.app/swagger-ui/index.html

---

## 10. Points d'attention pour les agents

1. **Ne jamais importer Leaflet directement dans un composant serveur** : utiliser le chargement dynamique.
2. **Toujours utiliser `cn()`** pour composer les classes Tailwind conditionnelles.
3. **Les stores persistés ont un `dummyStorage` SSR** : n'utiliser `localStorage` que via Zustand.
4. **Le front a un fallback mock** quand le backend est hors ligne : ne pas supprimer les mock users sans fournir une alternative de test.
5. **Respecter la distinction rôle backend / rôle frontend** :
   - Backend attend/renvoie : `CHERCHEUR`, `ORGANISATEUR`, `ADMIN`
   - Frontend stocke : `player`, `partner`, `admin`
6. **Mobile-first** : les maquettes et le layout doivent d'abord fonctionner sur mobile.
7. **Accessibilité** : respecter WCAG (contraste, focus visible, labels, `aria-*`).
8. **Ne pas modifier les conventions ESLint/Prettier sans raison majeure**.
9. **Si un composant a besoin du client**, ajouter `"use client"` en haut du fichier.
10. **Pour les appels API**, utiliser `apiClient` et créer un module typé dans `lib/api/` si le endpoint est réutilisé.

---

## 11. Roadmap / fonctionnalités en cours

- Carte interactive & géolocalisation (implémentée)
- Liste et détail des chasses (implémentées, partie mock)
- Wizard création de chasse 3 étapes (implémenté)
- Authentification JWT + mock fallback (implémenté)
- Profil joueur avec XP/niveau (implémenté)
- Inventaire artefacts + wallet POL : socle front implémenté avec fallback mock
- Marketplace (artefacts, enchères) : socle front types/API mocks/store créé ; backend métier à implémenter
- Vouchers / QR code : en cours / à implémenter côté back
- Notifications : en cours / à implémenter côté back
- Mode AR : page créée, contenu à compléter

---

## 12. Liens utiles dans le repo

- `../back-lootopia/AGENTS.md` : contexte backend
- `../AGENTS.md` : contexte global du repo
- `README.md` : documentation humaine du frontend
- `CONTRIBUTION.md` : guide de contribution (branches, qualité)
