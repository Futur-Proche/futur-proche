# Animations dynamiques — 4 sections home

Inspiré de Bima ("Is this you?") et Hydra ("Our Numbers" / "Industries We Serve"). Toutes les animations restent en IntersectionObserver natif + CSS, sans nouvelle dépendance. `prefers-reduced-motion` respecté partout.

---

## 1. `TensionSection` — "Vous connaissez sûrement ça" (style Bima)

Remplacer la grille 3 cartes hover par une **liste verticale qui se révèle progressivement au scroll**, façon Bima.

- Format : liste numérotée pleine largeur (max-w-4xl centré), chaque item = ligne avec un numéro géant à gauche (font-grotesk, ~6rem, couleur cream/15 ou cyan/20), titre + texte à droite, fin séparateur fin.
- Apparition : chaque ligne fade + translate-y(40px) + blur(6px → 0) avec stagger ~150ms, threshold 0.2.
- Hover : ligne entière s'illumine légèrement (background cyan/3, num passe en cyan plein).
- **Étendre de 3 à 6 pain points** (j'en ajoute 3 cohérents avec le positionnement Marketing/Comm senior, ex. : "Des prestataires qui se ressemblent tous", "Des KPIs qu'on ne peut pas comparer", "Une carrière qu'on construit en silence").
- CTA bas conservé tel quel.

## 2. `KeyElementsSection` — Bloc chiffres (style Hydra "Our Numbers")

Refondre le bloc 4 stats :

- Layout : grille 2×2 sur desktop avec **grosses séparations verticales/horizontales** type "cadran" (lignes 1px white/10 entre cellules), padding généreux.
- Chaque cellule : label mono en haut à gauche, **chiffre XXL** (text-7xl/8xl) qui s'anime (count-up actuel), petit sous-label en bas, et **petit graphique décoratif** (barre horizontale qui se remplit, ou arc / progress ring fin en SVG) qui s'active en parallèle du compteur.
- Au scroll dans la section : révélation séquentielle cellule par cellule (~200ms stagger).
- Garder le titre "Les chiffres qui comptent" + intro.

## 3. `KeyElementsSection` — "Trois profils, une même exigence" (style Hydra "Industries We Serve")

Remplacer la cascade simple par l'animation Hydra :

- 3 colonnes pleine hauteur avec **image / illustration** en haut (placeholder neutre cream/cyan abstrait, ou icône grand format type AtomIcon variant), titre + desc en bas.
- Au scroll : chaque colonne **slide depuis le bas avec un masque** (clip-path qui se rétracte vers le haut), stagger 120ms, threshold 0.3.
- Hover : la colonne active s'élargit légèrement (scale 1.02) et l'image gagne en saturation/contraste.
- Numéros (01/02/03) en mono small au-dessus, ligne fine cyan qui s'étire au reveal.

## 4. `TestimonialsSection` — "La parole à ceux qui en sont" (effet nuage)

Remplacer la grille statique par un **effet d'apparition en nuage** :

- Layout masonry-like (colonnes de hauteurs variables via CSS columns count-3 sur desktop, count-2 tablet, count-1 mobile).
- Au scroll : chaque carte témoignage apparaît avec position aléatoire-déterministe (translate-x ±20px + translate-y 30px + scale 0.92 + opacity 0 → final), stagger ~80ms, threshold 0.15.
- Légère rotation alternée (-1°/+1°/-0.5°…) pour casser la rigidité, façon post-its / nuage d'avis.
- Hover : carte remonte légèrement (translateY -4px) et bord cyan léger.
- Garder les 6 témoignages existants.

---

## Détails techniques

- Réutiliser `useInViewReveal` (hook existant) pour les reveals simples ; créer une variante `useStaggeredReveal(count, delay)` qui renvoie un tableau de booleans pour les listes/grilles à stagger.
- Pas de Framer Motion / GSAP — uniquement classes Tailwind + style inline transition-duration/delay + IntersectionObserver.
- Tokens conservés (navy / cream / cyan, Space Grotesk, JetBrains Mono).
- Tous les composants restent en `.tsx` autonomes ; aucun changement à `Index.tsx` ni à la DB.
- Accessibilité : `prefers-reduced-motion` désactive transforms/blur et révèle directement.

## Fichiers touchés

- `src/components/home/TensionSection.tsx` (refonte)
- `src/components/home/KeyElementsSection.tsx` (refonte chiffres + profils)
- `src/components/home/TestimonialsSection.tsx` (refonte grille → nuage)
- `src/hooks/useStaggeredReveal.ts` (nouveau, optionnel)
