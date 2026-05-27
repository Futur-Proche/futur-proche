# Refonte des interactions UI homepage

5 sections retravaillées, uniquement présentation/animation. Aucune logique métier ni backend touché.

## 1. `KeyElementsSection.tsx` — Cartes profils (Direction Marketing / Comm / Founders)

Refonte des 3 cartes "À qui s'adresse vraiment Futur Proche" :

- Suppression complète des images (`speakerEvent`, `eventCommunity`, `dinerCommunaute`) et du watermark numérique géant.
- Format compact : carte plate navy avec bord cyan fin, hauteur naturelle (plus d'`aspect-[3/4]`).
- Ajout d'une 3e propriété `details` par profil (3-4 puces concrètes : enjeux, sujets typiques, type de pair attendu — texte court, ton vouvoiement).
- État `openIdx` local : clic sur la carte → expand inline (height auto via `grid-rows-[0fr]` → `grid-rows-[1fr]` trick pour transition smooth). Une seule carte ouverte à la fois.
- Indicateur visuel : `+` qui tourne en `×` au clic, ligne cyan qui s'étend.
- Garde l'animation clip-path de reveal au scroll initial.

## 2. `FormatsSection.tsx` — Scroll storytelling type Sadewa "Our approach"

Pattern Sadewa : sticky media à gauche qui change quand on scrolle les blocs texte à droite.

- Conserver la structure 2 colonnes mais **inverser le sticky** : la colonne média (image) devient sticky desktop, les 4 blocs texte défilent.
- Ajouter une image par format dans le tableau `formats` (réutiliser assets existants : `communityGroup`, `eventTalk`, `networkingEchanges`, `ambianceGroupe`).
- `IntersectionObserver` déjà en place sur les cartes → driver l'image active. Crossfade entre images (stack absolute + opacity transition 600ms) + petit scale (1.02 → 1) sur la nouvelle image.
- Tag mono + numéro `01 / 04` au-dessus de l'image, sync avec l'index actif.
- Mobile : pas de sticky, image inline au-dessus de chaque bloc.
- Suppression du bloc "En coulisses" séparé (l'image principale fait le travail) et de la bande photos en bas (devient redondante avec le carousel sticky). À confirmer si on garde la bande photos — je la garde par défaut, on peut la retirer après.

## 3. `TestimonialsSection.tsx` — Hover spotlight témoignages

- Au hover sur une carte : `scale(1.04)`, `z-10`, bordure cyan plus vive, ombre cyan diffuse (`box-shadow: 0 0 40px hsl(186 79% 47% / 0.25)`), citation passe en blanc 100% au lieu de 80%, le guillemet géant grossit légèrement.
- Les **autres** cartes voisines passent à `opacity: 0.45` et `scale(0.98)` via un état `hoveredIdx` sur le container parent — effet "spotlight" qui isole la carte survolée.
- Transition `400ms ease-out`. Désactivé sur touch (media `hover: hover`).

## 4. `MembersCloud.tsx` — Bulles physiques déplaçables

Réécriture du rendu des avatars :

- Container `relative` plein largeur, hauteur fixe (≈ 520px desktop, 420px mobile), navy.
- Positions initiales calculées en cercle/cluster déterministe (rayon variable, jitter pseudo-aléatoire à seed fixe pour éviter changements entre renders).
- Mini physics simple en vanilla JS dans un `useEffect` + `requestAnimationFrame` :
  - Chaque bulle a `{x, y, vx, vy, radius}`.
  - Friction (`v *= 0.96`), répulsion douce entre bulles (séparation si distance < r1+r2), rebond sur les bords du container.
  - Drift ambiant léger (force aléatoire faible) pour que ça "bouge" en permanence.
- Interaction : `onMouseDown` sur une bulle → drag (mise à jour `x/y` direct, `vx/vy` = delta du mouvement), `onMouseUp` → relâche avec vélocité → la bulle pousse les autres en s'éloignant. Support touch.
- Respect `prefers-reduced-motion` : positions statiques fixes, pas d'animation, drag désactivé.
- Légende mise à jour : "Cliquez et déplacez."

Reste à voir si charger 30 avatars en physics est OK perf — `requestAnimationFrame` + ~30 bulles est confortable côté navigateur. Pas de lib externe.

## 5. `KeyElementsSection.tsx` — Flip cards sur les 4 stats

Modification de `StatCell` :

- Wrapper avec `perspective: 1200px`, inner avec `transform-style: preserve-3d` et `transition: transform 600ms`.
- Face avant = contenu actuel (gros chiffre + label + progress bar).
- Face arrière = nouveau texte explicatif court (1-2 phrases) par stat, ex :
  - `850+` → "Une communauté en croissance constante, sélectionnée à l'entrée."
  - `7+ ans` → "Le seuil pour des conversations entre pairs, pas entre niveaux."
  - `40% C-Level` → "Une vraie densité de décideurs autour de la table."
  - `15+ events` → "Des After Proche dans toutes les grandes places françaises."
- Hover desktop → flip Y 180°. Mobile : reste sur la face avant (pas de hover) — alternative : tap toggle. Je choisis tap toggle mobile pour que l'info reste accessible.
- Face arrière : même fond navy, accent cyan sur première lettre ou liseré gauche.

## Détails techniques

- Tous les composants restent en TSX présent dans `src/components/home/`.
- Tokens du design system conservés (navy `hsl(228 56% 10%)`, cyan `hsl(186 79% 47%)`, cream, mono/grotesk/serif).
- Aucune nouvelle dépendance (pas de framer-motion ajouté — tout en CSS transitions + petit RAF pour les bulles).
- `prefers-reduced-motion` respecté partout (pas de flip, pas de physique, pas de spotlight scale).

## Fichiers touchés

- `src/components/home/KeyElementsSection.tsx` (profils + flip stats)
- `src/components/home/FormatsSection.tsx` (sticky media)
- `src/components/home/TestimonialsSection.tsx` (spotlight)
- `src/components/home/MembersCloud.tsx` (physics)

Pas de migration, pas de nouvelle route, pas de changement Supabase.
