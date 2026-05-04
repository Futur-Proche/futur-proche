
## Plan : Alimenter le site avec les podcasts et événements passés

### 1. Podcasts — Page Ressources (`/ressources`)

Remplacer le placeholder "Embed player / carrousel des 3 derniers épisodes" par un vrai carrousel des derniers épisodes du podcast, avec pour chaque épisode :
- Titre, durée, date de publication, image cover (depuis Ausha)
- Lien Ausha pour l'écoute

Mettre à jour les liens plateforme (actuellement `href="#"`) avec les vraies URLs :
- **Spotify** : `https://open.spotify.com/show/4Fzm7K5joIHBDiUgjz66vn`
- **Apple Podcasts** : `https://podcasts.apple.com/au/podcast/futur-proche/id1778946164`
- **YouTube** : `https://www.youtube.com/@futurproche-marketing`

Ajouter un lien **Ausha** : `https://podcast.ausha.co/futur-proche`

Le carrousel affichera les 6 derniers épisodes (hors teasers) avec leur cover, titre, durée et un bouton "Écouter". Données en dur dans le composant (pas en DB pour l'instant, car contenu éditorial statique).

Episodes inclus (Saison 2 + fin Saison 1) :
1. Communauté : side project ou game changer ? (1h10, 20 avril 2026)
2. Sans Brand, c'est déjà la fin (53min, 19 mars 2026)
3. Outbound : strat' premium ou spam organisé ? (1h10, 17 fév. 2026)
4. Impact & business : et si agir rapportait gros ? (1h14, 20 jan. 2026)
5. SEO / GEO : la fin d'une ère ? (1h07, 30 nov. 2025)
6. L'international, c'est pas si loin ! (1h03, 16 oct. 2025)

Mettre à jour le compteur : **23 épisodes** (au lieu de 20).

### 2. Événements passés — Base de données

Insérer 3 événements passés dans la table `events` via l'outil d'insertion :

| Titre | Format | Date | Heure | Ville | Lieu | Statut |
|-------|--------|------|-------|-------|------|--------|
| A.P #Bordeaux - Au-delà du bullshit : le Marketing qui marche vraiment | after_proche | 2025-11-25 | 18:30 | Bordeaux | 84 Rue Camille Godard | past |
| AP#9 - C'est la faute de l'algo (w/ Agorapulse) | after_proche | 2025-10-14 | 18:30 | Paris | Agorapulse | past |
| A.P #10 - Community Building : l'amour dure 3 mois ? | after_proche | 2025-12-03 | 18:30 | Paris | Le Wagon | past |

### 3. Événements passés — Affichage sur `/evenements`

Mettre à jour le tableau `pastEvents` en dur dans `Evenements.tsx` pour refléter les vrais événements (ou mieux : remplacer par un fetch dynamique depuis la table `events` filtrée sur `statut = 'past'`). La page fait déjà un fetch des events publiés ; il suffira d'ajouter les events "past" dans la requête si ce n'est pas déjà le cas.

### Fichiers modifiés

- `src/pages/Ressources.tsx` — carrousel podcast + vrais liens plateforme
- `src/pages/Evenements.tsx` — ajustement mineur si nécessaire pour afficher les past events
- Insertion de 3 lignes dans la table `events` (via outil DB)

### Détails techniques

- Les images cover des podcasts seront chargées depuis les URLs Ausha (CDN externe, pas d'upload nécessaire)
- Les événements passés utilisent le statut `past` déjà prévu dans le schéma (`event_status` enum)
- La RLS autorise déjà la lecture des events `past` par les anonymes
