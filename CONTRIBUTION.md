## 🤝 Guide de Contribution à Lootopia

Bienvenue aux contributeurs de Lootopia ! Ce guide est conçu pour s'assurer que vos contributions s'intègrent de manière fluide et respectent les standards de qualité élevés attendus pour le projet Mastère 2.

### 1. Organisation du Projet & Gestion des Tâches

* **Gestion des Tâches :** Nous utilisons **GitHub Projects** pour le tableau de bord (Kanban). [cite_start]Chaque contribution doit être liée à un **Ticket (Issue)** existant[cite: 74].
* **Dépôts (Repos) :**
    * **Backend (API & Transactions) :** Java / Spring Boot.
    * **Frontend (Marketplace & PWA) :** Next.js / React.

#### Gestion des Tickets Inter-Dépôts

* Si un ticket principal nécessite des modifications dans les deux dépôts (Backend et Frontend), il doit être décomposé en **deux sous-tickets (Sub-Issues)**, chacun précisant clairement le dépôt concerné et associé au membre de l'équipe responsable.
* Chaque sous-ticket (Back ou Front) sera ensuite utilisé pour créer sa propre branche de développement.

### 2. Standards de Code et Qualité (M2)

[cite_start]Nous adhérons aux principes de **Code Propre et Modulaire** [cite: 81] [cite_start]et aux bonnes pratiques de sécurité[cite: 84].

* **Backend (Java/Spring Boot) :**
    * [cite_start]Appliquer les principes **SOLID**[cite: 81].
    * [cite_start]Les services d'économie/transactions doivent garantir l'atomicité et la **sécurité des données**[cite: 67].
    * [cite_start]Ne jamais stocker de mots de passe en clair[cite: 84]. [cite_start]Utiliser l'Auth **JWT** avec expiration[cite: 85, 91].
* **Frontend (Next.js/React) :**
    * [cite_start]Respecter les règles ESLint/Prettier et les standards d'accessibilité (**WCAG**)[cite: 87].
    * [cite_start]Le développement doit être orienté *mobile first*[cite: 31, 50].
* [cite_start]**Tests Systématiques :** Écrire des **tests unitaires** pour chaque fonctionnalité critique[cite: 83].

### 3. Workflow de Développement (Stratégie de Branches)

Nous utilisons une stratégie de branches basée sur la qualité et le déploiement.

| Branche | Rôle | Protection |
| :--- | :--- | :--- |
| **`main`** | [cite_start]**Production.** Contient le code stable, entièrement testé, prêt à être déployé[cite: 104]. | Protégée. Seules les fusions depuis `preprod` sont autorisées. |
| **`preprod`** | [cite_start]**Staging/QA.** Environnement d'intégration final et de test d'acceptation[cite: 104]. | Protégée. Seules les fusions depuis `dev` sont autorisées après validation complète. |
| **`dev`** | [cite_start]**Intégration.** Point de fusion pour toutes les fonctionnalités terminées et testées[cite: 78]. | Protégée. Seules les fusions via PR depuis les branches de fonctionnalités sont autorisées. |

#### Étapes de Contribution :

1.  **Créer une Branche de Fonctionnalité :**
    * La branche de développement (ex: `feat/eco-paiement-stripe` ou `fix/login-jwt`) doit toujours être créée à partir de la branche **`dev`**.
    * **Convention :** `[feat|fix|doc]/<numéro-issue>-<description-courte>`
2.  **Développement & Tests :** Coder, tester (unitaires) et effectuer des *commits* clairs (`feat:`, `fix:`, `docs:`) dans votre branche.
3.  **Pull Request (PR) :**
    * Ouvrir une PR de votre branche vers la branche **`dev`**.
    * Lier la PR au ticket initial (ex: `Closes #XX`).
    * [cite_start]La PR doit passer la **Continuous Integration (CI)** (build & tests unitaires)[cite: 78].
4.  **Revue de Code (Code Review) :** La PR est revue par un autre membre de l'équipe (ou le Tech Lead).
5.  **Fusion vers `dev` :** Une fois approuvée, la PR est fusionnée dans `dev`.
6.  **Déploiement vers `preprod` :** Lorsque `dev` est stable, on fusionne (`dev` -> `preprod`) pour des tests QA/fonctionnels complets.
7.  **Déploiement vers `main` :** Après validation sur `preprod`, on fusionne (`preprod` -> `main`) pour la mise en production.
