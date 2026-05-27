## Objectif

Abandonner le stack vertical actuel de la section « Vous connaissez sûrement ça. » et la remplacer par une composition radiale inspirée de la section « Is This You? » de bima.framer.media : une phrase centrée, autour de laquelle les 6 points apparaissent progressivement au scroll.

## Principe d'UX

- Section sticky qui occupe ~1 viewport pendant la séquence.
- Au centre, fixe : un bloc avec le label section + le titre « Vous connaissez sûrement ça. ».
- Autour de ce centre, 6 cartes-points disposées en couronne (2 à gauche, 2 à droite, 1 en haut, 1 en bas, ou pattern 3 à gauche / 3 à droite selon le rendu).
- Au scroll, les cartes se révèlent une à une (fade + petit translate vers leur position finale), dans l'ordre 01 → 06.
- Une fois les 6 cartes affichées, le scroll reprend normalement et la section se relâche.
- Aucun empilement, aucune carte cliquable à rouvrir : tout reste visible une fois révélé.

## Layout desktop (≥ 1024px)

```text
        [ Carte 01 ]                [ Carte 02 ]

[ Carte 03 ]      «  Vous connaissez       [ Carte 04 ]
                    sûrement ça.  »

        [ Carte 05 ]                [ Carte 06 ]
```

- Grille CSS 3 colonnes × 3 rangées, le centre (col 2 / row 2) occupé par le titre.
- Cartes : fond crème, bordure douce, numéro en mono (01 → 06), titre Space Grotesk semi-bold, texte court Instrument Sans.
- Liens fins/pointillés très discrets reliant chaque carte au centre (SVG en fond, opacité faible) — option visuelle, activable si ça reste lisible.

## Layout tablette (768–1023px)

- Grille 2 colonnes, centre déplacé en première ligne pleine largeur, puis 3 rangées de 2 cartes en dessous.

## Layout mobile (< 768px)

- Pas de composition radiale : centre en haut, puis liste verticale des 6 cartes qui se révèlent au scroll une par une (fade-in simple via IntersectionObserver).
- Pas de sticky sur mobile pour éviter les conflits de scroll.

## Animation au scroll

- Sur desktop, la section est `min-h-[180vh]` avec un wrapper interne sticky `h-screen`.
- Un seul listener scroll calcule la progression `0 → 1` sur la portion sticky et en déduit `revealedCount` de 0 à 6.
- Chaque carte a un état `revealed` qui contrôle opacity (0 → 1) et translate (12px vers sa position finale).
- Ordre de révélation pensé pour équilibrer visuellement la couronne (ex : 01, 02, 03, 04, 05, 06 en diagonale ou en spirale plutôt que strictement 1→6 linéaire).
- Respect de `prefers-reduced-motion` : affichage immédiat des 6 cartes, sans sticky.

## Détails techniques

- Fichier touché : `src/components/home/TensionSection.tsx` (réécriture complète du rendu, on garde le tableau `painPoints`).
- Suppression de toute la logique d'empilement (`collapsedHeight`, `expandedHeight`, `pickedIdx`, `DesktopStack`).
- Nouvelle structure :
  - `<section ref={sectionRef} className="relative min-h-[180vh]">`
  - `<div className="sticky top-0 h-screen flex items-center">`
  - Grille radiale + centre + 6 `<RadialCard idx={i} revealed={i < revealedCount} />`.
- Pas de nouvelle dépendance, animations en Tailwind + style inline (`transform`, `opacity`, `transition`).
- Pas de modification des autres sections (`FormatsSection`, `KeyElementsSection`, etc.).

## Résultat attendu

Une section claire, posée et premium, avec un effet narratif fort : la phrase centrale reste ancrée, les 6 tensions du métier viennent l'entourer une à une au scroll, puis la page repart. Plus aucun stack ni interaction cachée à découvrir.
