
# Plan — Refonte home + admin événements

## 1. Éditeur riche minimal (admin événements)

Nouveau composant `src/components/admin/RichTextEditor.tsx` :
- Basé sur `contenteditable` natif (zéro dépendance).
- Toolbar : Gras, Italique, H2/H3, listes ordonnées/non-ordonnées, citation, lien (prompt URL), nettoyer le format.
- API : `value: string` (HTML) / `onChange(html)`. Sanitize basique au paste (strip `<script>`/styles inline indésirables).
- Style aligné Futur Proche (border navy/15, font Space Grotesk, focus cyan).

Branché dans `AdminEvenements.tsx` sur :
- `description` (déjà `<Textarea>`)
- `compte_rendu` (champ existant en DB ; ajout dans le formulaire si absent — à vérifier en build)

Rendu côté public dans `EvenementDetail.tsx` via `dangerouslySetInnerHTML` dans un wrapper `prose-futurproche` (classes Tailwind dédiées dans `index.css`).

## 2. Refonte page /evenements et bloc Home

### Page /evenements (`src/pages/Evenements.tsx`)
- Suppression vue grille/liste → **une seule vue** style "Nos prochains rendez-vous".
- Tri par date desc/asc selon section.
- **Deux sections visuellement séparées** :
  - `À venir` (date ≥ aujourd'hui) — CTA card : `Voir & s'inscrire →`
  - `Passés` (date < aujourd'hui) — visuel désaturé / badge "Passé" — CTA : `Voir le résumé →`
- Filtres légers conservés (ville, format) via chips.
- **Carrousel photos** en bas : agrège les `event.gallery_urls` des 2-3 derniers événements passés, autoplay lent, chaque slide affiche le titre + date de l'événement.

### Home — nouveau bloc événements
Nouveau composant `src/components/home/EventsTeaserSection.tsx` :
- Récupère les 3 prochains événements via supabase.
- Cards horizontales (mobile : stack), CTA carte → `/evenements/:slug`.
- Lien global "Voir tous les événements →" → `/evenements`.
- Inséré dans `src/pages/Index.tsx` entre `FormatsSection` et `TestimonialsSection`.

### EvenementDetail
- Si date passée : masquer `RegistrationBlock`, mettre en avant `compte_rendu` + galerie.
- Si à venir : flow actuel.

## 3. Refonte section "Tension" (TensionSection)

### Desktop
- Augmenter la zone d'apparition : header dans son propre conteneur sticky **au-dessus** de la stage cloud (padding-top stage = hauteur header + 80px).
- Recalcul des positions `thoughts` pour éviter top < 25%.
- Réduire à 9-10 citations max (plus respirable).
- Style "citation" : guillemets `«` `»` en serif italique en ouverture, signature stylisée (— CMO, — Directrice Comm…).

### Mobile
- Remplacer la longue liste par un **carrousel de citations** (Embla), 1 citation visible, swipe + auto-rotation 5s.
- Format carte centrée, guillemets serif larges, signature.
- Indicateurs de progression (dots).

### Sous Tension : carrousel "La vie de la communauté"
Nouveau composant `src/components/home/CommunityLifeCarousel.tsx` :
- Même source que carrousel /evenements : galeries des 2-3 derniers événements passés.
- Style différencié : grandes photos paysage, overlay date + titre événement en mono, défilement horizontal continu (marquee).

## 4. FormatsSection — CTAs + renommages

Édition de `src/components/home/FormatsSection.tsx` :
- `01_WhatsApp` → ajouter CTA `Découvrir la communauté →` vers `/communaute`.
- `02_Events` : titre `After Proche` → `Événements exclusifs`, CTA `Voir les événements →` vers `/evenements`.
- `03_Podcast` : titre → `Des ressources expertes`, description réécrite (podcast, études, frameworks accessibles aux Futuristes), CTA `Accéder aux ressources →` vers `/ressources`.
- `04_Jobs` : titre → `Des opportunités partout en France`, description axée maillage géographique des membres, CTA `Explorer la carte →` vers `/carte` (nouvelle route).

Implémentation : extension du type `step` dans `ScrollyFormats` pour accepter `cta: { label, href }` + rendu bouton sous la description.

## 5. Bloc Ressources sur la home

Nouveau composant `src/components/home/RessourcesTeaserSection.tsx` :
- Fetch des 3 dernières `resources` publiées (table existante).
- Cards avec type (podcast / étude / article), titre, date.
- CTA global `Toutes les ressources →` vers `/ressources`.
- Inséré dans `Index.tsx` après `EventsTeaserSection`.

## 6. Carte de France des membres

### Données
- Migration : ajouter `code_postal text` à `profiles` et `candidatures`.
- Ajout du champ dans le formulaire de candidature (`Candidater.tsx`) + édition admin membre (`AdminMembres.tsx`) + profil membre (`MembreProfil.tsx`).
- Dataset INSEE codes postaux → coordonnées (lat/lon + département + ville) embarqué via JSON statique léger (`src/data/fr-postal-codes.json`, ~36k entrées compressées, ~1.5 Mo ; loadé en lazy import).

### Page `/carte` (nouvelle)
- Route publique.
- Carte SVG France (react-simple-maps + topojson FR départements).
- **Non loggué** : bulles agrégées par département (count + survol = nom département + nb membres). CTA flottant "Devenir Futuriste pour voir les membres".
- **Loggué (membre)** : zoom département → liste des membres de ce département (mini-cards photo + nom + ville + lien vers fiche annuaire).
- Lien depuis FormatsSection `/04`.

### Technique
- Lib : `react-simple-maps` (légère, sans clé).
- Topojson FR départements : import statique.
- Géocodage : lookup `code_postal` → `{lat, lon, dept}` via dataset embarqué.

## 7. Détails techniques

```text
Nouveaux fichiers
├─ src/components/admin/RichTextEditor.tsx
├─ src/components/home/EventsTeaserSection.tsx
├─ src/components/home/RessourcesTeaserSection.tsx
├─ src/components/home/CommunityLifeCarousel.tsx
├─ src/components/home/EventsPhotoCarousel.tsx (réutilisé /evenements + home)
├─ src/pages/CarteMembres.tsx
├─ src/data/fr-postal-codes.json (lazy)
└─ supabase/migrations/xxx_add_code_postal.sql

Modifs
├─ src/pages/Index.tsx (insertion nouveaux blocs)
├─ src/pages/Evenements.tsx (refonte complète : 2 sections + carrousel)
├─ src/pages/EvenementDetail.tsx (rendu HTML riche + branche passé/futur)
├─ src/pages/admin/AdminEvenements.tsx (RichTextEditor + champ compte_rendu)
├─ src/pages/Candidater.tsx (champ code_postal)
├─ src/pages/admin/AdminMembres.tsx (code_postal)
├─ src/pages/membre/MembreProfil.tsx (code_postal)
├─ src/components/home/TensionSection.tsx (refonte desktop + mobile carrousel citations)
├─ src/components/home/FormatsSection.tsx (CTAs + renaming)
├─ src/components/shared/ScrollyFormats.tsx (support CTA par step)
├─ src/App.tsx (route /carte)
└─ tailwind.config.ts (prose-futurproche si besoin)

Dépendances à ajouter
├─ react-simple-maps + d3-geo (carte France)
└─ embla-carousel-autoplay (autoplay carrousels — déjà embla dans le projet)
```

### Règles respectées
- Vouvoiement, "Marketing / Comm", pas de mots bannis.
- Palette Navy/Cream/Cyan, Space Grotesk / Instrument Serif / JetBrains Mono.
- Photos LinkedIn réelles only (carte membres : si pas de photo → initiales).

## Ordre d'implémentation suggéré
1. Migration `code_postal` (approbation user).
2. RichTextEditor + branchement admin/détail.
3. Refonte Evenements page + EventDetail passé/futur.
4. Bloc Events Home + carrousels photos partagés.
5. TensionSection refonte + CommunityLifeCarousel.
6. FormatsSection (CTAs + renames via ScrollyFormats).
7. RessourcesTeaserSection.
8. Carte de France `/carte` (dernier, le plus volumineux).
