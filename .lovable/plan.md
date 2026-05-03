
## Problème actuel

L'alternance des fonds est cassée — 3 sections Navy consécutives (KeyElements → Formats → PhotoBanner), ce qui crée un bloc visuel monotone. De plus, le site manque d'éléments graphiques dynamiques pour un rendu moderne.

## Plan

### 1. Corriger l'alternance des backgrounds

Nouvelle séquence stricte Navy / Cream :

| # | Section | Fond |
|---|---------|------|
| 1 | Hero | Navy |
| 2 | Tension | Cream |
| 3 | KeyElements + Formats | Navy (fusionner en une seule section, stats en haut puis formats en dessous) |
| 4 | PhotoBanner | Cream |
| 5 | Testimonials | Navy (inverser — les cards en halo sur fond sombre seront plus impactantes) |
| 6 | ForYou | Cream |
| 7 | MembersCloud | Navy |
| 8 | Join | Cream |
| 9 | CTA | Mesh gradient |

Fichiers modifiés : `Index.tsx`, `PhotoBanner.tsx`, `TestimonialsSection.tsx`, `ForYouSection.tsx`, `MembersCloud.tsx`, `JoinSection.tsx`, `KeyElementsSection.tsx`

### 2. Éléments graphiques dynamiques

Ajouter des éléments visuels animés pour moderniser le site :

- **Grille de points animée** (dot grid) : motif subtil de points cyan en arrière-plan des sections Navy, avec une animation de pulsation douce. Ajouté via CSS dans `index.css`.

- **Ligne de séparation animée** : trait horizontal cyan avec un gradient qui "glisse" entre certaines sections (animation CSS `shimmer`).

- **Floating orbs** : cercles flous (blobs) en position absolue qui dérivent lentement dans le Hero et le CTA, renforçant l'effet mesh/halo.

- **Scroll fade-in** : utiliser `IntersectionObserver` dans un hook `useScrollReveal` pour animer les sections au scroll (fade-in + légère translation vers le haut). Appliqué à chaque section.

- **Cards hover lift** : les card-halo et testimonial cards auront un `translateY(-4px)` au hover avec transition fluide.

- **Compteurs animés** : les chiffres de KeyElementsSection s'animeront de 0 à leur valeur au scroll (count-up effect).

Fichiers créés/modifiés :
- `src/hooks/useScrollReveal.ts` (nouveau)
- `src/hooks/useCountUp.ts` (nouveau)
- `src/index.css` (nouvelles animations : shimmer, float, dot-grid)
- Toutes les sections homepage (wrapping avec scroll reveal)

### Détails techniques

- Les animations CSS (`@keyframes`) seront ajoutées dans `index.css` : `float`, `shimmer`, `dot-pulse`
- Le hook `useScrollReveal` utilisera `IntersectionObserver` avec `threshold: 0.15` et appliquera les classes `animate-fade-in` existantes
- Le hook `useCountUp` utilisera `requestAnimationFrame` pour un compteur fluide
- Les floating orbs seront des `div` en `position: absolute` avec `filter: blur()` et animation `float`
- Pas de dépendance externe ajoutée — tout en CSS natif + React hooks
