# Lootopia — Frontend

Application web progressive (PWA) de chasse au trésor géolocalisée. Construite avec **Next.js 15**, **React 19** et **TypeScript 5.9**.

## Tech Stack

| Technologie | Version |
|-------------|---------|
| Next.js (App Router) | 15.5.9 |
| React | 19.2.3 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 3.4.17 |
| Zustand | 5.0.10 |
| Leaflet / react-leaflet | 1.9.4 / 5.0.0 |
| Framer Motion | 12.26.2 |
| GSAP | 3.14.2 |
| Zod | 4.3.5 |
| Lucide React | 0.562.0 |
| QRCode | 1.5.4 |
| next-pwa (Workbox) | 10.2.9 |

## Architecture

```
pages/ (App Router)
├── /              → Landing page
├── /login         → Connexion
├── /register      → Inscription
├── /map           → Carte interactive des chasses
├── /hunts         → Liste des chasses
├── /hunt/[id]     → Détail et jeu
├── /create        → Création de chasse (wizard 3 étapes)
├── /profile       → Profil et statistiques
├── /inventory     → Inventaire d'artefacts
├── /vouchers      → Mes bons d'achat
├── /history       → Historique des participations
├── /notifications → Notifications
├── /scan          → Scan de voucher (partenaires)
└── /ar            → Vue réalité augmentée
```

### Gestion d'état (Zustand)

| Store | Rôle | Persisté |
|-------|------|----------|
| `auth-store` | Authentification, token JWT | Oui |
| `player-store` | Profil, XP, niveau | Oui |
| `participation-store` | Participations actives | Oui |
| `geolocation-store` | Position GPS en direct | Non |
| `create-hunt-store` | Wizard de création | Non |
| `toast-store` | Notifications toast | Non |
| `app-store` | Navigation (onglet actif) | Non |

## Prérequis

- Node.js 20+
- pnpm (recommandé) ou bun

## Démarrer en local

```bash
git clone https://github.com/Lootopia-SDV-M2/front-lootopia.git
cd front-lootopia
```

### Avec pnpm

```bash
pnpm install
pnpm dev
```

### Avec bun

```bash
bun install
bun dev
```

L'application démarre sur `http://localhost:3000`.

## Configuration

Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Comptes de démonstration

Si le backend est indisponible, l'application utilise des données mockées :

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Chasseur | `demo@lootopia.fr` | `Demo123!` |
| Partenaire | `partenaire@lootopia.fr` | `Partner123!` |

## Structure

```
front-lootopia/
├── app/                   # Pages App Router
│   ├── layout.tsx         # Layout racine (Header, BottomNav)
│   ├── middleware.ts      # Protection des routes
│   └── globals.css        # Styles globaux + Tailwind
├── components/
│   ├── ui/                # Primitives (Button, Card, Input, Badge, Spinner...)
│   ├── shared/            # Composants réutilisables (Toast, Modal, Avatar...)
│   ├── layout/            # Header, BottomNav, HealthCheck
│   ├── map/               # Leaflet (GameMap, markers, popups, panels)
│   ├── hunt/              # Détail de chasse (jeu)
│   ├── create/            # Wizard création (StepOne, Two, Three + CreatorMap)
│   └── ar/                # Vue AR (flux caméra)
├── lib/
│   ├── api/               # Client API + modules typés
│   ├── stores/            # Zustand stores
│   ├── data/              # Mock data (hunts, artefacts)
│   ├── utils/             # Utilitaires (cn, ...)
│   └── validations/       # Schémas Zod (auth, hunt)
├── types/                 # Types TypeScript globaux
└── public/                # Assets statiques, manifest PWA
```

## Fonctionnalités

- **Carte interactive** — Leaflet avec marqueurs personnalisés, géolocalisation, popups
- **Validation GPS** — validation d'étape par proximité (~20m)
- **Wizard de création** — 3 étapes : infos, parcours, récompenses
- **Artefacts** — objets collectionnables (commun, rare, épique, légendaire)
- **Marketplace** — vente directe et enchères (achat/vente d'artefacts)
- **Vouchers** — codes uniques avec QR code
- **Notifications** — notifications in-app
- **PWA** — installation sur mobile, mode standalone
- **Mode déconnecté** — fallback données mockées quand le backend est hors ligne

## Scripts

```bash
pnpm dev       # Développement
pnpm build     # Build production
pnpm start     # Démarrer en production
pnpm lint      # ESLint
pnpm format    # Prettier
```

## CI/CD

- **Lint** : ESLint avec Prettier
- **Déclenché** : sur tout push et PR (GitHub Actions)

## Design System

Thème personnalisé Tailwind avec palette or (#c89a0e) / rose (#c95f84) :

- Animations : aurora, fade, slide, shimmer, float, glow
- Effets : glassmorphism, glow, ombres douces
- Polices : Inter (corps), Outfit (titres), Fira Code (mono)
- Mobile-first avec safe-area pour iOS

## PWA

- Manifest avec icônes maskable
- Service worker (Workbox)
- Installation sur écran d'accueil (iOS + Android)
- Mode standalone, orientation portrait

## Documentation

- [Guide utilisateur](../docs/guide/guide-utilisateur-partenaire.md)
- [Documentation technique](../docs/technique/documentation-technique.md)
- [Guide de contribution](CONTRIBUTION.md)
