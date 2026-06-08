# Galerie & résumé pour événements passés

## 1. Base de données

Migration sur `events` :
- `recap` (text, nullable) — résumé/compte rendu de l'événement (markdown léger ou texte).
- `gallery` (jsonb, nullable) — tableau d'URLs d'images : `[{ url, alt }]`.

Bucket `event-images` (déjà existant et public) sera réutilisé pour les photos de galerie, sous un préfixe `gallery/<event_id>/`.

## 2. Admin — AdminEvenements.tsx

Dans le formulaire d'édition d'un événement, ajouter une section **"Après l'événement"** visible quand `statut = past` (mais éditable même en `published`) :
- Textarea **Résumé** (`recap`) — multi-lignes, ~6 rows.
- **Galerie photo** :
  - Upload multi-fichiers vers `event-images/gallery/<event_id>/<uuid>.jpg`.
  - Vignettes des photos uploadées, avec bouton suppression et champ `alt` optionnel.
  - Drag-to-reorder (simple : flèches ↑/↓).
- Bouton "Marquer comme passé" (passe `statut` à `past`) — déjà existant ou à ajouter.

## 3. Page publique `/evenements` — Section "Nos prochains rendez-vous"

Renommer en **"Nos rendez-vous"** avec deux blocs visuellement distincts :

### 3a. À venir (en haut)
- Sous-titre : *"Prochaines dates"*
- Cartes existantes (date colorée, speakers, CTA "Voir & s'inscrire →" qui pointe vers `/evenements/:slug`).
- Badge "Inscriptions ouvertes" si `is_open_to_all` ou prix défini.

### 3b. Événements passés (en dessous)
- Sous-titre : *"Ils ont eu lieu"* + petit séparateur visuel.
- Filtre : uniquement les events avec `recap` non vide OU `gallery` non vide (les autres passés restent invisibles côté public).
- Format de carte distinct :
  - Visuel "archivé" : date en gris/desaturé au lieu du navy plein.
  - Mosaïque photo (3-4 vignettes de la galerie en aperçu) à droite.
  - Extrait du résumé (3 lignes max).
  - CTA : "Voir le compte-rendu →" → `/evenements/:slug`.
- Pas de CTA "S'inscrire".

## 4. Page détail `/evenements/:slug` — EvenementDetail.tsx

Quand `statut = past` :
- Masquer la sidebar d'inscription, la remplacer par un bloc "Cet événement a eu lieu le [date]".
- Ajouter sous la description :
  - **Section "Compte-rendu"** si `recap` rempli (typographie éditoriale).
  - **Section "Galerie"** si `gallery` non vide : grid responsive (3 colonnes desktop, 2 mobile) avec lightbox au clic (Dialog shadcn).
- La `ParticipantsList` (membres inscrits) reste visible pour les membres connectés inscrits.

## 5. Espace membre — MembreEvenements.tsx

Dans "Mes événements passés", afficher un petit aperçu galerie (3 vignettes) en plus du bouton "Retrouver les participants" si la galerie existe, avec lien vers la page détail publique pour voir tout le compte-rendu.

## Hors scope
- Pas de système de tags/album multiples.
- Pas de notifications aux participants à la publication du compte-rendu.
- Pas d'édition collaborative — admin seul.
- Pas de likes/commentaires sur les photos.

## Fichiers impactés
- Migration SQL (ajout `recap`, `gallery`).
- `src/pages/admin/AdminEvenements.tsx` — UI résumé + uploader galerie.
- `src/pages/Evenements.tsx` — split À venir / Passés avec recap.
- `src/pages/EvenementDetail.tsx` — sections recap + galerie + lightbox.
- `src/pages/membre/MembreEvenements.tsx` — aperçu galerie.
- Nouveau composant `src/components/event/EventGallery.tsx` (grid + lightbox réutilisable).
- Nouveau composant `src/components/admin/EventGalleryUploader.tsx`.
