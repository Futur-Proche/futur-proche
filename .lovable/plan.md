# Itération 2 — TensionSection (sticky split) + Profils (hover reveal)

## 1. `TensionSection` — Sticky split (style Sadewa "Our Approach")

Passer de la liste pleine largeur à un **layout 2 colonnes sticky** :

- **Colonne gauche (sticky, top ~120px)** : section-label "— Le constat", H2 "Vous connaissez sûrement ça.", filet cyan, paragraphe d'intro, et un **placeholder image** (aspect 4/5, fond cream foncé + dot-grid + watermark) prêt à recevoir une vraie image plus tard. Petit indicateur de progression "01 / 06" qui s'incrémente selon le pain point le plus visible.
- **Colonne droite (scrollable)** : les 6 pain points empilés verticalement, chacun en pleine hauteur d'écran partielle (min-h ~70vh ou padding généreux), avec reveal au scroll (fade + translateY + blur, identique à la version actuelle).
- Layout : `grid md:grid-cols-2 gap-12 lg:gap-20`. Sur mobile : colonne unique, gauche en haut non-sticky.
- L'indicateur "0X / 06" : chaque pain point a un `IntersectionObserver` qui met à jour un state partagé `activeIndex` quand il devient le plus centré.
- CTA bas conservé, hors du split.

## 2. `KeyElementsSection` — Profils types (style Hydra "Industries We Serve")

Refondre les 3 colonnes pour un effet **hover reveal** :

- État par défaut : chaque colonne affiche uniquement **numéro + titre** sur une grande tuile sombre (aspect ~3/4), bordure fine white/15, fond gradient navy. La description est masquée (opacity 0, translateY+10).
- **Au hover desktop** : la tuile s'illumine (fond cyan/12 → navy clair), une **barre cyan verticale** apparaît à gauche, la **description fade-in + slide-up**, et un petit "→" apparaît en bas à droite.
- Sur mobile : description visible en permanence (pas de hover possible).
- Conserver l'animation d'entrée actuelle (clip-path mask + ligne cyan qui s'étire + stagger 140ms).
- Tuile rendue avec un grand chiffre watermark en background (déjà présent), titre en text-2xl, desc en text-sm.

## Détails techniques

- Pas de nouvelle dépendance ; IntersectionObserver natif, transitions Tailwind/CSS.
- `prefers-reduced-motion` respecté.
- Tokens conservés (navy / cream / cyan, Space Grotesk).
- Placeholder image gauche : `<div>` stylé, on remplacera par une vraie image plus tard (TODO commenté dans le code).

## Fichiers touchés

- `src/components/home/TensionSection.tsx` (refonte split sticky + tracker)
- `src/components/home/KeyElementsSection.tsx` (refonte ProfilCol hover reveal uniquement)
