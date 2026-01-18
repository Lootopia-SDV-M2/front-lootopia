## 🤝 Guide de Contribution à Lootopia

Bienvenue aux contributeurs de Lootopia ! Ce guide est conçu pour s'assurer que vos contributions s'intègrent de manière fluide et respectent les standards de qualité élevés attendus pour le projet Mastère 2.

### 1. Organisation du Projet & Gestion des Tâches

* **Gestion des Tâches :** Nous utilisons **GitHub Projects** pour le tableau de bord (Kanban). Chaque contribution doit être liée à un **Ticket (Issue)** existant.
* **Dépôts (Repos) :**
    * **Backend (API & Transactions) :** Java / Spring Boot.
    * **Frontend (Marketplace & PWA) :** Next.js / React.

#### Gestion des Tickets Inter-Dépôts

* Si un ticket principal nécessite des modifications dans les deux dépôts (Backend et Frontend), il doit être décomposé en **deux sous-tickets (Sub-Issues)**, chacun précisant clairement le dépôt concerné et associé au membre de l'équipe responsable.
* Chaque sous-ticket (Back ou Front) sera ensuite utilisé pour créer sa propre branche de développement.

### 2. Standards de Code et Qualité (M2)

Nous adhérons aux principes de **Code Propre et Modulaire** et aux bonnes pratiques de sécurité.

* **Backend (Java/Spring Boot) :**
    * Appliquer les principes **SOLID**.
    * Les services d'économie/transactions doivent garantir l'atomicité et la **sécurité des données**.
    * Ne jamais stocker de mots de passe en clair. Utiliser l'Auth **JWT** avec expiration.
* **Frontend (Next.js/React) :**
    * Respecter les règles ESLint/Prettier et les standards d'accessibilité (**WCAG**).
    * Le développement doit être orienté *mobile first*.
* **Tests Systématiques :** Écrire des **tests unitaires** pour chaque fonctionnalité critique.

### 3. Workflow de Développement (Stratégie de Branches)

Nous utilisons une stratégie de branches basée sur la qualité et le déploiement.

| Branche | Rôle | Protection |
| :--- | :--- | :--- |
| **`main`** | **Production.** Contient le code stable, entièrement testé, prêt à être déployé. | Protégée. Seules les fusions depuis `preprod` sont autorisées. |
| **`preprod`** | **Staging/QA.** Environnement d'intégration final et de test d'acceptation. | Protégée. Seules les fusions depuis `dev` sont autorisées après validation complète. |
| **`dev`** | **Intégration.** Point de fusion pour toutes les fonctionnalités terminées et testées. | Protégée. Seules les fusions via PR depuis les branches de fonctionnalités sont autorisées. |

#### Étapes de Contribution :

1.  **Créer une Branche de Fonctionnalité :**
    * La branche de développement (ex: `feat/eco-paiement-stripe` ou `fix/login-jwt`) doit toujours être créée à partir de la branche **`dev`**.
    * **Convention :** `[feat|fix|doc]/<numéro-issue>-<description-courte>`
2.  **Développement & Tests :** Coder, tester (unitaires) et effectuer des *commits* clairs (`feat:`, `fix:`, `docs:`) dans votre branche.
3.  **Pull Request (PR) :**
    * Ouvrir une PR de votre branche vers la branche **`dev`**.
    * Lier la PR au ticket initial (ex: `Closes #XX`).
    * La PR doit passer la **Continuous Integration (CI)** (build & tests unitaires).
4.  **Revue de Code (Code Review) :** La PR est revue par un autre membre de l'équipe (ou le Tech Lead).
5.  **Fusion vers `dev` :** Une fois approuvée, la PR est fusionnée dans `dev`.
6.  **Déploiement vers `preprod` :** Lorsque `dev` est stable, on fusionne (`dev` -> `preprod`) pour des tests QA/fonctionnels complets.
7.  **Déploiement vers `main` :** Après validation sur `preprod`, on fusionne (`preprod` -> `main`) pour la mise en production.
