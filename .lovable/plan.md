## Compris — passer en "pinned scroll"

Aujourd'hui chaque étape est sa propre section de hauteur écran : on scrolle et on découvre la suivante en dessous. Toi tu veux que **la section reste collée à l'écran** et qu'à chaque cran de scroll, l'image + texte du point 1 soient **remplacés sur place** par ceux du point 2, puis 3, puis 4. Une fois le 4 affiché, le scroll reprend normalement.

C'est le pattern Sadewa / Apple : "pin + step".

## Comment je l'implémente

Composant `ScrollyFormats` revu :

```text
<section style="height: N * 100vh">   ← réserve la "longueur de scroll"
  <div class="sticky top-0 h-screen"> ← reste collé tant qu'on est dans la section
     ┌─────────────────────────────┐
     │ /0X    [ IMAGE ]   Titre    │  ← un seul slide visible, crossfade
     │                   Texte     │
     └─────────────────────────────┘
     • • • •  ← progress dots
  </div>
</section>
```

- `N = steps.length` (donc 4 × 100vh de hauteur réservée).
- Un seul "slide" rendu en absolu, on calcule `activeIdx` à partir du scroll :
  `progress = (window.scrollY - sectionTop) / (sectionHeight - viewportHeight)` → mappé sur `[0..N-1]`.
- Transition entre slides : crossfade image + texte (opacity + petit translateY) ≈ 500 ms. Pas de scroll-jacking, on suit le scroll réel.
- Le numéro `/01 → /02 → …` change avec l'index actif.
- Petits dots cliquables (déjà en place) pour sauter à une étape via `window.scrollTo` calculé.

## En-tête

Le label + h2 + intro restent **au-dessus** de la zone pinned, dans le flux normal. Quand on arrive à la section, on lit le titre, puis ça se "fixe" et on parcourt les 4 formats.

## Mobile

Pas de pin sur mobile (trop fragile, gestes scroll capricieux) : fallback en stack vertical simple (1 par 1, plein écran chacun). Détection via `matchMedia("(min-width: 1024px)")`.

## Reduced motion

Si `prefers-reduced-motion: reduce` → on désactive le pin et on tombe sur le stack vertical avec fade simple.

## Fichiers à modifier

- ✏️ `src/components/shared/ScrollyFormats.tsx` — refonte complète (pin + scroll-driven index).
- Aucune autre modif : `FormatsSection.tsx` (home) et `Communaute.tsx` consomment déjà le composant.

## Détails techniques

- `useEffect` avec `scroll` listener throttle via `requestAnimationFrame`.
- Hauteur du pin : `${steps.length * 100}vh`. Première étape visible au top, dernière maintenue ~jusqu'à la sortie.
- Un léger "dwell" en début/fin pour que l'étape 1 et 4 aient le temps d'exister → on map progress sur `steps.length` segments égaux avec `Math.round`.
- Indicateur de progression vertical : déjà présent, conservé, devient cliquable pour aller à l'offset correspondant.
